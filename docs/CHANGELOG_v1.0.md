# 📋 Mutualizm Changelog — v1.0

> **Version**: 1.0.0  
> **Status**: 🟡 Beta Release  
> **Release Date**: Juni 2026  
> **Platform**: Web (Vercel + Railway)  
> **Total Commits**: 33

---

## 🏷️ Version Label

```
╔══════════════════════════════════════╗
║     MUTUALIZM v1.0.0 — BETA         ║
║     Campus Collaboration Platform    ║
║     Telkom University                ║
╚══════════════════════════════════════╝
```

> [!NOTE]
> Project ini masih dalam tahap **v1.0 (Beta)**. Fitur-fitur yang ada mungkin masih mengalami perubahan dan penyempurnaan berdasarkan feedback pengguna..

---

## 📅 Git Commit History (33 Commits)

| # | Hash | Pesan Commit | Kategori |
|---|---|---|---|
| 1 | `f139ee9` | Initial Mutualizm Laravel backend — Sanctum auth, Reverb real-time chat, full REST API | 🚀 Init |
| 2 | `37409be` | fix deployment build image network timeouts | 🔧 Deploy |
| 3 | `4c13753` | rebase after pull | 🔧 Deploy |
| 4 | `b1cea5c` | optimize: Alpine, IPv4 resolve, pre-compiled installer | 🔧 Deploy |
| 5 | `ee3a049` | fix: healthcheck failure, DATABASE_URL mapping | 🐛 Fix |
| 6 | `7ac7db5` | fix: delegate startCommand to Dockerfile CMD via start.sh | 🐛 Fix |
| 7 | `f76b451` | feat: embed frontend source and compiled assets into backend | 🚀 Feature |
| 8 | `87e6088` | fix: restore home route, add APP_KEY warning | 🐛 Fix |
| 9 | `1487488` | feat: integrate frontend build in Dockerfile | 🚀 Feature |
| 10 | `28982ce` | Implement UI fixes and deployment setup | 🎨 UI |
| 11 | `66295b2` | Polish app UI and deployment flow | 🎨 UI |
| 12 | `5d4998a` | Refine responsive UI and match controls | 🎨 UI |
| 13 | `e404bd3` | Prepare Vercel deploy and realtime config | 🔧 Deploy |
| 14 | `e1a802a` | Fix Vercel static routing for frontend | 🔧 Deploy |
| 15 | `3627732` | Add Vercel API environment preflight | 🔧 Deploy |
| 16 | `1d27d94` | Allow Vercel API without configured app key | 🔧 Deploy |
| 17 | `42dfc32` | Preserve Laravel API paths on Vercel | 🔧 Deploy |
| 18 | `58c93bc` | Normalize Vercel API paths in PHP entrypoint | 🔧 Deploy |
| 19 | `b30c1ac` | Add serverless SQLite fallback for Vercel auth | 🔧 Deploy |
| 20 | `f3693f8` | feat: Integrate Supabase Auth, database schema and realtime | 🚀 Feature |
| 21 | `819c203` | fix: full email signup, remove TelU SSO, chunk splitting | 🐛 Fix |
| 22 | `7d138c8` | fix: Implement actual Google OAuth client-side redirect | 🐛 Fix |
| 23 | `51ddf98` | fix: Redirect to onboarding if profile incomplete | 🐛 Fix |
| 24 | `1994a5c` | fix: onboarding logo & step, discover refresh, login redirect, account delete | 🐛 Fix |
| 25 | `777cd99` | fix: onboarding validation crash, auto mutual match, refresh button | 🐛 Fix |
| 26 | `b371e07` | fix: resolve blank page on enter discover after onboarding | 🐛 Fix |
| 27 | `0b4567b` | fix: implement showSwiped for deck refresh, simulate_mutual_match RPC | 🐛 Fix |
| 28 | `50a9bbc` | fix: prevent match modal crash, duplicate chat messages, avatar stretching | 🐛 Fix |
- **[AUTH-001]** Implementasi login menggunakan **Google OAuth** melalui Supabase Auth
- **[AUTH-002]** Implementasi login menggunakan **Email/Password**
- **[AUTH-003]** Sistem session management dengan Supabase Auth tokens
- **[AUTH-004]** Auto-redirect ke halaman **Discover** setelah login berhasil (bypass landing page)

