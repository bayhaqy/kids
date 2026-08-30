/* ============================================================
   BelajarSeru! — Bank Konten
   Semua soal, lencana, avatar, dan data konten edukasi.
   ============================================================ */
"use strict";

const DATA = {};

/* ---------- Avatar ---------- */
DATA.avatars = ["🦊", "🐼", "🐨", "🦁", "🐧", "🐬", "🦉", "🐢", "🦄", "🐯", "🐙", "🦋"];

/* ---------- Lencana ---------- */
DATA.badges = [
  { id: "langkah-pertama", emoji: "🌟", name: "Langkah Pertama", desc: "Selesaikan 1 permainan", cond: s => (s.stats.rounds || 0) >= 1 },
  { id: "kolektor-bintang", emoji: "⭐", name: "Kolektor Bintang", desc: "Kumpulkan 15 bintang", cond: s => (s.stats.stars || 0) >= 15 },
  { id: "mateka-5", emoji: "🧮", name: "Ahli Matematika", desc: "Tuntaskan level 5 Matematika Petualangan", cond: s => s.progress["sd/mateka"] && s.progress["sd/mateka"].best >= 5 },
  { id: "pembaca-pintar", emoji: "📚", name: "Pembaca Pintar", desc: "Jawab 15 soal bahasa dengan benar", cond: s => s.stats.byGame["sd/bahasa"] >= 15 },
  { id: "jelajah-ipa", emoji: "🔭", name: "Penjelajah Alam", desc: "Jawab 15 soal IPA dengan benar", cond: s => s.stats.byGame["sd/ipa"] >= 15 },
  { id: "robot-builder", emoji: "🤖", name: "Pembuat Robot", desc: "Selesaikan 5 puzzle Robot Koding", cond: s => s.progress["sd/koding"] && s.progress["sd/koding"].best >= 5 },
  { id: "ilmuwan-muda", emoji: "🧪", name: "Ilmuwan Muda", desc: "Tuntaskan 5 target Lab Fisika", cond: s => s.progress["smp/lab"] && s.progress["smp/lab"].best >= 5 },
  { id: "sang-utbk", emoji: "🎓", name: "Sang Juara UTBK", desc: "Skor simulasi UTBK minimal 70", cond: s => s.progress["sma/utbk"] && s.progress["sma/utbk"].best >= 70 },
  { id: "api-semangat", emoji: "🔥", name: "Api Semangat", desc: "Belajar 3 hari berturut-turut", cond: s => (s.streak || 0) >= 3 },
  { id: "petualang-hebat", emoji: "🏆", name: "Petualang Hebat", desc: "Kumpulkan 500 XP", cond: s => (s.xp || 0) >= 500 },
];

/* ---------- TK: Tebak Huruf Awal ---------- */
DATA.kataHuruf = [
  { emoji: "🍎", kata: "Apel", huruf: "A" },
  { emoji: "🍌", kata: "Pisang", huruf: "P" },
  { emoji: "🐱", kata: "Kucing", huruf: "K" },
  { emoji: "🐘", kata: "Gajah", huruf: "G" },
  { emoji: "🌞", kata: "Matahari", huruf: "M" },
  { emoji: "🏠", kata: "Rumah", huruf: "R" },
  { emoji: "🚗", kata: "Mobil", huruf: "M" },
  { emoji: "🐟", kata: "Ikan", huruf: "I" },
  { emoji: "🌳", kata: "Pohon", huruf: "P" },
  { emoji: "⭐", kata: "Bintang", huruf: "B" },
  { emoji: "🎈", kata: "Balon", huruf: "B" },
  { emoji: "🦋", kata: "Kupu-kupu", huruf: "K" },
  { emoji: "🍉", kata: "Semangka", huruf: "S" },
  { emoji: "🐴", kata: "Kuda", huruf: "K" },
  { emoji: "📖", kata: "Buku", huruf: "B" },
  { emoji: "⚽", kata: "Bola", huruf: "B" },
  { emoji: "🍩", kata: "Donat", huruf: "D" },
  { emoji: "🌈", kata: "Pelangi", huruf: "P" },
  { emoji: "🐓", kata: "Ayam", huruf: "A" },
  { emoji: "🚀", kata: "Roket", huruf: "R" },
];

/* ---------- TK: Warna & Bentuk ---------- */
DATA.warna = [
  { nama: "merah", emoji: "🔴", css: "#ef4444" },
  { nama: "biru", emoji: "🔵", css: "#3b82f6" },
  { nama: "hijau", emoji: "🟢", css: "#22c55e" },
  { nama: "kuning", emoji: "🟡", css: "#eab308" },
  { nama: "jingga", emoji: "🟠", css: "#f97316" },
  { nama: "ungu", emoji: "🟣", css: "#a855f7" },
];
DATA.bentuk = [
  { nama: "bintang", emoji: "⭐" },
  { nama: "hati", emoji: "❤️" },
  { nama: "segitiga", emoji: "🔺" },
  { nama: "kotak", emoji: "🟦" },
  { nama: "lingkaran", emoji: "⭕" },
  { nama: "berlian", emoji: "💠" },
];

