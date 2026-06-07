# 🤝 Knowledge Moots

> **Moots** — Platform kolaborasi kampus berbasis kecocokan skill dan minat untuk mahasiswa Telkom University.

---

## 📖 Tentang Moots

**Moots** adalah platform web kolaborasi kampus yang dirancang khusus untuk mahasiswa **Telkom University**. Platform ini membantu mahasiswa menemukan kolaborator untuk kompetisi, proyek startup, tugas kuliah, riset, dan acara organisasi melalui **skill-based discovery**.

Platform ini menggunakan mekanisme **swipe interaktif** (mirip dating app tetapi berfokus pada kolaborasi profesional) untuk mempertemukan pengguna dengan kandidat yang memiliki potensi kolaborasi tinggi. Setiap pengguna dapat menunjukkan ketertarikan, membangun koneksi, berkomunikasi secara real-time, mendapatkan saran dari **AI Assistant**, dan membangun proyek bersama.

Konsep "mutualisme" diambil dari hubungan simbiosis yang saling menguntungkan — di mana dua pihak dapat tumbuh dan berkembang bersama.

---

## 🎯 Untuk Siapa?

| Pengguna | Kebutuhan |
|---|---|
| 🎓 **Mahasiswa Telkom University** | Mencari partner hackathon, tugas akhir, atau side project |
| 🚀 **Startup Founder Kampus** | Mencari co-founder atau anggota tim untuk startup |
| 🧑‍💻 **Developer & Designer** | Kolaborasi untuk membangun produk bersama |
| 🔬 **Peneliti** | Mencari partner riset dengan keahlian komplementer |
| 📊 **Organisasi Kampus** | Menemukan anggota tim untuk event dan kegiatan |

---

## 🏗️ Tech Stack

### Frontend
| Teknologi | Fungsi |
|---|---|
| **React 18** | Library UI utama |
| **TypeScript** | Type safety dan developer experience |
| **Vite** | Build tool dan dev server |
| **React Router DOM v6** | Client-side routing |
| **Lucide React** | Ikon-ikon UI modern |
| **Laravel Echo + Pusher.js** | Realtime WebSocket client |
| **@supabase/supabase-js** | Supabase client SDK |
| **Vanilla CSS** | Styling kustom (glassmorphism, dark mode, responsif) |

### Backend
| Teknologi | Fungsi |
|---|---|
| **Laravel 13** | Framework backend (PHP 8.3+) |
| **Laravel Sanctum** | API token authentication |
| **Laravel Reverb** | WebSocket server untuk realtime broadcasting |
| **Vercel Serverless** | Deployment dan serverless functions |
| **Supabase** | Database (PostgreSQL), Auth, dan Realtime |

### Database & Auth
| Teknologi | Fungsi |
|---|---|
| **Supabase PostgreSQL** | Database utama dengan Row-Level Security (RLS) |
| **Supabase Auth** | Autentikasi (Google OAuth, Email/Password) |
| **Supabase Realtime** | Real-time messaging dan notifications |
| **Laravel Migrations** | Migrasi database di sisi backend |

### AI Integration
| Teknologi | Fungsi |
|---|---|
| **OpenRouter API** | AI primary (model: `google/gemini-2.5-flash`) |
| **Google Gemini API** | AI fallback (model: `gemini-2.5-flash`) |
| **Local Fallback** | Fallback lokal jika kedua API gagal |

### Deployment
| Platform | Fungsi |
|---|---|
| **Vercel** | Hosting frontend (Vite build) + backend (Laravel serverless) |
| **GitHub** | Source control dan CI/CD |

---

## 📱 Fitur Utama

### 1. 🔐 Autentikasi (Login & Register)
- **Google OAuth** — Login cepat menggunakan akun Google
- **Email/Password** — Registrasi dan login manual
- Setelah login berhasil, pengguna langsung diarahkan ke halaman **Discover** (bukan landing page)
- Jika belum memiliki profil, pengguna diarahkan ke **Onboarding**

### 2. 📝 Onboarding (10 Tahap)
Proses pembuatan profil yang dipandu melalui 10 langkah:

