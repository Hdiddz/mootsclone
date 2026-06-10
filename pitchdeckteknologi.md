# 🛠️ Slide Pitch Deck: Teknologi yang Digunakan (Moots)

Berikut adalah ringkasan arsitektur teknologi (**Tech Stack**) aplikasi **Moots** yang dirancang khusus untuk mempermudah penyusunan slide presentasi Anda (misalnya Canva/PPT). Informasi ini dikelompokkan agar pas untuk dibaca dalam 1-2 slide.

---

## 📌 Judul Slide: Arsitektur Teknologi & Skalabilitas

> **Moots** mengadopsi arsitektur modern berbasis **Hybrid Real-Time & AI-Driven Stack** untuk memastikan performa tinggi, keamanan data tingkat tinggi, dan fitur kecocokan cerdas yang responsif.

---

## 🎨 1. Frontend (Premium Client-Side Experience)
*Untuk ditempel pada bagian UI/UX/Client Stack:*
* **React 18 & TypeScript** – Menjamin performa UI yang interaktif, stabil, serta bebas bug tipe data (*type-safety*).
* **Vite** – Build tool generasi baru untuk pemuatan halaman (*page load*) instan dan performa rendering super cepat.
* **Vanilla CSS (Glassmorphism & Dark Mode)** – Desain antarmuka premium, modern, dan sangat responsif di perangkat mobile maupun desktop tanpa *overhead* library luar.

---

## ⚙️ 2. Backend & Realtime Communication
*Untuk ditempel pada bagian Server/Logic Stack:*
* **Laravel 13 (PHP 8.3+)** – Framework backend enterprise yang tangguh untuk memproses logika bisnis, keamanan API (*Sanctum*), dan integrasi sistem.
* **Laravel Reverb (WebSockets)** – Server WebSocket internal berkecepatan tinggi untuk mengirimkan notifikasi instan secara *real-time*.

---

## 💾 3. Database & Cloud Infrastructure
*Untuk ditempel pada bagian Storage & Security:*
* **Supabase PostgreSQL** – Database relasional tangguh yang menyimpan profil mahasiswa, portofolio, dan histori interaksi.
* **Row-Level Security (RLS)** – Protokol keamanan tingkat tinggi yang memastikan data pribadi dan percakapan hanya dapat dibaca oleh pemilik sah.
* **Supabase Realtime & Auth** – Sinkronisasi chat instan antar mahasiswa serta integrasi login aman menggunakan Google OAuth.

---

## 🤖 4. AI Integration (Smart Teammate Matchmaker)
*Untuk ditempel pada bagian AI/Core Innovation:*
* **Google Gemini API & OpenRouter** – Otak AI utama (`gemini-2.5-flash`) yang menganalisis kecocokan *skills*, merekomendasikan rekan tim kolaborasi, dan merumuskan ide peran (*role fit analysis*) secara otomatis.
* **Smart Fallback System** – Sistem pertahanan AI berlapis untuk memastikan asisten AI tetap aktif meskipun terjadi lonjakan lalu lintas data (*traffic*).

---

## 🚀 Poin Unggulan untuk Pitch Deck (Value Proposition)
Jika Anda perlu menjelaskan **"Mengapa memilih teknologi ini?"** kepada juri/investor, gunakan poin-poin ini:
1. **Real-Time & No-Latency** – Menggabungkan Supabase Realtime & Laravel Reverb agar proses mencocokkan (*match*) dan *chatting* terjadi di bawah 100ms.
2. **Security-First** – Adopsi PostgreSQL RLS (Row-Level Security) membuat database Moots sangat aman dari peretasan akses data pribadi mahasiswa.
3. **Serverless & Cost-Efficient** – Di-deploy di **Vercel Serverless**, membuat aplikasi otomatis berskala saat pengguna naik tanpa biaya server bulanan yang bengkak.
4. **AI-Enabled Platform** – Bukan sekadar filter data biasa, kami memakai kecerdasan buatan LLM (Gemini) untuk menjamin kualitas rekomendasi tim yang presisi.