/* ---------- SD: Kuis Bahasa Indonesia ---------- */
DATA.sdBahasa = [
  { q: "Sinonim (persamaan kata) dari 'pandai' adalah…", o: ["Cerdas", "Bodoh", "Malas", "Lelah"], a: 0, f: "Sinonim adalah kata yang maknanya mirip. Pandai = cerdas." },
  { q: "Antonim (lawan kata) dari 'rajin' adalah…", o: ["Tekun", "Malas", "Pintar", "Kuat"], a: 1, f: "Antonim adalah lawan kata. Lawan rajin adalah malas." },
  { q: "Sinonim dari 'senang' adalah…", o: ["Sedih", "Gembira", "Marah", "Takut"], a: 1, f: "Senang memiliki makna yang sama dengan gembira." },
  { q: "Antonim dari 'tinggi' adalah…", o: ["Jongkok", "Rendah", "Besar", "Jauh"], a: 1, f: "Lawan kata tinggi adalah rendah." },
  { q: "Lengkapi: 'Ibu … nasi di dapur.'", o: ["memasak", "menyanyi", "menari", "membaca"], a: 0, f: "Kalimat yang tepat: Ibu memasak nasi di dapur." },
  { q: "Lengkapi: 'Adik sedang … di halaman.'", o: ["bermain", "menulis surat kabar", "menerbangkan pesawat", "melaut"], a: 0, f: "Adik sedang bermain di halaman." },
  { q: "Huruf vokal ada 5, yaitu…", o: ["a, i, u, e, o", "a, b, c, d, e", "b, c, d, f, g", "i, v, x, y, z"], a: 0, f: "Vokal: a, i, u, e, o. Huruf lainnya disebut konsonan." },
  { q: "Kata benda dalam kalimat 'Kucing itu tidur di sofa' adalah…", o: ["tidur", "kucing dan sofa", "di", "itu"], a: 1, f: "Kata benda adalah nama orang, binatang, benda, atau tempat." },
  { q: "Sinonim dari 'gigih' adalah…", o: ["Pantang menyerah", "Cepat marah", "Suka tidur", "Suka bermalas-malasan"], a: 0, f: "Gigih berarti tekun dan pantang menyerah." },
  { q: "Antonim dari 'terang' adalah…", o: ["Cerah", "Gelap", "Kuning", "Siang"], a: 1, f: "Lawan kata terang adalah gelap." },
  { q: "Lengkapi: 'Kami berangkat sekolah pukul … pagi.'", o: ["setengah tujuh", "dua belas malam", "sebelas malam", "tiga pagi buta"], a: 0, f: "Sekolah biasanya dimulai pagi, sekitar setengah tujuh." },
  { q: "Kalimat tanya ditandai dengan…", o: ["Tanda seru (!)", "Tanda tanya (?)", "Tanda titik (.)", "Tanda koma (,)"], a: 1, f: "Kalimat tanya selalu diakhiri tanda tanya (?)." },
  { q: "Sinonim dari 'indah' adalah…", o: ["Cantik", "Jelek", "Kotor", "Berantakan"], a: 0, f: "Indah dan cantik bermakna serupa." },
  { q: "Antonim dari 'penuh' adalah…", o: ["Berisi", "Kosong", "Selesai", "Banyak"], a: 1, f: "Lawan kata penuh adalah kosong." },
  { q: "Lengkapi: 'Kita harus … kepada orang tua.'", o: ["berbakti", "berbohong", "berkata kasar", "bersembunyi"], a: 0, f: "Sikap baik kepada orang tua adalah berbakti." },
  { q: "Huruf kapital digunakan pada…", o: ["Awal kalimat dan nama orang", "Semua huruf", "Hanya huruf vokal", "Akhir kalimat"], a: 0, f: "Huruf kapital dipakai di awal kalimat dan nama diri." },
  { q: "Sinonim dari 'cepat' adalah…", o: ["Lambat", "Kilat", "Pelan", "Lama"], a: 1, f: "Cepat memiliki persamaan makna dengan kilat." },
  { q: "Antonim dari 'berat' adalah…", o: ["Banyak", "Ringan", "Keras", "Padat"], a: 1, f: "Lawan kata berat adalah ringan." },
  { q: "Lengkapi: 'Sore ini kami … bola di lapangan.'", o: ["bermain", "menghapus", "menjahit", "mengetik"], a: 0, f: "Bermain bola dilakukan di lapangan." },
  { q: "Manakah kalimat yang benar?", o: ["aku pergi ke sekolah", "Aku pergi ke sekolah.", "AKU PERGI KE SEKOLAH,", "aku Pergi ke Sekolah"], a: 1, f: "Kalimat benar diawali huruf kapital dan diakhiri titik." },
  { q: "Sinonim dari 'rajin' adalah…", o: ["Tekun", "Malas", "Lelah", "Sibuk tidur"], a: 0, f: "Rajin sama maknanya dengan tekun." },
  { q: "Antonim dari 'mudah' adalah…", o: ["Gampang", "Sulit", "Cepat", "Ringan"], a: 1, f: "Lawan kata mudah adalah sulit." },
  { q: "Lengkapi: 'Nasi hangat ini … sekali rasanya.'", o: ["lezat", "pahit", "asin terlalu", "busuk"], a: 0, f: "Nasi hangat yang enak rasanya lezat." },
  { q: "Kata tanya untuk menanyakan tempat adalah…", o: ["Apa", "Di mana", "Kapan", "Siapa"], a: 1, f: "'Di mana?' digunakan untuk menanyakan tempat." },
];