| Tahap | Deskripsi |
|---|---|
| **Tahap 1** | Identitas dasar (nama lengkap) |
| **Tahap 2** | Informasi kampus (program studi, angkatan) |
| **Tahap 3** | Pemilihan peran (role) yang diinginkan |
| **Tahap 4** | Pemilihan keterampilan (skills) |
| **Tahap 5** | Ringkasan profil |
| **Tahap 6** | Pengalaman (organisasi, proyek sebelumnya) |
| **Tahap 7** | Timeline dan ketersediaan |
| **Tahap 8** | Portfolio dan link proyek |
| **Tahap 9** | Ketersediaan kolaborasi |
| **Tahap 10** | Preview profil lengkap |

- Dilengkapi **logo Moots** di pojok kiri atas
- Indikator progres tahap ("Tahap 1 dari 10") untuk memandu pengguna
- Setelah selesai, langsung diarahkan ke Discover dengan pre-loading data kandidat

### 3. 🔍 Discover (Halaman Utama)
Halaman utama untuk menemukan kandidat kolaborasi:

- **Card Deck** — Kartu kandidat ditampilkan secara bertumpuk dengan animasi swipe
- **Informasi Kandidat** — Nama, foto, peran, skills, bio
- **Tombol Aksi**:
  - ✅ **Interest** (centang hijau) — Menunjukkan ketertarikan
  - ❌ **Skip** (silang merah) — Melewati kandidat
- **Filter Panel** — Menyaring kandidat berdasarkan peran, skill, atau lokasi
- **Refresh Deck** — Memuat ulang semua kandidat (termasuk yang sudah di-swipe)
  - Kandidat yang sudah di-interest diberi label **"Sudah diminati"**
- Jika semua kandidat habis, muncul tombol **Refresh** untuk memuat ulang

### 4. 💘 Matches
Halaman untuk melihat kecocokan yang terjadi:

- **Tab "All Matches"** — Semua match yang terkonfirmasi (mutual interest)
- **Tab "Recent"** — Ketertarikan terbaru yang dikirim
- **Match Card** — Menampilkan foto, nama, peran kandidat
- **Aksi** — Mulai chat atau lihat profil lengkap
- Ketika pengguna menekan Interest di Discover, otomatis tercatat di Matches

### 5. 💬 Chat / Messaging
Komunikasi real-time antar pengguna yang sudah match:

- **Real-time messaging** menggunakan Supabase Realtime
- Riwayat pesan dengan timestamp
- Input pesan dengan tombol kirim
- Notifikasi pesan baru

### 6. 🤖 AI Assistant
Asisten AI terintegrasi untuk membantu kolaborasi:

- **Saran teammate** — AI merekomendasikan kandidat berdasarkan kebutuhan
- **Skill-fit analysis** — Analisis kecocokan skill dengan kandidat
- **Role ideas** — Saran peran yang cocok berdasarkan profil
- Menggunakan **Google Gemini** via OpenRouter API
- Riwayat percakapan AI tersimpan per pengguna
- Rate limiting: 20 request per menit

### 7. 📁 Projects
Kolaborasi berbasis proyek:

- Membuat proyek baru dengan deskripsi dan detail
- Mengelola anggota proyek (invite, join)
- Melihat detail proyek dengan creator dan members
- Daftar roles dan skills yang dibutuhkan

### 8. 💾 Saved (Tersimpan)
- Menyimpan/bookmark profil kandidat untuk dilihat nanti
- Tampilan grid yang rapi
- Terintegrasi dengan aksi swipe "save"

### 9. 🔔 Alerts (Notifikasi)
- Pusat notifikasi sistem real-time
- Notifikasi match baru, pesan masuk, project updates
- Mark as read (individual dan mark all)
- Badge counter untuk notifikasi belum dibaca

### 10. ⚙️ Settings (Pengaturan)
- **Edit Profil** — Mengubah informasi profil
- **Preferensi Tema** — Dark mode / light mode
- **Hapus Akun** — Menghapus akun secara permanen
  - Menghapus seluruh data: profil, swipes, matches, pesan
  - Konfirmasi dengan dialog peringatan
  - Login kembali akan membuat akun baru dari awal

### 11. 📲 QR Code Profile Sharing
- Generate QR code untuk membagikan link profil
- Share profil dengan mudah ke pengguna lain

### 12. 🌐 Bilingual Support
- Dukungan penuh bahasa **Indonesia** dan **English**
- Toggle bahasa pada antarmuka pengguna

---