---

## 🚀 Fitur Lengkap v1.0

### 🔐 Sistem Autentikasi
- **[AUTH-005]** Deteksi pengguna baru → redirect ke Onboarding; pengguna existing → redirect ke Discover
- **[AUTH-006]** Password reset flow (forgot password + reset with token)
- **[AUTH-007]** Logout multi-session aware dengan dialog konfirmasi

### 📝 Onboarding Flow (10 Tahap)
- **[ONB-001]** Wizard onboarding 10 langkah untuk pembuatan profil:
  - Tahap 1: Identitas (nama lengkap)
  - Tahap 2: Kampus (program studi, angkatan)
  - Tahap 3: Pemilihan Peran (role)
  - Tahap 4: Pemilihan Keterampilan (skills)
  - Tahap 5: Ringkasan Profil
  - Tahap 6: Pengalaman (organisasi, proyek)
  - Tahap 7: Timeline & Ketersediaan
  - Tahap 8: Portfolio & Link Proyek
  - Tahap 9: Ketersediaan Kolaborasi
  - Tahap 10: Preview Profil Lengkap
- **[ONB-002]** Indikator progres tahap ("Tahap 1 dari 5", "Tahap 2 dari 5", dst.)
- **[ONB-003]** Logo Mutualizm di pojok kiri atas halaman onboarding
- **[ONB-004]** Navigasi langsung ke Discover setelah onboarding selesai dengan pre-loading data kandidat

##### 🔍 Halaman Discover
- **[DSC-001]** Card deck dengan animasi swipe (pointer-based gesture, touch + mouse)
- **[DSC-002]** Kartu kandidat menampilkan: foto, nama, peran, skills, bio, program studi
- **[DSC-003]** Tiga aksi swipe:
  - ✅ **Interest** (centang hijau) — Menunjukkan ketertarikan
  - ❌ **Pass** (silang merah) — Melewati kandidat
  - 💾 **Save** (bookmark) — Menyimpan kandidat
- **[DSC-004]** Panel filter 7 dimensi: skill category, specific skill, role, availability, collaboration goal, program, experience level
- **[DSC-005]** Tombol **Refresh Deck** saat semua kandidat habis
  - Memuat ulang semua kandidat termasuk yang sudah di-swipe
  - Kandidat yang sudah di-interest diberi label **"Sudah diminati"** (`showSwiped` toggle)
- **[DSC-006]** Algoritma pencarian kandidat terbaik (`findBestSuggestion`) dengan null-safety
- **[DSC-007]** Empty state yang informatif dengan tombol refresh
- **[DSC-008]** `resetDeck()` function untuk reset deck state

##### 💘 Sistem Matches
- **[MCH-001]** Halaman Matches dengan tab **All Matches** dan **Recent**
- **[MCH-002]** Match cards menampilkan foto, nama, dan peran kandidat
- **[MCH-003]** Tombol aksi: **Chat** dan **View Profile** pada setiap match card
- **[MCH-004]** Interest di Discover otomatis tercatat di Recent Matches
- **[MCH-005]** Mutual interest detection — notifikasi saat kedua pihak saling interest

##### 💬 Chat / Real-time Messaging
- **[CHT-001]** Sistem chat real-time menggunakan **Supabase Realtime** + **Laravel Reverb** WebSocket
- **[CHT-002]** Riwayat pesan dengan timestamp
- **[CHT-003]** Input pesan dengan tombol kirim
- **[CHT-004]** Auto-scroll ke pesan terbaru
- **[CHT-005]** Reply, edit, delete, dan undo pesan
- **[CHT-006]** Typing indicator dan online status badges
- **[CHT-007]** Broadcast event `MessageSent` via PrivateChannel `chat.{matchId}`

