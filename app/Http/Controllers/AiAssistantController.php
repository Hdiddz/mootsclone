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
            'history' => ['nullable', 'array'],
        ]);

        $prompt = trim($data['prompt']);
        $context = $this->buildContext($data['candidate'] ?? [], $data['context'] ?? '');
        $provider = 'local';
        $reply = null;
        $apiError = null;

        // Use chat history passed from the frontend for stateless memory/context
        $history = [];
        if (isset($data['history']) && is_array($data['history'])) {
            // Map the history array to the format expected by the API clients: ['role' => role, 'content' => message]
            foreach ($data['history'] as $msg) {
                if (isset($msg['role']) && (isset($msg['message']) || isset($msg['content']))) {
                    $history[] = [
                        'role' => $msg['role'],
                        'content' => $msg['content'] ?? $msg['message'],
                    ];
                }
            }
        }

        // Prioritize Gemini since the user requested it specifically for Vercel deployment
        if ($geminiKey = config('services.gemini.key')) {
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

        if ($reply === null && ($openRouterKey = config('services.openrouter.key'))) {
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

        if ($reply === null) {
            if ($apiError !== null) {
                Log::warning('AI provider fallback used.', ['error' => $apiError]);
                $reply = $this->fallbackSuggestion($prompt, $context);
                $provider = 'local';
            } else {
                $reply = $this->fallbackSuggestion($prompt, $context);
                $provider = 'local';
            }
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
                'X-Title' => 'Moots',
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
        $model = config('services.gemini.model', 'gemini-2.5-flash-lite');

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
You are Moots AI, an assistant inside a Telkom University campus collaboration platform.
You understand the whole product: onboarding, profile skills, discover swipes, saved profiles, matches, chat, alerts, and project discovery.
Help users find collaborators, write concise chat openers, compare skill fit, and suggest next steps based on the skills or project goals they mention.
Keep answers practical, under three short paragraphs, and reply in Indonesian or English based on the user's wording.

Current candidate context:
{$candidateContext}

Additional page context:
{$extraContext}
CONTEXT);
    }

    private function fallbackSuggestion(string $prompt, string $context = ''): string
    {
        $promptLower = strtolower($prompt);

        // Parse candidates from the context string
        $candidates = $this->parseCandidatesFromContext($context);

        // If the user asks for a message/opener, give them one
        if (str_contains($promptLower, 'message') || str_contains($promptLower, 'opener') || str_contains($promptLower, 'pesan')) {
            return 'Hi, I saw your skills and think they fit well with my project. Are you open to discussing a simple role split and timeline this week?';
        }

        // Score candidates against the user's prompt
        $scored = $this->scoreCandidates($candidates, $promptLower);

        if (empty($scored)) {
            // Detect language: if prompt contains Indonesian words, respond in Indonesian
            $isIndo = $this->isLikelyIndonesian($promptLower);
            if ($isIndo) {
                return 'Maaf, saya tidak menemukan kandidat yang cocok dengan pencarian Anda saat ini. Coba gunakan kata kunci skill atau peran yang berbeda, misalnya "desainer UI/UX", "backend developer", atau "business strategist".';
            }
            return 'Sorry, I couldn\'t find candidates matching your search right now. Try using different skill or role keywords, such as "UI/UX designer", "backend developer", or "business strategist".';
        }

        $isIndo = $this->isLikelyIndonesian($promptLower);

        // Build a meaningful response listing the top matches
        $topMatches = array_slice($scored, 0, 3);
        $lines = [];

        if ($isIndo) {
            $lines[] = 'Berdasarkan pencarian Anda, berikut beberapa rekomendasi:';
            $lines[] = '';
            foreach ($topMatches as $i => $match) {
                $num = $i + 1;
                $c = $match['candidate'];
                $lines[] = "**{$num}. {$c['name']}** — {$c['role']}";
                $line = "   Skill utama: {$c['mainSkill']}";
                if (!empty($c['skills'])) {
                    $line .= '. Skill lainnya: ' . implode(', ', array_slice($c['skills'], 0, 4));
                }
                $lines[] = $line;
                if (!empty($c['availability'])) {
                    $lines[] = "   Ketersediaan: {$c['availability']}";
                }
                $lines[] = '';
            }
            $lines[] = 'Anda bisa klik profil mereka di bawah untuk melihat detail lebih lanjut, lalu mulai chat atau follow.';
        } else {
            $lines[] = 'Based on your search, here are some recommendations:';
            $lines[] = '';
            foreach ($topMatches as $i => $match) {
                $num = $i + 1;
                $c = $match['candidate'];
                $lines[] = "**{$num}. {$c['name']}** — {$c['role']}";
                $line = "   Main skill: {$c['mainSkill']}";
                if (!empty($c['skills'])) {
                    $line .= '. Other skills: ' . implode(', ', array_slice($c['skills'], 0, 4));
                }
                $lines[] = $line;
                if (!empty($c['availability'])) {
                    $lines[] = "   Availability: {$c['availability']}";
                }
                $lines[] = '';
            }
            $lines[] = 'Click on their profiles below for more details, then start a chat or follow them.';
        }

        return implode("\n", $lines);
    }

    /**
     * Parse candidate profiles from the context string sent by the frontend.
     * The context contains lines like:
     * - Name: Role, main skill X, skills A, B, goals G1, G2, availability Avail
     */
    private function parseCandidatesFromContext(string $context): array
    {
        $candidates = [];
        $lines = explode("\n", $context);

        foreach ($lines as $line) {
            $line = trim($line);
            if (!str_starts_with($line, '- ')) {
                continue;
            }

            $line = substr($line, 2); // Remove "- "

            // Parse "Name: Role, main skill X, skills A, B, goals G1, G2, availability Detail"
            $colonPos = strpos($line, ':');
            if ($colonPos === false) {
                continue;
            }

            $name = trim(substr($line, 0, $colonPos));
            $rest = trim(substr($line, $colonPos + 1));

            $candidate = [
                'name' => $name,
                'role' => '',
                'mainSkill' => '',
                'skills' => [],
                'goals' => [],
                'availability' => '',
                'raw' => strtolower($rest),
            ];

            // Extract role (text before first comma)
            $parts = explode(',', $rest);
            if (!empty($parts)) {
                $candidate['role'] = trim($parts[0]);
            }

            // Extract main skill
            if (preg_match('/main skill\s+(.+?)(?:,|$)/i', $rest, $m)) {
                $candidate['mainSkill'] = trim($m[1]);
            }

            // Extract skills list
            if (preg_match('/skills\s+(.+?)(?:,\s*goals|$)/i', $rest, $m)) {
                $skillsStr = trim($m[1]);
                $candidate['skills'] = array_map('trim', explode(',', $skillsStr));
                $candidate['skills'] = array_filter($candidate['skills']);
            }

            // Extract goals
            if (preg_match('/goals\s+(.+?)(?:,\s*availability|$)/i', $rest, $m)) {
                $goalsStr = trim($m[1]);
                $candidate['goals'] = array_map('trim', explode(',', $goalsStr));
                $candidate['goals'] = array_filter($candidate['goals']);
            }

            // Extract availability
            if (preg_match('/availability\s+(.+)$/i', $rest, $m)) {
                $candidate['availability'] = trim($m[1]);
            }

            $candidates[] = $candidate;
        }

        return $candidates;
    }

    /**
     * Score candidates against the user's prompt based on keyword matching.
     * Returns an array of candidates sorted by relevance score (descending).
     */
    private function scoreCandidates(array $candidates, string $promptLower): array
    {
        // Extract meaningful keywords from the prompt (remove stop words)
        $stopWords = [
            'i', 'need', 'a', 'an', 'the', 'who', 'can', 'help', 'with', 'and', 'or', 'for',
            'me', 'my', 'is', 'are', 'to', 'in', 'of', 'find', 'search', 'looking', 'want',
            'someone', 'person', 'people', 'saya', 'butuh', 'yang', 'bisa', 'bantu', 'dengan',
            'dan', 'atau', 'untuk', 'di', 'cari', 'orang', 'mau', 'perlu', 'tolong',
            'have', 'has', 'be', 'been', 'do', 'does', 'did', 'it', 'that', 'this',
            'jago', 'ahli', 'mahir', 'handal', 'pintar', 'bagus', 'baik',
        ];

        $words = preg_split('/[\s,\.\/\-]+/', $promptLower);
        $keywords = array_filter($words, function ($word) use ($stopWords) {
            return strlen($word) > 2 && !in_array($word, $stopWords);
        });
        $keywords = array_values($keywords);

        if (empty($keywords)) {
            // If no keywords extracted, return all candidates
            return array_map(function ($c) {
                return ['candidate' => $c, 'score' => 1];
            }, array_slice($candidates, 0, 3));
        }

        $scored = [];

        foreach ($candidates as $candidate) {
            $score = 0;
            $searchable = $candidate['raw'] . ' ' . strtolower($candidate['name']);

            foreach ($keywords as $keyword) {
                // Check for direct substring matches
                if (str_contains($searchable, $keyword)) {
                    $score += 3;
                }

                // Check partial/fuzzy matches (keyword is at least 4 chars)
                if (strlen($keyword) >= 4) {
                    foreach ($candidate['skills'] as $skill) {
                        if (str_contains(strtolower($skill), $keyword) || str_contains($keyword, strtolower($skill))) {
                            $score += 2;
                        }
                    }

                    if (str_contains(strtolower($candidate['role']), $keyword)) {
                        $score += 4;
                    }

                    if (str_contains(strtolower($candidate['mainSkill']), $keyword)) {
                        $score += 5;
                    }

                    foreach ($candidate['goals'] as $goal) {
                        if (str_contains(strtolower($goal), $keyword) || str_contains($keyword, strtolower($goal))) {
                            $score += 2;
                        }
                    }
                }
            }

            // Also check for role-based synonym matching
            $roleKeywordMap = [
                'business' => ['strategist', 'strategy', 'bisnis', 'strategi', 'pitch', 'market', 'research', 'validation', 'riset', 'pasar', 'validasi'],
                'technical' => ['developer', 'backend', 'frontend', 'fullstack', 'programmer', 'coding', 'code', 'api', 'database', 'laravel', 'react', 'pemrograman'],
                'design' => ['designer', 'ui', 'ux', 'figma', 'wireframe', 'desain', 'graphic', 'visual', 'prototype', 'desainer'],
            ];

            $candidateRoleLower = strtolower($candidate['role']);
            foreach ($roleKeywordMap as $roleKey => $synonyms) {
                if (str_contains($candidateRoleLower, $roleKey)) {
                    foreach ($synonyms as $synonym) {
                        if (str_contains($promptLower, $synonym)) {
                            $score += 6;
                            break;
                        }
                    }
                }
            }

            if ($score > 0) {
                $scored[] = ['candidate' => $candidate, 'score' => $score];
            }
        }

        // Sort by score descending
        usort($scored, function ($a, $b) {
            return $b['score'] - $a['score'];
        });

        return $scored;
    }

    /**
     * Simple heuristic to detect if the prompt is likely in Indonesian.
     */
    private function isLikelyIndonesian(string $text): bool
    {
        $indoWords = ['saya', 'butuh', 'cari', 'yang', 'bisa', 'dengan', 'untuk', 'orang', 'tolong', 'bantu', 'mau', 'ingin', 'perlu', 'bagaimana', 'siapa', 'apa', 'dimana'];
        $count = 0;
        foreach ($indoWords as $word) {
            if (str_contains($text, $word)) {
                $count++;
            }
        }
        return $count >= 2;
    }
}
