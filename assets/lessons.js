/* =================================================================
   Bayhaqy Kids — Lesson registry (v2)
   Lists all available lessons per subject, with grade level, type,
   and curriculum alignment (SPC, Cambridge, IB, IPC, Montessori, ID).
   Only lessons listed here AND deployed as HTML files will show up.
   ================================================================= */

window.LESSONS = {
  math: [
    // Kindergarten & Grade 1-3 (most content here per user request)
    { slug: 'counting-1-10',     grade: 'K', type: 'lesson',      curricula: ['spc','cambridge','ib','ipc','montessori','id'],
      en: { title: 'Counting 1 to 10',         desc: 'Meet the first ten numbers with fingers, dots, and fruits.' },
      id: { title: 'Berhitung 1 sampai 10',    desc: 'Kenal sepuluh angka pertama dengan jari, titik, dan buah.' } },
    { slug: 'counting-1-20',     grade: 'K', type: 'lesson',      curricula: ['spc','cambridge','ib','ipc','montessori','id'],
      en: { title: 'Counting 1 to 20',         desc: 'Continue the counting journey up to twenty.' },
      id: { title: 'Berhitung 1 sampai 20',    desc: 'Lanjutkan berhitung sampai dua puluh.' } },
    { slug: 'number-sense',      grade: 'K', type: 'lesson',      curricula: ['spc','cambridge','montessori','id'],
      en: { title: 'Number Sense',             desc: 'More, less, bigger, smaller — feel the numbers.' },
      id: { title: 'Pengenalan Bilangan',      desc: 'Lebih banyak, lebih sedikit, lebih besar, lebih kecil.' } },
    { slug: 'shapes-basics',     grade: 'K', type: 'lesson',      curricula: ['cambridge','ib','ipc','montessori','id'],
      en: { title: 'Shapes Around Us',         desc: 'Circle, square, triangle — find shapes everywhere.' },
      id: { title: 'Bentuk di Sekitar Kita',  desc: 'Lingkaran, persegi, segitiga — temukan bentuk di mana-mana.' } },
    { slug: 'colors-and-patterns', grade: 'K', type: 'lesson',    curricula: ['ipc','montessori','id'],
      en: { title: 'Colors & Patterns',        desc: 'Red, blue, green — and what comes next in a pattern.' },
      id: { title: 'Warna & Pola',             desc: 'Merah, biru, hijau — dan apa selanjutnya dalam pola.' } },
    { slug: 'addition-basics',   grade: '1', type: 'lesson',      curricula: ['spc','cambridge','ib','ipc','montessori','id'],
      en: { title: 'Addition Basics',          desc: 'Add two one-digit numbers using pictures.' },
      id: { title: 'Penjumlahan Dasar',        desc: 'Tambahkan dua angka satu digit dengan gambar.' } },
    { slug: 'subtraction-basics',grade: '1', type: 'lesson',      curricula: ['spc','cambridge','ib','ipc','montessori','id'],
      en: { title: 'Subtraction Basics',       desc: 'Take away within 20.' },
      id: { title: 'Pengurangan Dasar',        desc: 'Kurang dalam batas 20.' } },
    { slug: 'addition-to-20',    grade: '1', type: 'lesson',      curricula: ['spc','cambridge','id'],
      en: { title: 'Addition to 20',           desc: 'Build fluency adding within 20.' },
      id: { title: 'Penjumlahan sampai 20',    desc: 'Mahir menjumlahkan dalam batas 20.' } },
    { slug: 'place-value-10',    grade: '1', type: 'lesson',      curricula: ['spc','cambridge','montessori','id'],
      en: { title: 'Tens and Ones',            desc: 'Understand place value up to 99.' },
      id: { title: 'Puluhan dan Satuan',       desc: 'Pahami nilai tempat sampai 99.' } },
    { slug: 'measurement-basics',grade: '2', type: 'lesson',      curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Measuring Things',         desc: 'Long, short, heavy, light — measure the world.' },
      id: { title: 'Mengukur Sesuatu',         desc: 'Panjang, pendek, berat, ringan — ukur dunia.' } },
    { slug: 'money-basics',      grade: '2', type: 'lesson',      curricula: ['spc','cambridge','id'],
      en: { title: 'Money Basics',             desc: 'Coins and bills — count and compare.' },
      id: { title: 'Uang Dasar',               desc: 'Koin dan uang kertas — hitung dan bandingkan.' } },
    { slug: 'time-basics',       grade: '2', type: 'lesson',      curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Telling Time',             desc: 'Read the clock — hours and half-hours.' },
      id: { title: 'Membaca Jam',              desc: 'Baca jam — jam dan setengah jam.' } },
    { slug: 'geometry-shapes',   grade: '2', type: 'lesson',      curricula: ['cambridge','ib','ipc','montessori','id'],
      en: { title: '2D Shapes',                desc: 'Circles, squares, triangles, rectangles — and their properties.' },
      id: { title: 'Bentuk 2D',                desc: 'Lingkaran, persegi, segitiga, persegi panjang — dan sifatnya.' } },
    { slug: 'fractions-pizza',   grade: '3', type: 'simulation',  curricula: ['spc','cambridge','ib','ipc','montessori','id'],
      en: { title: 'Fractions with Pizza',     desc: 'Slice a pizza to learn halves, thirds, quarters.' },
      id: { title: 'Pecahan dengan Pizza',     desc: 'Potong pizza untuk belajar setengah, sepertiga, seperempat.' } },
    { slug: 'multiplication-table', grade: '3', type: 'simulation', curricula: ['spc','cambridge','id'],
      en: { title: 'Multiplication Table',     desc: 'See the times table come alive.' },
      id: { title: 'Tabel Perkalian',          desc: 'Lihat tabel perkalian hidup.' } },
    { slug: 'division-basics',   grade: '3', type: 'lesson',      curricula: ['spc','cambridge','id'],
      en: { title: 'Division Basics',          desc: 'Share equally — intro to division.' },
      id: { title: 'Pembagian Dasar',          desc: 'Berbagi sama rata — pengantar pembagian.' } },
    // Grade 4-9
    { slug: 'algebra-basics',    grade: '7', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Algebra Basics',           desc: 'Letters stand for numbers — solve for x.' },
      id: { title: 'Aljabar Dasar',            desc: 'Huruf mewakili angka — cari x.' } }
  ],
  language: [
    // Kindergarten & Grade 1-3
    { slug: 'alphabet',          grade: 'K', type: 'lesson',      curricula: ['cambridge','ib','ipc','montessori','id'],
      en: { title: 'The Alphabet',             desc: 'A to Z — names and sounds.' },
      id: { title: 'Alfabet',                  desc: 'A sampai Z — nama dan bunyi.' } },
    { slug: 'phonic-sounds',     grade: 'K', type: 'lesson',      curricula: ['cambridge','montessori','id'],
      en: { title: 'Phonics: First Sounds',    desc: 'Listen to the letter sounds — a, b, c…' },
      id: { title: 'Fonik: Bunyi Pertama',     desc: 'Dengarkan bunyi huruf — a, b, c…' } },
    { slug: 'sight-words',       grade: '1', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Sight Words',              desc: 'Common English words to recognize instantly.' },
      id: { title: 'Kata Sering',              desc: 'Kata umum Inggris yang dikenal instan.' } },
    { slug: 'rhyming-words',     grade: '1', type: 'game',        curricula: ['cambridge','ib','id'],
      en: { title: 'Rhyming Words',            desc: 'Match words that sound alike.' },
      id: { title: 'Kata Berima',              desc: 'Cocokkan kata yang bunyinya sama.' } },
    { slug: 'simple-sentences',  grade: '1', type: 'lesson',      curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Simple Sentences',         desc: 'Build sentences: subject + verb + object.' },
      id: { title: 'Kalimat Sederhana',        desc: 'Susun kalimat: subjek + predikat + objek.' } },
    { slug: 'indonesian-vocab',  grade: '2', type: 'lesson',      curricula: ['id'],
      en: { title: 'Indonesian Vocabulary',    desc: 'Everyday words: family, food, animals.' },
      id: { title: 'Kosakata Bahasa Indonesia', desc: 'Kata sehari-hari: keluarga, makanan, hewan.' } },
    { slug: 'parts-of-speech',   grade: '3', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Parts of Speech',          desc: 'Noun, verb, adjective, adverb.' },
      id: { title: 'Jenis Kata',               desc: 'Nomina, verba, adjektiva, adverba.' } },
    { slug: 'punctuation-basics',grade: '3', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Punctuation Basics',       desc: 'Period, question mark, exclamation — end the sentence right.' },
      id: { title: 'Tanda Baca Dasar',         desc: 'Titik, tanda tanya, tanda seru — akhiri kalimat dengan benar.' } },
    // Grade 4-9
    { slug: 'synonyms-antonyms', grade: '4', type: 'quiz',        curricula: ['cambridge','ib','id'],
      en: { title: 'Synonyms & Antonyms',      desc: 'Words that mean the same or opposite.' },
      id: { title: 'Sinonim & Antonim',        desc: 'Kata yang berarti sama atau berlawanan.' } },
    { slug: 'indonesian-proverbs', grade: '5', type: 'lesson',    curricula: ['id'],
      en: { title: 'Indonesian Proverbs',      desc: 'Pepatah — wisdom in a few words.' },
      id: { title: 'Pepatah Indonesia',        desc: 'Pepatah — bijak dalam beberapa kata.' } },
    { slug: 'essay-structure',   grade: '7', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Essay Structure',          desc: 'Introduction, body, conclusion.' },
      id: { title: 'Struktur Esai',            desc: 'Pendahuluan, isi, penutup.' } }
  ],
  science: [
    // Kindergarten & Grade 1-3
    { slug: 'five-senses',       grade: 'K', type: 'lesson',      curricula: ['cambridge','ib','ipc','montessori','id'],
      en: { title: 'The Five Senses',          desc: 'See, hear, smell, taste, touch.' },
      id: { title: 'Lima Indra',               desc: 'Penglihatan, pendengaran, penciuman, pengecap, peraba.' } },
    { slug: 'colors-rainbow',    grade: 'K', type: 'lesson',      curricula: ['ipc','montessori','id'],
      en: { title: 'Colors of the Rainbow',    desc: 'Roy G. Biv — meet the seven rainbow colors.' },
      id: { title: 'Warna Pelangi',            desc: 'Merah, jingga, kuning, hijau, biru, nila, ungu.' } },
    { slug: 'living-nonliving',  grade: '1', type: 'lesson',      curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Living vs Non-Living',     desc: 'What makes something alive?' },
      id: { title: 'Hidup vs Bukan Hidup',     desc: 'Apa yang membuat sesuatu hidup?' } },
    { slug: 'animal-groups',     grade: '2', type: 'lesson',      curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Animal Groups',            desc: 'Mammals, birds, fish, reptiles, amphibians.' },
      id: { title: 'Kelompok Hewan',           desc: 'Mamalia, burung, ikan, reptil, amfibi.' } },
    { slug: 'plant-parts',       grade: '2', type: 'lesson',      curricula: ['cambridge','ib','ipc','montessori','id'],
      en: { title: 'Parts of a Plant',         desc: 'Roots, stem, leaves, flower, fruit.' },
      id: { title: 'Bagian Tumbuhan',          desc: 'Akar, batang, daun, bunga, buah.' } },
    { slug: 'water-cycle',       grade: '2', type: 'simulation',  curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'The Water Cycle',          desc: 'Evaporation, condensation, precipitation.' },
      id: { title: 'Siklus Air',               desc: 'Penguapan, pengembunan, hujan.' } },
    { slug: 'solar-system',      grade: '3', type: 'simulation',  curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Solar System Tour',        desc: 'Fly through the 8 planets.' },
      id: { title: 'Tur Tata Surya',           desc: 'Terbangi 8 planet.' } },
    { slug: 'states-of-matter',  grade: '4', type: 'simulation',  curricula: ['cambridge','ib','id'],
      en: { title: 'States of Matter',         desc: 'Solid, liquid, gas — see particles move.' },
      id: { title: 'Wujud Zat',                desc: 'Padat, cair, gas — lihat partikel bergerak.' } },
    { slug: 'food-chain',        grade: '4', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Food Chains',              desc: 'Who eats whom in nature.' },
      id: { title: 'Rantai Makanan',           desc: 'Siapa makan siapa di alam.' } },
    { slug: 'photosynthesis',    grade: '6', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Photosynthesis',           desc: 'How plants make food from sunlight.' },
      id: { title: 'Fotosintesis',             desc: 'Bagaimana tumbuhan membuat makanan dari cahaya.' } },
    { slug: 'newton-laws',       grade: '8', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Newton\u2019s Laws of Motion', desc: 'Why things move the way they do.' },
      id: { title: 'Hukum Newton',             desc: 'Mengapa benda bergerak seperti itu.' } }
  ],
  tech: [
    // Kindergarten & Grade 1-3
    { slug: 'what-is-computer',  grade: 'K', type: 'lesson',      curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'What Is a Computer?',      desc: 'Meet the parts: screen, keyboard, mouse.' },
      id: { title: 'Apa itu Komputer?',        desc: 'Kenali bagian-bagiannya: layar, keyboard, mouse.' } },
    { slug: 'typing-skills',     grade: '2', type: 'game',        curricula: ['cambridge','id'],
      en: { title: 'Typing Skills',            desc: 'Learn the home row.' },
      id: { title: 'Keterampilan Mengetik',    desc: 'Belajar baris utama keyboard.' } },
    { slug: 'internet-safety',   grade: '3', type: 'lesson',      curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Internet Safety',          desc: 'Be smart, be kind, be safe online.' },
      id: { title: 'Keamanan Internet',        desc: 'Cerdas, ramah, aman di dunia daring.' } },
    // Grade 4-9
    { slug: 'first-html',        grade: '5', type: 'lesson',      curricula: ['cambridge','id'],
      en: { title: 'Your First HTML Page',     desc: 'Make a real webpage in 5 minutes.' },
      id: { title: 'Halaman HTML Pertamamu',   desc: 'Buat halaman web asli dalam 5 menit.' } },
    { slug: 'binary-numbers',    grade: '6', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'Binary Numbers',           desc: 'How computers count with 0 and 1.' },
      id: { title: 'Bilangan Biner',           desc: 'Cara komputer berhitung dengan 0 dan 1.' } },
    { slug: 'loops-coding',      grade: '6', type: 'simulation',  curricula: ['cambridge','ib','id'],
      en: { title: 'Loops & Patterns',         desc: 'See how loops draw shapes.' },
      id: { title: 'Perulangan & Pola',        desc: 'Lihat bagaimana perulangan menggambar.' } },
    { slug: 'ai-basics',         grade: '7', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'What Is AI?',              desc: 'How machines learn — kid-friendly intro.' },
      id: { title: 'Apa itu AI?',              desc: 'Bagaimana mesin belajar — pengenalan ramah anak.' } }
  ],
  history: [
    // Kindergarten & Grade 1-3
    { slug: 'indonesia-flag',    grade: 'K', type: 'lesson',      curricula: ['id'],
      en: { title: 'The Indonesian Flag',      desc: 'Merah Putih — what it means.' },
      id: { title: 'Bendera Indonesia',        desc: 'Merah Putih — apa maknanya.' } },
    { slug: 'independence-day',  grade: '2', type: 'lesson',      curricula: ['id'],
      en: { title: 'Indonesia\u2019s Independence', desc: '17 August 1945 — the story.' },
      id: { title: 'Kemerdekaan Indonesia',    desc: '17 Agustus 1945 — kisahnya.' } },
    { slug: 'indonesian-heroes', grade: '3', type: 'lesson',      curricula: ['id'],
      en: { title: 'National Heroes',          desc: 'Meet 6 heroes who shaped Indonesia.' },
      id: { title: 'Pahlawan Nasional',        desc: 'Kenal 6 pahlawan pembentuk Indonesia.' } },
    // Grade 4-9
    { slug: 'ancient-civilizations', grade: '5', type: 'lesson',  curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Ancient Civilizations',    desc: 'Egypt, Greece, China, India — first empires.' },
      id: { title: 'Peradaban Kuno',           desc: 'Mesir, Yunani, Tiongkok, India — imperium pertama.' } },
    { slug: 'world-war-2',       grade: '7', type: 'lesson',      curricula: ['cambridge','ib','id'],
      en: { title: 'World War II',             desc: 'What happened and why it matters.' },
      id: { title: 'Perang Dunia II',          desc: 'Apa yang terjadi dan mengapa penting.' } },
    { slug: 'history-timeline',  grade: '4', type: 'simulation',  curricula: ['cambridge','ib','ipc','id'],
      en: { title: 'Indonesia Timeline',       desc: 'Scroll through 1000+ years of history.' },
      id: { title: 'Linimasa Indonesia',       desc: 'Gulir 1000+ tahun sejarah.' } }
  ],
  games: [
    { slug: 'math-rush',         grade: '2', type: 'game',        curricula: ['spc','cambridge','id'],
      en: { title: 'Math Rush',                desc: 'How many sums in 60 seconds?' },
      id: { title: 'Math Rush',                desc: 'Berapa jumlah soal dalam 60 detik?' } },
    { slug: 'memory-cards',      grade: 'K', type: 'game',        curricula: ['cambridge','ib','montessori','id'],
      en: { title: 'Memory Cards',             desc: 'Flip cards and find pairs.' },
      id: { title: 'Kartu Memori',             desc: 'Buka kartu dan cari pasangan.' } }
  ]
};