##### 📁 Halaman Projects
- **[PRJ-001]** Membuat proyek kolaboratif baru dengan deskripsi, roles, dan skills yang dibutuhkan
- **[PRJ-002]** Mengelola anggota proyek (creator, join functionality)
- **[PRJ-003]** Detail view proyek dengan creator info dan daftar members
- **[PRJ-004]** Integrasi penuh dengan backend Supabase dan Laravel API

##### 💾 Halaman Saved (Tersimpan)
- **[SVD-001]** Fitur bookmark/simpan profil kandidat
- **[SVD-002]** Tampilan grid untuk profil yang disimpan
- **[SVD-003]** Tombol untuk menghapus dari daftar simpan

##### 🔔 Halaman Alerts (Notifikasi)
- **[ALR-001]** Pusat notifikasi sistem real-time
- **[ALR-002]** Notifikasi match baru (auto-generated via DB trigger)
- **[ALR-003]** Notifikasi pesan masuk
- **[ALR-004]** Badge counter untuk notifikasi yang belum dibaca
- **[ALR-005]** Mark as read (individual dan mark all)
- **[ALR-006]** Paginated notifications dari backend

##### ⚙️ Halaman Settings
- **[SET-001]** Edit profil pengguna (nama, bio, foto, skills, dll.) dengan crop controls
- **[SET-002]** Preferensi tema (dark mode / light mode) — persisted di localStorage
- **[SET-003]** **Hapus Akun** — Penghapusan akun secara permanen:
  - Menghapus seluruh data: profil, swipes, matches, pesan, proyek, AI conversations
  - Dialog konfirmasi dengan peringatan
  - Menggunakan `supabase.rpc('delete_user')` untuk cascading delete
  - Clear localStorage dan redirect ke landing page
  - Login kembali akan membuat akun yang sepenuhnya baru
- **[SET-004]** Notification, chat, dan email preferences
- **[SET-005]** Password change
- **[SET-006]** Status badge setting

##### 🤖 AI Assistant
- **[AI-001]** Asisten AI terintegrasi menggunakan **Google Gemini 2.5 Flash** via OpenRouter API
- **[AI-002]** Saran teammate berdasarkan kebutuhan pengguna
- **[AI-003]** Skill-fit analysis — analisis kecocokan skill dengan kandidat
- **[AI-004]** Role ideas — saran peran yang cocok
- **[AI-005]** Multi-provider fallback: OpenRouter → Google Gemini → Local fallback
- **[AI-006]** Riwayat percakapan AI tersimpan per pengguna di tabel `ai_conversations`
- **[AI-007]** Rate limiting: 20 request per menit
- **[AI-008]** Clear history functionality

##### 📲 QR Code Profile Sharing
- **[QR-001]** Generate QR code untuk profil pengguna
- **[QR-002]** Copy link profil ke clipboard
- **[QR-003]** Share profil dengan mudah ke pengguna lain

##### 🌐 Bilingual Support (i18n)
- **[I18N-001]** Dukungan penuh bahasa **Indonesia** dan **English**
- **[I18N-002]** 550+ translation keys per bahasa
- **[I18N-003]** Toggle bahasa pada antarmuka pengguna

---

#### 🐛 Bug Fixes

