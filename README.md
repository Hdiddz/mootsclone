# Mutualizm ✦ Campus Collaboration Matcher

Mutualizm adalah platform kolaborasi kampus yang dirancang khusus untuk mahasiswa **Telkom University** agar dapat saling menemukan rekan kolaborator untuk kompetisi, proyek startup, tugas kuliah, riset, maupun event organisasi secara terstruktur berbasis keahlian (*skill-based discovery*).

Aplikasi ini menggunakan mekanisme *card swiping* interaktif (mirip aplikasi pencari jodoh namun difokuskan pada kolaborasi profesional) untuk menyaring kandidat potensial secara cepat dan menyenangkan.

---

## 🚀 Fitur Utama

1. **Autentikasi Terintegrasi**: Login & pendaftaran akun yang aman menggunakan **Supabase Auth** (dilengkapi opsi login SSO menggunakan Google).
2. **Interactive Card Discovery**: Antarmuka geser kartu (swipe deck) interaktif berbasis gesture sentuh/mouse untuk memilih kandidat kolaborator (Pass, Save, atau Interest).
3. **Onboarding Flow**: Proses pembuatan profil bertahap untuk mendefinisikan peran, keahlian utama, pengalaman proyek, ketersediaan waktu, dan link portofolio secara terstruktur.
4. **Realtime Chat & Messaging**: Fitur percakapan instan secara realtime setelah terjadi kecocokan (*mutual match*) yang ditenagai oleh **Supabase Realtime**.
5. **Realtime Notifications & Alerts**: Pemberitahuan instan saat ada kecocokan kolaborator baru maupun pesan masuk yang dikirim langsung dari database trigger.
6. **Smart AI Assistant**: Asisten AI pintar yang terintegrasi (didukung model Google Gemini via OpenRouter) untuk membantu mencari kandidat berdasarkan kriteria keahlian/peran secara langsung.
7. **Warm Dark Theme & Responsive UI**: Tampilan visual premium, elegan, dan estetik dengan dukungan penuh tema gelap (*dark mode*) yang ramah di mata serta layout responsif untuk mobile view.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, TypeScript, React Router DOM v6, Lucide React (Icons), Vanilla CSS (Premium styling & micro-animations).
* **Backend & Database**: Supabase (PostgreSQL, Realtime subscriptions, Row Level Security, Database Triggers).
* **AI Completion**: OpenRouter API (Gemini 2.5 Flash Lite) di-route melalui serverless API PHP.
* **Hosting / Deployment**: Vercel.

---

## 📁 Struktur Proyek

```text
├── frontend/                     # Kode Sumber Aplikasi Client (React + Vite)
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.ts       # Inisialisasi client Supabase SDK
│   │   ├── pages/
│   │   │   └── MatchesPage.tsx   # Halaman kelola kecocokan (matches)
│   │   ├── App.tsx               # File utama React (Routes, State, View Components)
│   │   ├── styles.css            # Stylesheet utama (desain responsif & dark mode)
│   │   ├── types.ts              # Interface tipe data TypeScript
│   │   └── mockData.ts           # Data preset awal (skala fallback lokal)
│   ├── package.json
│   └── vite.config.ts
├── supabase_schema.sql           # Skema SQL lengkap untuk Supabase Editor
├── vercel.json                   # Konfigurasi deployment Vercel (Routing & serverless functions)
└── README.md                     # Dokumentasi ini
```

---

## ⚙️ Petunjuk Pemasangan Lokal

### 1. Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di perangkat Anda.

### 2. Kloning Repositori
```bash
git clone https://github.com/Hdiddz/Mutualizm-BE.git
cd Mutualizm-BE
```

### 3. Inisialisasi Database Supabase
1. Buka [Supabase Console](https://supabase.com) dan buat proyek baru.
2. Masuk ke menu **SQL Editor** pada panel kiri dashboard proyek Anda.
3. Buka berkas `supabase_schema.sql` di proyek Anda, salin (copy) semua baris kodenya, tempelkan (paste) ke editor query Supabase, dan klik **Run**.
4. Semua tabel (`profiles`, `swipes`, `matches`, `messages`, `notifications`, `ai_conversations`), trigger otomatisasi mutual-match, dan RLS policies akan langsung terkonfigurasi.

### 4. Konfigurasi File Environment (.env)
Buat file bernama `.env` di dalam folder `frontend/` (dan root directory jika perlu), lalu isi dengan kredensial proyek Supabase Anda:
```env
VITE_SUPABASE_URL=https://proyek-anda.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon-key-anda...
```

### 5. Jalankan Aplikasi Frontend secara Lokal
```bash
# Pindah ke direktori frontend
cd frontend

# Instal dependensi
npm install

# Jalankan server development
npm run dev
```
Buka browser Anda dan akses `http://localhost:5173`.

---

## 🔒 Konfigurasi Keamanan (RLS)
Keamanan data pada platform ini diatur langsung di tingkat database menggunakan PostgreSQL **Row Level Security (RLS)**:
* **Profiles**: Semua pengguna terdaftar dapat mencari profil kolaborator, tetapi modifikasi hanya diizinkan untuk pemilik akun (`auth.uid() = id`).
* **Swipes & Saved**: Hanya pembuat swipe yang dapat menulis dan melihat daftar geseran miliknya sendiri.
* **Matches & Messages**: Pengguna hanya dapat membaca kecocokan dan bertukar pesan jika mereka terlibat sebagai bagian dari pasangan match tersebut (`auth.uid() = user_a_id OR auth.uid() = user_b_id`).
