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
            'prompt' => ['required', 'string', 'max:8000'],
            'candidate' => ['nullable', 'array'],
            'context' => ['nullable', 'string', 'max:100000'],
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
        $geminiKey = config('services.gemini.key');

        if ($geminiKey) {
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
            }
            $reply = $this->fallbackSuggestion($prompt, $context);
            $provider = 'local';
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
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id is required'], 400);
        }

        $conversations = AiConversation::where('user_id', $userId)
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
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id is required'], 400);
        }

        AiConversation::where('user_id', $userId)->delete();

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
                'max_tokens' => 800,
            ])
            ->throw()
            ->json();

        return trim($response['choices'][0]['message']['content'] ?? 'I could not generate a suggestion right now.');
    }

    private function askGemini(string $key, string $context, string $prompt, array $history = []): string
    {
        $model = config('services.gemini.model');
        if (empty($model)) {
            $model = 'gemini-2.5-flash-lite';
        }

        // Robust model candidates to try sequentially in case of API errors or unsupported versions
        $attempts = [$model];
        foreach (['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'] as $fallback) {
            if ($fallback !== $model) {
                $attempts[] = $fallback;
            }
        }

        $lastException = null;

        foreach ($attempts as $currentModel) {
            try {
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

                $response = Http::timeout(25)
                    ->acceptJson()
                    ->withQueryParameters(['key' => $key])
                    ->post("https://generativelanguage.googleapis.com/v1beta/models/{$currentModel}:generateContent", [
                        'systemInstruction' => [
                            'parts' => [
                                ['text' => $context]
                            ]
                        ],
                        'contents' => $contents,
                        'generationConfig' => [
                            'temperature' => 0.55,
                            'maxOutputTokens' => 800,
                        ],
                    ])
                    ->throw()
                    ->json();

                return trim($response['candidates'][0]['content']['parts'][0]['text'] ?? 'I could not generate a suggestion right now.');
            } catch (\Throwable $exception) {
                Log::warning("Gemini AI request failed for model {$currentModel}, trying next model in list.", [
                    'error' => $exception->getMessage()
                ]);
                $lastException = $exception;
            }
        }

        throw $lastException ?? new \Exception('All Gemini models failed.');
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

    // ─── INTELLIGENT FALLBACK (no external AI) ───────────────────────────

    private function fallbackSuggestion(string $prompt, string $context = ''): string
    {
        $promptLower = strtolower(trim($prompt));
        $isIndo = $this->isLikelyIndonesian($promptLower);

        // 1. Greetings
        if ($this->isGreeting($promptLower)) {
            $isIndo = $isIndo || $this->isIndonesianGreeting($promptLower);
            if ($isIndo) {
                return "Halo! 👋 Saya **Moots AI**, asisten kolaborasi kamu.\n\nKamu bisa bertanya apa saja, misalnya:\n• \"Tips biar jago ngedit video\"\n• \"Cari orang yang jago UI/UX\"\n• \"Gimana cara bikin pitch deck yang bagus?\"\n\nSilakan tanya! 😊";
            }
            return "Hello! 👋 I'm **Moots AI**, your collaboration assistant.\n\nYou can ask me anything, like:\n• \"Tips for getting better at video editing\"\n• \"Find someone skilled in UI/UX\"\n• \"How to make a great pitch deck?\"\n\nFeel free to ask! 😊";
        }

        // 2. Help / what-can-you-do
        if ($this->isHelpRequest($promptLower)) {
            if ($isIndo) {
                return "Saya bisa bantu banyak hal! 🎯\n\n**Cari rekan tim:**\n• \"Cari backend developer yang bisa Laravel\"\n• \"Siapa yang jago desain UI/UX?\"\n\n**Tips & saran:**\n• \"Tips biar jago ngedit video\"\n• \"Gimana cara bikin portfolio yang bagus?\"\n\n**Chat opener:**\n• \"Buatkan pesan pertama untuk designer\"\n\nCoba ketik pertanyaan kamu!";
            }
            return "I can help with lots of things! 🎯\n\n**Find teammates:**\n• \"Find a backend developer with Laravel skills\"\n• \"Who's great at UI/UX design?\"\n\n**Tips & advice:**\n• \"Tips for getting better at video editing\"\n• \"How to build a great portfolio?\"\n\n**Chat openers:**\n• \"Write a first message for a designer\"\n\nTry asking me anything!";
        }

        // 3. Thank you
        if ($this->isThankYou($promptLower)) {
            return $isIndo
                ? "Sama-sama! 😊 Senang bisa bantu. Kalau ada pertanyaan lagi, jangan ragu untuk tanya ya!"
                : "You're welcome! 😊 Happy to help. Feel free to ask if you have more questions!";
        }

        // 4. Message/opener requests
        if ($this->isMessageRequest($promptLower)) {
            if ($isIndo) {
                return "Ini contoh pesan pertama yang bagus:\n\n\"Halo! Saya lihat skill kamu dan menurut saya cocok banget sama proyek yang lagi saya kerjain. Apakah kamu terbuka untuk diskusi singkat minggu ini?\"\n\n**Tips pesan pertama:**\n• Sebutkan skill spesifik mereka\n• Jelaskan proyek kamu singkat\n• Ajak next step yang jelas (15 menit call, meeting, dll)";
            }
            return "Here's a great first message template:\n\n\"Hi! I noticed your skills in [skill] and think they'd be a great fit for my project. Would you be open to a quick chat this week?\"\n\n**Tips for first messages:**\n• Mention their specific skills\n• Briefly describe your project\n• Suggest a clear next step (15-min call, meeting, etc.)";
        }

        // 5. Tips / advice / how-to questions
        $adviceResponse = $this->handleAdviceQuestion($promptLower, $isIndo);
        if ($adviceResponse !== null) {
            return $adviceResponse;
        }

        // 6. Platform questions
        $platformResponse = $this->handlePlatformQuestion($promptLower, $isIndo);
        if ($platformResponse !== null) {
            return $platformResponse;
        }

        // 7. Candidate search (only if user is actually searching for people)
        $candidates = $this->parseCandidatesFromContext($context);
        $scored = $this->scoreCandidates($candidates, $promptLower);

        if (!empty($scored)) {
            return $this->formatCandidateResults(array_slice($scored, 0, 3), $isIndo);
        }

        // 8. If user seems to be searching for people but no match found
        if ($this->isSearchIntent($promptLower)) {
            if ($isIndo) {
                return "Maaf, saya belum menemukan kandidat yang cocok. Coba kata kunci yang lebih spesifik, misalnya:\n• \"Cari desainer UI/UX\"\n• \"Butuh backend developer\"\n• \"Siapa yang jago business strategy?\"";
            }
            return "Sorry, I couldn't find matching candidates. Try more specific keywords, like:\n• \"Find a UI/UX designer\"\n• \"Need a backend developer\"\n• \"Who's good at business strategy?\"";
        }

        // 9. Friendly general fallback
        if ($isIndo) {
            return "Pertanyaan yang menarik! 🤔 Saya bisa bantu kamu dengan:\n\n• **Cari rekan tim** — \"Cari orang yang jago [skill]\"\n• **Tips & saran** — \"Tips biar jago [skill]\"\n• **Chat opener** — \"Buatkan pesan untuk [peran]\"\n• **Info platform** — \"Apa itu Moots?\"\n\nCoba rephrase pertanyaan kamu ya!";
        }
        return "Interesting question! 🤔 I can help you with:\n\n• **Find teammates** — \"Find someone skilled in [skill]\"\n• **Tips & advice** — \"Tips for getting better at [skill]\"\n• **Chat openers** — \"Write a message for a [role]\"\n• **Platform info** — \"What is Moots?\"\n\nTry rephrasing your question!";
    }

    // ─── Intent Detection Helpers ────────────────────────────────────────

    private function isGreeting(string $text): bool
    {
        $greetings = ['hello', 'hi', 'hey', 'halo', 'hai', 'hei', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'apa kabar', 'how are you', "what's up"];
        foreach ($greetings as $g) {
            if ($text === $g || str_starts_with($text, $g . ' ') || str_starts_with($text, $g . '!') || str_starts_with($text, $g . ',')) {
                return true;
            }
        }
        return false;
    }

    private function isIndonesianGreeting(string $text): bool
    {
        return in_array($text, ['halo', 'hai', 'hei', 'apa kabar', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam']);
    }

    private function isHelpRequest(string $text): bool
    {
        $keywords = ['what can you do', 'apa yang bisa kamu lakukan', 'bisa apa', 'bantuan', 'how does this work', 'cara pakai', 'what are you', 'kamu siapa', 'siapa kamu'];
        foreach ($keywords as $kw) {
            if ($text === $kw || str_contains($text, $kw)) {
                return true;
            }
        }
        // Only match standalone "help" / "tolong", not as part of longer sentences
        return $text === 'help' || $text === 'tolong';
    }

    private function isThankYou(string $text): bool
    {
        $keywords = ['thank', 'thanks', 'terima kasih', 'makasih', 'thx', 'tq', 'trims'];
        foreach ($keywords as $kw) {
            if (str_contains($text, $kw)) {
                return true;
            }
        }
        return false;
    }

    private function isMessageRequest(string $text): bool
    {
        $keywords = ['message', 'opener', 'pesan pertama', 'chat pertama', 'buatkan pesan', 'write a message', 'first message', 'ice breaker', 'icebreaker'];
        foreach ($keywords as $kw) {
            if (str_contains($text, $kw)) {
                return true;
            }
        }
        return false;
    }

    private function isSearchIntent(string $text): bool
    {
        $keywords = ['cari', 'find', 'search', 'butuh', 'need', 'looking for', 'siapa', 'who', 'recommend', 'rekomendasi'];
        foreach ($keywords as $kw) {
            if (str_contains($text, $kw)) {
                return true;
            }
        }
        return false;
    }

    // ─── Topic-Based Advice Responses ────────────────────────────────────

    private function handleAdviceQuestion(string $promptLower, bool $isIndo): ?string
    {
        $adviceIndicators = ['tips', 'cara', 'gimana', 'bagaimana', 'how to', 'how do', 'how can', 'tutorial', 'belajar', 'learn', 'improve', 'meningkatkan', 'biar jago', 'supaya jago', 'agar jago', 'biar bisa', 'advice', 'saran', 'best way', 'cara terbaik', 'langkah', 'steps', 'guide', 'panduan', 'gmn', 'gmana'];
        $isAdvice = false;
        foreach ($adviceIndicators as $indicator) {
            if (str_contains($promptLower, $indicator)) {
                $isAdvice = true;
                break;
            }
        }

        if (!$isAdvice) {
            return null;
        }

        $topics = $this->getTopicResponses();

        foreach ($topics as $topic) {
            foreach ($topic['keywords'] as $kw) {
                if (str_contains($promptLower, $kw)) {
                    return $isIndo ? $topic['id'] : $topic['en'];
                }
            }
        }

        // Generic advice fallback
        if ($isIndo) {
            return "Berikut tips umum untuk mengembangkan skill: 💡\n\n**1. Konsisten belajar**\nLuangkan waktu setiap hari, walau cuma 30 menit.\n\n**2. Belajar dari project nyata**\nTeori itu penting, tapi praktek langsung lebih efektif.\n\n**3. Cari mentor atau komunitas**\nBelajar bareng orang lain mempercepat perkembangan kamu.\n\n**4. Dokumentasikan progres**\nBikin portfolio atau jurnal belajar supaya bisa lihat perkembangan.\n\n**5. Jangan takut gagal**\nSetiap kesalahan adalah kesempatan belajar.\n\nMau tanya tentang topik spesifik? Misalnya \"tips editing\", \"cara belajar coding\", atau \"gimana bikin portfolio\"!";
        }
        return "Here are general tips for developing skills: 💡\n\n**1. Be consistent**\nDedicate time daily, even just 30 minutes.\n\n**2. Learn from real projects**\nTheory matters, but hands-on practice is more effective.\n\n**3. Find mentors or communities**\nLearning with others accelerates your growth.\n\n**4. Document your progress**\nBuild a portfolio or learning journal to track your development.\n\n**5. Don't fear failure**\nEvery mistake is a learning opportunity.\n\nWant specific advice? Try asking about \"editing tips\", \"how to learn coding\", or \"how to build a portfolio\"!";
    }

    private function handlePlatformQuestion(string $promptLower, bool $isIndo): ?string
    {
        $keywords = ['moots', 'platform ini', 'this platform', 'this app', 'aplikasi ini', 'fitur', 'feature'];
        foreach ($keywords as $kw) {
            if (str_contains($promptLower, $kw)) {
                if ($isIndo) {
                    return "**Moots** adalah platform kolaborasi untuk mahasiswa Telkom University! 🎓\n\n**Fitur utama:**\n• **Discover** — Swipe kartu untuk menemukan rekan tim\n• **Matches** — Chat langsung dengan orang yang kamu follow\n• **AI Assistant** — Tanya saya untuk cari rekan atau tips\n• **Saved** — Simpan profil menarik untuk nanti\n• **Projects** — Lihat proyek yang butuh anggota\n\nMau mulai? Coba tanya \"cari [skill yang kamu butuhkan]\"!";
                }
                return "**Moots** is a collaboration platform for Telkom University students! 🎓\n\n**Key features:**\n• **Discover** — Swipe cards to find matching teammates\n• **Matches** — Chat directly with people you follow\n• **AI Assistant** — Ask me to find teammates or get tips\n• **Saved** — Save interesting profiles for later\n• **Projects** — Browse projects looking for members\n\nWant to start? Try asking \"find [skill you need]\"!";
            }
        }
        return null;
    }

    private function getTopicResponses(): array
    {
        return [
            // Editing / Video
            ['keywords' => ['edit', 'editing', 'ngedit', 'video', 'premiere', 'davinci', 'capcut', 'after effect', 'motion graphic'],
             'id' => "Berikut tips biar jago editing! ✂️\n\n**1. Kuasai software-nya**\nMulai dari satu tools dulu (CapCut, Premiere Pro, atau DaVinci Resolve), pelajari shortcut-nya.\n\n**2. Banyak nonton referensi**\nPerhatikan cara transisi, color grading, dan pacing video yang kamu suka.\n\n**3. Practice project kecil**\nCoba edit vlog pendek, reels, atau video cover lagu.\n\n**4. Pelajari storytelling**\nEditing bukan cuma potong-gabung, tapi menyusun cerita.\n\n**5. Ikut komunitas**\nGabung grup editor di Discord/Telegram untuk feedback dan inspirasi.\n\n💡 *Mau cari editor untuk kolaborasi? Tanya \"cari orang yang jago editing\"!*",
             'en' => "Here are tips to master editing! ✂️\n\n**1. Master your software**\nStart with one tool (CapCut, Premiere Pro, or DaVinci Resolve), learn its shortcuts.\n\n**2. Watch lots of references**\nStudy transitions, color grading, and pacing in videos you admire.\n\n**3. Practice with small projects**\nEdit short vlogs, reels, or music covers.\n\n**4. Learn storytelling**\nEditing isn't just cutting — it's crafting a narrative.\n\n**5. Join communities**\nJoin editor groups on Discord/Telegram for feedback and inspiration.\n\n💡 *Want to find an editor to collaborate with? Try \"find someone skilled in editing\"!*"],

            // Design / UI/UX
            ['keywords' => ['design', 'desain', 'ui', 'ux', 'figma', 'wireframe', 'prototype', 'graphic', 'grafis', 'visual', 'illustra'],
             'id' => "Tips biar jago desain! 🎨\n\n**1. Pelajari prinsip dasar**\nTypography, color theory, spacing, dan hierarchy.\n\n**2. Latihan di Figma**\nRedesain app atau website yang sudah ada.\n\n**3. Cari inspirasi**\nDribbble, Behance, Mobbin, dan Awwwards.\n\n**4. Minta feedback**\nShare hasil desain ke teman atau komunitas desainer.\n\n**5. Pelajari user research**\nDesain yang bagus menyelesaikan masalah user.\n\n💡 *Mau cari desainer? Tanya \"cari desainer UI/UX\"!*",
             'en' => "Tips to master design! 🎨\n\n**1. Learn core principles**\nTypography, color theory, spacing, and hierarchy.\n\n**2. Practice in Figma**\nRedesign existing apps or websites.\n\n**3. Find inspiration**\nDribbble, Behance, Mobbin, and Awwwards.\n\n**4. Get feedback**\nShare your work with peers or design communities.\n\n**5. Learn user research**\nGreat design solves user problems.\n\n💡 *Want to find a designer? Ask \"find a UI/UX designer\"!*"],

            // Coding / Programming
            ['keywords' => ['coding', 'code', 'programming', 'pemrograman', 'developer', 'backend', 'frontend', 'fullstack', 'laravel', 'react', 'python', 'javascript', 'web', 'mobile', 'ngoding'],
             'id' => "Tips biar jago ngoding! 💻\n\n**1. Pilih satu bahasa dulu**\nMulai dari JavaScript atau Python.\n\n**2. Bikin project nyata**\nTo-do list, portfolio website, atau API sederhana.\n\n**3. Baca dokumentasi resmi**\nDokumentasi > tutorial YouTube random.\n\n**4. Kontribusi open source**\nMulai dari fix typo atau bug kecil di GitHub.\n\n**5. Konsisten tiap hari**\n30 menit setiap hari lebih baik dari 5 jam sekali seminggu.\n\n💡 *Mau cari developer? Tanya \"cari backend developer\"!*",
             'en' => "Tips to master coding! 💻\n\n**1. Pick one language first**\nStart with JavaScript or Python.\n\n**2. Build real projects**\nTo-do list, portfolio site, or simple API.\n\n**3. Read official docs**\nDocs > random YouTube tutorials.\n\n**4. Contribute to open source**\nStart with typo fixes or small bugs on GitHub.\n\n**5. Be consistent daily**\n30 minutes daily beats 5 hours once a week.\n\n💡 *Want to find a developer? Ask \"find a backend developer\"!*"],

            // Business / Pitch deck / Startup
            ['keywords' => ['business', 'bisnis', 'pitch', 'deck', 'startup', 'market', 'riset', 'pasar', 'validasi', 'validation', 'strateg', 'entrepreneur', 'wirausaha', 'presentasi'],
             'id' => "Tips seputar business & pitch deck! 📊\n\n**1. Pahami masalah dulu**\nPastikan masalah yang kamu pecahkan itu nyata.\n\n**2. Validasi pasar**\nBikin survei atau interview calon user sebelum build produk.\n\n**3. Pitch deck yang efektif**\n10-12 slide: Problem → Solution → Market → Business Model → Team → Ask.\n\n**4. Analisis kompetitor**\nCari celah pasar (gap analysis).\n\n**5. Networking**\nIkut event startup dan hackathon.\n\n💡 *Mau cari strategist? Tanya \"cari business strategist\"!*",
             'en' => "Tips for business & pitch decks! 📊\n\n**1. Understand the problem**\nMake sure the problem is real and worth solving.\n\n**2. Validate the market**\nRun surveys or interview potential users before building.\n\n**3. Effective pitch deck**\n10-12 slides: Problem → Solution → Market → Business Model → Team → Ask.\n\n**4. Analyze competitors**\nFind market gaps through competitor analysis.\n\n**5. Network actively**\nJoin startup events and hackathons.\n\n💡 *Want to find a strategist? Ask \"find a business strategist\"!*"],

            // Photography
            ['keywords' => ['foto', 'photo', 'photography', 'fotografi', 'kamera', 'camera', 'lightroom', 'photoshop'],
             'id' => "Tips biar jago fotografi! 📸\n\n**1. Pahami komposisi**\nRule of thirds, leading lines, framing.\n\n**2. Main cahaya**\nGolden hour (pagi/sore) memberikan hasil terbaik.\n\n**3. Banyak motret**\nJangan tunggu momen sempurna, motret sebanyak-banyaknya.\n\n**4. Editing itu penting**\nPelajari Lightroom untuk post-processing.\n\n**5. Bangun portfolio**\nUpload hasil terbaik ke Instagram atau Behance.\n\n💡 *Mau cari fotografer? Tanya \"cari orang yang jago fotografi\"!*",
             'en' => "Tips to master photography! 📸\n\n**1. Learn composition**\nRule of thirds, leading lines, framing.\n\n**2. Play with light**\nGolden hour (morning/evening) gives the best results.\n\n**3. Shoot a lot**\nDon't wait for the perfect moment.\n\n**4. Editing matters**\nLearn Lightroom for post-processing.\n\n**5. Build a portfolio**\nUpload your best work to Instagram or Behance.\n\n💡 *Want to find a photographer? Ask \"find someone skilled in photography\"!*"],

            // Portfolio
            ['keywords' => ['portfolio', 'portofolio', 'cv', 'resume'],
             'id' => "Tips bikin portfolio yang standout! 📁\n\n**1. Kualitas > Kuantitas**\nTampilkan 5-8 project terbaik saja.\n\n**2. Ceritakan prosesnya**\nJelaskan masalah, proses, dan dampak dari setiap project.\n\n**3. Pilih platform yang tepat**\nBehance untuk desain, GitHub untuk coding.\n\n**4. Sesuaikan target**\nPortfolio untuk startup beda dengan corporate.\n\n**5. Update rutin**\nTambahkan project baru, hapus yang sudah nggak relevan.\n\n💡 *Di Moots, kamu bisa tambahkan portfolio links di profil!*",
             'en' => "Tips to build a standout portfolio! 📁\n\n**1. Quality > Quantity**\nShowcase 5-8 best projects only.\n\n**2. Tell the story**\nExplain the problem, process, and impact of each project.\n\n**3. Choose the right platform**\nBehance for design, GitHub for coding.\n\n**4. Match your audience**\nA startup portfolio differs from a corporate one.\n\n**5. Update regularly**\nAdd new projects and remove outdated ones.\n\n💡 *On Moots, you can add portfolio links to your profile!*"],

            // Collaboration / Teamwork
            ['keywords' => ['kolaborasi', 'collaborat', 'teamwork', 'tim', 'team', 'kerja sama', 'kerjasama', 'kerja bareng'],
             'id' => "Tips kolaborasi yang efektif! 🤝\n\n**1. Definisikan peran**\nBuat pembagian tugas yang jelas.\n\n**2. Komunikasi rutin**\nStandup meeting singkat 15 menit setiap hari.\n\n**3. Gunakan tools yang tepat**\nNotion/Trello untuk task, Figma untuk desain, GitHub untuk kode.\n\n**4. Set deadline realistis**\nBuffer time itu penting.\n\n**5. Saling feedback**\nKritik membangun bikin output lebih bagus.\n\n💡 *Moots bisa bantu cari rekan yang skill-nya cocok!*",
             'en' => "Tips for effective collaboration! 🤝\n\n**1. Define roles**\nClear task division prevents overlap.\n\n**2. Communicate regularly**\nShort 15-minute standups daily.\n\n**3. Use the right tools**\nNotion/Trello for tasks, Figma for design, GitHub for code.\n\n**4. Set realistic deadlines**\nBuffer time matters.\n\n**5. Give mutual feedback**\nConstructive criticism makes output better.\n\n💡 *Moots helps you find collaborators with matching skills!*"],

            // Writing / Content
            ['keywords' => ['writing', 'nulis', 'menulis', 'copywriting', 'content', 'konten', 'artikel', 'article', 'blog'],
             'id' => "Tips biar jago nulis & content! ✍️\n\n**1. Baca banyak**\nPenulis yang bagus adalah pembaca yang rajin.\n\n**2. Tulis setiap hari**\nJurnal, blog, atau tweet — yang penting konsisten.\n\n**3. Kenali audiens**\nPahami siapa yang baca tulisan kamu.\n\n**4. Edit setelah menulis**\nJangan edit sambil nulis — selesaikan dulu, baru revisi.\n\n**5. Pelajari copywriting**\nHeadline yang menarik bikin orang mau baca lebih lanjut.\n\n💡 *Mau cari content writer? Tanya \"cari orang yang jago writing\"!*",
             'en' => "Tips to master writing & content! ✍️\n\n**1. Read a lot**\nGood writers are avid readers.\n\n**2. Write daily**\nJournals, blogs, or tweets — consistency is key.\n\n**3. Know your audience**\nUnderstand who reads your content.\n\n**4. Edit after writing**\nDon't edit while writing — finish first, then revise.\n\n**5. Learn copywriting**\nCompelling headlines make people want to read more.\n\n💡 *Want to find a content writer? Ask \"find someone skilled in writing\"!*"],

            // Data / Analytics
            ['keywords' => ['data', 'analytics', 'analitik', 'machine learning', 'ml', 'ai', 'artificial intelligence', 'excel', 'sql', 'tableau', 'power bi'],
             'id' => "Tips biar jago data & analytics! 📈\n\n**1. Kuasai SQL**\nSQL adalah fondasi dari semua data work.\n\n**2. Belajar Python/R**\nUntuk analisis data, visualisasi, dan machine learning.\n\n**3. Pahami statistik dasar**\nMean, median, standard deviation, korelasi — ini wajib.\n\n**4. Bikin project portfolio**\nAnalisis dataset publik dari Kaggle.\n\n**5. Storytelling dengan data**\nData tanpa cerita itu cuma angka.\n\n💡 *Mau cari data analyst? Tanya \"cari orang yang jago data analytics\"!*",
             'en' => "Tips to master data & analytics! 📈\n\n**1. Master SQL**\nSQL is the foundation of all data work.\n\n**2. Learn Python/R**\nFor data analysis, visualization, and machine learning.\n\n**3. Understand basic statistics**\nMean, median, standard deviation, correlation — these are essential.\n\n**4. Build portfolio projects**\nAnalyze public datasets from Kaggle.\n\n**5. Tell stories with data**\nData without a narrative is just numbers.\n\n💡 *Want to find a data analyst? Ask \"find someone skilled in data analytics\"!*"],
        ];
    }

    // ─── Candidate Parsing & Scoring ─────────────────────────────────────

    private function parseCandidatesFromContext(string $context): array
    {
        $candidates = [];
        $lines = explode("\n", $context);

        foreach ($lines as $line) {
            $line = trim($line);
            if (!str_starts_with($line, '- ')) {
                continue;
            }

            $line = substr($line, 2);
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

            $parts = explode(',', $rest);
            if (!empty($parts)) {
                $candidate['role'] = trim($parts[0]);
            }

            if (preg_match('/main skill\s+(.+?)(?:,|$)/i', $rest, $m)) {
                $candidate['mainSkill'] = trim($m[1]);
            }

            if (preg_match('/skills\s+(.+?)(?:,\s*goals|$)/i', $rest, $m)) {
                $candidate['skills'] = array_filter(array_map('trim', explode(',', trim($m[1]))));
            }

            if (preg_match('/goals\s+(.+?)(?:,\s*availability|$)/i', $rest, $m)) {
                $candidate['goals'] = array_filter(array_map('trim', explode(',', trim($m[1]))));
            }

            if (preg_match('/availability\s+(.+)$/i', $rest, $m)) {
                $candidate['availability'] = trim($m[1]);
            }

            $candidates[] = $candidate;
        }

        return $candidates;
    }

    private function scoreCandidates(array $candidates, string $promptLower): array
    {
        $stopWords = [
            'i', 'need', 'a', 'an', 'the', 'who', 'can', 'help', 'with', 'and', 'or', 'for',
            'me', 'my', 'is', 'are', 'to', 'in', 'of', 'find', 'search', 'looking', 'want',
            'someone', 'person', 'people', 'saya', 'butuh', 'yang', 'bisa', 'bantu', 'dengan',
            'dan', 'atau', 'untuk', 'di', 'cari', 'orang', 'mau', 'perlu', 'tolong',
            'have', 'has', 'be', 'been', 'do', 'does', 'did', 'it', 'that', 'this',
            'jago', 'ahli', 'mahir', 'handal', 'pintar', 'bagus', 'baik',
        ];

        $words = preg_split('/[\s,\.\/\-]+/', $promptLower);
        $keywords = array_values(array_filter($words, fn($w) => strlen($w) > 2 && !in_array($w, $stopWords)));

        if (empty($keywords)) {
            return [];
        }

        $roleKeywordMap = [
            'business' => ['strategist', 'strategy', 'bisnis', 'strategi', 'pitch', 'market', 'research', 'validation', 'riset', 'pasar', 'validasi'],
            'technical' => ['developer', 'backend', 'frontend', 'fullstack', 'programmer', 'coding', 'code', 'api', 'database', 'laravel', 'react', 'pemrograman'],
            'design' => ['designer', 'ui', 'ux', 'figma', 'wireframe', 'desain', 'graphic', 'visual', 'prototype', 'desainer'],
        ];

        $scored = [];

        foreach ($candidates as $candidate) {
            $score = 0;
            $searchable = $candidate['raw'] . ' ' . strtolower($candidate['name']);

            foreach ($keywords as $keyword) {
                if (str_contains($searchable, $keyword)) {
                    $score += 3;
                }

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

        usort($scored, fn($a, $b) => $b['score'] - $a['score']);
        return $scored;
    }

    private function formatCandidateResults(array $topMatches, bool $isIndo): string
    {
        $lines = [];

        if ($isIndo) {
            $lines[] = 'Berdasarkan pencarian kamu, berikut rekomendasinya:';
            $lines[] = '';
            foreach ($topMatches as $i => $match) {
                $c = $match['candidate'];
                $lines[] = '**' . ($i + 1) . '. ' . $c['name'] . '** — ' . $c['role'];
                $line = '   Skill utama: ' . $c['mainSkill'];
                if (!empty($c['skills'])) {
                    $line .= '. Skill lainnya: ' . implode(', ', array_slice($c['skills'], 0, 4));
                }
                $lines[] = $line;
                if (!empty($c['availability'])) {
                    $lines[] = '   Ketersediaan: ' . $c['availability'];
                }
                $lines[] = '';
            }
            $lines[] = 'Klik profil mereka di bawah untuk detail, lalu mulai chat atau follow! 👇';
        } else {
            $lines[] = 'Based on your search, here are some recommendations:';
            $lines[] = '';
            foreach ($topMatches as $i => $match) {
                $c = $match['candidate'];
                $lines[] = '**' . ($i + 1) . '. ' . $c['name'] . '** — ' . $c['role'];
                $line = '   Main skill: ' . $c['mainSkill'];
                if (!empty($c['skills'])) {
                    $line .= '. Other skills: ' . implode(', ', array_slice($c['skills'], 0, 4));
                }
                $lines[] = $line;
                if (!empty($c['availability'])) {
                    $lines[] = '   Availability: ' . $c['availability'];
                }
                $lines[] = '';
            }
            $lines[] = 'Click on their profiles below for more details, then start a chat or follow them! 👇';
        }

        return implode("\n", $lines);
    }

    private function isLikelyIndonesian(string $text): bool
    {
        $indoWords = ['saya', 'butuh', 'cari', 'yang', 'bisa', 'dengan', 'untuk', 'orang', 'tolong', 'bantu', 'mau', 'ingin', 'perlu', 'bagaimana', 'siapa', 'apa', 'dimana', 'gimana', 'biar', 'jago', 'ngedit', 'bikin', 'punya', 'kasih', 'tahu', 'dong', 'nih', 'gue', 'gw', 'lu', 'loe', 'gak', 'nggak', 'ngga'];
        $count = 0;
        foreach ($indoWords as $word) {
            if (str_contains($text, $word)) {
                $count++;
            }
        }
        return $count >= 1;
    }
}
