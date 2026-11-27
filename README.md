# Portofolio Tazky Ferliansyah

Satu halaman portofolio untuk Tazky Ferliansyah (`ZyrexFX`), dibangun dengan Next.js App Router, TypeScript, dan Tailwind CSS v4.

Halaman ini adalah fondasi awal. Proyek GitHub yang tampil dipilih manual, bukan mengambil semua repositori publik.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Perintah lain:

```bash
npm run typecheck
npm run build
npm start
```

## Menambah proyek pilihan

Semua kurasi ada di `src/data/site.ts`, pada array `featuredRepos`.

```ts
{
  repo: "nama-repo",
  tags: ["Kategori", "Teknologi"],
  liveUrl: "https://contoh.com", // opsional
  description: "Deskripsi singkat", // opsional, menimpa deskripsi GitHub
  fallback: {
    name: "nama-repo",
    description: "Deskripsi cadangan",
    url: "https://github.com/ZyrexFX/nama-repo",
    homepage: null,
    language: "TypeScript",
    license: "MIT",
    pushedAt: "2026-11-23T12:24:31Z",
    topics: []
  }
}
```

Cara kerjanya:

1. Hanya `repo` yang terdaftar di `featuredRepos` yang diambil dari GitHub API.
2. Metadata diperbarui paling cepat setiap satu jam (`revalidate`).
3. Jika API gagal, halaman memakai data `fallback` dan menampilkan catatan bahwa data sedang memakai salinan tersimpan.
4. Jika daftar kosong, halaman menampilkan empty state yang mengarah ke GitHub.

Untuk menaikkan batas rate limit GitHub API, set `GITHUB_TOKEN` (personal access token tanpa scope khusus) di environment. Tanpa token, batasnya 60 permintaan per jam per IP.

## Struktur

```text
src/
  app/
    layout.tsx       Metadata, font, header, footer
    page.tsx         Hero, tentang, kontak
    globals.css      Token warna Tailwind, parallax, skeleton, fokus
  components/
    projects.tsx     Daftar proyek, loading, error, empty state
    depth-scene.tsx  Akuarium interaktif di hero (kursor, gulir, klik untuk memberi makan)
    parallax-backdrop.tsx
    depth-rail.tsx   Navigasi progres di sisi kiri (desktop)
    site-header.tsx
    site-footer.tsx
  data/site.ts       Profil dan daftar repo pilihan
  lib/github.ts      Pengambilan dan normalisasi data GitHub
public/
  contours-*.svg     Lapisan garis kontur untuk parallax
```

## Arah desain

- **Palet**: `#131B2B` (latar), `#2F4A63` dan `#5B91A3` (struktur dan air), `#FF4D4D` (aksen 10%, hover `#FF6B6B`), `#A9C6CF` dan `#E9F2F0` (teks). Aksen dipakai hanya untuk CTA, kata miring, underline nav aktif, focus ring, dan seleksi.
- **Tipografi**: DM Sans untuk teks dan antarmuka, Newsreader untuk nama, judul, dan aksen italic. Pasangan ini memberi karakter editorial yang tenang dan tidak memakai font bawaan template developer.
- **Parallax**: tiga lapisan kontur bergerak dengan kecepatan berbeda di hero. Garis kontur adalah motif identitas, bukan hiasan acak, dan berhenti saat `prefers-reduced-motion` aktif.
- **Scene interaktif**: akuarium garis di samping nama. Ikan dan partikel bergerak di dalam batas yang tidak digambar, kursor membuat ikan menghindar, gulir menggeser lapisan, dan klik di dalam akuarium menebar pakan. Tombol `Feed` menjadi jalur keyboard, tombol `Pause` menghentikan animasi latar, dan gerak ambient berhenti saat `prefers-reduced-motion` aktif.
- **Navigasi**: underline pada navbar mengikuti bagian aktif dan bergerak halus saat berpindah bagian, baik di desktop maupun menu seluler.
- **Scrollbar**: ramping 6px, tanpa tombol panah atas dan bawah, dengan thumb yang menyala saat disentuh.
- **Ritme**: bagian proyek berupa daftar editorial bernomor, bagian tentang asimetris dengan angka besar, bagian kontak menyatu dengan latar gelap. Tidak ada tiga kartu fitur atau statistik palsu.
- **Bahasa**: seluruh isi halaman memakai bahasa Inggris dengan nada santai namun tetap rapi. Kode dan dokumentasi tetap memakai bahasa Indonesia.
- **Dial**: ENERGY 2 / RHYTHM 3 / MOTION 3.
- **Data**: hanya fakta dari profil GitHub dan repositori yang dipilih. Tidak ada testimoni, angka pengguna, atau klaim sertifikasi.

## Catatan

- Kontak memakai `mailto:tazky.ferliansyah21@gmail.com` dan profil GitHub. Email muncul sebagai tombol aksen di bagian kontak, ikon surat di header, dan tautan di footer. Ubah di `src/data/site.ts` bila berubah.
- `src/app/icon.svg` adalah monogram sementara `TF`. Ganti dengan logo final saat sudah siap.
- `src/data/site.ts` menyimpan tahun di footer. Perbarui saat tahun berganti atau ubah menjadi nilai dinamis.
- Agar hasil build lebih tahan terhadap perubahan API, isi `fallback` dengan metadata terakhir yang valid.
- Nama tampilan, logo `Tazky.F`, dan nama depan/belakang diambil dari `site` di `src/data/site.ts`.

## Deploy

- Produksi: <https://tazky-portfolio.vercel.app>
- Repositori: <https://github.com/ZyrexFX/tazky-portfolio>
- Proyek Vercel `tazky-portfolio` sudah terhubung ke repositori, jadi setiap push ke `main` otomatis membuat deployment produksi baru.
- `GITHUB_TOKEN` bersifat opsional. Tanpa token, API GitHub tetap dipanggil tanpa autentikasi dan bagian proyek memakai data `fallback` bila kena batas.
- Tidak ada database atau layanan lain yang dibutuhkan.