| ID | Bug | Commit | Solusi | Status |
|---|---|---|---|---|
| **BUG-001** | Build timeout pada Railway | `37409be`, `b1cea5c` | IPv4 precedence, Alpine optimization, retries | ✅ Fixed |
| **BUG-002** | Healthcheck failure | `ee3a049` | Map DATABASE_URL, auto-detect DB driver | ✅ Fixed |
| **BUG-003** | Railway parser errors | `7ac7db5` | Delegate ke Dockerfile CMD via start.sh | ✅ Fixed |
| **BUG-004** | Home route 500 error | `87e6088` | Restore `/` route | ✅ Fixed |
| **BUG-005** | Vercel routing issues (5 fixes) | `e1a802a`→`58c93bc` | Static routing, API paths, PHP entrypoint | ✅ Fixed |
| **BUG-006** | Vercel auth tanpa DB | `b30c1ac` | SQLite fallback untuk serverless auth | ✅ Fixed |
| **BUG-007** | Email signup terbatas TelU | `819c203` | Support arbitrary email, remove TelU SSO | ✅ Fixed |
| **BUG-008** | Vendor chunk warnings | `819c203` | Configure Vite chunk splitting | ✅ Fixed |
| **BUG-009** | Tidak redirect ke onboarding | `51ddf98` | Auto-redirect ke `/onboarding` jika profil incomplete | ✅ Fixed |
| **BUG-010** | Blank page setelah onboarding | `b371e07` | Null-safety checks, pre-load `fetchDiscoverAndMatches()` | ✅ Fixed |
| **BUG-011** | Onboarding validation crash | `777cd99` | Fix crash di `validateOnboardingStep` | ✅ Fixed |
| **BUG-012** | Interest tidak sinkron ke Matches | `0b4567b` | Implement `showSwiped`, `simulate_mutual_match` RPC | ✅ Fixed |
| **BUG-013** | Tombol Interest menyebabkan blank page | `50a9bbc` | Null-safety di `findBestSuggestion` dan `applyFilters` | ✅ Fixed |
| **BUG-014** | Chat mengirim pesan dua kali | `50a9bbc` | Fix duplicate message rendering dan event handler | ✅ Fixed |
| **BUG-015** | UI Matches avatar stretching | `50a9bbc` | Fix match card avatar CSS | ✅ Fixed |
| **BUG-016** | Match modal crash | `50a9bbc` | Handle incomplete match data | ✅ Fixed |
| **BUG-017** | Login redirect ke landing page | `1994a5c` | Fix auth listener redirect langsung ke /discover | ✅ Fixed |
| **BUG-018** | Delete account "function not found" | `1994a5c` | Fix Supabase RPC call untuk `delete_user` | ✅ Fixed |
| **BUG-019** | Tombol "Clear All" tidak sesuai | `1994a5c` | Ganti dengan "Refresh Deck" + `resetDeck()` | ✅ Fixed |

---

#### 🎨 Peningkatan UI/UX

| ID | Perubahan | Detail |
|---|---|---|
| **UI-001** | Logo placement di Onboarding | Logo Mutualizm ditempatkan di pojok kiri atas, konsisten dengan halaman Discover |
| **UI-002** | Step indicators di Onboarding | Menampilkan "Tahap X dari 5" untuk membantu pengguna mengetahui progres |
| **UI-003** | Label "Sudah diminati" | Badge pada kandidat yang sudah di-interest saat refresh deck |
| **UI-004** | Animasi swipe card | Smooth card animations menggunakan Framer Motion dengan spring physics |
| **UI-005** | Responsive mobile-first design | Seluruh halaman dioptimasi untuk tampilan mobile dan desktop |
| **UI-006** | Dark theme support | Tema gelap sebagai default dengan opsi light mode |
| **UI-007** | Glassmorphism effects | Efek glassmorphism pada kartu, panel, dan dialog |
| **UI-008** | Premium color palette | Warna-warna premium yang terkurasi (bukan warna generik) |
| **UI-009** | Modern typography | Penggunaan font modern (Inter/Roboto) alih-alih default browser |
| **UI-010** | Micro-animations | Hover effects, transisi halus, dan feedback visual interaktif |

---

#### 🔧 Perubahan Backend & Database

