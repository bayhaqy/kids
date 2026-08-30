/* ============================================================
   BelajarSeru! — Game Engine: Dunia TK & SD
   ============================================================ */
"use strict";

(() => {
  const { GAMES, runQuiz, shuffle, pick, rand, el, sfx, speak, toast, confetti, addXp, recordRound, setBest, roundResult } = Core;

  /* =====================================================
     TK — Tebak Huruf Awal
     ===================================================== */
  GAMES["tk/huruf"] = function (stage) {
    const soal = shuffle(DATA.kataHuruf).slice(0, 10).map(k => {
      const lain = shuffle("BCDEFGHIJKLMNOPQ".split("").filter(c => c !== k.huruf)).slice(0, 3);
      const opts = shuffle([k.huruf, ...lain]);
      return {
        q: `Huruf awal dari kata <b>${k.kata}</b> adalah…`,
        visual: k.emoji, o: opts, a: opts.indexOf(k.huruf),
        f: `${k.huruf} untuk ${k.kata}!`,
      };
    });
    runQuiz(stage, {
      title: "Tebak Huruf Awal",
      questions: soal,
      gameId: "tk/huruf",
      cols: "cols-4",
      onShow: (q) => { const k = q.f.split(" untuk ")[1]; if (k) speak(k.replace("!", "")); },
      retryLabel: "Main Lagi",
      home: "#/tk",
      headline: "Kamu Anak Pintar Huruf!",
    });
  };

  /* =====================================================
     TK — Hitung Mainan
     ===================================================== */
  GAMES["tk/hitung"] = function (stage) {
    const emojiMainan = ["🧸", "⚽", "🎈", "🍎", "🚗", "⭐", "🍩", "🐥"];
    const soal = [];
    const terpakai = new Set();
    for (let i = 0; i < 10; i++) {
      let n;
      do { n = rand(1, 12); } while (terpakai.has(n));
      terpakai.add(n);
      const em = pick(emojiMainan);
      const salah = shuffle([n + 1, n - 1, n + 2, n - 2, n + 3].map(v => Math.max(0, v)).filter(v => v !== n));
      const opts = shuffle([n, ...salah.slice(0, 3)]);
      soal.push({
        q: "Ada berapa banyak mainannya? Hitung yuk!",
        visual: Array(n).fill(em).join(" "),
        o: opts.map(String), a: null,
        cv: String(n),
        f: `Jumlahnya ${n}!`,
      });
    }
    runQuiz(stage, {
      title: "Hitung Mainan",
      questions: soal,
      gameId: "tk/hitung",
      cols: "cols-4",
      retryLabel: "Hitung Lagi",
      home: "#/tk",
      headline: "Jago Berhitung!",
    });
  };

  /* =====================================================
     TK — Warna & Bentuk
     ===================================================== */
  GAMES["tk/warnabentuk"] = function (stage) {
    const soal = [];
    const warnaPilih = shuffle(DATA.warna).slice(0, 5);
    warnaPilih.forEach(w => {
      const lain = DATA.warna.filter(x => x.nama !== w.nama).map(x => x.emoji);
      const opts = shuffle([w.emoji, ...shuffle(lain).slice(0, 3)]);
      soal.push({ q: `Ketuk <b>warna ${w.nama}</b>!`, o: opts, a: opts.indexOf(w.emoji), f: `Ini warna ${w.nama}!` });
    });
    const bentukPilih = shuffle(DATA.bentuk).slice(0, 5);
    bentukPilih.forEach(b => {
      const lain = DATA.bentuk.filter(x => x.nama !== b.nama).map(x => x.emoji);
      const opts = shuffle([b.emoji, ...shuffle(lain).slice(0, 3)]);
      soal.push({ q: `Ketuk <b>bentuk ${b.nama}</b>!`, o: opts, a: opts.indexOf(b.emoji), f: `Ini bentuk ${b.nama}!` });
    });
    runQuiz(stage, {
      title: "Warna & Bentuk",
      questions: shuffle(soal),
      gameId: "tk/warnabentuk",
      onShow: (q) => { speak(q.q.replace(/<[^>]*>/g, "")); },
      retryLabel: "Main Lagi",
      home: "#/tk",
      headline: "Mata Kamu Jeli Sekali!",
    });
  };

  /* =====================================================
     SD — Matematika Petualangan (peta level)
     ===================================================== */
  GAMES["sd/mateka"] = function (stage) {
    const gameId = "sd/mateka";
    const TOTAL_LEVEL = 10;

    const p = Core.state.progress[gameId] || {};
    const levels = p.levels || {};

    function buatSoal(lv) {
      const opsinya = (cv, kandidat) => {
        const opts = [cv];
        kandidat.forEach(v => { if (!opts.includes(v)) opts.push(v); });
        return { o: opts.slice(0, 4).sort(() => Math.random() - .5), cv };
      };
      if (lv === 1) { const a = rand(1, 10), b = rand(1, 10), h = a + b; const x = opsinya(h, [h + 1, h - 1 || h + 2, h + 2]); return { q: `Berapa hasil dari <b>${a} + ${b}</b>?`, ...x, f: `${a} + ${b} = ${h}` }; }
      if (lv === 2) { const a = rand(10, 20), b = rand(1, 9), h = a - b; const x = opsinya(h, [h + 1, h + 2, h - 1 || h + 3]); return { q: `Berapa hasil dari <b>${a} − ${b}</b>?`, ...x, f: `${a} − ${b} = ${h}` }; }
      if (lv === 3) { const a = rand(2, 5), b = rand(2, 5), h = a * b; const x = opsinya(h, [h + a, h - b || h + 1, h + 2]); return { q: `Berapa hasil dari <b>${a} × ${b}</b>?`, ...x, f: `${a} × ${b} = ${h}` }; }
      if (lv === 4) { const a = rand(3, 9), b = rand(3, 9), h = a * b; const x = opsinya(h, [h + a, h - b || h + 3, h + 5]); return { q: `Berapa hasil dari <b>${a} × ${b}</b>?`, ...x, f: `${a} × ${b} = ${h}` }; }
      if (lv === 5) { const b = rand(2, 5), c = rand(2, 5), a = b * c; const x = opsinya(c, [c + 1, c - 1 || c + 2, c + 2]); return { q: `Berapa hasil dari <b>${a} ÷ ${b}</b>?`, ...x, f: `${a} ÷ ${b} = ${c}` }; }
      if (lv === 6) { const b = rand(3, 9), c = rand(2, 9), a = b * c; const x = opsinya(c, [c + 1, c + 2, c - 1 || c + 3]); return { q: `Berapa hasil dari <b>${a} ÷ ${b}</b>?`, ...x, f: `${a} ÷ ${b} = ${c}` }; }
      if (lv === 7) { const a = rand(2, 9), b = rand(2, 9), c = rand(1, 9), h = a * b + c; const x = opsinya(h, [h + 1, h - c || h + 2, h + 5]); return { q: `Berapa hasil dari <b>${a} × ${b} + ${c}</b>?`, ...x, f: `Kerjakan perkalian dulu: ${a * b} + ${c} = ${h}` }; }
      if (lv === 8) { const a = rand(10, 30), b = rand(2, 9), c = rand(2, 9), h = a + b * c; const x = opsinya(h, [h + b, h - c || h + 1, h + 10]); return { q: `Berapa hasil dari <b>${a} + ${b} × ${c}</b>?`, ...x, f: `Perkalian dulu: ${a} + ${b * c} = ${h}` }; }
      if (lv === 9) { const d = rand(2, 6), p1 = rand(1, 4), p2 = rand(1, 4), h = `${p1 + p2}/${d}`; const x = opsinya(h, [`${p1 + p2 + 1}/${d}`, `${p1 * p2}/${d}`, `${p1 + p2}/${d + 1}`]); return { q: `<b>${p1}/${d} + ${p2}/${d}</b> = ?`, ...x, f: `Penyebut sama: (${p1}+${p2})/${d} = ${h}` }; }
      const y = rand(2, 6), c = rand(2, 9), x = y * c; const h = c; const z = opsinya(h, [h + 1, h + 2, h - 1 || h + 3]);
      return { q: `Ani memiliki <b>${x} permen</b>, dibagikan rata kepada <b>${y} teman</b>. Masing-masing mendapat…`, ...z, f: `${x} ÷ ${y} = ${c} permen` };
    }

    function mapLevel() {
      stage.innerHTML = "";
      stage.appendChild(el(`<div class="quiz-wrap" style="text-align:center">
        <h2 style="font-size:26px">🗺️ Peta Petualangan</h2>
        <p style="color:var(--ink-soft);font-weight:700">Selesaikan level untuk membuka level berikutnya. Tiap level = 6 soal!</p>
      </div>`));
      const map = el(`<div class="level-map"></div>`);
      for (let lv = 1; lv <= TOTAL_LEVEL; lv++) {
        const terbuka = lv === 1 || (levels[lv - 1] || 0) >= 1;
        const bintang = levels[lv] || 0;
        const node = el(`<button class="level-node ln-tier${Math.ceil(lv / 2)} ${terbuka ? "" : "locked"}">
          ${terbuka ? lv : "🔒"}
          <span class="ln-stars">${bintang ? "⭐".repeat(bintang) : ""}</span>
        </button>`);
        if (terbuka) node.addEventListener("click", () => { sfx("click"); mainLevel(lv); });
        map.appendChild(node);
      }
      stage.appendChild(map);
      stage.appendChild(el(`<p style="text-align:center;color:var(--ink-soft);font-weight:600;font-size:14px">
        💡 Level 1–2 penjumlahan & pengurangan • 3–4 perkalian • 5–6 pembagian • 7–8 campuran • 9–10 pecahan & cerita</p>`));
    }

    function mainLevel(lv) {
      const soal = [];
      for (let i = 0; i < 6; i++) soal.push(buatSoal(lv));
      runQuiz(stage, {
        title: `Matematika Petualangan — Level ${lv}`,
        questions: soal,
        gameId,
        cols: "cols-2",
        onFinish: (correct, stars) => {
          levels[lv] = Math.max(levels[lv] || 0, stars);
          const pr = Core.state.progress[gameId] || {};
          pr.levels = levels;
          Core.state.progress[gameId] = pr;
          Core.save();
          setBest(gameId, lv);
        },
        retryLabel: `Ulangi Level ${lv}`,
        retry: () => mainLevel(lv),
        home: "#/sd",
        headline: lv >= 8 ? "Nyaris Ahli Matematika!" : "Level Selesai!",
      });
    }

    mapLevel();
  };

  /* =====================================================
     SD — Kuis Bahasa & Jelajah IPA
     ===================================================== */
  GAMES["sd/bahasa"] = function (stage) {
    runQuiz(stage, {
      title: "Kuis Bahasa Indonesia",
      questions: shuffle(DATA.sdBahasa).slice(0, 10),
      gameId: "sd/bahasa",
      retryLabel: "Coba Set Soal Baru",
      home: "#/sd",
      headline: "Juara Bahasa!",
    });
  };
  GAMES["sd/ipa"] = function (stage) {
    runQuiz(stage, {
      title: "Jelajah IPA",
      questions: shuffle(DATA.sdIpa).slice(0, 10),
      gameId: "sd/ipa",
      retryLabel: "Jelajah Lagi",
      home: "#/sd",
      headline: "Penjelajah Sains!",
    });
  };

  /* =====================================================
     SD — Robot Koding
     ===================================================== */
  GAMES["sd/koding"] = function (stage) {
    const PUZZLES = [
      { grid: ["R...F", ".....", ".....", ".....", "....."], hint: "Robot harus berjalan lurus ke kanan." },
      { grid: ["R....", ".....", "...F.", ".....", "....."], hint: "Kanan dulu, lalu turun." },
      { grid: ["R...X", "....X", "..FX.", ".....", "....."], hint: "Ada dinding! Jalan menurun lalu mendekat." },
      { grid: ["R.X..", "..X..", "..XF.", ".....", "....."], hint: "Kelilingi dinding dari sisi kiri." },
      { grid: ["..F..", ".XXX.", ".....", ".XXX.", "R...."], hint: "Naik ke atas, lalu belok ke kanan." },
    ];
    let idx = 0;

    function mainPuzzle() {
      const pz = PUZZLES[idx];
      const grid = pz.grid.map(r => r.split(""));
      let pos = null, goal = null;
      grid.forEach((row, r) => row.forEach((c, col) => {
        if (c === "R") { pos = { r, c: col }; grid[r][col] = "."; }
        if (c === "F") { goal = { r, c: col }; grid[r][col] = "."; }
      }));
      let cmds = [];
      let running = false;

      stage.innerHTML = "";
      stage.appendChild(el(`<div class="quiz-wrap" style="text-align:center">
        <h2 style="font-size:24px">🤖 Puzzle ${idx + 1} dari ${PUZZLES.length}</h2>
        <p style="color:var(--ink-soft);font-weight:700">Susun perintah panah, lalu tekan <b>Jalankan</b> untuk mengantar robot 🤖 ke bendera 🏁</p>
      </div>`));
      const wrap = el(`<div class="robot-stage"></div>`);

      /* Papan */
      const board = el(`<div class="robot-grid"></div>`);
      const cellEls = [];
      for (let r = 0; r < 5; r++) {
        cellEls.push([]);
        for (let c = 0; c < 5; c++) {
          const cell = el(`<div class="robot-cell ${pz.grid[r][c] === "X" ? "wall" : ""}"></div>`);
          cellEls[r].push(cell);
          board.appendChild(cell);
        }
      }
      function paint() {
        for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
          const isWall = pz.grid[r][c] === "X";
          cellEls[r][c].className = "robot-cell " + (isWall ? "wall" : "") + (r === goal.r && c === goal.c ? " goal" : "");
          let isi = "";
          if (r === goal.r && c === goal.c) isi = "🏁";
          if (pos && r === pos.r && c === pos.c) isi = "🤖";
          cellEls[r][c].textContent = isi;
        }
      }
      paint();

      /* Panel perintah */
      const panel = el(`<div class="robot-panel">
        <h3 style="font-size:15px;color:var(--ink-soft)">📝 Rencana Perintah</h3>
        <div class="cmd-slot"></div>
        <div class="cmd-pad">
          <span></span><button class="cmd-btn" data-c="up">⬆️</button><span></span>
          <button class="cmd-btn" data-c="left">⬅️</button><button class="cmd-btn" data-c="down">⬇️</button><button class="cmd-btn" data-c="right">➡️</button>
          <button class="cmd-run">▶️ Jalankan!</button>
        </div>
        <button class="cmd-clear">🗑️ Hapus Semua</button>
        <p style="font-size:13px;color:var(--ink-soft);font-weight:700">💡 ${pz.hint}</p>
      </div>`);
      const slot = panel.querySelector(".cmd-slot");

      function paintSlot() {
        slot.innerHTML = "";
        if (!cmds.length) slot.innerHTML = `<span style="font-size:13px;color:#a6a3bd;font-weight:700">Belum ada perintah…</span>`;
        cmds.forEach((c, i) => {
          const t = el(`<span class="cmd-token" title="Ketuk untuk hapus">${{ up: "⬆️", down: "⬇️", left: "⬅️", right: "➡️" }[c]} ${i + 1}</span>`);
          t.addEventListener("click", () => { if (!running) { cmds.splice(i, 1); paintSlot(); } });
          slot.appendChild(t);
        });
      }
      panel.querySelectorAll(".cmd-btn").forEach(b => b.addEventListener("click", () => {
        if (running) return;
        if (cmds.length >= 12) { toast("Maksimal 12 perintah ya!", "✋"); return; }
        sfx("click"); cmds.push(b.dataset.c); paintSlot();
      }));
      panel.querySelector(".cmd-clear").addEventListener("click", () => { if (!running) { cmds = []; paintSlot(); } });

      const delta = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
      panel.querySelector(".cmd-run").addEventListener("click", () => {
        if (running) return;
        if (!cmds.length) { toast("Susun dulu perintahnya!", "🤖"); return; }
        running = true;
        pos = { r: pos.r, c: pos.c };
        let i = 0, kena = false;
        const step = () => {
          if (i >= cmds.length) { selesai(); return; }
          const [dr, dc] = delta[cmds[i++]];
          const nr = pos.r + dr, nc = pos.c + dc;
          if (nr < 0 || nr > 4 || nc < 0 || nc > 4 || pz.grid[nr][nc] === "X") { kena = true; selesai(); return; }
          pos = { r: nr, c: nc };
          sfx("click"); paint();
          setTimeout(step, 380);
        };
        const selesai = () => {
          running = false;
          if (kena) { sfx("no"); toast("Aduh, robot nabrak! Coba atur ulang rencananya.", "💥"); return; }
          if (pos.r === goal.r && pos.c === goal.c) menang();
          else { sfx("no"); toast("Robot belum sampai bendera. Tambah/ubah perintahmu!", "🎯"); }
        };
        step();
      });

      function menang() {
        sfx("win"); confetti();
        addXp(30);
        const solved = idx + 1;
        recordRound("sd/koding", 1, 1, 3);
        setBest("sd/koding", Math.max((Core.state.progress["sd/koding"] || {}).best || 0, solved));
        toast(`Puzzle ${solved} tuntas! +30 XP`, "🤖");
        setTimeout(() => {
          idx++;
          if (idx < PUZZLES.length) mainPuzzle();
          else {
            stage.innerHTML = "";
            roundResult(stage, {
              correct: PUZZLES.length, total: PUZZLES.length, stars: 3, xp: PUZZLES.length * 30, coins: 0,
              gameId: "sd/koding", retryLabel: "Main dari Awal",
              retry: () => { idx = 0; mainPuzzle(); },
              home: "#/sd",
              headline: "Robot Master! 🤖",
            });
          }
        }, 900);
      }

      wrap.appendChild(board); wrap.appendChild(panel);
      stage.appendChild(wrap);
      paintSlot();
    }

    mainPuzzle();
  };
})();
