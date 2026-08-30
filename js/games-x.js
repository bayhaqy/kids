/* ============================================================
   BelajarSeru! 3D — games-x.js
   Fitur fleksibilitas: "🎲 Kejutkan Aku!" (picker pintar) &
   "🧩 Bikin Kuis Sendiri" (builder di atas bank 1.096 soal).
   Dimuat SEBELUM app.js.
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- pemetaan topik utk 14 game lama (utk bobot kejutan) ---------- */
  const OLD_TOPICS = {
    'tebak-huruf': ['tk-huruf'], 'hitung-mainan': ['tk-angka'], 'warna-bentuk': ['tk-warna'],
    'memory-hewan': ['tk-hewan'], 'mtk-petualangan': ['sd1-mtk-tambah', 'sd2-mtk-kali', 'sd3-mtk-pecahan', 'sd6-mtk-bulat'],
    'robot-koding': ['sd1-mtk-bangun'], 'tebak-kata': ['sd2-bindo-sinonim', 'sd3-bindo-pokok'],
    'lab-lontaran': ['smp8-ipa-gaya'], 'lab-ph': ['smp7-ipa-zat'], 'kuis-kilat': [],
    'utbk-sim': ['utbk-pu', 'utbk-ppu', 'utbk-pmm', 'utbk-lbi', 'utbk-lbing'], 'flashcard-3d': [],
    'grafik-fungsi': ['smp8-mtk-fungsi'], 'karier': [],
  };

  /* ============================================================
     🎲 KEJUTKAN AKU! — picker acak pintar lintas semua game
     ============================================================ */
  BS.surprise = function (worldId) {
    const weak = BS.weakTopics(5).map((t) => t.id);
    const last = Object.entries(BS.S.playLog || {}).sort((a, b) => (a[1] < b[1] ? 1 : -1)).slice(0, 2).map((x) => x[0]);
    const today = new Date().toISOString().slice(0, 10);
    const cands = Object.entries(BS.GAMES)
      .filter(([id, g]) => !worldId || g.world === worldId)
      .map(([id, g]) => {
        const topics = g.topics && g.topics.length ? g.topics : (OLD_TOPICS[id] || []);
        const hitWeak = topics.some((t) => weak.includes(t));
        let w = 1;
        if (!(BS.S.playLog || {})[id]) w *= 2;
        if ((BS.S.playLog || {})[id] === today) w *= 0.5;
        if (hitWeak) w *= 2.5;
        return { id, g, w, hitWeak };
      })
      .filter((c) => !last.includes(c.id));
    if (!cands.length) { BS.toast('Mainkan satu game dulu, nanti Pipo kejutkan lagi 🎲'); return; }
    /* aturan 30%: paksa kandidat bertopik lemah bila ada */
    let pool = cands;
    if (Math.random() < 0.3 && weak.length) {
      const weakPool = cands.filter((c) => c.hitWeak);
      if (weakPool.length) pool = weakPool;
    }
    let roll = Math.random() * pool.reduce((s, c) => s + c.w, 0);
    let chosen = pool[0];
    for (const c of pool) { roll -= c.w; if (roll <= 0) { chosen = c; break; } }
    let rerolls = 3;
    function modal() {
      BS.modal(`
        <div style="text-align:center">
          <span style="font-size:52px;display:inline-block;animation:floaty 3s ease-in-out infinite">${chosen.g.icon}</span>
          <h2 style="margin:.1em 0">Pipo pilih untukmu…</h2>
          <h3 style="color:var(--coral-d)">${chosen.g.name}</h3>
          <p style="font-weight:700;color:var(--ink-soft)">${chosen.g.desc || ''}</p>
          ${chosen.hitWeak ? '<span class="stick-badge leaf">🔥 Latihan topik lemahmu!</span>' : ''}
          <div class="btn-row" style="justify-content:center;margin-top:14px">
            <button class="btn btn-coral btn-big" id="sp-go">🎮 Main!</button>
            <button class="btn btn-sun btn-big" id="sp-again">🎲 Acak lagi</button>
            <button class="btn btn-ghost btn-big" data-md-close>Batal</button>
          </div>
        </div>`, () => {
        document.getElementById('sp-go').onclick = () => { BS.closeModal(); BS.sound('pop'); BS.fx.confetti(12); BS.openGame(chosen.id); };
        document.getElementById('sp-again').onclick = () => {
          if (rerolls-- <= 0) { BS.toast('Kejutannya sudah tegas: main itu! 😄'); return; }
          BS.sound('pop');
          roll = Math.random() * pool.reduce((s, c) => s + c.w, 0);
          for (const c of pool) { roll -= c.w; if (roll <= 0) { chosen = c; break; } }
          modal();
        };
      });
    }
    BS.sound('pop');
    modal();
  };

  /* ============================================================
     🧩 BIKIN KUIS SENDIRI — builder 5 langkah di atas bank soal
     ============================================================ */
  BS.customQuiz = function () {
    const saved = BS.S.customQuizCfg;
    let step = 1;
    let worldId = null, gradeId = null, subjectId = null, topicIds = [], count = 10, mode = 'latihan';
    if (saved) { worldId = saved.worldId; gradeId = saved.gradeId; subjectId = saved.subjectId; topicIds = saved.topicIds || []; count = saved.count || 10; mode = saved.mode || 'latihan'; }
    function chip(label, on, attrs) { return `<button class="chip ${on ? 'on' : ''}" ${attrs} style="min-height:44px">${label}</button>`; }
    function modal() {
      const w = BS.WORLDS.find((x) => x.id === worldId);
      const grade = w && w.grades.find((g) => g.id === gradeId);
      const subjects = worldId && gradeId ? BS.subjectsOf(worldId, gradeId) : [];
      const topicList = worldId && gradeId && subjectId ? BS.topicsOf(worldId, gradeId, subjectId) : [];
      const totalQ = topicIds.reduce((s, t) => s + (BS.questionsByTopic[t] || []).length, 0);
      let body = `<div class="chip-row" style="margin-bottom:12px">${[1, 2, 3, 4, 5].map((i) => `<span class="gs-pill ${i <= step ? '' : 'dim'}" style="opacity:${i <= step ? 1 : .45}">${i === 1 ? '1️⃣ Jenjang' : i === 2 ? '2️⃣ Kelas' : i === 3 ? '3️⃣ Mapel' : i === 4 ? '4️⃣ Topik' : '5️⃣ Jumlah'}</span>`).join('')}</div>`;
      if (step === 1) {
        body += `<div class="chip-row">${BS.WORLDS.map((x) => chip(`${x.icon} ${x.name}`, x.id === worldId, `data-w="${x.id}"`)).join('')}</div>`;
      } else if (step === 2) {
        body += `<div class="chip-row">${w.grades.map((g) => chip(`${g.icon || ''} ${g.name}`, g.id === gradeId, `data-g="${g.id}"`)).join('')}</div>`;
      } else if (step === 3) {
        body += `<div class="chip-row">${subjects.map((s) => chip(`${s.icon} ${s.name} (${s.count})`, s.id === subjectId, `data-s="${s.id}"`)).join('')}</div>`;
        if (!subjects.length) body += `<div class="empty-state" role="status"><span class="empty-owl" aria-hidden="true">🦉</span><p class="empty-bubble">Mapel belum tersedia di kelas ini — coba pilih kelas lain yuk!</p></div>`;
      } else if (step === 4) {
        body += `<p style="font-weight:700">Pilih 1–8 topik (bebas urutan):</p><div class="chip-row">${topicList.map((t) => chip(`${t.icon} ${t.name} · ${(BS.questionsByTopic[t.id] || []).length} soal`, topicIds.includes(t.id), `data-t="${t.id}"`)).join('')}</div>`;
        body += `<div class="btn-row" style="margin-top:10px"><button class="btn btn-sun btn-big" id="cq-auto">✨ Pilih untuk aku</button></div>`;
      } else if (step === 5) {
        body += `<div class="chip-row">${[5, 10, 15].map((n) => chip(`${n} soal`, count === n, `data-n="${n}"`)).join('')}</div>
          <div class="chip-row" style="margin-top:8px">
            ${chip('📖 Latihan — feedback tiap soal', mode === 'latihan', 'data-m="latihan"')}
            ${chip('🔥 Tantangan — soal lebih sulit', mode === 'tantangan', 'data-m="tantangan"')}
          </div>
          <p style="font-weight:800;margin-top:10px">Total soal tersedia: <b>${totalQ}</b></p>`;
        if (!totalQ) body += `<div class="empty-state" role="status"><span class="empty-owl" aria-hidden="true">🦉</span><p class="empty-bubble">Belum ada soal di topik pilihanmu — balik ke langkah 4 dan pilih topik lain ya!</p></div>`;
      }
      const nav = `<div class="btn-row" style="justify-content:space-between;margin-top:14px">
          <button class="btn btn-ghost btn-big" id="cq-back" ${step === 1 ? 'disabled' : ''}>← Mundur</button>
          ${step < 5 ? `<button class="btn btn-coral btn-big" id="cq-next" ${step === 4 && !topicIds.length ? 'disabled' : ''}>Lanjut →</button>`
          : `<button class="btn btn-coral btn-big" id="cq-go" ${!totalQ ? 'disabled' : ''}>🚀 Mulai Kuis Buatanmu!</button>`}
        </div>`;
      BS.modal(`<h2>🧩 Bikin Kuis Sendiri</h2>${body}${nav}`, bind);
    }
    function bind() {
      document.getElementById('cq-back').onclick = () => { if (step > 1) { step--; BS.sound('pop'); modal(); } };
      const next = document.getElementById('cq-next');
      if (next) next.onclick = () => { step++; BS.sound('pop'); modal(); };
      document.querySelectorAll('[data-w]').forEach((b) => { b.onclick = () => { worldId = b.dataset.w; gradeId = null; subjectId = null; topicIds = []; BS.sound('pop'); modal(); }; });
      document.querySelectorAll('[data-g]').forEach((b) => { b.onclick = () => { gradeId = b.dataset.g; subjectId = null; topicIds = []; BS.sound('pop'); modal(); }; });
      document.querySelectorAll('[data-s]').forEach((b) => { b.onclick = () => { subjectId = b.dataset.s; topicIds = []; BS.sound('pop'); modal(); }; });
      document.querySelectorAll('[data-t]').forEach((b) => {
        b.onclick = () => {
          const id = b.dataset.t;
          if (topicIds.includes(id)) topicIds = topicIds.filter((x) => x !== id);
          else if (topicIds.length < 8) topicIds.push(id);
          else { BS.toast('Maksimal 8 topik ya! 😅'); return; }
          BS.sound('pop'); modal();
        };
      });
      const auto = document.getElementById('cq-auto');
      if (auto) auto.onclick = () => {
        const weak = BS.weakTopics(3);
        if (weak.length) topicIds = weak.map((t) => t.id).slice(0, Math.min(3, topicList.length));
        else topicIds = shuffle(topicList).slice(0, 3).map((t) => t.id);
        BS.sound('coin'); BS.toast('Pipo pilihkan topik spesialmu! ✨', 'reward');
        modal();
      };
      document.querySelectorAll('[data-n]').forEach((b) => { b.onclick = () => { count = +b.dataset.n; BS.sound('pop'); modal(); }; });
      document.querySelectorAll('[data-m]').forEach((b) => { b.onclick = () => { mode = b.dataset.m; BS.sound('pop'); modal(); }; });
      const go = document.getElementById('cq-go');
      if (go) go.onclick = () => {
        let qs = topicIds.flatMap((t) => BS.questionsByTopic[t] || []);
        if (mode === 'tantangan') {
          const hard = qs.filter((q) => (q.d || 1) >= 2);
          qs = hard.length >= count ? hard : hard.concat(qs.filter((q) => (q.d || 1) < 2));
        }
        qs = qs.slice().sort(() => Math.random() - 0.5).slice(0, count);
        BS.S.customQuizCfg = { worldId, gradeId, subjectId, topicIds, count, mode };
        BS.save();
        BS.closeModal(); BS.sound('fanfare');
        BS.runQuiz({ title: 'Kuis Buatanmu 🧩', icon: '🧩', questions: qs, exitTo: '#/petualangan', topic: null });
      };
    }
    modal();
  };
})();
