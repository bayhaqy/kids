/* =================================================================
   Bayhaqy Kids — Lesson registry
   Lists all available lessons per subject, with grade level + type.
   Used by subject index pages to render lesson cards dynamically.
   ================================================================= */

window.LESSONS = {
  math: [
    { slug: 'counting-1-10',     grade: 'K',   type: 'lesson',      en: { title: 'Counting 1 to 10',         desc: 'Meet the first ten numbers.' },                 id: { title: 'Berhitung 1 sampai 10', desc: 'Kenal sepuluh angka pertama.' } },
    { slug: 'addition-basics',   grade: '1',   type: 'lesson',      en: { title: 'Addition Basics',          desc: 'Add two one-digit numbers.' },                  id: { title: 'Penjumlahan Dasar',     desc: 'Tambahkan dua angka satu digit.' } },
    { slug: 'subtraction-basics',grade: '1',   type: 'lesson',      en: { title: 'Subtraction Basics',       desc: 'Take away within 20.' },                        id: { title: 'Pengurangan Dasar',     desc: 'Kurang dalam batas 20.' } },
    { slug: 'multiplication-table', grade: '3', type: 'simulation', en: { title: 'Multiplication Table',     desc: 'See the times table come alive.' },             id: { title: 'Tabel Perkalian',       desc: 'Lihat tabel perkalian hidup.' } },
    { slug: 'fractions-pizza',   grade: '3',   type: 'simulation',  en: { title: 'Fractions with Pizza',     desc: 'Slice a pizza to learn fractions.' },           id: { title: 'Pecahan dengan Pizza',  desc: 'Potong pizza untuk belajar pecahan.' } },
    { slug: 'geometry-shapes',   grade: '2',   type: 'lesson',      en: { title: '2D Shapes',                desc: 'Circles, squares, triangles, and more.' },      id: { title: 'Bentuk 2D',             desc: 'Lingkaran, persegi, segitiga, dan lainnya.' } },
    { slug: 'algebra-basics',    grade: '7',   type: 'lesson',      en: { title: 'Algebra Basics',           desc: 'Letters stand for numbers — solve for x.' },    id: { title: 'Aljabar Dasar',         desc: 'Huruf mewakili angka — cari x.' } },
    { slug: 'math-quiz',         grade: '3',   type: 'quiz',        en: { title: 'Mixed Math Quiz',          desc: '10 quick questions across topics.' },           id: { title: 'Kuis Matematika Campur',desc: '10 soal cepat dari berbagai topik.' } }
  ],
  language: [
    { slug: 'alphabet',          grade: 'K',   type: 'lesson',      en: { title: 'The Alphabet',             desc: 'A to Z — names and sounds.' },                  id: { title: 'Alfabet',               desc: 'A sampai Z — nama dan bunyi.' } },
    { slug: 'sight-words',       grade: '1',   type: 'lesson',      en: { title: 'Sight Words',              desc: 'Common English words to recognize instantly.'}, id: { title: 'Kata Sering',           desc: 'Kata umum Inggris yang dikenal instan.' } },
    { slug: 'rhyming-words',     grade: '1',   type: 'game',        en: { title: 'Rhyming Words',            desc: 'Match words that sound alike.' },               id: { title: 'Kata Berima',           desc: 'Cocokkan kata yang bunyinya sama.' } },
    { slug: 'parts-of-speech',   grade: '3',   type: 'lesson',      en: { title: 'Parts of Speech',          desc: 'Noun, verb, adjective, adverb.' },              id: { title: 'Jenis Kata',            desc: 'Nomina, verba, adjektiva, adverba.' } },
    { slug: 'synonyms-antonyms', grade: '4',   type: 'quiz',        en: { title: 'Synonyms & Antonyms',      desc: 'Words that mean the same or opposite.' },       id: { title: 'Sinonim & Antonim',     desc: 'Kata yang berarti sama atau berlawanan.' } },
    { slug: 'indonesian-proverbs', grade: '5', type: 'lesson',      en: { title: 'Indonesian Proverbs',      desc: 'Pepatah — wisdom in a few words.' },            id: { title: 'Pepatah Indonesia',     desc: 'Pepatah — bijak dalam beberapa kata.' } },
    { slug: 'essay-structure',   grade: '7',   type: 'lesson',      en: { title: 'Essay Structure',          desc: 'Introduction, body, conclusion.' },             id: { title: 'Struktur Esai',         desc: 'Pendahuluan, isi, penutup.' } }
  ],
  science: [
    { slug: 'five-senses',       grade: 'K',   type: 'lesson',      en: { title: 'The Five Senses',          desc: 'See, hear, smell, taste, touch.' },             id: { title: 'Lima Indra',            desc: 'Penglihatan, pendengaran, penciuman, pengecap, peraba.' } },
    { slug: 'water-cycle',       grade: '2',   type: 'simulation',  en: { title: 'The Water Cycle',          desc: 'Evaporation, condensation, precipitation.' },   id: { title: 'Siklus Air',            desc: 'Penguapan, pengembunan, hujan.' } },
    { slug: 'solar-system',      grade: '3',   type: 'simulation',  en: { title: 'Solar System Tour',        desc: 'Fly through the 8 planets.' },                  id: { title: 'Tur Tata Surya',        desc: 'Terbangi 8 planet.' } },
    { slug: 'plant-parts',       grade: '2',   type: 'lesson',      en: { title: 'Parts of a Plant',         desc: 'Roots, stem, leaves, flower, fruit.' },         id: { title: 'Bagian Tumbuhan',       desc: 'Akar, batang, daun, bunga, buah.' } },
    { slug: 'states-of-matter',  grade: '4',   type: 'simulation',  en: { title: 'States of Matter',         desc: 'Solid, liquid, gas — see particles move.' },    id: { title: 'Wujud Zat',             desc: 'Padat, cair, gas — lihat partikel bergerak.' } },
    { slug: 'food-chain',        grade: '4',   type: 'lesson',      en: { title: 'Food Chains',              desc: 'Who eats whom in nature.' },                    id: { title: 'Rantai Makanan',        desc: 'Siapa makan siapa di alam.' } },
    { slug: 'photosynthesis',    grade: '6',   type: 'lesson',      en: { title: 'Photosynthesis',           desc: 'How plants make food from sunlight.' },         id: { title: 'Fotosintesis',          desc: 'Bagaimana tumbuhan membuat makanan dari cahaya.' } },
    { slug: 'newton-laws',       grade: '8',   type: 'lesson',      en: { title: 'Newton\u2019s Laws of Motion', desc: 'Why things move the way they do.' },         id: { title: 'Hukum Newton',          desc: 'Mengapa benda bergerak seperti itu.' } }
  ],
  tech: [
    { slug: 'what-is-computer',  grade: 'K',   type: 'lesson',      en: { title: 'What Is a Computer?',      desc: 'Meet the parts: screen, keyboard, mouse.' },    id: { title: 'Apa itu Komputer?',     desc: 'Kenali bagian-bagiannya.' } },
    { slug: 'typing-skills',     grade: '2',   type: 'game',        en: { title: 'Typing Skills',            desc: 'Learn the home row.' },                         id: { title: 'Keterampilan Mengetik', desc: 'Belajar baris utama keyboard.' } },
    { slug: 'first-html',        grade: '5',   type: 'lesson',      en: { title: 'Your First HTML Page',     desc: 'Make a real webpage in 5 minutes.' },           id: { title: 'Halaman HTML Pertamamu',desc: 'Buat halaman web asli dalam 5 menit.' } },
    { slug: 'binary-numbers',    grade: '6',   type: 'lesson',      en: { title: 'Binary Numbers',           desc: 'How computers count with 0 and 1.' },           id: { title: 'Bilangan Biner',        desc: 'Cara komputer berhitung dengan 0 dan 1.' } },
    { slug: 'internet-safety',   grade: '3',   type: 'lesson',      en: { title: 'Internet Safety',          desc: 'Be smart, be kind, be safe online.' },          id: { title: 'Keamanan Internet',     desc: 'Cerdas, ramah, aman di dunia daring.' } },
    { slug: 'loops-coding',      grade: '6',   type: 'simulation',  en: { title: 'Loops & Patterns',         desc: 'See how loops draw shapes.' },                  id: { title: 'Perulangan & Pola',     desc: 'Lihat bagaimana perulangan menggambar.' } },
    { slug: 'ai-basics',         grade: '7',   type: 'lesson',      en: { title: 'What Is AI?',              desc: 'How machines learn — kid-friendly intro.' },    id: { title: 'Apa itu AI?',           desc: 'Bagaimana mesin belajar — pengenalan ramah anak.' } }
  ],
  history: [
    { slug: 'indonesia-flag',    grade: 'K',   type: 'lesson',      en: { title: 'The Indonesian Flag',      desc: 'Merah Putih — what it means.' },                id: { title: 'Bendera Indonesia',     desc: 'Merah Putih — apa maknanya.' } },
    { slug: 'independence-day',  grade: '2',   type: 'lesson',      en: { title: 'Indonesia\u2019s Independence', desc: '17 August 1945 — the story.' },            id: { title: 'Kemerdekaan Indonesia', desc: '17 Agustus 1945 — kisahnya.' } },
    { slug: 'indonesian-heroes', grade: '3',   type: 'lesson',      en: { title: 'National Heroes',          desc: 'Meet 6 heroes who shaped Indonesia.' },         id: { title: 'Pahlawan Nasional',     desc: 'Kenal 6 pahlawan pembentuk Indonesia.' } },
    { slug: 'ancient-civilizations', grade: '5', type: 'lesson',    en: { title: 'Ancient Civilizations',    desc: 'Egypt, Greece, China, India — first empires.'}, id: { title: 'Peradaban Kuno',        desc: 'Mesir, Yunani, Tiongkok, India — imperium pertama.' } },
    { slug: 'world-war-2',       grade: '7',   type: 'lesson',      en: { title: 'World War II',             desc: 'What happened and why it matters.' },           id: { title: 'Perang Dunia II',       desc: 'Apa yang terjadi dan mengapa penting.' } },
    { slug: 'history-timeline',  grade: '4',   type: 'simulation',  en: { title: 'Indonesia Timeline',       desc: 'Scroll through 1000+ years of history.' },      id: { title: 'Linimasa Indonesia',    desc: 'Gulir 1000+ tahun sejarah.' } }
  ],
  games: [
    { slug: 'math-rush',         grade: '2',   type: 'game',        en: { title: 'Math Rush',                desc: 'How many sums in 60 seconds?' },                id: { title: 'Math Rush',             desc: 'Berapa jumlah soal dalam 60 detik?' } },
    { slug: 'word-match',        grade: '1',   type: 'game',        en: { title: 'Word Match',               desc: 'Match pictures to words.' },                    id: { title: 'Cocokkan Kata',         desc: 'Cocokkan gambar ke kata.' } },
    { slug: 'memory-cards',      grade: 'K',   type: 'game',        en: { title: 'Memory Cards',             desc: 'Flip cards and find pairs.' },                  id: { title: 'Kartu Memori',          desc: 'Buka kartu dan cari pasangan.' } },
    { slug: 'color-hunt',        grade: 'K',   type: 'game',        en: { title: 'Color Hunt',               desc: 'Tap objects of the right color.' },             id: { title: 'Buruan Warna',          desc: 'Tekan benda dengan warna yang benar.' } },
    { slug: 'capital-quiz',      grade: '4',   type: 'quiz',        en: { title: 'World Capitals Quiz',      desc: 'Match countries to their capitals.' },          id: { title: 'Kuis Ibu Kota Dunia',   desc: 'Cocokkan negara ke ibu kotanya.' } },
    { slug: 'shape-sorter',      grade: 'K',   type: 'game',        en: { title: 'Shape Sorter',             desc: 'Drag shapes to the right bin.' },               id: { title: 'Penyortir Bentuk',      desc: 'Seret bentuk ke kotak yang benar.' } }
  ]
};

