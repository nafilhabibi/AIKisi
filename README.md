# 🧠 AIKisi — Asisten Belajar AI Pintar & Kilat

AIKisi adalah aplikasi web modern berbasis AI yang dirancang khusus untuk mempermudah siswa dan pengajar dalam memproses dokumen pelajaran. Cukup dengan mengunggah materi dalam format **PDF**, AIKisi akan mengekstrak teks, membuat rangkuman terstruktur, menyediakan kuis latihan interaktif, dan menghadirkan chatbot pintar untuk mendiskusikan materi tersebut secara langsung.

Ditenagai oleh **Next.js 16**, **Tailwind CSS v4**, dan kecepatan inferensi luar biasa dari **Cerebras Cloud SDK**, AIKisi menawarkan pengalaman belajar yang responsif, interaktif, dan berestetika tinggi dengan gaya desain *Neo-Brutalism*.

---

## ✨ Fitur Utama

- 📄 **Unggah & Ekstraksi PDF Instan**: Mengekstrak teks dari file PDF berukuran hingga 20MB secara lokal menggunakan pustaka `unpdf`.
- 📝 **Rangkuman Cerdas & Terstruktur**: Menghasilkan rangkuman otomatis yang mencakup:
  - Ringkasan menyeluruh (2-3 paragraf)
  - Poin-poin penting kunci materi
  - Glosarium istilah dan definisinya
  - Kumpulan rumus/formula matematika atau sains jika tersedia
- 💬 **Diskusi Interaktif (Tanya AI)**: Obrolan interaktif dengan chatbot AI yang mempelajari konteks dokumen materi secara khusus. Dukungan *response streaming* membuat percakapan terasa hidup dan instan.
- 📝 **Latihan Soal Pilihan Ganda**: Generator kuis otomatis dengan tingkat kesulitan bervariasi. Lengkap dengan kunci jawaban, kalkulasi skor instan, dan penjelasan/pembahasan mendalam untuk setiap nomor.
- 💾 **Penyimpanan Riwayat Lokal**: Semua materi yang telah diproses disimpan secara aman di `localStorage` peramban Anda. Buka kembali kapan saja tanpa perlu database eksternal atau proses login yang rumit.
- ⚡ **Rate-Limit Resilient**: Dilengkapi dengan mekanisme *exponential backoff retry* otomatis untuk menangani potensi batas batas request (HTTP 429) dari server API.

---

## 🛠️ Stack Teknologi

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Inference Engine**: [Cerebras Cloud SDK](https://cerebras.ai/) (Model: `gpt-oss-120b`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan visual Neo-Brutalism & Glassmorphism
- **PDF Parser**: [unpdf](https://github.com/unjs/unpdf)
- **Kumpulan Ikon**: [Lucide React](https://lucide.dev/)

---

## 🚀 Memulai (Panduan Instalasi)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek AIKisi di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18 ke atas disarankan) dan pengelola paket pilihan Anda (NPM, Yarn, PNPM, atau Bun).

### 2. Kloning Repositori
```bash
git clone https://github.com/nafilhabibi/AIKisi.git
cd AIKisi
```

### 3. Instalasi Dependensi
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 4. Konfigurasi Variabel Lingkungan
Buat berkas `.env` di direktori utama (root) proyek Anda dan tambahkan kunci API Cerebras Cloud Anda:

```env
# Kunci API Cerebras untuk masing-masing modul (bisa menggunakan kunci yang sama)
MODEL_MATERI_KEY=your_cerebras_api_key_here
MODEL_SOAL_KEY=your_cerebras_api_key_here
MODEL_CHATBOT_KEY=your_cerebras_api_key_here
```

> [!TIP]
> Jika Anda hanya mendefinisikan `MODEL_MATERI_KEY`, sistem otomatis akan menggunakannya sebagai cadangan (fallback) untuk pembuatan soal dan chatbot jika variabel lainnya tidak diisi.

### 5. Menjalankan Server Pengembangan
Jalankan perintah berikut untuk menjalankan server lokal:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

### 6. Build untuk Produksi
Untuk melakukan kompilasi aplikasi ke mode siap rilis:
```bash
npm run build
npm run start
```

---

## 📁 Struktur Folder Utama

```text
AIKisi/
├── src/
│   ├── app/                # Halaman Next.js (App Router) & Rute API
│   │   ├── api/            # API Endpoints (chat, quiz, summarize, upload)
│   │   ├── latihan/        # Halaman Kuis / Latihan Soal
│   │   ├── materi/         # Halaman Daftar Semua Materi
│   │   ├── rangkuman/      # Halaman Detail Rangkuman & Chatbot
│   │   ├── tentang/        # Halaman Informasi Aplikasi
│   │   ├── globals.css     # Pengaturan Gaya & Animasi Global (Tailwind v4)
│   │   └── page.tsx        # Beranda Utama (Landing & Upload Zone)
│   └── lib/                # Logika Utilitas & Konfigurasi Integrasi
│       ├── cerebras.ts     # Integrasi Cerebras SDK & Auto-Retry Logic
│       └── storage.ts      # Pengelolaan LocalStorage (Simpan, Hapus, Ambil)
├── public/                 # Aset Gambar, Ikon, dan Font
├── .env                    # Konfigurasi Environment Variables (Lokal)
├── package.json            # Daftar Pustaka & Skrip NPM
└── tsconfig.json           # Konfigurasi TypeScript
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT**. Lihat berkas [LICENSE](file:///home/nfl-linux/Workspace/AIKisi/LICENSE) untuk informasi lebih lanjut.

---

*Dibuat dengan 💻 dan ⚡ oleh [nafilhabibi](https://github.com/nafilhabibi).*
