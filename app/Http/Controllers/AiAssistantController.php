<?php

namespace App\Http\Controllers;

use App\Models\AiConversation;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiAssistantController extends Controller
{
    public function suggest(Request $request)
    {
        $data = $request->validate([
            'prompt' => ['required', 'string', 'max:1400'],
            'candidate' => ['nullable', 'array'],
            'context' => ['nullable', 'string', 'max:5000'],
        ]);

        $prompt = trim($data['prompt']);
        $context = $this->buildContext($data['candidate'] ?? [], $data['context'] ?? '');
        $provider = 'local';
        $reply = null;
        $apiError = null;

        // Fetch recent chat history for the user to provide memory/context
        $history = [];
        if ($user = $request->user()) {
            $history = AiConversation::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(12)
                ->get()
                ->reverse()
                ->map(fn ($msg) => [
                    'role' => $msg->role,
                    'content' => $msg->message,
                ])
                ->toArray();
        }

        if ($openRouterKey = config('services.openrouter.key')) {
            try {
                $reply = $this->askOpenRouter($openRouterKey, $context, $prompt, $history);
                $provider = 'openrouter';
            } catch (RequestException $exception) {
                $status = $exception->response?->status();
                $body = $exception->response?->body();
                $apiError = "OpenRouter API Error [{$status}]: " . ($exception->response?->json('error.message') ?? $body ?? $exception->getMessage());
                Log::warning('OpenRouter AI request failed.', ['status' => $status, 'body' => $body]);
            } catch (\Throwable $exception) {
                $apiError = "OpenRouter Error: " . $exception->getMessage();
                Log::warning('OpenRouter AI request failed.', ['error' => $exception->getMessage()]);
            }
        }

        if ($reply === null && ($geminiKey = config('services.gemini.key'))) {
            try {
                $reply = $this->askGemini($geminiKey, $context, $prompt, $history);
                $provider = 'gemini';
            } catch (RequestException $exception) {
                $status = $exception->response?->status();
                $apiError = "Gemini API Error [{$status}]: " . ($exception->response?->json('error.message') ?? $exception->getMessage());
                Log::warning('Gemini AI request failed.', ['status' => $status]);
            } catch (\Throwable $exception) {
                $apiError = "Gemini Error: " . $exception->getMessage();
                Log::warning('Gemini AI request failed.', ['error' => $exception->getMessage()]);
            }
        }

        if ($reply === null) {
            if ($apiError !== null) {
                Log::warning('AI provider fallback used.', ['error' => $apiError]);
                $reply = $this->fallbackSuggestion($prompt);
                $provider = 'local';
            } else {
                $reply = $this->fallbackSuggestion($prompt);
                $provider = 'local';
            }
        }

        // Save conversation history if user is authenticated
        if ($user = $request->user()) {
            AiConversation::create([
                'user_id' => $user->id,
                'role' => 'user',
                'message' => $prompt,
            ]);
            AiConversation::create([
                'user_id' => $user->id,
                'role' => 'assistant',
                'message' => $reply,
            ]);
        }

        return response()->json([
            'message' => $reply,
            'provider' => $provider,
        ]);
    }

    /**
     * Retrieve AI chat history for the authenticated user.
     */
    public function chatHistory(Request $request)
    {
        $user = $request->user();

        $conversations = AiConversation::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get(['id', 'role', 'message', 'created_at']);

        return response()->json([
            'conversations' => $conversations,
        ]);
    }

    /**
     * Clear AI chat history for the authenticated user.
     */
    public function clearHistory(Request $request)
    {
        $user = $request->user();
        AiConversation::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Chat history cleared.',
        ]);
    }

    private function askOpenRouter(string $key, string $context, string $prompt, array $history = []): string
    {
        $messages = [];
        $messages[] = ['role' => 'system', 'content' => $context];

        foreach ($history as $msg) {
            $messages[] = [
                'role' => $msg['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => $msg['content']
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $prompt];

        $response = Http::timeout(30)
            ->acceptJson()
            ->withHeaders([
                'Authorization' => 'Bearer '.$key,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => 'Mutualizm',
            ])
            ->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => config('services.openrouter.model', 'google/gemini-2.5-flash'),
                'messages' => $messages,
                'temperature' => 0.55,
                'max_tokens' => 260,
            ])
            ->throw()
            ->json();

        return trim($response['choices'][0]['message']['content'] ?? 'I could not generate a suggestion right now.');
    }

    private function askGemini(string $key, string $context, string $prompt, array $history = []): string
    {
        $model = config('services.gemini.model', 'gemini-2.5-flash');

        $contents = [];
        foreach ($history as $msg) {
            $contents[] = [
                'role' => $msg['role'] === 'assistant' ? 'model' : 'user',
                'parts' => [
                    ['text' => $msg['content']]
                ]
            ];
        }
        $contents[] = [
            'role' => 'user',
            'parts' => [
                ['text' => $prompt]
            ]
        ];

        $response = Http::timeout(30)
            ->acceptJson()
            ->withQueryParameters(['key' => $key])
            ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent", [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $context]
                    ]
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.55,
                    'maxOutputTokens' => 260,
                ],
            ])
            ->throw()
            ->json();

        return trim($response['candidates'][0]['content']['parts'][0]['text'] ?? 'I could not generate a suggestion right now.');
    }

    private function buildContext(array $candidate, string $extraContext): string
    {
        $candidateContext = collect([
            'Name' => $candidate['name'] ?? null,
            'Role' => $candidate['role'] ?? null,
            'Main skill' => $candidate['mainSkill'] ?? null,
            'Program' => $candidate['program'] ?? null,
            'Availability' => $candidate['availabilityDetail'] ?? $candidate['availability'] ?? null,
            'Goals' => isset($candidate['collaborationGoals']) ? implode(', ', (array) $candidate['collaborationGoals']) : null,
            'Summary' => $candidate['profileSummary'] ?? null,
            'Skills' => isset($candidate['skills'])
                ? collect($candidate['skills'])->map(fn ($skill) => is_array($skill) ? ($skill['name'] ?? '') : $skill)->filter()->implode(', ')
                : null,
        ])->filter()->map(fn ($value, $key) => "{$key}: {$value}")->implode("\n");

        return trim(<<<CONTEXT
You are Mutualizm AI, an assistant inside a Telkom University campus collaboration platform.
You understand the whole product: onboarding, profile skills, discover swipes, saved profiles, matches, chat, alerts, and project discovery.
Help users find collaborators, write concise chat openers, compare skill fit, and suggest next steps based on the skills or project goals they mention.
Keep answers practical, under three short paragraphs, and reply in Indonesian or English based on the user's wording.

Current candidate context:
{$candidateContext}

Additional page context:
{$extraContext}
CONTEXT);
    }

    private function fallbackSuggestion(string $prompt): string
    {
        if (str_contains(strtolower($prompt), 'message')) {
            return 'Hi, I saw your skills and think they fit well with my project. Are you open to discussing a simple role split and timeline this week?';
        }

        return 'Start by matching the project need with one main skill, then ask about availability, expected role, and one concrete next step such as a 15-minute planning chat.';
    }
}
