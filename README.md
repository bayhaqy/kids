# 🦉 BelajarSeru! 3D

Portal belajar interaktif **TK • SD • SMP • SMA** sesuai **Kurikulum Merdeka** — dengan visual 3D (Three.js), gamifikasi penuh, dan 15 game edukatif. Live: **https://bayhaqy.my.id/kids/**

![status](https://img.shields.io/badge/versi-3D_2.0-FF6B5E) ![kurikulum](https://img.shields.io/badge/kurikulum-Merdeka_2026-2EC77E) ![lisensi](https://img.shields.io/badge/konten-gratis-38A9F5)

## ✨ Apa yang ada di dalam?

| | Konten | Jumlah |
|---|---|---|
| 📚 | Topik materi terstruktur (Ide Inti → Intuisi → Contoh → Kesalahan Umum → Tips) | **141 topik** |
| ✏️ | Bank soal Pilihan Ganda + penjelasan tiap jawaban | **1.096 soal** |
| ♾️ | Generator soal matematika (18 mesin — soal baru tiap klik) | tak terbatas |
| 🎮 | Game edukatif (huruf, hitung, memory, robot koding, lab fisika, lab pH, kuis kilat, simulator UTBK, flashcard 3D, grafik fungsi, penjelajah karier) | **14 game** |
| 🎖️ | Lencana, XP, koin, level, streak, misi harian, combo | sistem lengkap |

### 4 Dunia
- 🎈 **Dunia TK** (Fase Fondasi): huruf bersuara, hitung mainan, warna & bentuk, memory hewan
- 🏝️ **Dunia SD** (Fase A–C): 6 kelas — MTK, B. Indonesia, IPAS, B. Inggris + Matematika Petualangan 10 pulau, Robot Koding, Tebak Kata
- 🔬 **Dunia SMP** (Fase D): MTK, IPA, IPS, B. Indonesia, B. Inggris + Lab Lontaran (gerak parabola), Lab pH, Kuis Kilat 60 detik
- 🪐 **Dunia SMA** (Fase E–F): MTK, Fisika, Kimia, Biologi, B. Indonesia, B. Inggris + **Simulator UTBK** (25 soal, 25 menit, analisis per subtes), Flashcard 3D, Lab Grafik, Penjelajah Karier

### Fitur unggulan
- 🧊 **3D interaktif**: pulau melayang, maskot Pipo si burung hantu, planet & roket — geser untuk memutar (Three.js, offline, tanpa CDN)
- 🔊 **TTS Bahasa Indonesia** — materi dibacakan (cocok untuk TK & anak yang belum lancar membaca)
- 🔁 **"Ulangi yang Lemah"** — deteksi otomatis topik lemah (spaced repetition ala tutor)
- 👨‍👩‍👧 **Dashboard Orang Tua & Guru** — gerbang hitungan, penguasaan per topik, tips pendampingan berbasis riset
- 🔒 **Privasi total** — semua progres tersimpan di localStorage perangkat; tidak ada data yang dikirim
- 📱 Responsif desktop & mobile, aksesibel (keyboard, reduced-motion)

## 🧑‍🏫 Metodologi materi
Struktur materi mengikuti praktik terbaik: tujuan **"Saya bisa…"** per topik, gradual release (*materi → contoh → latihan mandiri*), diferensiasi 3 tingkat kesulitan (Mudah/Sedang/Sulit ≈ 50/30/20%), dan template unit belajar (ide inti, intuisi, contoh bertahap, kesalahan umum, tips) — diadaptasi dari metodologi instructional design & tutoring berbasis sains. Ruang lingkup topik mengikuti fase **Kurikulum Merdeka** (Fondasi, A–F).

## 🗂️ Struktur
```
index.html            — shell + loading 22 file JS
css/styles.css        — design system "Candy Neo-Brutalist"
js/vendor/three.min.js— Three.js r150 (offline)
js/scene.js           — scene 3D (hero, 4 dunia, maskot)
js/data/*.js          — 18 file data kurikulum (141 topik, 1.096 soal)
js/quiz.js            — mesin kuis + 18 generator matematika
js/views.js           — tampilan (beranda, dunia, materi, profil, ortu)
js/games-a.js         — game TK & SD (7)
js/games-b.js         — game SMP & SMA (7)
js/app.js             — state, gamifikasi, router, suara, TTS, boot
```

## 🚀 Menjalankan lokal
Statis murni — cukup buka `index.html` atau:
```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## 📦 Versi
- **3D 2.0** (30 Agustus 2026): visual 3D Three.js, 141 topik + 1.096 soal (dari 13 topik + 300 soal), 14 game (dari 13), materi terstruktur study-tutor, spaced repetition, UTBK analitik, karier, lab grafik, misi harian 8 pool, 16 lencana.
- **1.0** (29 Agustus 2026): peluncuran ulang portal TK–SMA.

Dibuat dengan ❤️ untuk anak-anak Indonesia. Selamat belajar! 🎉