/* ---------- SD: Jelajah IPA ---------- */
DATA.sdIpa = [
  { q: "Planet yang paling dekat dengan Matahari adalah…", o: ["Venus", "Bumi", "Merkurius", "Mars"], a: 2, f: "Merkurius adalah planet terdekat dari Matahari." },
  { q: "Hewan yang makan tumbuhan saja disebut…", o: ["Karnivora", "Herbivora", "Omnivora", "Insektivora"], a: 1, f: "Herbivora = pemakan tumbuhan, seperti kambing dan sapi." },
  { q: "Alat pernapasan manusia adalah…", o: ["Jantung", "Paru-paru", "Lambung", "Hati"], a: 1, f: "Kita bernapas menggunakan paru-paru." },
  { q: "Tumbuhan membuat makanannya dengan bantuan…", o: ["Cahaya matahari", "Angin malam", "Suara keras", "Pasir"], a: 0, f: "Proses ini disebut fotosintesis, butuh cahaya matahari." },
  { q: "Air yang mendidih akan berubah menjadi…", o: ["Es", "Uap", "Salju", "Kabut tebal"], a: 1, f: "Air mendidih (100°C) berubah menjadi uap. Namanya menguap." },
  { q: "Planet yang kita tempati bernama…", o: ["Mars", "Jupiter", "Bumi", "Saturnus"], a: 2, f: "Bumi adalah planet ketiga dari Matahari." },
  { q: "Hewan berikut yang bisa terbang adalah…", o: ["Ikan", "Burung", "Kambing", "Kucing"], a: 1, f: "Burung memiliki sayap untuk terbang." },
  { q: "Bagian tumbuhan yang menyerap air dari tanah adalah…", o: ["Daun", "Bunga", "Akar", "Buah"], a: 2, f: "Akar menyerap air dan zat hara dari dalam tanah." },
  { q: "Matahari terbit di arah…", o: ["Barat", "Timur", "Utara", "Selatan"], a: 1, f: "Matahari terbit di timur dan terbenam di barat." },
  { q: "Benda yang bisa ditembus cahaya disebut…", o: ["Benda tembus cahaya", "Benda bayangan", "Benda pejal", "Benda berat"], a: 0, f: "Kaca adalah contoh benda tembus cahaya." },
  { q: "Gempa bumi terjadi karena…", o: ["Hujan deras", "Pergerakan lempeng bumi", "Angin kencang", "Pelangi"], a: 1, f: "Gempa terjadi saat lempeng-lempeng di kerak bumi bergerak." },
  { q: "Kucing, singa, dan harimau termasuk kelompok…", o: ["Kelompok kucing", "Kelompok anjing", "Kelompok burung", "Kelompok ikan"], a: 0, f: "Mereka termasuk keluarga besar kucing (Felidae)." },
  { q: "Perubahan wujud dari padat menjadi cair disebut…", o: ["Mencair", "Membeku", "Menguap", "Menyublim"], a: 0, f: "Es mencair menjadi air. Itu namanya mencair." },
  { q: "Organ tubuh untuk mencerna makanan pertama kali adalah…", o: ["Mulut", "Telinga", "Hidung", "Kaki"], a: 0, f: "Pencernaan dimulai dari mulut dengan bantuan gigi dan air liur." },
  { q: "Sumber energi terbesar bagi bumi adalah…", o: ["Matahari", "Bulan", "Bintang jatuh", "Awan"], a: 0, f: "Matahari memberi energi cahaya dan panas untuk bumi." },
  { q: "Hewan yang mengalami metamorfosis sempurna adalah…", o: ["Kupu-kupu", "Kucing", "Ayam", "Sapi"], a: 0, f: "Telur → ulat → kepompong → kupu-kupu. Itu metamorfosis sempurna." },
  { q: "Cahaya dapat melewati kaca karena kaca bersifat…", o: ["Tembus cahaya", "Membayangi", "Pantulan", "Berat"], a: 0, f: "Kaca tembus cahaya sehingga kita bisa melihat ke seberangnya." },
  { q: "Bagian bunga yang menarik kupu-kupu adalah…", o: ["Warna dan harum bunga", "Akar bunga", "Duri bunga", "Ukuran akar"], a: 0, f: "Warna cerah dan aroma harum menarik serangga penyerbuk." },
  { q: "Alat pencium manusia adalah…", o: ["Hidung", "Mata", "Telinga", "Lidah"], a: 0, f: "Kita mencium bau menggunakan hidung." },
  { q: "Bulan tampak terang di malam hari karena…", o: ["Memantulkan cahaya matahari", "Membakar gas", "Punya lampu sendiri", "Dihiasi bintang"], a: 0, f: "Bulan tidak memancarkan cahaya sendiri, ia memantulkan cahaya Matahari." },
  { q: "Rangka manusia berfungsi untuk…", o: ["Menopang tubuh", "Mencerna makanan", "Mengepom darah", "Bernapas"], a: 0, f: "Tulang menopang tubuh dan melindungi organ penting." },
  { q: "Contoh sumber air alami adalah…", o: ["Sungai", "Gelas", "Ember", "Selinckang"], a: 0, f: "Sungai, danau, dan laut adalah sumber air alami." },
  { q: "Hewan berikut yang berkembang biak dengan bertelur adalah…", o: ["Ayam", "Sapi", "Kucing", "Kambing"], a: 0, f: "Ayam bertelur (ovipar). Sapi, kucing, kambing melahirkan." },
  { q: "Kapan terjadi siang dan malam?", o: ["Bumi berputar pada porosnya", "Bumi mengelilingi bulan", "Bulan jatuh", "Matahari berhenti"], a: 0, f: "Rotasi bumi (berputar pada porosnya) menyebabkan siang dan malam." },
];

