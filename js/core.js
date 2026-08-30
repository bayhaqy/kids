/* ============================================================
   BelajarSeru! — Core
   State, router, gamifikasi, mesin kuis, dashboard orang tua.
   ============================================================ */
"use strict";

const Core = (() => {
  const STORE_KEY = "belajarseru_v1";
  const $app = () => document.getElementById("app");

  /* ---------------- State ---------------- */
  const todayStr = (d) => {
    const t = d || new Date();
    return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
  };
  const yesterdayStr = () => todayStr(new Date(Date.now() - 864e5));

  const defaults = () => ({
    xp: 0, coins: 0, streak: 0, lastXpDate: "",
    avatar: "🦊", sound: true,
    progress: {},           // gameId -> {plays, stars, best, correct, total}
    stats: { rounds: 0, stars: 0, byGame: {} },
    badges: [],
    missions: { date: "", counters: { plays: 0, xp: 0, wins: 0 }, done: {} },
    timeToday: { date: "", seconds: 0 },
  });

  let state = defaults();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) state = Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { state = defaults(); }
    ensureToday();
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function ensureToday() {
    if (state.missions.date !== todayStr()) {
      const pool = [...DATA.missionPool].sort(() => Math.random() - .5).slice(0, 3);
      state.missions = { date: todayStr(), counters: { plays: 0, xp: 0, wins: 0 }, done: {}, list: pool.map(m => m.id) };
      save();
    }
    if (state.timeToday.date !== todayStr()) { state.timeToday = { date: todayStr(), seconds: 0 }; save(); }
  }
  const missionList = () => (state.missions.list || []).map(id => DATA.missionPool.find(m => m.id === id)).filter(Boolean);

  /* ---------------- Gamifikasi ---------------- */
  const level = () => Math.floor(state.xp / 100) + 1;
  const xpInLevel = () => state.xp % 100;

  function streakTick() {
    const t = todayStr();
    if (state.lastXpDate === t) return;
    state.streak = state.lastXpDate === yesterdayStr() ? (state.streak || 0) + 1 : 1;
    state.lastXpDate = t;
  }

  function addXp(n) {
    if (n <= 0) return;
    streakTick();
    state.xp += n;
    state.missions.counters.xp += n;
    checkMissions();
    checkBadges();
    save();
  }

  function recordRound(gameId, correct, total, stars) {
    const p = state.progress[gameId] || { plays: 0, stars: 0, best: 0, correct: 0, total: 0 };
    p.plays += 1; p.stars += stars; p.correct += correct; p.total += total;
    state.progress[gameId] = p;
    state.stats.rounds += 1;
    state.stats.stars += stars;
    state.stats.byGame[gameId] = (state.stats.byGame[gameId] || 0) + correct;
    state.missions.counters.plays += 1;
    if (stars >= 1) state.missions.counters.wins += 1;
    checkMissions();
    save();
  }
  function setBest(gameId, val) {
    const p = state.progress[gameId] || { plays: 0, stars: 0, best: 0, correct: 0, total: 0 };
    p.best = Math.max(p.best, val);
    state.progress[gameId] = p;
    checkBadges(); save();
  }

  function checkMissions() {
    const counters = state.missions.counters;
    missionList().forEach(m => {
      if (state.missions.done[m.id]) return;
      if ((counters[m.key] || 0) >= m.target) {
        state.missions.done[m.id] = true;
        state.coins += 5;
        toast("Misi selesai: " + m.teks + " (+5 koin)", "🎁");
      }
    });
  }
  function checkBadges() {
    DATA.badges.forEach(b => {
      if (state.badges.includes(b.id)) return;
      let ok = false;
      try { ok = b.cond(state); } catch (e) { ok = false; }
      if (ok) { state.badges.push(b.id); toast(b.name + " — lencana baru!", b.emoji); confetti(); }
    });
  }

  /* ---------------- Util ---------------- */
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  function el(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  }
  function starsFor(correct, total) {
    const r = correct / Math.max(1, total);
    return r >= .9 ? 3 : r >= .7 ? 2 : r >= .5 ? 1 : 0;
  }
  function toast(msg, emoji) {
    const layer = document.getElementById("toast-layer");
    if (!layer) return;
    const t = el(`<div class="toast"><span>${emoji || "✨"}</span><span>${msg}</span></div>`);
    layer.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
  function confetti() {
    const layer = document.getElementById("confetti-layer");
    if (!layer) return;
    const colors = ["#7c3aed", "#ec4899", "#f59e0b", "#22c55e", "#0ea5e9", "#eab308"];
    for (let i = 0; i < 50; i++) {
      const c = el(`<div class="confetto"></div>`);
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = pick(colors);
      c.style.animationDuration = (2 + Math.random() * 1.6) + "s";
      c.style.animationDelay = (Math.random() * .5) + "s";
      if (Math.random() > .5) c.style.borderRadius = "50%";
      layer.appendChild(c);
      setTimeout(() => c.remove(), 4200);
    }
  }

  /* ---- Suara ---- */
  let actx = null;
  function sfx(type) {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { ok: [[523, 0], [659, .1], [784, .2]], no: [[330, 0], [262, .12]], win: [[523, 0], [659, .12], [784, .24], [1047, .36]], click: [[440, 0]] }[type] || [[440, 0]];
      seq.forEach(([freq, delay]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = "sine"; o.frequency.value = freq;
        g.gain.setValueAtTime(.001, actx.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(.16, actx.currentTime + delay + .02);
        g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + delay + .22);
        o.connect(g); g.connect(actx.destination);
        o.start(actx.currentTime + delay); o.stop(actx.currentTime + delay + .25);
      });
    } catch (e) { /* audio tidak tersedia */ }
  }
  function speak(text) {
    if (!state.sound) return;
    try {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID"; u.rate = .9; u.pitch = 1.1;
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  /* ---------------- Konfigurasi Dunia ---------------- */
  const WORLDS = {
    tk: {
      nama: "Dunia TK", emoji: "🧸", umur: "Usia 4–6 Tahun", theme: "tk",
      desc: "Belajar lewat bermain! Kenali huruf, angka, warna, dan bentuk bersama teman-temanmu. Setiap sesi ringan, 5–10 menit, penuh suara dan warna.",
      games: [
        { id: "huruf", emoji: "🔤", judul: "Tebak Huruf Awal", desc: "Lihat gambarnya, tebak huruf awalnya! Ada suara untuk bantuan.", tag: "Literasi" },
        { id: "hitung", emoji: "🔢", judul: "Hitung Mainan", desc: "Hitung jumlah mainan yang muncul, lalu pilih jawabannya!", tag: "Numerasi" },
        { id: "warnabentuk", emoji: "🎨", judul: "Warna & Bentuk", desc: "Ketuk warna dan bentuk yang diminta sesuai perintah.", tag: "Kognitif" },
      ],
    },
    sd: {
      nama: "Dunia SD", emoji: "🎒", umur: "Kelas 1–6 SD", theme: "sd",
      desc: "Petualangan 15 menit setiap hari! Taklukkan peta matematika, kuis bahasa & IPA, dan latih logika dengan robot koding. Kumpulkan bintang di setiap level!",
      games: [
        { id: "mateka", emoji: "🗺️", judul: "Matematika Petualangan", desc: "10 level berantai dari penjumlahan sampai soal serba-serbi. Kalahkan semua!", tag: "Numerasi" },
        { id: "bahasa", emoji: "📚", judul: "Kuis Bahasa", desc: "Sinonim, antonim, kalimat rumpang — buktikan kamu juara bahasa!", tag: "Literasi" },
        { id: "ipa", emoji: "🔭", judul: "Jelajah IPA", desc: "Tata surya, hewan, tubuh manusia, dan fenomena alam seru lainnya.", tag: "Sains" },
        { id: "koding", emoji: "🤖", judul: "Robot Koding", desc: "Susun perintah panah untuk mengantar robot ke bendera. Latih logika pemrograman!", tag: "Logika" },
      ],
    },
    smp: {
      nama: "Dunia SMP", emoji: "🧪", umur: "Kelas 7–9 SMP", theme: "smp",
      desc: "Saatnya eksperimen! Coba lab fisika mini, kuis matematika yang menantang, dan IPA-IPS lintas topik. Belajar dengan memahami, bukan menghafal.",
      games: [
        { id: "lab", emoji: "🎯", judul: "Lab Fisika: Lontaran", desc: "Atur sudut dan kekuatan katapel, kena sasaran! Belajar gerak parabola lewat percobaan.", tag: "Fisika" },
        { id: "matika", emoji: "➗", judul: "Kuis Matematika", desc: "Aljabar, pangkat, pecahan, dan soal cerita. Setiap soal beda-beda!", tag: "Numerasi" },
        { id: "ips", emoji: "🌏", judul: "Kuis IPA & IPS", desc: "Sel, gaya, listrik, sejarah, geografi — uji wawasan lintas mapel.", tag: "Lintas Ilmu" },
      ],
    },
    sma: {
      nama: "Dunia SMA", emoji: "🎓", umur: "Kelas 10–12 SMA", theme: "sma",
      desc: "Persiapan masa depan! Simulasi UTBK bertimer, kartu hafalan rumus penting, dan petunjuk karier untuk menemukan jalan terbaikmu setelah lulus.",
      games: [
        { id: "utbk", emoji: "🎓", judul: "Simulasi UTBK", desc: "12 soal PU, literasi, dan penalaran matematika dengan timer 10 menit + analisis hasil.", tag: "Ujian" },
        { id: "kartu", emoji: "🃏", judul: "Kartu Hafalan", desc: "Flashcards rumus matematika, fisika, dan fakta penting. Balik kartunya untuk cek jawaban!", tag: "Hafalan" },
        { id: "karier", emoji: "🧭", judul: "Petunjuk Karier", desc: "Jawab 6 pertanyaan singkat, temukan bidang yang paling cocok dengan kekuatanmu.", tag: "BK" },
      ],
    },
  };

  const GAMES = {}; // diisi oleh games-td.js & games-sms.js

  /* ---------------- Mesin Kuis ---------------- */
  function runQuiz(container, opts) {
    const qs = opts.questions;
    let idx = 0, correct = 0, locked = false;
    let timeLeft = opts.timer || 0, timerId = null;
    const results = [];

    container.innerHTML = "";
    const wrap = el(`<div class="quiz-wrap"></div>`);
    container.appendChild(wrap);

    const top = el(`<div class="quiz-top"><span class="quiz-count"></span><span class="timer-chip" style="display:none"></span></div>`);
    const bar = el(`<div class="quiz-progress"><div class="q-fill" style="width:0%"></div></div>`);
    const card = el(`<div class="question-card"></div>`);
    wrap.appendChild(top); wrap.appendChild(bar); wrap.appendChild(card);

    function paintTop() {
      top.querySelector(".quiz-count").textContent = `Soal ${idx + 1} dari ${qs.length}`;
      bar.querySelector(".q-fill").style.width = (idx / qs.length * 100) + "%";
    }

    if (opts.timer) {
      const chip = top.querySelector(".timer-chip");
      chip.style.display = "";
      const paint = () => {
        const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
        chip.textContent = `⏱ ${m}:${String(s).padStart(2, "0")}`;
        chip.classList.toggle("warn", timeLeft <= 60);
      };
      timerId = setInterval(() => {
        timeLeft--; paint();
        if (timeLeft <= 0) { clearInterval(timerId); finish(); }
      }, 1000);
      paint();
    }

    function paintQuestion() {
      locked = false;
      const q = qs[idx];
      paintTop();
      if (opts.onShow) { try { opts.onShow(q); } catch (e) { /* ignore */ } }
      card.innerHTML = "";
      const prompt = el(`<div class="q-prompt">${q.q}</div>`);
      card.appendChild(prompt);
      if (q.visual) card.appendChild(el(`<div class="q-visual">${q.visual}</div>`));

      const ans = (q.a == null && q.cv != null) ? q.o.indexOf(q.cv) : q.a;
      const grid = el(`<div class="options ${opts.cols || ""}"></div>`);
      q.o.forEach((opt, i) => {
        const isEmoji = typeof opt === "string" && opt.length <= 3 && /\p{Extended_Pictographic}/u.test(opt);
        const b = el(`<button class="opt-btn"></button>`);
        if (isEmoji) { b.innerHTML = `<span class="opt-emoji">${opt}</span>`; grid.classList.add("cols-4"); }
        else b.textContent = opt;
        b.addEventListener("click", () => answer(i, b, ans));
        grid.appendChild(b);
      });
      card.appendChild(grid);
      const fb = el(`<div class="feedback-banner"></div>`);
      const nb = el(`<button class="next-btn">Lanjut ➜</button>`);
      card.appendChild(fb); card.appendChild(nb);
      nb.addEventListener("click", () => { sfx("click"); idx++; idx >= qs.length ? finish() : paintQuestion(); });
    }

    function answer(i, btn, ans) {
      if (locked) return;
      locked = true;
      const q = qs[idx];
      const buttons = card.querySelectorAll(".opt-btn");
      buttons.forEach(b => b.disabled = true);
      const fb = card.querySelector(".feedback-banner");
      const nb = card.querySelector(".next-btn");
      if (i === ans) {
        correct++; sfx("ok");
        results[idx] = true;
        btn.classList.add("correct");
        fb.className = "feedback-banner show ok";
        fb.textContent = "🎉 Benar! Hebat sekali!" + (q.f ? " " + q.f : "");
      } else {
        sfx("no");
        results[idx] = false;
        btn.classList.add("wrong");
        buttons[ans] && buttons[ans].classList.add("correct");
        fb.className = "feedback-banner show no";
        fb.textContent = "💪 Belum tepat. " + (q.f || "Coba lagi di soal berikutnya!");
      }
      nb.classList.add("show");
      nb.textContent = idx >= qs.length - 1 ? "Lihat Hasil 🏁" : "Lanjut ➜";
    }

    function finish() {
      if (timerId) clearInterval(timerId);
      const stars = starsFor(correct, qs.length);
      const xp = correct * 10 + stars * 10;
      addXp(xp);
      recordRound(opts.gameId, correct, qs.length, stars);
      const coins = correct * 2;
      state.coins += coins; save();
      if (opts.onFinish) opts.onFinish(correct, stars, results);
      if (opts.customResult) {
        opts.customResult(correct, stars, results, qs);
        return;
      }
      roundResult(container, {
        correct, total: qs.length, stars, xp, coins, gameId: opts.gameId,
        retryLabel: opts.retryLabel || "Main Lagi",
        retry: () => runQuiz(container, opts),
        home: opts.home || "#/",
        headline: opts.headline,
      });
    }

    paintQuestion();
  }

  function roundResult(container, o) {
    container.innerHTML = "";
    const s = [1, 2, 3].map(i => `<span class="${i <= o.stars ? "" : "off"}">⭐</span>`).join("");
    const card = el(`
      <div class="result-card">
        <div class="r-emoji">${o.stars >= 3 ? "🏆" : o.stars === 2 ? "🎉" : o.stars === 1 ? "👍" : "🌱"}</div>
        <h2>${o.headline || (o.stars > 0 ? "Kerja Bagus!" : "Terus Semangat!")}</h2>
        <div class="result-stars">${s}</div>
        <div class="result-stats">
          <span class="stat-chip">✅ ${o.correct}/${o.total} benar</span>
          <span class="stat-chip">⚡ +${o.xp} XP</span>
          <span class="stat-chip">💰 +${o.coins || 0} koin</span>
        </div>
        <div class="result-actions">
          <button class="btn-primary">${o.retryLabel}</button>
          <a class="btn-ghost" href="${o.home}">Kembali</a>
        </div>
      </div>`);
    card.querySelector(".btn-primary").addEventListener("click", o.retry);
    container.appendChild(card);
    if (o.stars >= 2) { sfx("win"); confetti(); }
  }

  /* ---------------- UI: Header ---------------- */
  function header() {
    const h = el(`
      <header class="topbar">
        <a class="brand" href="#/"><span class="logo-bubble">🚀</span><span class="wordmark">Belajar<b>Seru!</b></span></a>
        <span class="spacer"></span>
        <span class="stat-chip hide-xs" title="Level kamu">⭐ Lv ${level()}</span>
        <span class="stat-chip" title="Koin">💰 ${state.coins}</span>
        <span class="stat-chip hide-xs" title="Runtutan harian">🔥 ${state.streak}</span>
        <button class="icon-btn" id="btn-avatar" title="Ganti avatar">${state.avatar}</button>
        <button class="icon-btn" id="btn-sound" title="Suara on/off">${state.sound ? "🔊" : "🔇"}</button>
        <a class="icon-btn" href="#/ortu" title="Dashboard orang tua">🧑‍🏫</a>
      </header>`);
    h.querySelector("#btn-avatar").addEventListener("click", avatarModal);
    h.querySelector("#btn-sound").addEventListener("click", () => {
      state.sound = !state.sound; save();
      h.querySelector("#btn-sound").textContent = state.sound ? "🔊" : "🔇";
      toast(state.sound ? "Suara dinyalakan" : "Suara dimatikan", state.sound ? "🔊" : "🔇");
    });
    return h;
  }

  function avatarModal() {
    const back = el(`<div class="modal-back"><div class="modal-card">
      <h3 style="font-size:20px">Pilih Avatarmu ${state.avatar}</h3>
      <div class="avatar-grid"></div>
    </div></div>`);
    const grid = back.querySelector(".avatar-grid");
    DATA.avatars.forEach(a => {
      const b = el(`<button class="avatar-opt ${a === state.avatar ? "sel" : ""}">${a}</button>`);
      b.addEventListener("click", () => {
        state.avatar = a; save();
        back.remove(); render();
        toast("Avatar diperbarui!", a);
      });
      grid.appendChild(b);
    });
    back.addEventListener("click", (e) => { if (e.target === back) back.remove(); });
    document.body.appendChild(back);
  }

  /* ---------------- UI: Halaman ---------------- */
  function homeView() {
    document.body.dataset.world = "home";
    const frag = document.createDocumentFragment();
    frag.appendChild(header());
    const main = el(`<main></main>`);

    main.appendChild(el(`
      <section class="hero">
        <span class="kicker">🎓 Gratis • Tanpa Iklan • Kurikulum Merdeka</span>
        <h1>Selamat datang di <span class="grad">BelajarSeru!</span></h1>
        <p class="lead">Empat dunia belajar dalam satu portal — dari mengenal huruf sampai persiapan UTBK. Belajar jadi petualangan!</p>
        <div class="mascots"><span>🧸</span><span>🦊</span><span>🐬</span><span>🦉</span></div>
      </section>`));

    main.appendChild(el(`<h2 class="section-title">🗺️ Pilih Duniamu!</h2>`));
    main.appendChild(el(`<p class="section-sub">Setiap dunia punya tantangan dan hadiahnya sendiri.</p>`));
    const grid = el(`<div class="world-grid"></div>`);
    Object.entries(WORLDS).forEach(([id, w]) => {
      const c = el(`
        <a class="world-card wc-${id}" href="#/${id}">
          <span class="wc-emoji">${w.emoji}</span>
          <span class="wc-age">${w.umur}</span>
          <h3>${w.nama}</h3>
          <p>${w.desc.split("!")[0]}…</p>
          <span class="wc-count">${w.games.length} permainan seru →</span>
        </a>`);
      grid.appendChild(c);
    });
    main.appendChild(grid);

    /* Misi harian */
    main.appendChild(el(`<h2 class="section-title">🎯 Misi Hari Ini</h2>`));
    main.appendChild(el(`<p class="section-sub">Selesaikan misi, dapatkan koin ekstra! (diperbarui setiap hari)</p>`));
    const mPanel = el(`<div class="panel"><div class="mission-row"></div></div>`);
    const mRow = mPanel.querySelector(".mission-row");
    ensureToday();
    missionList().forEach(m => {
      const cur = Math.min(state.missions.counters[m.key] || 0, m.target);
      const done = !!state.missions.done[m.id];
      const row = el(`
        <div class="mission ${done ? "done" : ""}">
          <div class="m-title"><span>${m.emoji}</span><span>${m.teks}</span></div>
          <div class="m-track"><div class="m-fill" style="width:${cur / m.target * 100}%"></div></div>
          <div class="m-info">${done ? "✅ Selesai! +5 koin" : `${cur}/${m.target} ${m.satuan} • hadiah 5 💰`}</div>
        </div>`);
      mRow.appendChild(row);
    });
    main.appendChild(mPanel);

    /* Lencana */
    main.appendChild(el(`<h2 class="section-title">🏅 Koleksi Lencana</h2>`));
    main.appendChild(el(`<p class="section-sub">${state.badges.length} dari ${DATA.badges.length} lencana sudah kamu miliki.</p>`));
    const bPanel = el(`<div class="panel"><div class="badge-grid"></div></div>`);
    const bGrid = bPanel.querySelector(".badge-grid");
    DATA.badges.forEach(b => {
      const earned = state.badges.includes(b.id);
      bGrid.appendChild(el(`
        <div class="badge-card ${earned ? "earned" : ""}">
          <div class="b-emoji">${b.emoji}</div>
          <div class="b-name">${b.name}</div>
          <div class="b-desc">${b.desc}</div>
        </div>`));
    });
    main.appendChild(bPanel);

    frag.appendChild(main);
    frag.appendChild(footer());
    return frag;
  }

  function worldView(id) {
    const w = WORLDS[id];
    document.body.dataset.world = w.theme;
    const frag = document.createDocumentFragment();
    frag.appendChild(header());
    const main = el(`<main></main>`);
    main.appendChild(el(`<a class="back-link" href="#/">← Semua Dunia</a>`));
    main.appendChild(el(`
      <section class="world-hero wh-${id}">
        <span class="wh-emoji">${w.emoji}</span>
        <h2>${w.nama}</h2>
        <p><b>${w.umur}</b> — ${w.desc}</p>
      </section>`));
    const grid = el(`<div class="game-grid"></div>`);
    w.games.forEach(g => {
      const p = state.progress[`${id}/${g.id}`];
      const meta = p && p.plays
        ? `<span class="pill stars">⭐ ${p.stars} bintang</span><span class="pill">🎮 ${p.plays}x</span>`
        : `<span class="pill">Belum dimainkan</span>`;
      grid.appendChild(el(`
        <a class="game-card" href="#/${id}/${g.id}">
          <span class="g-emoji ge-${id}">${g.emoji}</span>
          <h3>${g.judul}</h3>
          <p>${g.desc}</p>
          <div class="g-meta"><span class="pill">${g.tag}</span>${meta}</div>
        </a>`));
    });
    main.appendChild(grid);
    frag.appendChild(main);
    frag.appendChild(footer());
    return frag;
  }

  function gameView(worldId, gameId) {
    const w = WORLDS[worldId];
    const g = w.games.find(x => x.id === gameId);
    document.body.dataset.world = w.theme;
    const frag = document.createDocumentFragment();
    frag.appendChild(header());
    const main = el(`<main></main>`);
    main.appendChild(el(`<a class="back-link" href="#/${worldId}">← ${w.nama}</a>`));
    const stage = el(`<div class="game-stage"></div>`);
    main.appendChild(stage);
    frag.appendChild(main);

    const fn = GAMES[`${worldId}/${gameId}`];
    if (fn) { try { fn(stage, { world: w, game: g }); } catch (err) { stage.innerHTML = "<div class='panel'>Waduh, ada gangguan. Coba muat ulang halaman ya!</div>"; } }
    return frag;
  }

  function footer() {
    return el(`<footer class="site-footer">
      🚀 <b>BelajarSeru!</b> — Petualangan Belajar TK sampai SMA.<br>
      Terinspirasi riset edutech 2026: latihan > menonton, gamifikasi yang bermakna, dan dampingi selalu anakmu.
      • Bagian dari <a href="https://bayhaqy.my.id">bayhaqy.my.id</a>
    </footer>`);
  }

  /* ---------------- Dashboard Orang Tua ---------------- */
  function ortuView() {
    document.body.dataset.world = "home";
    const frag = document.createDocumentFragment();
    frag.appendChild(header());
    const main = el(`<main></main>`);

    if (sessionStorage.getItem("bs_gate") !== "ok") {
      const a = rand(6, 9), b = rand(6, 9);
      main.appendChild(el(`
        <div class="panel gate-card">
          <div style="font-size:44px">🧑‍🏫</div>
          <h2 style="margin:8px 0 4px">Area Orang Tua</h2>
          <p style="color:var(--ink-soft);font-weight:600">Jawab pertanyaan ini untuk masuk (supaya anak-anak tetap fokus bermain 😊)</p>
          <input id="gate-input" type="number" inputmode="numeric" placeholder="${a} × ${b} = ?" />
          <button class="btn-primary" id="gate-btn" style="width:100%">Buka Dashboard</button>
        </div>`));
      frag.appendChild(main);
      const btn = main.querySelector("#gate-btn");
      const doCheck = () => {
        const v = parseInt(main.querySelector("#gate-input").value, 10);
        if (v === a * b) { sessionStorage.setItem("bs_gate", "ok"); render(); }
        else { toast("Coba hitung lagi ya!", "🤔"); }
      };
      btn.addEventListener("click", doCheck);
      main.querySelector("#gate-input").addEventListener("keydown", e => { if (e.key === "Enter") doCheck(); });
      return frag;
    }

    /* Konten dashboard */
    const totalTime = state.timeToday.seconds || 0;
    const mm = Math.floor(totalTime / 60), ss = totalTime % 60;
    main.appendChild(el(`<a class="back-link" href="#/">← Kembali ke Beranda</a>`));
    main.appendChild(el(`
      <section class="world-hero wh-sma">
        <span class="wh-emoji">🧑‍🏫</span>
        <h2>Dashboard Orang Tua</h2>
        <p>Pantau perkembangan belajar anak: XP, runtutan harian, waktu layar, dan kemajuan tiap permainan.</p>
      </section>`));

    main.appendChild(el(`<div class="ortu-stats">
      <div class="ortu-stat"><div class="os-num">Lv ${level()}</div><div class="os-label">Level anak</div></div>
      <div class="ortu-stat"><div class="os-num">${state.xp}</div><div class="os-label">Total XP</div></div>
      <div class="ortu-stat"><div class="os-num">🔥 ${state.streak} hari</div><div class="os-label">Runtutan belajar</div></div>
      <div class="ortu-stat"><div class="os-num">${mm}m ${ss}d</div><div class="os-label">Waktu layar hari ini</div></div>
      <div class="ortu-stat"><div class="os-num">${state.stats.rounds}</div><div class="os-label">Total sesi permainan</div></div>
      <div class="ortu-stat"><div class="os-num">${state.badges.length}</div><div class="os-label">Lencana terkumpul</div></div>
    </div>`));

    /* Tabel progres per game */
    const tbl = el(`<div class="panel"><h3 style="margin-bottom:10px">📊 Kemajuan per Permainan</h3></div>`);
    const table = document.createElement("table");
    table.className = "progress-table";
    table.innerHTML = `<thead><tr><th>Permainan</th><th>Main</th><th>Akurasi</th><th>Prestasi Terbaik</th></tr></thead>`;
    const tbody = document.createElement("tbody");
    Object.entries(WORLDS).forEach(([wid, w]) => {
      w.games.forEach(g => {
        const p = state.progress[`${wid}/${g.id}`];
        const acc = p && p.total ? Math.round(p.correct / p.total * 100) : 0;
        let best = "—";
        if (p) {
          if (wid === "sd" && g.id === "mateka" && p.best) best = `Level ${p.best}`;
          else if (wid === "sd" && g.id === "koding" && p.best) best = `${p.best} puzzle`;
          else if (wid === "smp" && g.id === "lab" && p.best) best = `${p.best} sasaran`;
          else if (wid === "sma" && g.id === "utbk" && p.best) best = `Skor ${p.best}`;
          else if (p.plays) best = `${p.stars} ⭐`;
        }
        tbody.innerHTML += `<tr>
          <td>${w.emoji} ${g.judul}</td>
          <td>${p ? p.plays : 0}x</td>
          <td><span class="mini-track"><span class="mini-fill" style="width:${acc}%"></span></span> ${acc}%</td>
          <td>${best}</td>
        </tr>`;
      });
    });
    table.appendChild(tbody);
    tbl.appendChild(table);
    main.appendChild(tbl);

    /* Misi & tips */
    main.appendChild(el(`<h2 class="section-title">💡 Tips untuk Ayah & Bunda</h2>`));
    main.appendChild(el(`<p class="section-sub">Berdasarkan riset pendidikan terkini (2025–2026).</p>`));
    const tipGrid = el(`<div class="mission-row"></div>`);
    DATA.tipsOrtu.forEach(t => {
      tipGrid.appendChild(el(`<div class="tip-card"><b>${t.t}</b>${t.d}</div>`));
    });
    main.appendChild(tipGrid);

    const resetPanel = el(`<div class="panel" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:space-between">
      <span style="font-weight:700;color:var(--ink-soft);font-size:14px">Zona bahaya: menghapus seluruh progres belajar di perangkat ini.</span>
      <button class="btn-danger">Reset Semua Data</button></div>`);
    resetPanel.querySelector("button").addEventListener("click", () => {
      if (confirm("Yakin ingin menghapus SEMUA progres belajar? Tindakan ini tidak bisa dibatalkan.")) {
        localStorage.removeItem(STORE_KEY);
        location.hash = "#/"; render();
        toast("Semua data telah direset", "🧹");
      }
    });
    main.appendChild(resetPanel);

    frag.appendChild(main);
    frag.appendChild(footer());
    return frag;
  }

  /* ---------------- Router ---------------- */
  function render() {
    const hash = location.hash.replace(/^#\/?/, "");
    const parts = hash.split("/").filter(Boolean);
    let view;
    if (parts.length === 0) view = homeView();
    else if (parts[0] === "ortu") view = ortuView();
    else if (WORLDS[parts[0]]) {
      view = parts[1] ? gameView(parts[0], parts[1]) : worldView(parts[0]);
    }
    else view = homeView();
    const app = $app();
    app.innerHTML = "";
    app.appendChild(view);
    window.scrollTo(0, 0);
  }

  function init() {
    load();
    window.addEventListener("hashchange", render);
    render();
    setInterval(() => {
      if (document.visibilityState === "visible") {
        ensureToday();
        state.timeToday.seconds += 5;
        if (state.timeToday.seconds % 30 === 0) save();
      }
    }, 5000);
    window.addEventListener("beforeunload", save);
  }

  return {
    init, render, save, toast, confetti, sfx, speak,
    shuffle, pick, rand, el, starsFor,
    runQuiz, roundResult,
    addXp, recordRound, setBest, checkBadges, ensureToday,
    get state() { return state; },
    WORLDS, GAMES,
    todayStr,
  };
})();
