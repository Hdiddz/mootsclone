<?php

namespace App\Http\Controllers;

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

        if ($openRouterKey = config('services.openrouter.key')) {
            try {
                return response()->json([
                    'message' => $this->askOpenRouter($openRouterKey, $context, $prompt),
                    'provider' => 'openrouter',
                ]);
            } catch (RequestException $exception) {
                Log::warning('OpenRouter AI request failed.', ['status' => $exception->response?->status()]);
            } catch (\Throwable $exception) {
                Log::warning('OpenRouter AI request failed.', ['error' => $exception->getMessage()]);
            }
        }

        if ($geminiKey = config('services.gemini.key')) {
            try {
                return response()->json([
                    'message' => $this->askGemini($geminiKey, $context, $prompt),
                    'provider' => 'gemini',
                ]);
            } catch (RequestException $exception) {
                Log::warning('Gemini AI request failed.', ['status' => $exception->response?->status()]);
            } catch (\Throwable $exception) {
                Log::warning('Gemini AI request failed.', ['error' => $exception->getMessage()]);
            }
        }

        return response()->json([
            'message' => $this->fallbackSuggestion($prompt),
            'provider' => 'local',
        ]);
    }

    private function askOpenRouter(string $key, string $context, string $prompt): string
    {
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
                'messages' => [
                    ['role' => 'system', 'content' => $context],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.55,
                'max_tokens' => 260,
            ])
            ->throw()
            ->json();

        return trim($response['choices'][0]['message']['content'] ?? 'I could not generate a suggestion right now.');
    }

    private function askGemini(string $key, string $context, string $prompt): string
    {
        $model = config('services.gemini.model', 'gemini-2.5-flash');
        $response = Http::timeout(30)
            ->acceptJson()
            ->withQueryParameters(['key' => $key])
            ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $context."\n\nUser request: ".$prompt],
                        ],
                    ],
                ],
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