window.GRADE_LABEL = function (g) {
  var lang = window.getLang ? window.getLang() : 'en';
  if (g === 'K') return lang === 'id' ? 'TK' : 'K';
  if (g === '1' || g === '2' || g === '3') return 'G' + g;
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

window.renderLessons = function (container, subject, gradeFilter) {
  if (!container) return;
  var lang = window.getLang ? window.getLang() : 'en';
  var list = window.LESSONS[subject] || [];
  var html = '';
  list.forEach(function (l) {
    if (gradeFilter && gradeFilter !== 'all' && l.grade !== gradeFilter) return;
    var tr = l[lang] || l.en;
    html += '<a class="lesson-card" href="/kids/' + subject + '/' + l.slug + '/" data-grade="' + l.grade + '" data-type="' + l.type + '">' +
              '<span class="level">' + window.GRADE_LABEL(l.grade) + ' · ' + window.TYPE_LABEL(l.type) + '</span>' +
              '<h4>' + tr.title + '</h4>' +
              '<p class="desc">' + tr.desc + '</p>' +
            '</a>';
  });
  if (!html) {
    html = '<p style="color: var(--ink-mute); padding: 1rem 0;">' +
           (lang === 'id' ? 'Tidak ada pelajaran di tingkat ini.' : 'No lessons at this grade yet.') +
           '</p>';
  }
  container.innerHTML = html;
};
