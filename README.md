# 🚀 BelajarSeru! — Petualangan Belajar TK sampai SMA

Portal belajar interaktif untuk anak TK, SD, SMP, dan SMA dalam satu aplikasi web statis (tanpa backend, tanpa iklan, gratis).

**URL:** https://bayhaqy.my.id/kids/

## 🌍 Empat Dunia Belajar

| Dunia | Usia | Permainan |
|-------|------|-----------|
| 🧸 Dunia TK | 4–6 tahun | Tebak Huruf Awal (dengan suara), Hitung Mainan, Warna & Bentuk |
| 🎒 Dunia SD | Kelas 1–6 | Matematika Petualangan (10 level), Kuis Bahasa, Jelajah IPA, Robot Koding |
| 🧪 Dunia SMP | Kelas 7–9 | Lab Fisika: Lontaran (gerak parabola interaktif), Kuis Matematika, Kuis IPA & IPS |
| 🎓 Dunia SMA | Kelas 10–12 | Simulasi UTBK (timer + analisis per kategori), Kartu Hafalan, Petunjuk Karier |

## ✨ Fitur

- **Gamifikasi bermakna** — XP, koin, level, bintang, 10 lencana, dan runtutan harian (streak)
- **Misi harian** — 3 misi acak yang diperbarui setiap hari dengan hadiah koin
- **Dashboard Orang Tua** — dilindungi gerbang matematika: XP, waktu layar hari ini, akurasi per permainan, dan tips berbasis riset
- **Suara & narasi Bahasa Indonesia** — Web Audio API + Speech Synthesis (untuk game TK)
- **Progres tersimpan otomatis** di `localStorage` perangkat (tanpa akun, tanpa pelacakan)
- **100% statis** — cukup GitHub Pages, tanpa server

## 🧠 Prinsip Desain (riset edutech 2025–2026)

1. **Latihan > menonton** — konten didominasi aktivitas interaktif, bukan video pasif
2. **Gamifikasi di proses belajarnya sendiri** (pola DragonBox), bukan sekadar poin di atas kuis
3. **Sesi pendek 5–15 menit** sesuai rentang perhatian tiap jenjang (pola IXL/Khan Academy Kids)
4. **Dampingi anak** — dashboard ortu mendorong keterlibatan orang tua

## 🗂️ Struktur

```
index.html          — shell SPA
css/styles.css      — design system (tema 4 dunia)
js/data.js          — bank soal, lencana, avatar, misi
js/core.js          — state, router, gamifikasi, mesin kuis, dashboard ortu
js/games-td.js      — engine game TK & SD
js/games-sms.js     — engine game SMP & SMA
```

## 🛠️ Teknologi

Vanilla HTML/CSS/JavaScript — tanpa framework, tanpa dependensi build. Font: Baloo 2 & Nunito (Google Fonts).

## 📄 Lisensi

Dibuat untuk pembelajaran. Konten soal disusun khusus untuk aplikasi ini.