window.GRADE_LABEL = function (g) {
  var lang = window.getLang ? window.getLang() : 'en';
  if (g === 'K') return lang === 'id' ? 'TK' : 'K';
  return 'G' + g;
};

window.TYPE_LABEL = function (t) {
  var lang = window.getLang ? window.getLang() : 'en';
  var map = {
    lesson:      lang === 'id' ? 'Pelajaran'   : 'Lesson',
    simulation:  lang === 'id' ? 'Simulasi'    : 'Simulation',
    game:        lang === 'id' ? 'Permainan'   : 'Game',
    quiz:        lang === 'id' ? 'Kuis'        : 'Quiz'
  };
  return map[t] || t;
};

window.CURRICULUM_LABEL = function (c) {
  var map = {
    spc:        'SPC',
    cambridge:  'Cambridge',
    ib:         'IB',
    ipc:        'IPC',
    montessori: 'Montessori',
    id:         'ID'
  };
  return map[c] || c;
};

window.renderLessons = function (container, subject, gradeFilter, curriculumFilter) {
  if (!container) return;
  var lang = window.getLang ? window.getLang() : 'en';
  var list = window.LESSONS[subject] || [];
  var html = '';
  list.forEach(function (l) {
    if (gradeFilter && gradeFilter !== 'all' && l.grade !== gradeFilter) return;
    if (curriculumFilter && curriculumFilter !== 'all' && l.curricula && l.curricula.indexOf(curriculumFilter) === -1) return;
    var tr = l[lang] || l.en;
    var currHtml = '';
    if (l.curricula && l.curricula.length) {
      currHtml = '<div class="curricula">';
      l.curricula.forEach(function (c) {
        currHtml += '<span class="pill small">' + window.CURRICULUM_LABEL(c) + '</span>';
      });
      currHtml += '</div>';
    }
    html += '<a class="lesson-card" href="/kids/' + subject + '/' + l.slug + '/" data-grade="' + l.grade + '" data-type="' + l.type + '">' +
              '<span class="level">' + window.GRADE_LABEL(l.grade) + ' · ' + window.TYPE_LABEL(l.type) + '</span>' +
              '<h4>' + tr.title + '</h4>' +
              '<p class="desc">' + tr.desc + '</p>' +
              currHtml +
            '</a>';
  });
  if (!html) {
    html = '<p style="color: var(--ink-mute); padding: 1rem 0;">' +
           (lang === 'id' ? 'Tidak ada pelajaran di tingkat ini.' : 'No lessons at this grade yet.') +
           '</p>';
  }
  container.innerHTML = html;
};
