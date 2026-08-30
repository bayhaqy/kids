/* ============================================================
   BelajarSeru! 3D — views.js
   Semua tampilan: Beranda, Petualangan, Dunia, Materi, Profil,
   Dashboard Ortu. Data & state disediakan oleh app.js.
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  BS.views = {};
  BS.bind = BS.bind || {};

  /* ============ BERANDA ============ */
  BS.views.home = function () {
    const S = BS.S;
    const weak = BS.weakTopics(3);
    const misi = BS.dailyMissions();
    return `
    <div class="view">
      <section class="hero" id="hero-box">
        <canvas id="hero-canvas"></canvas>
        <span class="hero-hint">👆 geser untuk memutar 3D</span>
        <div class="hero-overlay">
          <h1 class="hero-title">Ayo Berpetualang Belajar bareng <span style="color:var(--coral)">Pipo</span> si Burung Hantu! 🦉</h1>
          <span class="hero-sub">Materi lengkap TK • SD • SMP • SMA sesuai Kurikulum Merdeka</span>
          <div class="hero-cta">
            <a class="btn btn-coral btn-big" href="#/petualangan">🚀 Mulai Petualangan</a>
            <a class="btn btn-sky btn-big" href="#/belajar">📚 Baca Materi</a>
          </div>
          <div class="hero-cta" style="margin-top:8px">
            <button class="btn btn-surprise btn-big" id="btn-surprise">🎲 Kejutkan Aku!</button>
            <button class="btn btn-grape btn-big" id="btn-custom-quiz">🧩 Bikin Kuis Sendiri</button>
          </div>
        </div>
      </section>

      <div class="section-title"><span class="emoji">🗺️</span><h2>Pilih Duniamu</h2><span class="sub">4 dunia, 1 petualangan</span></div>
      ${(() => {
        const ranked = BS.WORLDS.map((w) => ({ w, p: BS.worldProgress(w.id) })).sort((a, b) => b.p - a.p);
        return `<div class="bento world-bento">${ranked.map(({ w, p }, i) => `
          <a class="b-card world b-${i === 0 ? 'hero' : 'mini'} ${w.id}c" href="#/w/${w.id}" style="--i:${i};--tilt:${BS.tiltVar('w-' + w.id)}deg">
            <span class="wc-ico">${w.icon}</span>
            <h3>${w.name}</h3>
            ${i === 0 ? `<p>${w.tagline}</p>` : ''}
            <div class="wc-meta"><span class="sticker">${w.topicCount} topik</span><span class="sticker sun">${w.games.length} game</span></div>
            <div class="wc-progress" style="width:${p}%"></div>
          </a>`).join('')}</div>`;
      })()}

      <div class="section-title"><span class="emoji">🎯</span><h2>Misi Hari Ini</h2><span class="sub">reset tiap pagi</span></div>
      <div class="missions">
        ${misi.list.map((m, i) => `
          <div class="mission ${m.done ? 'done' : ''}">
            <span class="m-ico">${m.icon}</span>
            <div class="m-txt"><b>${m.label}</b>
              <div class="m-bar"><i style="width:${Math.min(100, (m.progress / m.target) * 100)}%"></i></div>
            </div>
            <span class="m-check">${m.done ? '✅' : `${Math.min(m.progress, m.target)}/${m.target}`}</span>
          </div>`).join('')}
      </div>

      <div class="section-title"><span class="emoji">📊</span><h2>Statistik Kemajuan</h2></div>
      <div class="statstrip">
        <div class="statbox"><span class="s-ico">⭐</span><b>${S.xp}</b><span>Total XP</span></div>
        <div class="statbox"><span class="s-ico">🏅</span><b>Lv.${BS.level().lv}</b><span>${BS.level().title}</span></div>
        <div class="statbox"><span class="s-ico">✅</span><b>${S.stats.correct}</b><span>Soal Benar</span></div>
        <div class="statbox"><span class="s-ico">🎯</span><b>${S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0}%</b><span>Akurasi</span></div>
        <div class="statbox"><span class="s-ico">🎖️</span><b>${S.badges.length}</b><span>Lencana</span></div>
      </div>

      ${weak.length ? `
      <div class="section-title"><span class="emoji">🔁</span><h2>Ulangi yang Lemah</h2><span class="sub">spaced repetition ala tutor</span></div>
      <div class="weak-list">
        ${weak.map((t) => `
          <div class="weak-item"><span class="w-ico">${t.icon}</span><b>${t.name}</b>
            <button class="btn btn-pink" data-quiz="${t.id}">✏️ Latihan Ulang</button>
          </div>`).join('')}
      </div>` : ''}

      <div class="section-title"><span class="emoji">👨‍👩‍👧</span><h2>Untuk Orang Tua & Guru</h2></div>
      <div class="card" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <span style="font-size:34px">📋</span>
        <p style="flex:1;min-width:200px;margin:0"><b>Pantau perkembangan belajar</b> — lihat penguasaan materi, statistik latihan, dan tips pendampingan.</p>
        <a class="btn btn-grape" href="#/ortu">Buka Dashboard</a>
      </div>
    </div>`;
  };

  BS.bind.home = function () {
    const ok = BS.buildHeroScene(document.getElementById('hero-canvas'));
    if (!ok) document.getElementById('hero-box').style.background = 'linear-gradient(#8ED8FF,#DFF8E8)';
    document.querySelectorAll('[data-quiz]').forEach((b) => { b.onclick = () => BS.startTopicQuiz(b.dataset.quiz); });
    const sb = document.getElementById('btn-surprise');
    if (sb) sb.onclick = () => BS.surprise();
    const cq = document.getElementById('btn-custom-quiz');
    if (cq) cq.onclick = () => BS.customQuiz();
  };

  /* ============ PETUALANGAN (hub) ============ */
  BS.views.petualangan = function () {
    return `
    <div class="view">
      <h1 style="margin-top:18px">🗺️ Peta Petualangan</h1>
      <p style="font-weight:700;color:var(--ink-soft)">Jelajahi 4 dunia. Selesaikan materi & latihan untuk membuka semua bintang!</p>
      <div class="bento hub-bento">
        ${BS.WORLDS.map((w, i) => {
          const p = BS.worldProgress(w.id);
          return `
          <a class="b-card b-${i === 0 ? 'hero' : 'mini'} hub" href="#/w/${w.id}" style="--i:${i};--tilt:${BS.tiltVar('h-' + w.id)}deg">
            <span class="h-ico" style="background:${w.color}22">${w.icon}</span>
            <h3>${w.name} <span class="sticker sky">${w.fase}</span></h3>
            <p>${w.tagline}</p>
            <div class="h-progress"><i style="width:${p}%"></i></div>
            <p style="margin-top:6px">✨ ${p}% selesai · ${w.topicCount} topik · ${w.games.length} game</p>
          </a>`;
        }).join('')}
      </div>
      <div class="section-title"><span class="emoji">🕹️</span><h2>Semua Game Edukatif</h2><span class="sub">${Object.keys(BS.GAMES).length} game — bebas pilih, tanpa urutan!</span></div>
      <div class="game-toolbar">
        <div class="chip-filter" role="group" aria-label="Filter game" id="game-filter"></div>
        <div class="btn-row">
          <button class="btn btn-surprise" id="btn-surprise">🎲 Kejutkan Aku!</button>
          <button class="btn btn-grape" id="btn-custom-quiz">🧩 Bikin Kuis</button>
        </div>
      </div>
      <div class="bento games-bento" id="games-bento">
        ${Object.entries(BS.GAMES).map(([id, g], i) => {
          const SIZES = ['hero', 'wide', 'mini', 'mini', 'tall', 'mini', 'wide', 'mini', 'mini'];
          const size = SIZES[i % SIZES.length];
          return `
          <article class="b-card b-${size} game-card" data-tags="${(g.tags || []).join(' ')}" style="--i:${Math.min(i, 12)};--tilt:${BS.tiltVar(id)}deg">
            ${id === 'utbk-sim' || id === 'smp-cell' ? '<span class="stick-badge">🔥 Favorit</span>' : ''}
            <span class="h-ico gico">${g.icon}</span>
            <h3>${g.name}</h3>
            <span class="sticker ${g.sticker || 'sun'}">${g.worldName}</span>
            <p class="t-obj">${g.desc}</p>
            <div class="t-actions"><button class="btn btn-leaf" data-game="${id}">🎮 Main</button></div>
          </article>`;
        }).join('')}
      </div>
    </div>`;
  };
  BS.bind.petualangan = function () {
    document.querySelectorAll('[data-game]').forEach((b) => { b.onclick = () => BS.openGame(b.dataset.game); });
    const sb = document.getElementById('btn-surprise');
    if (sb) sb.onclick = () => BS.surprise();
    const cq = document.getElementById('btn-custom-quiz');
    if (cq) cq.onclick = () => BS.customQuiz();
    /* filter mapel bebas multi-pilih */
    const TAGS = [['semua', '🌈 Semua'], ['umum', '🧸 TK'], ['mtk', '🔢 MTK'], ['bindo', '📖 B.Indo'], ['bing', '🌍 B.Ing'], ['ipas', '🌱 IPAS'], ['ipa', '🔬 IPA'], ['fisika', '⚛️ Fisika'], ['kimia', '🧪 Kimia'], ['biologi', '🧬 Biologi'], ['ips', '🌏 IPS'], ['logika', '🧩 Logika'], ['lintas', '🎯 Lintas']];
    const cards = [...document.querySelectorAll('#games-bento .game-card')];
    const active = new Set(['semua']);
    const wrap = document.getElementById('game-filter');
    if (wrap) {
      wrap.innerHTML = TAGS.map(([k, label]) => {
        const n = k === 'semua' ? cards.length : cards.filter((c) => (c.dataset.tags || '').split(/\s+/).includes(k)).length;
        if (k !== 'semua' && n === 0) return '';
        return `<button class="chip ${k === 'semua' ? 'on' : ''}" aria-pressed="${k === 'semua' ? 'true' : 'false'}" data-tag="${k}">${label} <span class="cnt">${n}</span></button>`;
      }).join('');
      wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-tag]');
        if (!btn) return;
        const tag = btn.dataset.tag;
        BS.sound('pop');
        if (tag === 'semua') { active.clear(); active.add('semua'); }
        else { active.delete('semua'); active.has(tag) ? active.delete(tag) : active.add(tag); if (!active.size) active.add('semua'); }
        wrap.querySelectorAll('.chip').forEach((c) => {
          const on = active.has(c.dataset.tag);
          c.classList.toggle('on', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        let shown = 0;
        cards.forEach((c) => {
          const tags = (c.dataset.tags || '').split(/\s+/);
          const hide = !active.has('semua') && !tags.some((t) => active.has(t));
          c.classList.toggle('hide', hide);
          if (!hide) shown++;
        });
        BS.toast(`${shown} game siap dimainkan 🕹️`);
      });
    }
  };

  /* ============ DUNIA ============ */
  BS.views.world = function (worldId, gradeId, subjectId) {
    const w = BS.WORLDS.find((x) => x.id === worldId);
    if (!w) return BS.views.home();
    gradeId = gradeId || w.grades[0].id;
    const grades = w.grades;
    const subjects = BS.subjectsOf(worldId, gradeId);
    subjectId = subjects.some((s) => s.id === subjectId) ? subjectId : subjects[0]?.id;
    const topics = BS.topicsOf(worldId, gradeId, subjectId);
    const grade = grades.find((g) => g.id === gradeId);

    return `
    <div class="view">
      <section class="world-hero" id="wh-box">
        <canvas id="world-canvas"></canvas>
        <span class="wh-hint">👆 geser untuk memutar 3D</span>
        <div class="wh-label"><span class="wh-badge">${w.icon}</span><span>${w.name} — ${esc(grade.name)} <span style="font-size:.6em">${grade.fase || ''}</span></span></div>
      </section>

      <div class="chip-row" style="margin-top:16px">
        ${grades.map((g) => `<button class="chip ${g.id === gradeId ? 'on' : ''}" data-grade="${g.id}">${g.icon || ''} ${esc(g.name)}</button>`).join('')}
      </div>

      <div class="subject-tabs">
        ${subjects.map((s) => `
          <button class="sub-tab ${s.id === subjectId ? 'on' : ''}" data-sub="${s.id}" style="${s.id === subjectId ? `background:${s.color}` : ''}">
            ${s.icon} ${esc(s.name)} <span class="cnt">${s.count}</span>
          </button>`).join('')}
      </div>

      <div class="topic-grid">
        ${topics.map((t) => {
          const m = BS.mastery(t.id);
          return `
          <div class="topic-card">
            <div class="t-head">
              <span class="t-ico">${t.icon}</span>
              <div style="flex:1">
                <h3>${esc(t.name)}</h3>
                <p class="t-obj">${esc(t.objectives[0] || '')}</p>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="mastery-dots" title="Penguasaan">${[0, 1, 2, 3].map((i) => `<i class="${i < m ? 'got' : ''}"></i>`).join('')}</span>
              <span style="font-size:.75rem;font-weight:800;color:var(--ink-soft)">${m >= 3 ? 'Mahir! 🌟' : m >= 1 ? 'Berjalan' : 'Baru'}</span>
              ${t.gen ? `<span class="sticker grape">∞ soal</span>` : ''}
            </div>
            <div class="t-actions">
              <button class="btn btn-sun" data-materi="${t.id}">📚 Materi</button>
              <button class="btn btn-leaf" data-quiz="${t.id}">✏️ Latihan</button>
              ${t.gen ? `<button class="btn btn-sky" data-gen="${t.gen}" title="Latihan soal baru tiap klik">∞</button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>

      ${topics.length === 0 ? `<div class="empty-state" role="status" style="margin-top:14px">
        <span class="empty-owl" aria-hidden="true">🦉</span>
        <p class="empty-bubble">Mapel ini masih kosong di kelas ini. Coba mapel lain, atau mainkan game dulu yuk!</p>
        <a class="btn btn-coral" href="#/petualangan">🕹️ Lihat Galeri Game</a>
      </div>` : ''}

      <div class="section-title"><span class="emoji">🎮</span><h2>Game ${w.name}</h2><span class="sub">${w.games.length} game · mulai yang mana saja!</span></div>
      ${(w.regions || [{ name: 'Semua Game 🕹️', games: w.games }]).map((rg, ri) => `
      <div class="region-title"><span class="sticker sun">${rg.name}</span><span class="region-line"></span></div>
      <div class="bento region-bento">
        ${rg.games.map((gid, i) => {
          const g = BS.GAMES[gid]; if (!g) return '';
          return `
          <article class="b-card b-${i === 0 && rg.games.length > 1 ? 'wide' : 'mini'} game-card" style="--i:${i};--tilt:${BS.tiltVar(gid)}deg">
            <span class="h-ico gico">${g.icon}</span>
            <h3>${g.name}</h3>
            <p class="t-obj">${g.desc}</p>
            <div class="t-actions"><button class="btn btn-coral" data-game="${gid}">🎮 Main Sekarang</button></div>
          </article>`;
        }).join('')}
      </div>`).join('')}

      <div class="btn-row" style="margin-top:22px;justify-content:center">
        <button class="btn btn-grape btn-big" data-mixed="1">🎲 Latihan Campuran ${esc(grade.name)}</button>
        <button class="btn btn-surprise btn-big" id="btn-surprise">🎲 Kejutkan Aku!</button>
        ${worldId === 'sma' ? `<a class="btn btn-ink btn-big" style="background:var(--ink);color:#fff" href="#/game/utbk-sim">🎓 Simulator UTBK</a>` : ''}
      </div>
    </div>`;
  };

  BS.bind.world = function (worldId, gradeId, subjectId) {
    const w = BS.WORLDS.find((x) => x.id === worldId);
    BS.buildWorldScene(document.getElementById('world-canvas'), worldId);
    if (!w) return;
    document.querySelectorAll('[data-grade]').forEach((b) => { b.onclick = () => { location.hash = `#/w/${worldId}/${b.dataset.grade}`; }; });
    document.querySelectorAll('[data-sub]').forEach((b) => { b.onclick = () => { location.hash = `#/w/${worldId}/${gradeId}/${b.dataset.sub}`; }; });
    document.querySelectorAll('[data-materi]').forEach((b) => { b.onclick = () => { location.hash = '#/m/' + b.dataset.materi; }; });
    document.querySelectorAll('[data-quiz]').forEach((b) => { b.onclick = () => BS.startTopicQuiz(b.dataset.quiz); });
    document.querySelectorAll('[data-gen]').forEach((b) => { b.onclick = () => BS.startGenQuiz(b.dataset.gen); });
    document.querySelectorAll('[data-game]').forEach((b) => { b.onclick = () => BS.openGame(b.dataset.game); });
    document.querySelectorAll('[data-mixed]').forEach((b) => { b.onclick = () => BS.startMixedQuiz(worldId, gradeId); });
    const sb = document.getElementById('btn-surprise');
    if (sb) sb.onclick = () => BS.surprise(worldId);
  };

  /* ============ MATERI ============ */
  BS.views.materi = function (topicId) {
    const t = BS.topicById(topicId);
    if (!t) return BS.views.home();
    const subj = BS.subjectMeta(t.subject);
    const sib = BS.siblings(topicId);
    const i = sib.indexOf(topicId);
    const prev = sib[i - 1], next = sib[i + 1];
    const m = t.materi || {};
    return `
    <div class="view materi-wrap" style="max-width:820px;margin:0 auto">
      <div class="materi-head">
        <span class="m-ico-big">${t.icon}</span>
        <div style="flex:1;min-width:200px">
          <span class="sticker sky">${subj.name}</span>
          <h1 style="margin:.2em 0 .1em">${esc(t.name)}</h1>
          <p style="margin:0;font-weight:700;color:var(--ink-soft)">${BS.topicLabel(t)}</p>
        </div>
        <button class="btn btn-sky tts-btn" id="btn-tts">🔊 Bacakan</button>
      </div>

      <div class="obj-list">
        ${(t.objectives || []).map((o) => `<div class="obj-item"><span class="obj-check">✔</span><span>${esc(o)}</span></div>`).join('')}
      </div>

      ${m.core ? `<div class="materi-block mb-core"><div class="mb-title">💡 Ide Inti</div><div class="mb-body"><b>${esc(m.core)}</b></div></div>` : ''}
      ${m.intuition ? `<div class="materi-block mb-intu"><div class="mb-title">🤔 Coba Bayangkan</div><div class="mb-body">${esc(m.intuition)}</div></div>` : ''}
      ${m.details ? `<div class="materi-block mb-det"><div class="mb-title">📝 Penjelasan</div><div class="mb-body"><ul>${m.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div></div>` : ''}
      ${m.example ? `<div class="materi-block mb-ex"><div class="mb-title">✏️ Contoh: ${esc(m.example.q)}</div><div class="mb-body"><ol class="example-steps">${(m.example.steps || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div></div>` : ''}
      ${m.mistakes && m.mistakes.length ? `<div class="materi-block mb-mist"><div class="mb-title">⚠️ Hati-hati, Sering Keliru!</div><div class="mb-body"><ul>${m.mistakes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>` : ''}
      ${m.tip ? `<div class="materi-block mb-tip"><div class="mb-title">🌟 Tips Pipo</div><div class="mb-body">${esc(m.tip)}</div></div>` : ''}

      <div class="btn-row" style="margin-top:20px;justify-content:center">
        <button class="btn btn-leaf btn-big" data-quiz="${t.id}">✏️ Mulai Latihan</button>
        ${t.gen ? `<button class="btn btn-sky btn-big" data-gen="${t.gen}">♾️ Latihan Tak Terbatas</button>` : ''}
      </div>

      <div class="materi-nav">
        ${prev ? `<button class="btn" id="m-prev">← ${esc(BS.topicById(prev).name)}</button>` : '<span></span>'}
        ${next ? `<button class="btn" id="m-next">${esc(BS.topicById(next).name)} →</button>` : '<span></span>'}
      </div>
    </div>`;
  };

  BS.bind.materi = function (topicId) {
    const t = BS.topicById(topicId); if (!t) return;
    if (BS.markMateriRead) BS.markMateriRead(topicId);
    document.querySelectorAll('[data-quiz]').forEach((b) => { b.onclick = () => BS.startTopicQuiz(b.dataset.quiz); });
    document.querySelectorAll('[data-gen]').forEach((b) => { b.onclick = () => BS.startGenQuiz(b.dataset.gen); });
    const prev = BS.siblings(topicId)[BS.siblings(topicId).indexOf(topicId) - 1];
    const next = BS.siblings(topicId)[BS.siblings(topicId).indexOf(topicId) + 1];
    const pb = document.getElementById('m-prev'), nb = document.getElementById('m-next');
    if (pb) pb.onclick = () => { location.hash = '#/m/' + prev; };
    if (nb) nb.onclick = () => { location.hash = '#/m/' + next; };
    const btn = document.getElementById('btn-tts');
    if (btn) btn.onclick = () => BS.speakTopic(t, btn);
  };

  /* ============ BELAJAR (katalog materi) ============ */
  BS.views.belajar = function (worldId) {
    const w = BS.WORLDS.find((x) => x.id === worldId) || BS.WORLDS[0];
    return `
    <div class="view">
      <h1 style="margin-top:18px">📚 Perpustakaan Materi</h1>
      <p style="font-weight:700;color:var(--ink-soft)">Ringkasan materi terstruktur: Ide Inti → Intuisi → Contoh → Kesalahan Umum → Tips. Total <b>${BS.allTopics().length} topik</b>.</p>
      <div class="chip-row">
        ${BS.WORLDS.map((x) => `<button class="chip ${x.id === w.id ? 'on' : ''}" data-w="${x.id}">${x.icon} ${x.name}</button>`).join('')}
      </div>
      ${w.grades.map((g) => {
        const subjects = BS.subjectsOf(w.id, g.id);
        return `
        <h2 style="margin:22px 0 4px">${g.icon || '🎒'} ${esc(g.name)} <span class="sticker">${g.fase || ''}</span></h2>
        ${subjects.map((s) => {
          const topics = BS.topicsOf(w.id, g.id, s.id);
          if (!topics.length) return '';
          return `
          <details class="subject-accordion" ${s.id === subjects[0].id && g.id === w.grades[0].id ? 'open' : ''}>
            <summary><span class="sa-ico" style="background:${s.color}22">${s.icon}</span> ${esc(s.name)} <span class="sticker sun" style="margin-left:4px">${topics.length} topik</span><span class="sa-arrow">▾</span></summary>
            <div class="sa-body">
              <div class="topic-grid">
                ${topics.map((t) => `
                <div class="topic-card">
                  <div class="t-head"><span class="t-ico">${t.icon}</span><div><h3 style="font-size:.95rem">${esc(t.name)}</h3></div></div>
                  <div class="t-actions">
                    <button class="btn btn-sun" data-materi="${t.id}">📚 Materi</button>
                    <button class="btn btn-leaf" data-quiz="${t.id}">✏️ Latihan</button>
                  </div>
                </div>`).join('')}
              </div>
            </div>
          </details>`;
        }).join('')}
        ${w.id === 'sma' && g.id === 'sma-12' ? `
        <div class="card" style="margin-top:12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-size:30px">🎓</span><p style="flex:1;min-width:180px;margin:0"><b>Persiapan UTBK?</b> Coba simulator 25 soal berwaktu + analisis kelemahan per subtes.</p>
          <a class="btn btn-grape" href="#/game/utbk-sim">Mulai Simulasi</a>
        </div>` : ''}
      `; }).join('')}
    </div>`;
  };
  BS.bind.belajar = function () {
    document.querySelectorAll('[data-w]').forEach((b) => { b.onclick = () => { location.hash = '#/belajar/' + b.dataset.w; }; });
    document.querySelectorAll('[data-materi]').forEach((b) => { b.onclick = () => { location.hash = '#/m/' + b.dataset.materi; }; });
    document.querySelectorAll('[data-quiz]').forEach((b) => { b.onclick = () => BS.startTopicQuiz(b.dataset.quiz); });
  };

  /* ============ PROFIL ============ */
  BS.views.profil = function () {
    const S = BS.S, lv = BS.level();
    const avatars = ['🦊', '🐼', '🐯', '🐨', '🦁', '🐵', '🐸', '🦄', '🐙', '🦖', '🐝', '🐬'];
    return `
    <div class="view">
      <div class="card card-pad-lg" style="margin-top:16px">
        <div class="profile-head">
          <span class="avatar-big">${S.avatar}</span>
          <div class="level-bar">
            <div class="lv-top"><span style="font-family:var(--font-disp);font-size:1.2rem">${esc(S.name || 'Petualang')}</span><span class="level-title">Lv.${lv.lv} — ${lv.title}</span></div>
            <div class="lv-track"><i style="width:${lv.pct}%"></i></div>
            <p style="margin:6px 0 0;font-size:.85rem;font-weight:700;color:var(--ink-soft)">⭐ ${S.xp} XP — ${lv.need - S.xp} XP lagi ke Lv.${lv.lv + 1}</p>
          </div>
        </div>
        <div class="statstrip" style="margin-top:16px">
          <div class="statbox"><span class="s-ico">🪙</span><b>${S.coins}</b><span>Koin</span></div>
          <div class="statbox"><span class="s-ico">🔥</span><b>${S.streak}</b><span>Streak hari</span></div>
          <div class="statbox"><span class="s-ico">📚</span><b>${S.seenMateri.length}</b><span>Materi dibaca</span></div>
          <div class="statbox"><span class="s-ico">🎮</span><b>${S.stats.games}</b><span>Game dimainkan</span></div>
        </div>
      </div>

      <div class="section-title"><span class="emoji">🎖️</span><h2>Koleksi Lencana</h2><span class="sub">${S.badges.length}/${BS.BADGES.length}</span></div>
      <div class="badge-grid">
        ${BS.BADGES.map((b) => {
          const got = S.badges.includes(b.id);
          return `<div class="badge-item ${got ? '' : 'locked'}" title="${esc(b.how)}"><span class="b-ico">${b.icon}</span><b>${b.name}</b><span>${esc(b.how)}</span></div>`;
        }).join('')}
      </div>

      <div class="section-title"><span class="emoji">🔁</span><h2>Perlu Diulang</h2><span class="sub">dari analisis jawabanmu</span></div>
      ${BS.weakTopics(8).length ? `
        <div class="weak-list">
          ${BS.weakTopics(8).map((t) => `
            <div class="weak-item"><span class="w-ico">${t.icon}</span><b>${esc(t.name)}</b>
              <a class="btn btn-sun" href="#/m/${t.id}">📚</a>
              <button class="btn btn-pink" data-quiz="${t.id}">✏️</button>
            </div>`).join('')}
        </div>` : `<div class="empty-state" role="status">
          <span class="empty-owl" aria-hidden="true">🦉</span>
          <p class="empty-bubble">Belum ada catatan kelemahan. Kerjakan latihan supaya Pipo bisa menganalisis ya! 💪</p>
          <a class="btn btn-coral" href="#/petualangan">🕹️ Mulai dari Galeri Game</a>
        </div>`}

      <div class="section-title"><span class="emoji">🎭</span><h2>Kostum Avatar</h2></div>
      <div class="card">
        <div class="avatar-picker">
          ${avatars.map((a) => `<button class="av-opt ${S.avatar === a ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}
        </div>
        <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;align-items:center">
          <input class="name-input" id="name-in" maxlength="18" placeholder="Namamu..." value="${esc(S.name || '')}">
          <button class="btn btn-sky" id="name-save">💾 Simpan Nama</button>
          <button class="btn btn-ghost" id="reset-btn" style="color:var(--coral-d)">🗑️ Reset Semua Progres</button>
        </div>
      </div>
    </div>`;
  };
  BS.bind.profil = function () {
    document.querySelectorAll('[data-quiz]').forEach((b) => { b.onclick = () => BS.startTopicQuiz(b.dataset.quiz); });
    document.querySelectorAll('[data-av]').forEach((b) => {
      b.onclick = () => { BS.S.avatar = b.dataset.av; BS.save(); BS.rerender(); BS.sound('pop'); };
    });
    document.getElementById('name-save').onclick = () => {
      const v = document.getElementById('name-in').value.trim();
      if (v) { BS.S.name = v; BS.save(); BS.toast('Nama tersimpan! 🎉', 'reward'); BS.sound('coin'); }
    };
    document.getElementById('reset-btn').onclick = () => {
      BS.modal(`
        <h2>Reset semua progres?</h2>
        <p style="font-weight:600">XP, koin, lencana, dan statistik akan dihapus permanen dari perangkat ini.</p>
        <div class="btn-row" style="justify-content:flex-end">
          <button class="btn" id="md-no">Batal</button>
          <button class="btn btn-coral" id="md-yes">Ya, Reset</button>
        </div>`, () => {
        document.getElementById('md-no').onclick = BS.closeModal;
        document.getElementById('md-yes').onclick = () => { BS.resetAll(); BS.closeModal(); location.hash = '#/home'; };
      });
    };
  };

  /* ============ ORTU ============ */
  BS.views.ortu = function () {
    if (!sessionStorage.getItem('bs_gate2')) {
      const a = 12 + Math.floor(Math.random() * 13), b = 6 + Math.floor(Math.random() * 9);
      return `
      <div class="view gate-wrap">
        <div class="card card-pad-lg">
          <span style="font-size:44px">🔐</span>
          <h2>Area Orang Tua & Guru</h2>
          <p style="font-weight:700">Buktikan kamu bukan anak yang pengin lihat laporan sendiri 😄<br>Hitung dulu: <b style="font-size:1.5rem">${a} × ${b} = ?</b></p>
          <input class="gate-input" id="gate-in" inputmode="numeric" autocomplete="off">
          <div><button class="btn btn-grape btn-big" id="gate-ok">Buka 🔓</button></div>
          <p id="gate-msg" style="font-weight:800;min-height:1.4em"></p>
          <a class="btn btn-ghost" href="#/home">← Kembali</a>
        </div>
      </div>`;
    }
    const S = BS.S;
    const days = Object.keys(S.screenDays || {}).length;
    const rows = BS.allTopics().map((t) => {
      const st = S.stats.byTopic[t.id] || { seen: 0, correct: 0 };
      const pct = st.seen ? Math.round(st.correct / st.seen * 100) : -1;
      return { t, st, pct };
    }).filter((r) => r.st.seen > 0).sort((x, y) => x.pct - y.pct);
    return `
    <div class="view">
      <h1 style="margin-top:18px">👨‍👩‍👧 Dashboard Orang Tua & Guru</h1>
      <p style="font-weight:700;color:var(--ink-soft)">Progres belajar tersimpan <b>hanya di perangkat ini</b> (localStorage) — tidak ada data yang dikirim ke mana pun.</p>

      <div class="statstrip" style="margin-top:8px">
        <div class="statbox"><span class="s-ico">⭐</span><b>${S.xp}</b><span>Total XP</span></div>
        <div class="statbox"><span class="s-ico">✅</span><b>${S.stats.correct}</b><span>Jawaban Benar</span></div>
        <div class="statbox"><span class="s-ico">📊</span><b>${S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0}%</b><span>Akurasi</span></div>
        <div class="statbox"><span class="s-ico">📅</span><b>${days}</b><span>Hari aktif</span></div>
        <div class="statbox"><span class="s-ico">🦉</span><b>${S.seenMateri.length}</b><span>Materi dibaca</span></div>
      </div>

      <div class="section-title"><span class="emoji">📈</span><h2>Penguasaan Materi</h2><span class="sub">diurutkan dari yang paling perlu bantuan</span></div>
      <div class="card" style="overflow-x:auto">
        ${rows.length ? `
        <table class="mastery-table">
          <thead><tr><th>Topik</th><th>Jenjang</th><th>Dikerjakan</th><th>Penguasaan</th></tr></thead>
          <tbody>
            ${rows.map((r) => `
            <tr class="${r.pct >= 0 && r.pct < 60 ? 'warn' : ''}">
              <td>${r.t.icon} ${esc(r.t.name)}</td>
              <td>${BS.topicLabel(r.t)}</td>
              <td>${r.st.seen} soal</td>
              <td><span class="mastery-bar"><i style="width:${r.pct}%"></i></span> ${r.pct}%</td>
            </tr>`).join('')}
          </tbody>
        </table>` : `<p style="font-weight:700">Belum ada data latihan. Ajak anak mencoba satu topik — datanya muncul di sini. 😊</p>`}
      </div>

      <div class="section-title"><span class="emoji">💡</span><h2>Tips Pendampingan</h2><span class="sub">berbasis riset edukasi</span></div>
      <div class="card">
        <ol class="tips-list">
          <li><b>15 menit tiap hari</b> lebih efektif daripada 2 jam sekali seminggu — konsistensi membentuk kebiasaan (prinsip latihan terdistribusi).</li>
          <li>Rayakan <b>proses, bukan hanya skor</b>: "kamu tekun mencoba" membangun growth mindset lebih kuat daripada "kamu pintar".</li>
          <li>Gunakan daftar <b>Perlu Diulang</b>: review topik lemah pada hari yang sama, lalu ulangi di hari ke-1, ke-3, dan ke-7 (spaced repetition).</li>
          <li>Dampingi sesi <b>Materi</b> sebelum latihan: memahami dulu ("I-do") lalu berlatih mandiri ("You-do") sesuai gradual release.</li>
          <li>Untuk usia TK: duduk bersama, bacakan dengan tombol 🔊, dan batasi sesi 10–15 menit sesuai rentang perhatian usia dini.</li>
          <li>UTBK/SMA: analisis simulasi menunjukkan subtes terlemah — fokuskan latihan ke sana daripada mengerjakan semua merata.</li>
        </ol>
      </div>

      <div class="btn-row" style="margin-top:18px;justify-content:center">
        <button class="btn btn-ghost" id="ortu-lock">🔒 Kunci Ulang Dashboard</button>
      </div>
    </div>`;
  };
  BS.bind.ortu = function () {
    const gok = document.getElementById('gate-ok');
    if (gok) {
      const a = document.querySelector('.gate-wrap p b');
      gok.onclick = () => {
        // re-derive soal dari teks
        const m = a.textContent.match(/(\d+)\s*×\s*(\d+)/);
        const ans = +m[1] * +m[2];
        const val = document.getElementById('gate-in').value.trim();
        const msg = document.getElementById('gate-msg');
        if (val && +val === ans) { sessionStorage.setItem('bs_gate2', '1'); BS.rerender(); }
        else { msg.textContent = val ? 'Belum tepat, coba hitung lagi 🙂' : 'Isi jawabannya dulu ya'; msg.style.color = 'var(--coral-d)'; }
      };
      document.getElementById('gate-in').addEventListener('keydown', (e) => { if (e.key === 'Enter') gok.click(); });
    }
    const lock = document.getElementById('ortu-lock');
    if (lock) lock.onclick = () => { sessionStorage.removeItem('bs_gate2'); location.hash = '#/home'; };
  };
})();
