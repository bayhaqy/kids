/* ============================================================
   BelajarSeru! 3D — app.js
   Glue utama: merge data, state & gamifikasi, router, suara,
   efek, TTS, boot. Dimuat TERAKHIR.
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});

  /* ============================================================
     1. GABUNGKAN DATA dari window.BS_RAW (ditulis file data)
     ============================================================ */
  const RAW = window.BS_RAW || {};
  function collect(prefix) {
    const topics = [], questions = [];
    Object.keys(RAW).forEach((k) => {
      if (k === prefix || k.startsWith(prefix + '-')) {
        if (RAW[k].topics) topics.push(...RAW[k].topics);
        if (RAW[k].questions) questions.push(...RAW[k].questions);
      }
    });
    return { topics, questions };
  }
  const SUBJECTS = {
    umum: { name: 'Tematik TK', icon: '🧸', color: '#FF8FAB' },
    mtk: { name: 'Matematika', icon: '🔢', color: '#FF6B5E' },
    bindo: { name: 'Bahasa Indonesia', icon: '📖', color: '#38A9F5' },
    ipas: { name: 'IPAS', icon: '🔬', color: '#2EC77E' },
    bing: { name: 'Bahasa Inggris', icon: '🌍', color: '#9B5CF6' },
    ipa: { name: 'IPA', icon: '🔬', color: '#2EC77E' },
    ips: { name: 'IPS', icon: '🌏', color: '#F2A900' },
    fisika: { name: 'Fisika', icon: '⚛️', color: '#38A9F5' },
    kimia: { name: 'Kimia', icon: '🧪', color: '#2EC77E' },
    biologi: { name: 'Biologi', icon: '🧬', color: '#9B5CF6' },
    tps: { name: 'TPS UTBK', icon: '🎓', color: '#2A2140' },
  };
  BS.subjectMeta = (id) => SUBJECTS[id] || { name: id, icon: '📘', color: '#888' };

  BS.topicById = null; BS.questionsByTopic = {}; BS.questionsByGrade = {}; BS.WORLDS = []; BS.allTopics = () => [];

  (function buildData() {
    const tk = collect('tk'), sd13 = collect('sd13'), sd46 = collect('sd46'), smp = collect('smp'), sma = collect('sma');
    const map = {}; const qByTopic = {}; const qByGrade = {};
    function register(topics, questions) {
      topics.forEach((t) => { map[t.id] = t; qByTopic[t.id] = qByTopic[t.id] || []; });
      questions.forEach((q) => {
        (qByTopic[q.t] = qByTopic[q.t] || []).push(q);
        (qByGrade[q.g] = qByGrade[q.g] || []).push(q);
      });
    }
    register(tk.topics, tk.questions);
    register([...sd13.topics, ...sd46.topics], [...sd13.questions, ...sd46.questions]);
    register(smp.topics, smp.questions);
    register(sma.topics, sma.questions);
    BS.topicById = (id) => map[id] || null;
    BS.allTopics = () => Object.values(map);
    BS.questionsByTopic = qByTopic;
    BS.questionsByGrade = qByGrade;
    BS.questionsOfGrade = (...gs) => gs.reduce((a, g) => a.concat(qByGrade[g] || []), []);

    const gradesOf = (ids, labels) => ids.map((id, i) => ({ id, ...labels[i] }));
    BS.WORLDS = [
      { id: 'tk', name: 'Dunia TK', icon: '🎈', color: '#FF8FAB', tagline: 'Bermain sambil mengenal huruf, angka, warna & hewan', fase: 'Fase Fondasi',
        grades: gradesOf(['tk'], [{ name: 'TK A & B', icon: '🧸', fase: 'Fondasi' }]),
        games: ['tebak-huruf', 'tk-trace', 'hitung-mainan', 'tk-pattern', 'warna-bentuk', 'tk-shape3d', 'memory-hewan', 'tk-pasang'],
        regions: [
          { name: 'Hutan Kata 🔤', games: ['tebak-huruf', 'tk-trace'] },
          { name: 'Taman Angka 🔢', games: ['hitung-mainan', 'tk-pattern'] },
          { name: 'Pulau Bentuk 🔺', games: ['warna-bentuk', 'tk-shape3d'] },
          { name: 'Sawah Sahabat 🐾', games: ['memory-hewan', 'tk-pasang'] },
        ] },
      { id: 'sd', name: 'Dunia SD', icon: '🏝️', color: '#2EC77E', tagline: 'Petualangan pulau: MTK, baca-tulis, IPAS & bahasa Inggris', fase: 'Fase A–C',
        grades: gradesOf(['sd-1', 'sd-2', 'sd-3', 'sd-4', 'sd-5', 'sd-6'], [
          { name: 'Kelas 1', icon: '🌱', fase: 'Fase A' }, { name: 'Kelas 2', icon: '🌿', fase: 'Fase A' }, { name: 'Kelas 3', icon: '🌳', fase: 'Fase B' },
          { name: 'Kelas 4', icon: '⛰️', fase: 'Fase B' }, { name: 'Kelas 5', icon: '🌊', fase: 'Fase C' }, { name: 'Kelas 6', icon: '🚀', fase: 'Fase C' }]),
        games: ['mtk-petualangan', 'sd-money', 'sd-clock', 'tebak-kata', 'sd-word', 'sd-plant', 'robot-koding', 'sd-type', 'sd-geo'],
        regions: [
          { name: 'Teluk Hitung 🧮', games: ['mtk-petualangan', 'sd-money', 'sd-clock'] },
          { name: 'Hutan Kata 📖', games: ['tebak-kata', 'sd-word'] },
          { name: 'Kebun IPAS 🌱', games: ['sd-plant'] },
          { name: 'Bengkel Petualang 🔧', games: ['robot-koding', 'sd-type', 'sd-geo'] },
        ] },
      { id: 'smp', name: 'Dunia SMP', icon: '🔬', color: '#38A9F5', tagline: 'Lab maya, eksperimen & tantangan logika', fase: 'Fase D',
        grades: gradesOf(['smp-7', 'smp-8', 'smp-9'], [
          { name: 'Kelas 7', icon: '🔎', fase: 'Fase D' }, { name: 'Kelas 8', icon: '⚗️', fase: 'Fase D' }, { name: 'Kelas 9', icon: '🧲', fase: 'Fase D' }]),
        games: ['lab-lontaran', 'smp-circuit', 'lab-ph', 'smp-molecule', 'smp-cell', 'smp-timeline', 'smp-solid', 'kuis-kilat'],
        regions: [
          { name: 'Lab Gerak & Daya ⚡', games: ['lab-lontaran', 'smp-circuit'] },
          { name: 'Lab Hayati & Kimia 🧪', games: ['lab-ph', 'smp-molecule', 'smp-cell'] },
          { name: 'Studio Waktu 🏛️', games: ['smp-timeline'] },
          { name: 'Menara Angka 📐', games: ['smp-solid'] },
          { name: 'Arena Kilat 🎯', games: ['kuis-kilat'] },
        ] },
      { id: 'sma', name: 'Dunia SMA', icon: '🪐', color: '#9B5CF6', tagline: 'Jurusan pilihan, UTBK & persiapan masa depan', fase: 'Fase E–F',
        grades: gradesOf(['sma-10', 'sma-11', 'sma-12', 'utbk'], [
          { name: 'Kelas 10', icon: '✨', fase: 'Fase E' }, { name: 'Kelas 11', icon: '🌟', fase: 'Fase F' }, { name: 'Kelas 12', icon: '💫', fase: 'Fase F' }, { name: 'UTBK', icon: '🎓', fase: 'Simulasi' }]),
        games: ['grafik-fungsi', 'sma-calc', 'sma-vector', 'sma-chem', 'sma-gene', 'sma-econ', 'utbk-sim', 'flashcard-3d', 'karier'],
        regions: [
          { name: 'Observatorium Matematika 🔭', games: ['grafik-fungsi', 'sma-calc'] },
          { name: 'Lab Sains Rupa 🧬', games: ['sma-vector', 'sma-chem', 'sma-gene'] },
          { name: 'Bank & Bursa 💰', games: ['sma-econ'] },
          { name: 'Menara UTBK 🎓', games: ['utbk-sim', 'flashcard-3d'] },
          { name: 'Jalan Karier 🧭', games: ['karier'] },
        ] },
    ];
    BS.WORLDS.forEach((w) => {
      w.topicCount = 0; w.qCount = 0;
      w.grades.forEach((g) => {
        g.topics = w.id === 'sd'
          ? [...sd13.topics, ...sd46.topics].filter((t) => t.grade === g.id)
          : (w.id === 'tk' ? tk.topics : w.id === 'smp' ? smp.topics : sma.topics).filter((t) => t.grade === g.id);
        w.topicCount += g.topics.length;
        w.qCount += (qByGrade[g.id] || []).length;
      });
      w.games.forEach((gid) => { const g = BS.GAMES && BS.GAMES[gid]; if (g) g.world = w.id; });
    });
    BS.topicsOf = (worldId, gradeId, subjectId) => {
      const w = BS.WORLDS.find((x) => x.id === worldId); if (!w) return [];
      const g = w.grades.find((x) => x.id === gradeId); if (!g) return [];
      return subjectId ? g.topics.filter((t) => t.subject === subjectId) : g.topics;
    };
    BS.subjectsOf = (worldId, gradeId) => {
      const seen = new Map();
      BS.topicsOf(worldId, gradeId).forEach((t) => {
        if (!seen.has(t.subject)) seen.set(t.subject, { id: t.subject, ...BS.subjectMeta(t.subject), count: 0 });
        seen.get(t.subject).count++;
      });
      return [...seen.values()];
    };
    BS.topicLabel = (t) => {
      const w = BS.WORLDS.find((x) => x.grades.some((g) => g.id === t.grade));
      const g = w && w.grades.find((g) => g.id === t.grade);
      return `${w ? w.name : ''} · ${g ? g.name : t.grade} · ${BS.subjectMeta(t.subject).name}`;
    };
    BS.siblings = (topicId) => {
      const t = map[topicId]; if (!t) return [];
      return BS.topicsOf(BS.WORLDS.find((w) => w.grades.some((g) => g.id === t.grade))?.id, t.grade, t.subject).map((x) => x.id);
    };
  })();

  /* ============================================================
     2. STATE & GAMIFIKASI
     ============================================================ */
  const KEY = 'belajarseru_v2';
  const today = () => new Date().toISOString().slice(0, 10);
  const defState = () => ({
    name: '', avatar: '🦊', xp: 0, coins: 0, streak: 0, lastDay: '',
    badges: [], seenMateri: [], playLog: {}, typingBest: 0,
    missions: { date: '', list: [], progress: {} },
    stats: { answered: 0, correct: 0, quizzes: 0, games: 0, byTopic: {}, utbk: { history: [] } },
    screenDays: {},
  });
  BS.S = (() => {
    try { return Object.assign(defState(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return defState(); }
  })();
  BS.save = () => { try { localStorage.setItem(KEY, JSON.stringify(BS.S)); } catch (e) {} };

  BS.S.screenDays[today()] = true;
  const yest = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };
  if (BS.S.lastDay !== today()) {
    BS.S.streak = BS.S.lastDay === yest() ? (BS.S.streak || 0) + 1 : 1;
    BS.S.lastDay = today();
    if (BS.S.streak >= 3) BS.award('streak-3');
    if (BS.S.streak >= 7) BS.award('streak-7');
  }
  BS.save();

  const TITLES = ['Pemula Baru', 'Penjelajah Kecil', 'Pengumpul Bintang', 'Pemburu Ilmu', 'Ahli Kutu Buku', 'Master Cerdas', 'Juara Kelas', 'Maestro Pengetahuan', 'Legenda Sekolah', 'Guru Muda Pipo'];
  BS.level = () => {
    let lv = 1, need = 100, base = 0;
    while (BS.S.xp >= base + need) { base += need; lv++; need = Math.round(need * 1.35); }
    return { lv, title: TITLES[Math.min(lv - 1, TITLES.length - 1)], pct: Math.min(100, Math.round((BS.S.xp - base) / need * 100)), need: base + need };
  };

  BS.addXP = function (xp, coins, fx) {
    BS.S.xp += xp; BS.S.coins += coins;
    BS.toast(`⭐ +${xp} XP  🪙 +${coins} koin`, 'reward');
    BS.checkMissions('xp');
    BS.save(); BS.refreshTop();
    const lv = BS.level();
    if (lv.lv >= 5) BS.award('level-5');
    if (lv.lv >= 10) BS.award('level-10');
  };

  BS.BADGES = [
    { id: 'first-materi', icon: '📖', name: 'Langkah Pertama', how: 'Baca materi pertamamu' },
    { id: 'first-quiz', icon: '✏️', name: 'Perintis Latihan', how: 'Selesaikan 1 latihan' },
    { id: 'quiz-10', icon: '📝', name: 'Ahli Latihan', how: 'Selesaikan 10 latihan' },
    { id: 'game-5', icon: '🎮', name: 'Pemain Rajin', how: 'Main 5 game edukatif' },
    { id: 'streak-3', icon: '🔥', name: 'Konsisten', how: 'Belajar 3 hari beruntun' },
    { id: 'streak-7', icon: '🌟', name: 'Juara Mingguan', how: 'Belajar 7 hari beruntun' },
    { id: 'combo-5', icon: '⚡', name: 'Combo Master', how: '5 benar beruntun' },
    { id: 'coins-100', icon: '🪙', name: 'Kolektor Koin', how: 'Kumpulkan 100 koin' },
    { id: 'coins-500', icon: '💰', name: 'Taipan Koin', how: 'Kumpulkan 500 koin' },
    { id: 'level-5', icon: '🚀', name: 'Naik Kelas', how: 'Capai Level 5' },
    { id: 'level-10', icon: '👑', name: 'Legenda Belajar', how: 'Capai Level 10' },
    { id: 'perfect', icon: '💯', name: 'Sempurna', how: 'Skor 100% di latihan' },
    { id: 'tk-master', icon: '🧸', name: 'Master TK', how: 'Kuasai semua topik TK' },
    { id: 'sd-master', icon: '🎒', name: 'Master SD', how: 'Kuasai semua topik SD' },
    { id: 'smp-master', icon: '🎓', name: 'Master SMP', how: 'Kuasai semua topik SMP' },
    { id: 'utbk-try', icon: '🎯', name: 'Pemberani UTBK', how: 'Selesaikan simulator UTBK' },
  ];
  BS.award = function (id) {
    if (BS.S.badges.includes(id)) return;
    const b = BS.BADGES.find((x) => x.id === id); if (!b) return;
    BS.S.badges.push(id); BS.save();
    BS.toast(`🎖️ Lencana baru: ${b.icon} ${b.name}!`, 'reward');
    BS.sound('fanfare'); BS.fx.confetti(40);
  };

  /* ---- misi harian ---- */
  const MISSION_POOL = [
    { id: 'm2quiz', icon: '✏️', label: 'Selesaikan 2 latihan', target: 2, type: 'quiz' },
    { id: 'm1materi', icon: '📚', label: 'Baca 1 materi baru', target: 1, type: 'materi' },
    { id: 'm1game', icon: '🎮', label: 'Mainkan 1 game', target: 1, type: 'game' },
    { id: 'm30xp', icon: '⭐', label: 'Kumpulkan 30 XP', target: 30, type: 'xp' },
    { id: 'm10correct', icon: '✅', label: 'Jawab benar 10 soal', target: 10, type: 'correct' },
    { id: 'mcombo', icon: '🔥', label: 'Capai combo x3', target: 1, type: 'combo' },
    { id: 'm80', icon: '🌟', label: 'Raih skor ≥ 80%', target: 1, type: 'score80' },
    { id: 'm3topics', icon: '🧭', label: 'Latih 3 topik berbeda', target: 3, type: 'topics' },
  ];
  BS.dailyMissions = function () {
    const t = today();
    if (BS.S.missions.date !== t) {
      const picks = MISSION_POOL.slice().sort(() => Math.random() - 0.5).slice(0, 4);
      BS.S.missions = { date: t, list: picks.map((p) => p.id), progress: {}, done: {} };
      BS.save();
    }
    return {
      list: BS.S.missions.list.map((id) => {
        const p = MISSION_POOL.find((m) => m.id === id);
        return { ...p, progress: BS.S.missions.progress[id] || 0, done: (BS.S.missions.progress[id] || 0) >= p.target };
      }),
    };
  };
  BS.checkMissions = function (type, extra) {
    const M = BS.S.missions; if (!M || !M.list) return;
    M.list.forEach((id) => {
      const m = MISSION_POOL.find((x) => x.id === id);
      if (!m || m.type !== type) return;
      if (type === 'combo') { if (extra && extra.combo >= 3) M.progress[id] = 1; return; }
      if (type === 'score80') { if (extra && extra.pct >= 80) M.progress[id] = 1; return; }
      if (type === 'topics') {
        M.progress[id] = new Set([...(M.topicsDone || []), extra.topic]).size;
        M.topicsDone = [...new Set([...(M.topicsDone || []), extra.topic])];
        return;
      }
      if (type === 'xp') { M.progress[id] = BS.S.xp - (M.xpBase ?? (M.xpBase = BS.S.xp)) + (M.progress[id] || 0); M.xpBase = BS.S.xp; return; }
      M.progress[id] = (M.progress[id] || 0) + 1;
    });
    BS.save();
  };

  /* ---- rekam aktivitas ---- */
  BS.recordAnswer = function (topicId, ok) {
    BS.S.stats.answered++;
    if (ok) { BS.S.stats.correct++; BS.checkMissions('correct'); }
    const bt = BS.S.stats.byTopic[topicId] = BS.S.stats.byTopic[topicId] || { seen: 0, correct: 0 };
    bt.seen++; if (ok) bt.correct++;
    BS.checkMissions('topics', { topic: topicId });
    BS.save();
  };
  BS.recordQuiz = function (topicId, correct, n, pct) {
    BS.S.stats.quizzes++;
    BS.checkMissions('quiz');
    BS.checkMissions('score80', { pct });
    BS.award('first-quiz');
    if (BS.S.stats.quizzes >= 10) BS.award('quiz-10');
    if (BS.S.coins >= 100) BS.award('coins-100');
    if (BS.S.coins >= 500) BS.award('coins-500');
    BS.checkWorldMasters();
    BS.save(); BS.refreshTop();
  };
  BS.markMateriRead = function (topicId) {
    if (!BS.S.seenMateri.includes(topicId)) {
      BS.S.seenMateri.push(topicId);
      BS.checkMissions('materi');
      BS.award('first-materi');
      BS.save();
    }
  };
  BS.recordUTBK = function (per, score) {
    BS.S.stats.utbk.history.push({ date: today(), score });
    BS.S.stats.utbk.last = { per, score, date: today() };
    BS.save();
  };
  BS.stats = function (kind) {
    if (kind === 'game') BS.S.stats.games++;
    if (BS.S.stats.games >= 5) BS.award('game-5');
    BS.save();
  };
  BS.gameDone = function (gameId, pct) {
    BS.stats('game');
    BS.checkMissions('game');
    if (BS.S.playLog) BS.S.playLog[gameId] = today();
    BS.addXP(Math.round(10 + (pct || 0) / 2), 5, null);
  };
  /* kemiringan deterministik per-id utk bento playful (ui-spec 3-C) */
  BS.tiltVar = function (id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % 997; return (((h % 9) - 4) / 2).toFixed(1); };
  BS.checkWorldMasters = function () {
    const worlds = { tk: 'tk-master', sd: 'sd-master', smp: 'smp-master' };
    Object.entries(worlds).forEach(([wid, badge]) => {
      const w = BS.WORLDS.find((x) => x.id === wid);
      if (w.topicCount && w.grades.every((g) => g.topics.every((t) => BS.mastery(t.id) >= 2))) BS.award(badge);
    });
  };
  BS.mastery = function (topicId) {
    const st = BS.S.stats.byTopic[topicId];
    if (!st || !st.seen) return 0;
    const pct = st.correct / st.seen;
    return pct >= 0.85 ? 3 : pct >= 0.65 ? 2 : pct >= 0.4 ? 1 : 0;
  };
  BS.worldProgress = function (worldId) {
    const w = BS.WORLDS.find((x) => x.id === worldId); if (!w || !w.topicCount) return 0;
    let sum = 0;
    w.grades.forEach((g) => g.topics.forEach((t) => { sum += BS.mastery(t.id); }));
    return Math.round((sum / (w.topicCount * 3)) * 100);
  };
  BS.weakTopics = function (limit) {
    return Object.entries(BS.S.stats.byTopic)
      .filter(([id, st]) => st.seen >= 4 && st.correct / st.seen < 0.6 && BS.topicById(id))
      .sort((a, b) => (a[1].correct / a[1].seen) - (b[1].correct / b[1].seen))
      .slice(0, limit || 3)
      .map(([id]) => BS.topicById(id));
  };
  BS.resetAll = function () {
    localStorage.removeItem(KEY);
    BS.S = defState();
    BS.S.screenDays[today()] = true;
    BS.save();
    BS.toast('Progres direset. Selamat memulai petualangan baru! 🌱');
    BS.rerender();
  };

  /* ============================================================
     3. PELUNCUR KUIS
     ============================================================ */
  BS.startTopicQuiz = function (topicId) {
    const t = BS.topicById(topicId);
    const qs = BS.questionsByTopic[topicId] || [];
    if (!t || !qs.length) { BS.toast('Soal topik ini sedang istirahat 😅'); return; }
    BS.runQuiz({ title: t.name, icon: t.icon, questions: qs, topic: topicId, exitTo: '#/m/' + topicId });
  };
  BS.startGenQuiz = function (genId) {
    const t = BS.allTopics().find((x) => x.gen === genId);
    const qs = [];
    for (let i = 0; i < 8; i++) {
      const q = BS.makeGenQuestion(genId);
      if (q) qs.push(q);
    }
    if (!qs.length) { BS.toast('Generator sedang sibuk, coba lagi ya!'); return; }
    BS.runQuiz({ title: (t ? t.name : 'Latihan') + ' — Tak Terbatas ♾️', icon: '♾️', questions: qs, topic: t ? t.id : null, exitTo: t ? '#/m/' + t.id : '#/home', silentFx: true });
  };
  BS.startMixedQuiz = function (worldId, gradeId) {
    const qs = BS.questionsOfGrade(gradeId);
    if (!qs.length) { BS.toast('Belum ada soal untuk kelas ini 😊'); return; }
    const w = BS.WORLDS.find((x) => x.id === worldId);
    BS.runQuiz({ title: `Latihan Campuran ${w.name}`, icon: '🎲', questions: qs, exitTo: `#/w/${worldId}/${gradeId}` });
  };
  BS.openGame = function (id, replay) {
    const g = BS.GAMES[id];
    if (!g) { BS.toast('Game tidak ditemukan 🤔'); return; }
    if (replay) { BS.renderGameInto(id); return; }
    location.hash = '#/game/' + id;
  };
  BS.renderGameInto = function (id) {
    const g = BS.GAMES[id];
    const app = document.getElementById('app');
    g.render(app);
    const ex = app.querySelector('[data-exit]');
    if (ex && !ex.dataset.bound) ex.onclick = () => { location.hash = '#/petualangan'; };
    app.dataset.world = g.world || '';
  };

  /* ============================================================
     4. SUARA (WebAudio) & EFEK
     ============================================================ */
  let actx = null;
  const soundOn = () => localStorage.getItem('bs_mute') !== '1';
  function tone(freq, dur, type, gain, when) {
    if (!soundOn()) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.12, actx.currentTime + (when || 0));
      g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + (when || 0) + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(actx.currentTime + (when || 0)); o.stop(actx.currentTime + (when || 0) + dur + 0.05);
    } catch (e) {}
  }
  BS.sound = function (name) {
    if (name === 'correct') { tone(523, .12, 'sine', .14); tone(659, .12, 'sine', .14, .1); tone(784, .2, 'sine', .14, .2); }
    else if (name === 'wrong') { tone(196, .25, 'sawtooth', .08); tone(147, .3, 'sawtooth', .08, .12); }
    else if (name === 'pop') tone(660, .07, 'triangle', .1);
    else if (name === 'coin') { tone(988, .08, 'square', .06); tone(1319, .16, 'square', .06, .08); }
    else if (name === 'fanfare') { [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, 'triangle', .12, i * .13)); }
  };
  BS.fx = {
    confetti(n) {
      const layer = document.getElementById('confetti-layer');
      const colors = ['#FF6B5E', '#FFC53D', '#2EC77E', '#38A9F5', '#9B5CF6', '#FF8FAB'];
      for (let i = 0; i < (n || 40); i++) {
        const c = document.createElement('i');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = -20 + 'px';
        c.style.background = colors[i % colors.length];
        c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
        c.style.transform = `rotate(${Math.random() * 360}deg)`;
        layer.appendChild(c);
        setTimeout(() => c.remove(), 3400);
      }
    },
    xpBurst(txt) {
      const el = document.createElement('div');
      el.className = 'xp-burst'; el.textContent = txt;
      el.style.left = (45 + Math.random() * 10) + 'vw';
      el.style.top = '38vh';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    },
  };

  /* ---- TTS ---- */
  BS.speak = function (text) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'id-ID'; u.rate = 0.92; u.pitch = 1.1;
      const v = speechSynthesis.getVoices().find((v) => /id[-_]ID|Indones/i.test(v.lang + v.name));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { BS.toast('Fitur suara tidak tersedia di browser ini'); }
  };
  BS.speakTopic = function (t, btn) {
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); btn.textContent = '🔊 Bacakan'; return; }
    const m = t.materi || {};
    const text = [
      t.name + '.',
      (t.objectives || []).join('. ') + '.',
      'Ide inti. ' + (m.core || ''),
      'Coba bayangkan. ' + (m.intuition || ''),
      'Penjelasan. ' + (m.details || []).join('. '),
      'Contoh. ' + (m.example ? m.example.q + '. ' + (m.example.steps || []).join('. ') : ''),
      'Tips. ' + (m.tip || ''),
    ].filter(Boolean).join(' ');
    BS.speak(text);
    btn.textContent = '⏹️ Stop';
    const iv = setInterval(() => { if (!speechSynthesis.speaking) { clearInterval(iv); btn.textContent = '🔊 Bacakan'; } }, 500);
  };

  /* ---- util UI ---- */
  BS.toast = function (msg, cls) {
    const layer = document.getElementById('toast-layer');
    const t = document.createElement('div');
    t.className = 'toast ' + (cls || '');
    t.textContent = msg;
    layer.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  };
  BS.modal = function (html, onbind) {
    BS.closeModal();
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal">${html}</div>`;
    document.body.appendChild(back);
    back.addEventListener('click', (e) => { if (e.target === back) BS.closeModal(); });
    if (onbind) onbind();
    back.querySelectorAll('[data-md-close]').forEach((b) => { b.onclick = BS.closeModal; });
  };
  BS.closeModal = function () { document.querySelectorAll('.modal-back').forEach((m) => m.remove()); };
  BS.scrollTop = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  BS.refreshTop = function () {
    document.querySelector('#stat-streak b').textContent = BS.S.streak;
    document.querySelector('#stat-coins b').textContent = BS.S.coins;
    document.querySelector('#stat-xp b').textContent = BS.S.xp;
  };
  BS.resetAll = BS.resetAll; // (didefinisikan di atas)

  /* ============================================================
     5. ROUTER
     ============================================================ */
  let currentHash = '';
  BS.rerender = function () { route(location.hash || '#/home', true); };
  function route(hash, force) {
    if (hash === currentHash && !force) return;
    currentHash = hash;
    BS.closeModal();
    speechSynthesis && speechSynthesis.cancel && speechSynthesis.cancel();
    const app = document.getElementById('app');
    const parts = (hash.replace(/^#\/?/, '') || 'home').split('/');
    const nav = document.querySelectorAll('.bottomnav a');
    nav.forEach((a) => { a.classList.remove('on'); a.removeAttribute('aria-current'); });
    const setNav = (k) => { const a = document.querySelector(`.bottomnav a[data-nav="${k}"]`); if (a) { a.classList.add('on'); a.setAttribute('aria-current', 'page'); } };

    let fn = null, bind = null, navKey = 'home';
    try {
      if (parts[0] === '' || parts[0] === 'home') { fn = BS.views.home; bind = BS.bind.home; navKey = 'home'; }
      else if (parts[0] === 'petualangan') { fn = BS.views.petualangan; bind = BS.bind.petualangan; navKey = 'petualangan'; }
      else if (parts[0] === 'belajar') { fn = () => BS.views.belajar(parts[1]); bind = BS.bind.belajar; navKey = 'belajar'; }
      else if (parts[0] === 'w') { fn = () => BS.views.world(parts[1], parts[2], parts[3]); bind = () => BS.bind.world(parts[1], parts[2], parts[3]); navKey = 'petualangan'; }
      else if (parts[0] === 'm' && parts[1]) { fn = () => BS.views.materi(parts[1]); bind = () => BS.bind.materi(parts[1]); navKey = 'belajar'; }
      else if (parts[0] === 'game' && parts[1]) {
        const g = BS.GAMES[parts[1]];
        if (g) { app.innerHTML = ''; g.render(app); const ex = app.querySelector('[data-exit]'); if (ex && !ex.dataset.bound) ex.onclick = () => { location.hash = '#/petualangan'; }; app.dataset.world = g.world || ''; setNav('petualangan'); BS.scrollTop(); return; }
        fn = BS.views.petualangan; bind = BS.bind.petualangan;
      }
      else if (parts[0] === 'profil') { fn = BS.views.profil; bind = BS.bind.profil; navKey = 'profil'; }
      else if (parts[0] === 'ortu') { fn = BS.views.ortu; bind = BS.bind.ortu; navKey = 'ortu'; }
      if (!fn) { fn = BS.views.home; bind = BS.bind.home; }
      app.innerHTML = fn();
      if (bind) bind(parts[1], parts[2], parts[3]);
      app.dataset.world = parts[0] === 'w' ? (parts[1] || '') : '';
      setNav(navKey);
      BS.scrollTop();
      BS.refreshTop();
    } catch (e) {
      console.error('route error', e);
      app.innerHTML = `<div class="view" style="text-align:center;padding:60px 0">
        <span style="font-size:60px">🦉</span>
        <h2>Ups, ada yang aneh!</h2>
        <p style="font-weight:700">Pipo tersandung. Coba kembali ke beranda ya.</p>
        <a class="btn btn-coral btn-big" href="#/home">🏠 Kembali ke Beranda</a></div>`;
    }
  }

  /* ============================================================
     6. BOOT
     ============================================================ */
  function boot() {
    BS.initDoodles();
    window.addEventListener('hashchange', () => route(location.hash));
    const soundBtn = document.getElementById('btn-sound');
    const paintSound = () => { soundBtn.textContent = soundOn() ? '🔊' : '🔇'; };
    soundBtn.onclick = () => {
      localStorage.setItem('bs_mute', soundOn() ? '1' : '0');
      paintSound(); if (soundOn()) BS.sound('pop');
    };
    paintSound();
    const s = BS.S;
    if (!s.name) {
      setTimeout(() => {
        BS.modal(`
          <div style="text-align:center">
            <span style="font-size:54px">🦉</span>
            <h2>Halo, Petualang!</h2>
            <p style="font-weight:600">Aku <b>Pipo</b>, pemandu belajarmu. Siapa namamu?</p>
            <input class="name-input" id="boot-name" maxlength="18" placeholder="Namamu..." style="margin:8px auto">
            <div style="margin-top:8px">
              <p style="font-weight:700;font-size:.9rem">Pilih avatarmu:</p>
              <div class="avatar-picker" id="boot-av">
                ${['🦊', '🐼', '🐯', '🦁', '🦄', '🐬'].map((a, i) => `<button class="av-opt ${i === 0 ? 'on' : ''}" data-a="${a}">${a}</button>`).join('')}
              </div>
            </div>
            <button class="btn btn-coral btn-big" id="boot-go" style="margin-top:14px">🚀 Mulai Petualangan!</button>
          </div>`, () => {
          let av = '🦊';
          document.querySelectorAll('#boot-av .av-opt').forEach((b) => {
            b.onclick = () => { document.querySelectorAll('#boot-av .av-opt').forEach((x) => x.classList.remove('on')); b.classList.add('on'); av = b.dataset.a; BS.sound('pop'); };
          });
          document.getElementById('boot-go').onclick = () => {
            BS.S.name = document.getElementById('boot-name').value.trim() || 'Petualang';
            BS.S.avatar = av;
            BS.save(); BS.closeModal(); BS.sound('fanfare'); BS.fx.confetti(50);
            BS.toast(`Selamat datang, ${BS.S.name}! 🎉`, 'reward');
          };
        });
      }, 600);
    }
    route(location.hash || '#/home');
    console.log('%c🦉 BelajarSeru! 3D siap —', 'font-size:14px;font-weight:bold', BS.allTopics().length, 'topik,', Object.values(BS.questionsByTopic).flat().length, 'soal,', Object.keys(BS.GAMES).length, 'game');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