## 🗄️ Struktur Database

### Tabel Utama

| Tabel | Deskripsi | Kolom Utama |
|---|---|---|
| `profiles` | Data profil pengguna | `id`, `email`, `name`, `campus`, `program`, `role`, `main_skill`, `skills` (jsonb), `experiences` (jsonb), `portfolio_links` (jsonb), `availability`, `avatar_url`, `online` |
| `swipes` | Rekaman aksi swipe antar pengguna | `swiper_id`, `swiped_id`, `action` (pass/interest/save) |
| `matches` | Match yang terkonfirmasi (mutual interest) | `user_a_id`, `user_b_id` (constraint: a < b) |
| `messages` | Pesan chat antar pengguna yang match | `match_id`, `sender_id`, `text` |
| `notifications` | Notifikasi dan alert sistem | `user_id`, `type`, `title`, `body`, `read` |
| `ai_conversations` | Riwayat percakapan AI per pengguna | `user_id`, `role` (user/assistant), `message` |

### Tabel Laravel Migrations (Tambahan)
| Tabel | Deskripsi |
|---|---|
| `users` | Tabel user standar Laravel |
| `skills` + `profile_skills` | Many-to-many pivot untuk skills |
| `user_matches` | Match pairs |
| `projects` + `project_members` | Proyek dan anggota (pivot) |
| `personal_access_tokens` | Sanctum tokens |
| `cache`, `sessions`, `jobs` | Infrastruktur Laravel |

### Keamanan Data (RLS Policies)
| Tabel | Read | Write |
|---|---|---|
| `profiles` | Public read | Owner-only update/insert |
| `swipes` | Owner-only | Owner-only insert/update |
| `matches` | Participants-only | Auto (via trigger) |
| `messages` | Participants-only | Participants-only insert |
| `notifications` | Owner-only | Owner-only update/delete |
| `ai_conversations` | Owner-only | Owner-only insert/delete |

### Database Triggers & Functions
| Fungsi | Deskripsi |
|---|---|
| `handle_new_user()` | Auto-creates profile row saat user baru terdaftar |
| `check_mutual_match()` | Cek mutual interest pada swipe → auto-create match + notifikasi |
| `simulate_mutual_match()` | RPC function untuk simulasi match (testing) |
| `delete_user()` | Cascading delete seluruh data pengguna |

### Realtime Publications
Tabel yang terpublish ke Supabase Realtime: `matches`, `messages`, `notifications`, `profiles`, `ai_conversations`

---

## 🔗 API Endpoints

### Public Routes
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Health check server |
| `POST` | `/api/register` | Registrasi user baru |
| `POST` | `/api/login` | Login, return Sanctum token |
| `POST` | `/api/forgot-password` | Kirim link reset password |
| `POST` | `/api/reset-password` | Reset password dengan token |

### Authenticated Routes (Sanctum)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/me` | Profil user saat ini |
| `POST` | `/api/logout` | Revoke token saat ini |
| `GET` | `/api/profile` | Lihat profil sendiri dengan skills |
| `PUT` | `/api/profile` | Update profil |
| `POST` | `/api/profile/avatar` | Upload foto avatar |
| `GET` | `/api/users/{id}` | Lihat profil user lain |
| `GET` | `/api/discover` | Daftar kandidat (filter: role, skill, availability) |
| `POST` | `/api/swipe` | Swipe pada user (pass/interest/save) |
| `GET` | `/api/matches` | Daftar semua match |
| `DELETE` | `/api/matches/{matchId}` | Hapus match |
| `GET` | `/api/matches/{matchId}/messages` | Riwayat chat per match |
| `POST` | `/api/matches/{matchId}/messages` | Kirim pesan (broadcast via Reverb) |
| `PUT` | `/api/matches/{matchId}/messages/{id}` | Edit pesan sendiri |
| `DELETE` | `/api/matches/{matchId}/messages/{id}` | Hapus pesan sendiri |
| `GET` | `/api/projects` | Daftar proyek |
| `POST` | `/api/projects` | Buat proyek baru |
| `GET` | `/api/projects/{id}` | Detail proyek |
| `POST` | `/api/projects/{id}/join` | Gabung proyek |
| `GET` | `/api/notifications` | Notifikasi (paginated) |
| `PUT` | `/api/notifications/{id}/read` | Mark notifikasi read |
| `PUT` | `/api/notifications/read-all` | Mark semua notifikasi read |
| `POST` | `/api/ai/suggest` | AI suggestions (20/min limit) |
| `GET` | `/api/ai/history` | Riwayat percakapan AI |
| `DELETE` | `/api/ai/history` | Hapus riwayat AI |