/* ---------- SMP: Kuis IPA & IPS ---------- */
DATA.smpIpaIps = [
  { q: "Organel sel yang berfungsi sebagai 'pembangkit energi' adalah…", o: ["Ribosom", "Mitokondria", "Nukleus", "Vakuola"], a: 1, f: "Mitokondria menghasilkan ATP, energi bagi sel." },
  { q: "Hukum II Newton menyatakan bahwa gaya sama dengan…", o: ["massa × percepatan", "massa × kecepatan", "berat × waktu", "energi × jarak"], a: 0, f: "F = m × a, ini bunyi Hukum II Newton." },
  { q: "Pada rangkaian listrik seri, arus listrik…", o: ["Besar arusnya sama di semua titik", "Terbagi ke tiap cabang", "Berhenti di lampu pertama", "Mengalir dua arah"], a: 0, f: "Rangkaian seri hanya punya satu jalur, arusnya sama di mana pun." },
  { q: "Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal…", o: ["17 Agustus 1945", "1 Juni 1945", "10 November 1945", "28 Oktober 1928"], a: 0, f: "Proklamasi dibacakan Ir. Soekarno pada 17 Agustus 1945." },
  { q: "ASEAN didirikan di kota…", o: ["Jakarta", "Bangkok", "Manila", "Kuala Lumpur"], a: 1, f: "ASEAN lahir di Bangkok, Thailand, pada 8 Agustus 1967." },
  { q: "Bagian sel tumbuhan yang TIDAK dimiliki sel hewan adalah…", o: ["Dinding sel", "Membran sel", "Sitoplasma", "Nukleus"], a: 0, f: "Dinding sel (dari selulosa) hanya dimiliki tumbuhan." },
  { q: "Satuan gaya dalam SI adalah…", o: ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"], a: 0, f: "Gaya diukur dalam Newton, diambil dari nama Isaac Newton." },
  { q: "Zat yang berpindah dari konsentrasi tinggi ke rendah disebut…", o: ["Difusi", "Osmosis spesifik", "Katalis", "Evaporasi"], a: 0, f: "Difusi adalah perpindahan zat dari larutan pekat ke encer." },
  { q: "Sistem ekonomi Indonesia menganut…", o: ["Ekonomi pasar bebas", "Ekonomi kerakyatan dengan asas kekeluargaan", "Ekonomi komando", "Kapitalisme murni"], a: 1, f: "Pasal 33 UUD 1945: perekonomian disusun atas asas kekeluargaan." },
  { q: "Garis lintang khatulistiwa adalah 0° dan disebut juga…", o: ["Equator", "Meridian", "Azimut", "Zenith"], a: 0, f: "Khatulistiwa = equator, membelah bumi utara–selatan." },
  { q: "Reaksi asam + basa menghasilkan garam dan…", o: ["Air", "Oksigen", "Karbon", "Nitrogen"], a: 0, f: "Reaksi netralisasi: asam + basa → garam + air." },
  { q: "Ciri makhluk hidup berikut yang merupakan respon terhadap rangsang adalah…", o: ["Tanaman mimosa menutup daun saat disentuh", "Tumbuhan bertambah tinggi", "Bayi bertambah berat", "Kucing beranak"], a: 0, f: "Merespons rangsang (iritabilitas) adalah salah satu ciri makhluk hidup." },
  { q: "Pahlawan dari Aceh yang berjuang melawan Belanda adalah…", o: ["Cut Nyak Dien", "Ki Hajar Dewantara", "Pattimura", "Sultan Hasanuddin"], a: 0, f: "Cut Nyak Dien adalah pahlawan nasional dari Aceh." },
  { q: "Ketinggian tempat mempengaruhi iklim. Semakin tinggi tempat, suhu udaranya…", o: ["Semakin rendah", "Semakin tinggi", "Tetap", "Naik lalu turun mendadak"], a: 0, f: "Setiap naik 100 m, suhu udara turun sekitar 0,6°C." },
  { q: "DNA terletak di dalam…", o: ["Nukleus (inti sel)", "Ribosom", "Dinding sel", "Vakuola"], a: 0, f: "DNA tersimpan di nukleus dan mengandung informasi genetik." },
  { q: "Bunyi tidak bisa merambat melalui…", o: ["Vakum", "Air", "Udara", "Besi"], a: 0, f: "Bunyi butuh medium. Di ruang vakum, bunyi tidak dapat merambat." },
  { q: "Sumpah Pemuda diperingati setiap tanggal…", o: ["28 Oktober", "17 Agustus", "1 Oktober", "20 Mei"], a: 0, f: "Sumpah Pemuda diikrarkan pada 28 Oktober 1928." },
  { q: "Kesetaraan hak dan kewajiban warga negara diatur dalam UUD 1945 pasal…", o: ["Pasal 27", "Pasal 1", "Pasal 45", "Pasal 99"], a: 0, f: "Pasal 27 ayat 1: segala warga negara bersamaan kedudukannya dalam hukum." },
  { q: "Alat pernapasan ikan adalah…", o: ["Insang", "Paru-paru", "Trakea", "Kulit"], a: 0, f: "Ikan bernapas dengan insang untuk mengambil oksigen terlarut." },
  { q: "Angin yang bertiup dari darat ke laut pada malam hari disebut…", o: ["Angin darat", "Angin laut", "Angin muson", "Angin puting beliung"], a: 0, f: "Malam hari darat lebih dingin, angin bertiup dari darat ke laut." },
  { q: "Gaya yang menyebabkan buah jatuh ke bawah adalah gaya…", o: ["Gravitasi", "Magnet", "Gesek", "Pegas"], a: 0, f: "Gravitasi bumi menarik benda ke arah pusat bumi." },
  { q: "Negara pendiri ASEAN berjumlah 5, kecuali…", o: ["Jepang", "Indonesia", "Malaysia", "Singapura"], a: 0, f: "Pendiri ASEAN: Indonesia, Malaysia, Singapura, Thailand, Filipina. Jepang bukan." },
  { q: "Pencernaan karbohidrat dimulai dari mulut oleh enzim…", o: ["Amilase (ptialin)", "Pepsin", "Lipase", "Trypsin"], a: 0, f: "Enzim amilase di air liur memecah pati menjadi gula sederhana." },
  { q: "Ibu kota Provinsi Jawa Barat adalah…", o: ["Bandung", "Semarang", "Surabaya", "Serang"], a: 0, f: "Bandung adalah ibu kota Jawa Barat." },
];

/* ---------- SMP: Matematika (generator) ---------- */
DATA.genSmpMatika = function () {
  const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const tipe = ["aljabar", "pangkat", "pecahan", "campuran"];
  const tipePilih = tipe[r(0, 3)];
  const buat = (q, cv, kandidat, f) => {
    const opts = [cv];
    kandidat.forEach(v => { if (opts.length < 4 && !opts.includes(v)) opts.push(v); });
    let k = 1;
    while (opts.length < 4) { const v = typeof cv === "number" ? cv + k * 3 : cv + " *".repeat(k); if (!opts.includes(v)) opts.push(v); k++; }
    return { q, o: opts.sort(() => Math.random() - .5), cv, a: null, f };
  };
  if (tipePilih === "aljabar") {
    const a = r(2, 6), x = r(2, 12), b = r(1, 15), c = a * x + b;
    return buat(`Jika ${a}x + ${b} = ${c}, maka nilai x adalah…`, x,
      [x + r(1, 3), x - r(1, 3) || x + 4, x + r(4, 6), c + r(1, 5)],
      `${a}x = ${c} − ${b} = ${a * x}, maka x = ${a * x} ÷ ${a} = ${x}.`);
  }
  if (tipePilih === "pangkat") {
    const basis = r(2, 7), p = r(2, 3), hasil = Math.pow(basis, p);
    return buat(`Berapakah nilai dari ${basis}<sup>${p}</sup>?`, hasil,
      [hasil + basis, hasil - basis, hasil + 10, hasil + 5],
      `${basis}<sup>${p}</sup> = ${Array(p).fill(basis).join(" × ")} = ${hasil}.`);
  }
  if (tipePilih === "pecahan") {
    const d = r(2, 6), p1 = r(1, 4), p2 = r(1, 4), num = p1 + p2;
    return buat(`Berapakah hasil dari ${p1}/${d} + ${p2}/${d}?`, `${num}/${d}`,
      [`${num + 1}/${d}`, `${num}/${d + 1}`, `${num - 1 || num + 1}/${d}`, `${num + 2}/${d}`].filter(s => s !== `${num}/${d}`),
      `Penyebutnya sama, jumlahkan pembilangnya: (${p1}+${p2})/${d} = ${num}/${d}.`);
  }
  const a = r(12, 30), b = r(4, 12), hasil = a * b;
  return buat(`Sebuah kelas memiliki ${a} baris kursi dengan ${b} kursi di tiap baris. Total kursi ada…`, hasil,
    [hasil + a, hasil - b, hasil + 10, a + b],
    `${a} × ${b} = ${hasil} kursi.`);
};

/* ---------- SMA: Simulasi UTBK ---------- */
DATA.utbk = [
  { kat: "Penalaran Umum", q: "Semua siswa MENYENANGKAN belajar matematika. Sebagian siswa suka main catur. Kesimpulan yang PALING TEPAT adalah…", o: ["Semua siswa suka catur", "Sebagian siswa yang suka catur pasti menyenangkan matematika", "Tidak ada siswa yang suka catur", "Semua pecatur tidak suka matematika"], a: 1, f: "Sebagian siswa (yang suka catur) tetap bagian dari 'semua siswa' yang menyenangkan matematika." },
  { kat: "Penalaran Umum", q: "Jika hari hujan, maka jalan basah. Hari ini jalan TIDAK basah. Kesimpulannya…", o: ["Hari ini pasti hujan", "Hari ini tidak hujan", "Hari ini mungkin hujan deras", "Tidak dapat disimpulkan"], a: 1, f: "Modus tollens: jika P→Q dan ¬Q, maka ¬P. Jalan tidak basah berarti tidak hujan." },
  { kat: "Penalaran Umum", q: "Urutan: A lebih tinggi dari B, C lebih pendek dari B. Siapa yang paling pendek?", o: ["A", "B", "C", "Tidak diketahui"], a: 2, f: "A > B > C, maka C paling pendek." },
  { kat: "Penalaran Umum", q: "Pola bilangan: 2, 6, 12, 20, 30, …? Bilangan berikutnya adalah…", o: ["36", "40", "42", "44"], a: 2, f: "Selisihnya +4, +6, +8, +10, +12 → 30+12 = 42. Pola n×(n+1)." },
  { kat: "Penalaran Umum", q: "Semua dokter pandai berbicara. Sebagian orang pandai berbicara adalah penulis. Kesimpulan yang SAH adalah…", o: ["Semua dokter penulis", "Sebagian penulis pasti dokter", "Tidak dapat disimpulkan bahwa semua dokter adalah penulis", "Tidak ada dokter yang penulis"], a: 2, f: "Dua himpunan yang saling beririsan tidak otomatis membuat satu memuat yang lain." },
  { kat: "Literasi Bahasa", q: "'Lembaga pendidikan harus menjadi ruang aman bagi tumbuh kembang anak.' Kata 'ruang aman' bermakna…", o: ["Tempat berbayar", "Lingkungan yang mendukung dan bebas dari ancaman", "Gedung bertingkat", "Ruang kelas ber-AC"], a: 1, f: "Ruang aman = lingkungan yang mendukung perkembangan, tanpa kekerasan/ancaman." },
  { kat: "Literasi Bahasa", q: "Bacalah: 'Membaca buku sebelum tidur terbukti meningkatkan kualitas tidur anak, asalkan durasinya wajar dan kontennya sesuai usia.' Ide pokok kalimat tersebut adalah…", o: ["Buku mahal harganya", "Membaca sebelum tidur bermanfaat bagi kualitas tidur anak jika tepat durasi dan konten", "Anak harus tidur larut", "Semua buku bagus untuk semua usia"], a: 1, f: "Ide pokok: manfaat membaca sebelum tidur dengan syarat durasi & konten sesuai usia." },
  { kat: "Literasi Bahasa", q: "Konjungsi yang tepat: 'Rina rajin belajar, … nilainya meningkat.'", o: ["tetapi", "karena", "sehingga", "padahal"], a: 2, f: "Hubungan sebab-akibat: rajin belajar SEHINGGA nilai meningkat." },
  { kat: "Literasi Bahasa", q: "Kalimat efektif di bawah ini adalah…", o: ["Para siswa-siswa berbaris di lapangan lapangan", "Siswa berbaris di lapangan", "Yang siswa berbaris itu di lapangan", "Di lapangan itu baris siswa berbaris"], a: 1, f: "Kalimat efektif = ringkas, jelas, tidak berulang, sesuai kaidah." },
  { kat: "Literasi Bahasa", q: "'Pemerintah menggalakkan literasi digital agar warga bijak menggunakan internet.' Kata 'literasi' berarti…", o: ["Kemampuan membaca dan memahami secara kritis", "Membeli gawai baru", "Menonton video", "Menjual produk online"], a: 0, f: "Literasi = kemampuan memahami, menilai, dan menggunakan informasi secara kritis." },
  { kat: "Penalaran Matematika", q: "Rata-rata 5 nilai ujian Rani adalah 80. Empat nilai: 75, 85, 78, 82. Nilai kelima adalah…", o: ["80", "82", "84", "86"], a: 0, f: "Total = 5×80 = 400. 75+85+78+82 = 320. Nilai kelima = 400−320 = 80." },
  { kat: "Penalaran Matematika", q: "Sebuah bak diisi 2 keran. Keran A mengisi 6 jam, keran B 3 jam. Jika bersama, bak penuh dalam…", o: ["2 jam", "3 jam", "4,5 jam", "9 jam"], a: 0, f: "Laju gabungan = 1/6 + 1/3 = 1/2 bak per jam → penuh dalam 2 jam." },
  { kat: "Penalaran Matematika", q: "Harga baju naik 20%, lalu diskon 20%. Harga akhir dibanding harga awal adalah…", o: ["Sama", "Lebih rendah 4%", "Lebih tinggi 4%", "Lebih rendah 20%"], a: 1, f: "1,2 × 0,8 = 0,96 → 96% harga awal, lebih rendah 4%." },
  { kat: "Penalaran Matematika", q: "Barisan geometri: 3, 6, 12, 24, … Suku ke-8 adalah…", o: ["192", "384", "96", "768"], a: 1, f: "Rasio = 2. U8 = 3 × 2^7 = 3 × 128 = 384." },
];

/* ---------- SMA: Kartu Hafalan ---------- */
DATA.flashcards = [
  { depan: "Rumus luas lingkaran?", belakang: "L = π × r²  (π ≈ 3,14 atau 22/7)" },
  { depan: "Hukum Ohm?", belakang: "V = I × R (tegangan = arus × hambatan)" },
  { depan: "Hasil fotosintesis?", belakang: "Glukosa (C₆H₁₂O₆) dan oksigen (O₂)" },
  { depan: "Rumus Keliling lingkaran?", belakang: "K = 2 × π × r" },
  { depan: "Hukum I Newton bunyinya?", belakang: "Benda cenderung mempertahankan keadaannya (inersia) jika resultan gaya nol." },
  { depan: "Rumus kecepatan?", belakang: "v = s / t (jarak dibagi waktu)" },
  { depan: "Proklamasi dibacakan kapan dan siapa?", belakang: "17 Agustus 1945, oleh Ir. Soekarno didampingi Drs. Mohammad Hatta." },
  { depan: "Rumus Pythagoras?", belakang: "a² + b² = c²  (sisi miring kuadrat = jumlah kuadrat dua sisi lain)" },
  { depan: "Bedanya sel tumbuhan & hewan?", belakang: "Sel tumbuhan punya dinding sel & kloroplas; sel hewan tidak." },
  { depan: "Rumus luas segitiga?", belakang: "L = ½ × alas × tinggi" },
  { depan: "Apa itu ekosistem?", belakang: "Kesatuan hubungan timbal balik antara makhluk hidup dengan lingkungannya." },
  { depan: "Teorema Binomial singkat (a+b)² ?", belakang: "a² + 2ab + b²" },
  { depan: "Klasifikasi Makhluk Hidup: 5 kingdom?", belakang: "Monera, Protista, Fungi (jamur), Plantae, Animalia." },
  { depan: "Rumus energi kinetik?", belakang: "Ek = ½ × m × v²" },
  { depan: "Trigonometri: sin 30°, cos 60° ?", belakang: "sin 30° = ½ dan cos 60° = ½ (nilainya sama!)" },
  { depan: "Garis lintang Indonesia?", belakang: "6° LU – 11° LS, 95° BT – 141° BT (negara maritim tropis)." },
];

/* ---------- SMA: Petunjuk Karier ---------- */
DATA.careerFields = {
  teknologi: { nama: "Teknologi & Rekayasa", emoji: "💻", desk: "Kamu suka memecahkan masalah dan logika! Dunia teknologi menanti: programmer, insinyur AI, data scientist, atau perancang robot. Coba pelajari coding dari sekarang — mulai dari Scratch atau Python.", jurusan: ["Ilmu Komputer", "Teknik Informatika", "Sistem Informasi", "Teknik Elektro"] },
  sains: { nama: "Sains & Riset", emoji: "🔬", desk: "Rasa ingin tahu muu tinggi — ciri ilmuwan hebat! Kamu bisa jadi peneliti, dokter, astronom, atau ahli bioteknologi. Ikut olimpiade sains dan jangan takut bereksperimen!", jurusan: ["Kedokteran", "Farmasi", "Biologi", "Fisika", "Astronomi"] },
  bisnis: { nama: "Bisnis & Kewirausahaan", emoji: "📈", desk: "Kamu punya jiwa pemimpin dan berani ambil keputusan! Wirausaha, manajer produk, atau ekonom hebat bisa jadi panggungmu. Mulai dari belajar mengelola uang jajanmu.", jurusan: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan", "Hubungan Internasional"] },
  seni: { nama: "Seni & Kreatif", emoji: "🎨", desk: "Imajinasimu luas dan kamu melihat dunia dengan cara unik! Desainer, animator, musisi, penulis, atau arsitek bisa jadi masa depanmu. Bangun portofolio karyamu sejak sekarang!", jurusan: ["DKV (Desain Komunikasi Visual)", "Film", "Arsitektur", "Sastra", "Seni Musik"] },
  sosial: { nama: "Sosial & Membantu Orang", emoji: "🤝", desk: "Kamu hangat dan peduli pada orang lain! Guru, psikolog, pekerja sosial, atau jurnalis bisa jadi jalurmu. Kemampuan mendengarkan adalah superpower-mu.", jurusan: ["Psikologi", "Ilmu Pendidikan", "Ilmu Komunikasi", "Kesejahteraan Sosial"] },
  bahasa: { nama: "Bahasa & Budaya", emoji: "🌍", desk: "Kamu menikmati kata-kata dan budaya! Penerjemah, diplomat, penulis, atau pengajar bahasa bisa jadi karier impianmu. Perbanyak baca dan pelajari bahasa asing.", jurusan: ["Sastra Inggris", "Hubungan Internasional", "Ilmu Politik", "Pendidikan Bahasa"] },
};

DATA.careerQuestions = [
  { q: "Kalau punya waktu luang satu hari penuh, kamu pilih…", o: [{ t: "Membuat program kecil / bermain logika", f: "teknologi" }, { t: "Eksperimen sederhana di rumah", f: "sains" }, { t: "Menjual barang jadi online", f: "bisnis" }, { t: "Menggambar / membuat musik", f: "seni" }] },
  { q: "Teman sekolah bermasalah, kamu biasanya…", o: [{ t: "Mikir solusi langkah demi langkah", f: "teknologi" }, { t: "Cari tahu penyebabnya seperti detektif", f: "sains" }, { t: "Ajak kerja sama proyek bersama", f: "bisnis" }, { t: "Dengarkan dan temani dia", f: "sosial" }] },
  { q: "Pelajaran yang paling bikinmu bersemangat…", o: [{ t: "Matematika / Informatika", f: "teknologi" }, { t: "Fisika / Biologi / Kimia", f: "sains" }, { t: "Ekonomi / Kewirausahaan", f: "bisnis" }, { t: "Bahasa / Seni Budaya", f: "bahasa" }] },
  { q: "Proyek kelompok impianmu adalah…", o: [{ t: "Membuat aplikasi atau game", f: "teknologi" }, { t: "Penelitian kecil tentang lingkungan", f: "sains" }, { t: "Bazar untuk mengumpulkan dana", f: "bisnis" }, { t: "Panggung seni / majalah dinding", f: "seni" }] },
  { q: "Mimpi besar yang paling menggugah…", o: [{ t: "Menemukan teknologi baru yang berguna", f: "teknologi" }, { t: "Menemukan obat / penelitian penting", f: "sains" }, { t: "Membangun perusahaan sendiri", f: "bisnis" }, { t: "Karya yang diapresiasi banyak orang", f: "seni" }] },
  { q: "Cara belajar yang paling cocok buatmu…", o: [{ t: "Coba-coba langsung dan eksperimen", f: "teknologi" }, { t: "Baca sumber lalu rangkum dengan rapi", f: "sains" }, { t: "Diskusi dan berlatih menjual ide", f: "bisnis" }, { t: "Cerita, gambar, dan analogi kreatif", f: "seni" }] },
];

/* ---------- Tips orang tua ---------- */
DATA.tipsOrtu = [
  { t: "15 menit setiap hari", d: "Latihan singkat tapi rutin terbukti lebih efektif daripada sekali duduk berjam-jam. Cukup 1–2 permainan per hari." },
  { t: "Dampingi, jangan gantikan", d: "Duduk bersama anak sesekali, tanyakan apa yang dipelajari hari ini. Keterlibatan orang tua adalah pendorong motivasi terbesar." },
  { t: "Latihan lebih penting daripada menonton", d: "Anak belajar lewat mencoba dan salah. Rayakan usahanya, bukan hanya jawaban benarnya." },
  { t: "Batasi waktu layar", d: "Sesuai rekomendasi ahli, sesi belajar digital idealnya 20–45 menit per usia, diselingi istirahat dan aktivitas fisik." },
];

/* ---------- Misi harian ---------- */
DATA.missionPool = [
  { id: "main2", emoji: "🎮", teks: "Selesaikan 2 permainan apa pun", target: 2, satuan: "permainan", key: "plays" },
  { id: "xp50", emoji: "⚡", teks: "Kumpulkan 50 XP hari ini", target: 50, satuan: "XP", key: "xp" },
  { id: "menang1", emoji: "🏅", teks: "Raih minimal 1 bintang di sebuah permainan", target: 1, satuan: "kemenangan", key: "wins" },
  { id: "main3", emoji: "🚀", teks: "Selesaikan 3 permainan apa pun", target: 3, satuan: "permainan", key: "plays" },
  { id: "xp100", emoji: "🔥", teks: "Kumpulkan 100 XP hari ini", target: 100, satuan: "XP", key: "xp" },
];
