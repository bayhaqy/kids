// Data kurikulum TK — BelajarSeru! (Fase Fondasi, usia 4-6 th)
window.BS_RAW = window.BS_RAW || {};
window.BS_RAW.tk = {
topics: [
  { id: 'tk-huruf', grade: 'tk', subject: 'umum', name: 'Mengenal Huruf', icon: '🔤',
    objectives: ['Saya bisa menyebut huruf A sampai Z', 'Saya bisa membedakan huruf mirip seperti b dan d'],
    materi: {
      core: 'Huruf adalah tanda untuk membuat kata. Ada 26 huruf dari A sampai Z.',
      intuition: 'Coba bayangkan huruf seperti balok susun. Balok disusun jadi kata lucu.',
      details: [
        'Huruf vokal ada 5: A, I, U, E, O.',
        'Huruf lain disebut konsonan, contohnya B, K, M.',
        'b dan d mirip. Ingat: b punya perut di kanan.'
      ],
      example: { q: 'Huruf manakah yang termasuk vokal?', steps: ['Lihat pilihan hurufnya.', 'Vokal ada A I U E O. Jadi jawabannya huruf vokal itu!'] },
      mistakes: ['b dan d sering tertukar. Ingat: perut b di kanan.'],
      tip: 'Nyanyikan lagu ABC setiap hari supaya hafal.'
    },
    gen: null },
  { id: 'tk-angka', grade: 'tk', subject: 'umum', name: 'Angka 1–20', icon: '🔢',
    objectives: ['Saya bisa membilang 1 sampai 20', 'Saya bisa menghitung benda di sekitarku'],
    materi: {
      core: 'Angka adalah tanda untuk berhitung. Kita mengenal angka 1 sampai 20.',
      intuition: 'Coba bayangkan jari tanganmu. Satu tangan ada 5 jari.',
      details: [
        'Membilang mulai dari 1, 2, 3, terus sampai 20.',
        'Menghitung benda satu per satu sambil menunjuk.',
        'Yang banyak angkanya besar, yang sedikit angkanya kecil.'
      ],
      example: { q: 'Ada 🍌🍌🍌. Berapa banyak pisangnya?', steps: ['Tunjuk pisang satu per satu.', 'Hitung: 1, 2, 3. Jawabannya 3!'] },
      mistakes: ['Sering melewatkan angka saat menghitung. Hitung pelan-pelan ya.'],
      tip: 'Hitung mainan atau kue di rumah setiap hari.'
    },
    gen: null },
  { id: 'tk-warna', grade: 'tk', subject: 'umum', name: 'Warna & Bentuk', icon: '🎨',
    objectives: ['Saya bisa menyebut warna dasar', 'Saya bisa mengenal lingkaran, persegi, dan segitiga'],
    materi: {
      core: 'Warna membuat dunia jadi indah. Benda juga punya bentuk berbeda-beda.',
      intuition: 'Coba bayangkan bendera merah putih di tiang. Merah berani, putih bersih.',
      details: [
        'Warna dasar: merah, kuning, dan biru.',
        'Lingkaran itu bulat seperti bola.',
        'Segitiga punya 3 sisi, persegi punya 4 sisi sama panjang.'
      ],
      example: { q: 'Roda sepeda berbentuk apa?', steps: ['Lihat roda sepeda berputar.', 'Rodanya bulat. Bentuknya lingkaran!'] },
      mistakes: ['Persegi dan lingkaran berbeda. Persegi punya sudut, lingkaran tidak.'],
      tip: 'Sebut warna benda saat berjalan atau bermain.'
    },
    gen: null },
  { id: 'tk-buah', grade: 'tk', subject: 'umum', name: 'Buah & Sayur', icon: '🍎',
    objectives: ['Saya bisa menyebut nama buah', 'Saya bisa memilah buah dan sayur'],
    materi: {
      core: 'Buah dan sayur adalah makanan sehat. Buah manis dimakan langsung, sayur dimasak jadi sup.',
      intuition: 'Coba bayangkan keranjang belanja Ibu di pasar. Ada mangga, ada bayam.',
      details: [
        'Buah: apel, pisang, mangga, jeruk, durian.',
        'Sayur: bayam, wortel, kubis, kacang panjang.',
        'Makan buah dan sayur membuat tubuh sehat.'
      ],
      example: { q: 'Wortel termasuk buah atau sayur?', steps: ['Wortel tumbuh di dalam tanah.', 'Wortel dimasak jadi sup. Sayur!'] },
      mistakes: ['Kentang itu sayur, bukan buah.'],
      tip: 'Bantu Ibu belanja, lalu sebutkan nama buahnya.'
    },
    gen: null },
  { id: 'tk-hewan', grade: 'tk', subject: 'umum', name: 'Hewan & Suaranya', icon: '🐶',
    objectives: ['Saya bisa menirukan suara hewan', 'Saya bisa menyebut makanan kesukaan hewan'],
    materi: {
      core: 'Setiap hewan punya suara sendiri. Hewan juga makan makanan yang berbeda-beda.',
      intuition: 'Coba bayangkan kandang hewan di kebun binatang. Ada ayam, kucing, dan gajah.',
      details: [
        'Kucing mengeong "meong", ayam "petok".',
        'Anjing menggonggong "guk guk", sapi "moo".',
        'Kelinci suka wortel, gajah suka rumput.'
      ],
      example: { q: 'Sapi bersuara apa?', steps: ['Dengarkan suara sapi di sawah.', 'Sapi melenguh: "moo"!'] },
      mistakes: ['Kelinci bukan pemakan daging. Kelinci suka sayur dan wortel.'],
      tip: 'Bermain tebak suara hewan bersama teman.'
    },
    gen: null },
  { id: 'tk-tubuh', grade: 'tk', subject: 'umum', name: 'Anggota Tubuh', icon: '🖐',
    objectives: ['Saya bisa menyebut fungsi anggota tubuh', 'Saya bisa merawat tubuh agar bersih dan sehat'],
    materi: {
      core: 'Tubuh kita hebat sekali. Mata melihat, telinga mendengar, tangan memegang.',
      intuition: 'Coba bayangkan matamu seperti kamera kecil. Kamera melihat wajah Ayah dan Ibu.',
      details: [
        'Mata untuk melihat, hidung untuk mencium bau.',
        'Telinga untuk mendengar, kaki untuk berjalan.',
        'Tubuh bersih bikin kita sehat dan segar.'
      ],
      example: { q: 'Untuk mendengarkan musik kita memakai apa?', steps: ['Musik menghasilkan bunyi.', 'Alat untuk mendengar adalah telinga!'] },
      mistakes: ['Jangan menatap matahari langsung. Mata bisa sakit.'],
      tip: 'Cuci tangan sebelum makan dan sikat gigi dua kali sehari.'
    },
    gen: null },
  { id: 'tk-banding', grade: 'tk', subject: 'umum', name: 'Besar–Kecil & Panjang–Pendek', icon: '📏',
    objectives: ['Saya bisa membandingkan benda besar dan kecil', 'Saya bisa mengurutkan benda dari yang terkecil'],
    materi: {
      core: 'Benda bisa dibandingkan. Ada yang besar dan kecil, panjang dan pendek.',
      intuition: 'Coba bayangkan gajah dan semut bertemu. Gajah besar, semut kecil sekali.',
      details: [
        'Gajah lebih besar daripada kucing.',
        'Pensil baru lebih panjang daripada pensil pendek.',
        'Benda bisa diurutkan dari terkecil sampai terbesar.'
      ],
      example: { q: 'Mana yang lebih tinggi, gedung atau rumah?', steps: ['Lihat gedung dan rumah.', 'Gedung lebih tinggi daripada rumah!'] },
      mistakes: ['Saat membandingkan panjang, samakan ujung benda dulu.'],
      tip: 'Bandingkan mainanmu, mana yang paling besar.'
    },
    gen: null },
  { id: 'tk-akhlak', grade: 'tk', subject: 'umum', name: 'Kebiasaan Baik', icon: '🌟',
    objectives: ['Saya bisa mengucap kata tolong dan terima kasih', 'Saya bisa merapikan mainan setelah bermain'],
    materi: {
      core: 'Anak baik selalu sopan. Kita bilang tolong, terima kasih, dan maaf.',
      intuition: 'Coba bayangkan senyummu seperti matahari pagi. Senyum membuat teman senang.',
      details: [
        'Bilang "tolong" saat minta bantuan.',
        'Bilang "terima kasih" saat diberi sesuatu.',
        'Rapikan mainan dan buang sampah di tempatnya.'
      ],
      example: { q: 'Teman memberimu kue. Kata apa yang kita ucapkan?', steps: ['Kamu senang diberi kue.', 'Ucapkan: "Terima kasih"!'] },
      mistakes: ['Jangan membuang sampah sembarangan. Sampah masuk tempat sampah.'],
      tip: 'Kata sopan membuat semua orang bahagia.'
    },
    gen: null }
],
questions: [
  // tk-huruf (7)
  { g: 'tk', s: 'umum', t: 'tk-huruf', q: 'Huruf vokal di bawah ini adalah ...', opts: ['B', 'A', 'R'], a: 1, e: 'Vokal ada A, I, U, E, O. Jadi jawabannya A.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-huruf', q: '🍎 apel diawali huruf ...', opts: ['A', 'M', 'Z'], a: 0, e: 'Apel diawali huruf A. A adalah huruf vokal.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-huruf', q: 'Mana yang BUKAN huruf vokal?', opts: ['U', 'E', 'K'], a: 2, e: 'U dan E vokal. K adalah konsonan.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-huruf', q: 'Huruf setelah C adalah ...', opts: ['E', 'D', 'B'], a: 1, e: 'Urutannya A, B, C, D. Setelah C ada D.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-huruf', q: 'Ada berapa huruf vokal?', opts: ['5', '3', '26'], a: 0, e: 'Vokal A, I, U, E, O. Jumlahnya ada 5.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-huruf', q: 'Huruf ini bulat seperti bola 🟠, yaitu ...', opts: ['L', 'O', 'S'], a: 1, e: 'O bentuknya bulat seperti bola.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-huruf', q: 'Kata "ibu" diawali huruf ...', opts: ['i', 'b', 'u'], a: 0, e: 'Ibu diawali huruf i, huruf vokal.', d: 1 },
  // tk-angka (7)
  { g: 'tk', s: 'umum', t: 'tk-angka', q: 'Ada 🍎🍎🍎🍎. Berapa banyak?', opts: ['3', '4', '5'], a: 1, e: 'Hitung satu per satu: 1, 2, 3, 4. Ada 4.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-angka', q: 'Angka setelah 6 adalah ...', opts: ['5', '8', '7'], a: 2, e: 'Membilang: 5, 6, 7. Setelah 6 ada 7.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-angka', q: 'Kelompok mana yang paling banyak?', opts: ['⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐'], a: 1, e: 'Empat bintang lebih banyak dari dua dan tiga.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-angka', q: 'Dua tanganmu ada berapa jari?', opts: ['10', '5', '2'], a: 0, e: 'Satu tangan 5 jari. Dua tangan 10 jari.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-angka', q: 'Angka sebelum 9 adalah ...', opts: ['8', '10', '7'], a: 0, e: 'Urutan: 7, 8, 9. Sebelum 9 ada 8.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-angka', q: 'Berapa ekor ayam? 🐔🐔🐔🐔', opts: ['4', '3', '5'], a: 0, e: 'Hitung: 1, 2, 3, 4. Ada 4 ekor ayam.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-angka', q: 'Mana angka yang paling besar?', opts: ['12', '15', '9'], a: 1, e: '15 lebih besar dari 12 dan 9.', d: 2 },
  // tk-warna (7)
  { g: 'tk', s: 'umum', t: 'tk-warna', q: 'Daun biasanya berwarna ...', opts: ['biru', 'hijau', 'merah'], a: 1, e: 'Daun di pohon berwarna hijau.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-warna', q: 'Bola berbentuk ...', opts: ['segitiga', 'persegi', 'lingkaran'], a: 2, e: 'Bola itu bulat. Bentuknya lingkaran.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-warna', q: 'Bendera kita berwarna merah dan ...', opts: ['putih', 'kuning', 'biru'], a: 0, e: 'Bendera Indonesia merah putih.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-warna', q: 'Segitiga punya berapa sisi?', opts: ['4', '2', '3'], a: 2, e: 'Segitiga punya 3 sisi dan 3 sudut.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-warna', q: 'Pisang matang berwarna ...', opts: ['kuning', 'ungu', 'hitam'], a: 0, e: 'Pisang matang kulitnya kuning.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-warna', q: 'Benda persegi di rumah adalah ...', opts: ['roda', 'jendela', 'bola'], a: 1, e: 'Jendela berbentuk persegi, ada sudutnya.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-warna', q: 'Langit saat siang cerah berwarna ...', opts: ['cokelat', 'hijau', 'biru'], a: 2, e: 'Langit siang cerah berwarna biru.', d: 1 },
  // tk-buah (7)
  { g: 'tk', s: 'umum', t: 'tk-buah', q: '🍎 buah merah ini namanya ...', opts: ['apel', 'wortel', 'bayam'], a: 0, e: 'Apel adalah buah berwarna merah.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-buah', q: 'Mana yang termasuk buah?', opts: ['bayam', 'mangga', 'wortel'], a: 1, e: 'Mangga adalah buah. Bayam dan wortel sayur.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-buah', q: 'Mana yang termasuk sayur?', opts: ['pisang', 'semangka', 'kubis'], a: 2, e: 'Kubis adalah sayur untuk sayur sop.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-buah', q: '🍌 buah kuning panjang namanya ...', opts: ['jeruk', 'pisang', 'semangka'], a: 1, e: 'Itu pisang, buah kuning panjang.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-buah', q: 'Buah berduri yang baunya harum adalah ...', opts: ['semangka', 'apel', 'durian'], a: 2, e: 'Durian berduri dan baunya harum.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-buah', q: 'Sayur oranye yang baik untuk mata ...', opts: ['wortel', 'kol', 'bayam'], a: 0, e: 'Wortel berwarna oranye, bagus untuk mata.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-buah', q: 'Makan buah membuat tubuh kita ...', opts: ['ngantuk', 'sehat', 'sedih'], a: 1, e: 'Buah punya vitamin untuk tubuh sehat.', d: 2 },
  // tk-hewan (7)
  { g: 'tk', s: 'umum', t: 'tk-hewan', q: '"Meong!" Suara hewan ini adalah ...', opts: ['ayam', 'kucing', 'sapi'], a: 1, e: 'Kucing bersuara "meong".', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-hewan', q: 'Hewan yang bersuara "petok" adalah ...', opts: ['ayam', 'bebek', 'kucing'], a: 0, e: 'Ayam berkokok "petok petok".', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-hewan', q: 'Kelinci 🐇 suka makan ...', opts: ['daging', 'permen', 'wortel'], a: 2, e: 'Kelinci suka makan wortel.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-hewan', q: '🐶 suaranya adalah ...', opts: ['guk guk', 'meong', 'petok'], a: 0, e: 'Anjing bersuara "guk guk".', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-hewan', q: 'Hewan yang hidup di air adalah ...', opts: ['kucing', 'ikan', 'ayam'], a: 1, e: 'Ikan hidup di dalam air.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-hewan', q: 'Susu segar berasal dari ...', opts: ['sapi', 'kelinci', 'burung'], a: 0, e: 'Susu yang kita minum dari sapi perah.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-hewan', q: 'Gajah 🐘 makanannya adalah ...', opts: ['rumput', 'ayam goreng', 'ikan'], a: 0, e: 'Gajah makan rumput dan daun.', d: 2 },
  // tk-tubuh (7)
  { g: 'tk', s: 'umum', t: 'tk-tubuh', q: 'Kita melihat dengan memakai ...', opts: ['mata', 'telinga', 'hidung'], a: 0, e: 'Mata adalah alat untuk melihat.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-tubuh', q: 'Mencium bau enak memakai ...', opts: ['mata', 'telinga', 'hidung'], a: 2, e: 'Hidung untuk mencium bau.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-tubuh', q: 'Mendengar musik memakai ...', opts: ['telinga', 'kaki', 'tangan'], a: 0, e: 'Telinga untuk mendengar bunyi.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-tubuh', q: 'Kaki kita digunakan untuk ...', opts: ['melihat', 'berjalan', 'mencium'], a: 1, e: 'Kaki untuk berjalan dan berlari.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-tubuh', q: 'Sebelum makan, kita harus ...', opts: ['cuci tangan', 'tidur dulu', 'berlari'], a: 0, e: 'Cuci tangan supaya kuman hilang.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-tubuh', q: 'Memegang pensil memakai ...', opts: ['telinga', 'dada', 'tangan'], a: 2, e: 'Tangan untuk memegang pensil.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-tubuh', q: 'Gigi sebaiknya disikat ...', opts: ['dua kali sehari', 'sekali sebulan', 'tidak perlu'], a: 0, e: 'Sikat gigi dua kali sehari agar bebas lubang.', d: 2 },
  // tk-banding (7)
  { g: 'tk', s: 'umum', t: 'tk-banding', q: 'Mana yang lebih besar?', opts: ['🐜 semut', '🐘 gajah', '🐞 kumbang'], a: 1, e: 'Gajah jauh lebih besar dari semut.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-banding', q: 'Mana yang lebih kecil?', opts: ['🐘 gajah', '🐄 sapi', '🐜 semut'], a: 2, e: 'Semut adalah hewan yang sangat kecil.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-banding', q: 'Mana yang lebih panjang?', opts: ['🚂 kereta', '🚗 mobil', '🛴 skuter'], a: 0, e: 'Kereta lebih panjang dari mobil.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-banding', q: 'Mana yang lebih pendek?', opts: ['🚌 bus', '✏️ pensil', '🚚 truk'], a: 1, e: 'Pensil lebih pendek dari bus dan truk.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-banding', q: 'Urutan dari paling kecil adalah ...', opts: ['semut, kucing, gajah', 'gajah, kucing, semut', 'kucing, semut, gajah'], a: 0, e: 'Kecil ke besar: semut, kucing, gajah.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-banding', q: 'Balon 🎈 dibanding kelereng, balon lebih ...', opts: ['kecil', 'besar', 'sama saja'], a: 1, e: 'Balon besar, kelereng kecil.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-banding', q: 'Ayah biasanya lebih ... daripada adik', opts: ['pendek', 'kecil', 'tinggi'], a: 2, e: 'Orang dewasa lebih tinggi dari anak kecil.', d: 1 },
  // tk-akhlak (7)
  { g: 'tk', s: 'umum', t: 'tk-akhlak', q: 'Minta bantuan dengan berkata ...', opts: ['Ambilin!', 'Tolong, ya', 'Cepat!'], a: 1, e: 'Kata "tolong" adalah kata sopan.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-akhlak', q: 'Diberi hadiah, kita ucapkan ...', opts: ['terima kasih', 'terima saja', 'kasi lagi'], a: 0, e: 'Terima kasih membuat pemberi hadiah senang.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-akhlak', q: 'Sebelum makan bersama, kita ...', opts: ['cuci tangan', 'nonton TV', 'main dulu'], a: 0, e: 'Cuci tangan dulu supaya tidak sakit.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-akhlak', q: 'Menabrak teman, katakanlah ...', opts: ['maaf', 'terus jalan', 'terima kasih'], a: 0, e: 'Kita minta maaf bila bersalah.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-akhlak', q: 'Setelah bermain, mainan di ...', opts: ['dibuang', 'dirapikan', 'dilupakan'], a: 1, e: 'Mainan dirapikan agar rapi dan tidak hilang.', d: 2 },
  { g: 'tk', s: 'umum', t: 'tk-akhlak', q: 'Sampah dibuang ke dalam ...', opts: ['meja', 'kolam', 'tempat sampah'], a: 2, e: 'Sampah harus masuk tempat sampah.', d: 1 },
  { g: 'tk', s: 'umum', t: 'tk-akhlak', q: 'Bertemu Bu Guru, kita ...', opts: ['memberi salam', 'sembunyi', 'pergi diam-diam'], a: 0, e: 'Anak sopan selalu memberi salam.', d: 2 }
]
};