> **Catatan**: Frontend juga menggunakan Supabase JS Client secara langsung untuk operasi realtime, direct DB queries, dan autentikasi.

### Broadcast Events (Laravel Reverb)
| Event | Deskripsi |
|---|---|
| `NewMatch` | Fired ketika mutual match terbentuk |
| `MessageSent` | Fired ketika pesan baru dikirim |

---

## 🔄 Alur Penggunaan

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Landing     │────▶│  Login /     │────▶│  Onboarding  │
│  Page        │     │  Register    │     │  (10 Tahap)  │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                    ┌────────────────────────────┘
                    ▼
            ┌─────────────┐     ┌─────────────┐
            │  Discover    │────▶│  Interest /  │
            │  (Swipe)     │     │  Skip        │
            └──────┬──────┘     └──────┬──────┘
                   │                    │
                   ▼                    ▼
            ┌─────────────┐     ┌─────────────┐
            │  Matches     │────▶│  Chat        │
            │              │     │  (Real-time) │
            └──────┬──────┘     └─────────────┘
                   │
                   ▼
            ┌─────────────┐
            │  Projects /  │
            │  Kolaborasi  │
            └─────────────┘
```

### Langkah-langkah:

1. **Buka website** → Muncul Landing Page dengan informasi tentang Moots
2. **Login/Register** → Pilih Google OAuth atau Email/Password
3. **Onboarding** (pengguna baru) → Isi 10 tahap profil lengkap
4. **Discover** → Lihat kandidat, swipe untuk interest, skip, atau save
5. **Match** → Jika keduanya saling interest, terjadi match otomatis (via DB trigger)
6. **Chat** → Mulai percakapan real-time dengan match
7. **AI Assistant** → Dapatkan rekomendasi teammate dan analisis kecocokan
8. **Buat Proyek** → Kolaborasi dalam proyek bersama
9. **Kelola Akun** → Edit profil, simpan kandidat favorit, kelola notifikasi
10. **Share Profil** → Bagikan profil via QR Code

---

## 🎨 Desain & UI

- **Dark Mode** sebagai tema default
- **Glassmorphism** effects pada kartu dan panel
- **Animasi smooth** menggunakan Framer Motion
- **Responsif** — Mobile-first design
- **Modern typography** dan color palette yang premium
- **Micro-animations** untuk meningkatkan engagement

---

## 🌐 Deployment

### Vercel Configuration
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.php" },
    { "src": "/(.*)", "dest": "/frontend/dist/$1" }
  ]
}
```

### Environment Variables
| Variable | Deskripsi |
|---|---|
| `APP_NAME` | Nama aplikasi (Moots) |
| `APP_ENV` | Environment (production/local) |
| `APP_KEY` | Laravel application key |
| `DATABASE_URL` | PostgreSQL connection string |
| `VITE_SUPABASE_URL` | URL instance Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key untuk akses client-side |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key untuk operasi admin |
| `REVERB_APP_ID/KEY/SECRET` | Laravel Reverb WebSocket credentials |
| `OPENROUTER_API_KEY` | API key untuk OpenRouter (AI) |
| `OPENROUTER_MODEL` | Model AI yang digunakan |
| `GEMINI_API_KEY` | API key Google Gemini (fallback) |
| `GEMINI_MODEL` | Model Gemini yang digunakan |

### Dev Scripts
| Script | Fungsi |
|---|---|
| `composer dev` | Menjalankan Laravel + queue + logs + Vite secara bersamaan |
| `npm run dev:full` | Menjalankan Laravel + frontend secara bersamaan |
| `npm run build` | Build frontend dan sync ke `public/` |
| `npm run vercel-build` | Build untuk deployment Vercel |

---

## 📞 Kontak & Kontribusi

Moots dikembangkan sebagai bagian dari proyek kolaborasi mahasiswa Telkom University. Untuk berkontribusi:

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

---

> _"Mutualism is not just a concept — it's a way of building together."_ 🤝