| ID | Perubahan | Detail |
|---|---|---|
| **BE-001** | Supabase schema setup | 6 tabel utama + triggers + RLS policies (296 baris SQL) |
| **BE-002** | Row-Level Security (RLS) | Kebijakan granular pada semua tabel |
| **BE-003** | Database Triggers | `handle_new_user()`, `check_mutual_match()` |
| **BE-004** | RPC Functions | `simulate_mutual_match()`, `delete_user()` |
| **BE-005** | 9 Laravel Controllers | Auth, Profile, Discover, Match, Chat, Project, Notification, AiAssistant, Base |
| **BE-006** | 9 Eloquent Models | User, Profile, Skill, Swipe, UserMatch, Message, AppNotification, Project, AiConversation |
| **BE-007** | Laravel Reverb setup | WebSocket broadcasting dengan `NewMatch` dan `MessageSent` events |
| **BE-008** | Sanctum Auth | Personal access tokens untuk API authentication |
| **BE-009** | AI Multi-Provider | OpenRouter → Gemini → Local fallback, rate limited 20/min |
| **BE-010** | Supabase Realtime | 5 tabel published ke `supabase_realtime` |
| **BE-011** | Vercel serverless config | `vercel-php@0.8.0`, 60s max duration, SPA fallback |
| **BE-012** | Railway Docker deploy | Multi-stage build (Node 20 + PHP 8.4 Alpine) |

---

#### 🗃️ Database Migrations

| Migration | Tanggal | Tabel |
|---|---|---|
| `0001_01_01_000000` | Default | `users`, `password_reset_tokens`, `sessions` |
| `0001_01_01_000001` | Default | `cache`, `cache_locks` |
| `0001_01_01_000002` | Default | `jobs`, `job_batches`, `failed_jobs` |
| `2024_01_02_000000` | Jan 2024 | Core: `profiles`, `skills`, `profile_skills`, `swipes`, `matches`, `messages`, `projects`, `project_members`, `notifications` |
| `2026_06_04_174015` | Jun 4, 2026 | `personal_access_tokens` (Sanctum) |
| `2026_06_05_000000` | Jun 5, 2026 | `ai_conversations` (AI chat history) |

---

#### 📦 Dependencies

##### Frontend
| Package | Version | Fungsi |
|---|---|---|
| `react` | ^18.x | Library UI |
| `react-dom` | ^18.x | React DOM renderer |
| `react-router-dom` | ^6.x | Client-side routing |
| `lucide-react` | ^0.4x | Icon library |
| `@supabase/supabase-js` | ^2.107+ | Supabase client SDK |
| `laravel-echo` | ^1.x | Realtime WebSocket client |
| `pusher-js` | ^8.x | Pusher protocol (for Reverb) |

##### Backend
| Package | Version | Fungsi |
|---|---|---|
| `laravel/framework` | ^13.8 | PHP framework |
| `laravel/sanctum` | ^4.0 | API token auth |
| `laravel/reverb` | ^1.10 | WebSocket server |
| `supabase` | - | Database & auth provider |
| `phpunit/phpunit` | ^12.x | Testing framework |

---

## 🗺️ Roadmap (Planned for v1.1+)

> [!TIP]
> Fitur-fitur berikut direncanakan untuk versi mendatang:

- [ ] 📱 Progressive Web App (PWA) support
- [ ] 🔔 Push notifications (browser)
- [ ] 📊 Dashboard analytics untuk pengguna
- [ ] 🤖 AI-powered matching recommendations
- [ ] 📹 Video call integration
- [ ] 🌍 Multi-language support (ID/EN)
- [ ] 📎 File sharing dalam chat
- [ ] 🏆 Gamification dan badges
- [ ] 📧 Email notifications
- [ ] 🔗 Portfolio/LinkedIn integration

---

## 📝 Catatan Rilis

> [!IMPORTANT]
> **Versi 1.0** merupakan rilis beta pertama dari Mutualizm. Platform ini masih dalam tahap pengembangan aktif. Beberapa fitur mungkin belum sepenuhnya stabil dan akan terus diperbaiki berdasarkan feedback pengguna.

### Known Issues (v1.0)
- Performa mungkin menurun pada jumlah kandidat yang sangat besar (>1000)
- Beberapa animasi mungkin terasa lambat pada perangkat low-end
- Real-time chat membutuhkan koneksi internet yang stabil

### Minimum Requirements
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Koneksi**: Internet stabil (min. 1 Mbps)
- **Resolusi**: Min. 320px (mobile) — Optimal 1920x1080 (desktop)

---

> _Mutualizm v1.0 — Building connections that matter._ 🤝
