/* ============================================================
   BelajarSeru! — Game Engine: Dunia SMP & SMA
   ============================================================ */
"use strict";

(() => {
  const { GAMES, runQuiz, shuffle, rand, el, sfx, toast, confetti, addXp, recordRound, setBest, roundResult, starsFor } = Core;

  /* =====================================================
     SMP — Kuis Matematika & IPA-IPS
     ===================================================== */
  GAMES["smp/matika"] = function (stage) {
    const soal = [];
    for (let i = 0; i < 10; i++) soal.push(DATA.genSmpMatika());
    runQuiz(stage, {
      title: "Kuis Matematika SMP",
      questions: soal,
      gameId: "smp/matika",
      cols: "cols-2",
      retryLabel: "Set Soal Baru",
      home: "#/smp",
      headline: "Matematikamu Mengkilap!",
    });
  };

  GAMES["smp/ips"] = function (stage) {
    runQuiz(stage, {
      title: "Kuis IPA & IPS",
      questions: shuffle(DATA.smpIpaIps).slice(0, 10),
      gameId: "smp/ips",
      retryLabel: "Coba Set Soal Baru",
      home: "#/smp",
      headline: "Wawasanmu Luas!",
    });
  };

  /* =====================================================
     SMP — Lab Fisika: Lontaran (gerak parabola)
     ===================================================== */
  GAMES["smp/lab"] = function (stage) {
    const W = 720, H = 300, GROUND = 262, LAUNCHER_X = 60, G = 980;
    let level = Math.min(((Core.state.progress["smp/lab"] || {}).best || 0) + 1, 5);
    let targetX = 0, trail = [], ball = null, anim = null;

    stage.innerHTML = "";
    stage.appendChild(el(`<div class="lab-wrap">
      <div style="text-align:center;margin-bottom:10px">
        <h2 style="font-size:24px">🎯 Lab Fisika: Lontaran</h2>
        <p style="color:var(--ink-soft);font-weight:700">Atur <b>sudut</b> dan <b>kekuatan</b> katapel agar bola menyentuh sasaran. Level <b id="lab-lv"></b>/5</p>
      </div>
      <div class="lab-canvas-box"><canvas id="labCanvas" width="${W}" height="${H}"></canvas></div>
      <div class="lab-controls">
        <div class="lab-slider"><label>Sudut lontaran <span id="lab-angle-v">45°</span></label><input type="range" id="lab-angle" min="20" max="80" value="45" /></div>
        <div class="lab-slider"><label>Kekuatan <span id="lab-power-v">70</span></label><input type="range" id="lab-power" min="30" max="100" value="70" /></div>
        <button class="lab-launch" id="lab-fire">🚀 Lepaskan!</button>
      </div>
      <div class="panel" style="margin-top:14px">
        <b>Bagaimana ini bekerja? 🔬</b>
        <p style="font-weight:600;color:var(--ink-soft);font-size:14px;line-height:1.6;margin-top:6px">
          Bola bergerak mengikuti <b>gerak parabola</b>: kecepatan mendatar (vx) tetap, sementara gravitasi (g = 9,8 m/s²)
          menariknya ke bawah. Jarak terjauh dicapai pada sudut <b>45°</b>. Sudut terlalu kecil = terlalu rendah,
          terlalu besar = melayang tinggi tapi jatuh dekat. Coba sendiri untuk membuktikannya!</p>
      </div>
    </div>`));

    const canvas = stage.querySelector("#labCanvas");
    const ctx = canvas.getContext("2d");
    const lvLabel = stage.querySelector("#lab-lv");

    function rangeFor(lv) { return [ [360, 430], [430, 500], [500, 560], [560, 620], [620, 680] ][lv - 1]; }

    function newTarget() {
      const [a, b] = rangeFor(level);
      targetX = rand(a, b);
      trail = []; ball = null;
      paint();
    }

    function paint() {
      lvLabel.textContent = level;
      ctx.clearRect(0, 0, W, H);
      /* langit & tanah */
      ctx.fillStyle = "#dbeafe"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#86efac"; ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = "#4ade80"; ctx.fillRect(0, GROUND, W, 6);
      /* katapel */
      ctx.font = "34px serif"; ctx.textAlign = "center";
      ctx.fillText("🏹", LAUNCHER_X, GROUND - 6);
      /* sasaran */
      ctx.fillText("🎯", targetX, GROUND - 4);
      /* jejak */
      trail.forEach((p, i) => {
        ctx.globalAlpha = i / trail.length * .7 + .2;
        ctx.fillStyle = "#7c3aed";
        ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      /* bola */
      if (ball) { ctx.font = "24px serif"; ctx.fillText("🔴", ball.x, ball.y); }
    }

    function fire() {
      if (ball || anim) return;
      const angle = parseInt(stage.querySelector("#lab-angle").value, 10) * Math.PI / 180;
      const v0 = parseInt(stage.querySelector("#lab-power").value, 10) * 8;
      ball = { x: LAUNCHER_X, y: GROUND - 26, vx: v0 * Math.cos(angle), vy: -v0 * Math.sin(angle) };
      trail = [];
      let last = performance.now();
      sfx("click");
      const loop = (now) => {
        const dt = Math.min(.032, (now - last) / 1000); last = now;
        ball.x += ball.vx * dt;
        ball.vy += G * dt;
        ball.y += ball.vy * dt;
        if (trail.length === 0 || Math.abs(trail[trail.length - 1][0] - ball.x) > 14) trail.push([ball.x, ball.y]);
        paint();
        const landed = ball.y >= GROUND - 14;
        const kenaTarget = Math.abs(ball.x - targetX) < 26 && ball.y >= GROUND - 60;
        if (kenaTarget) { selesai(true); return; }
        if (landed) { selesai(Math.abs(ball.x - targetX) < 26); return; }
        if (ball.x > W + 40) { selesai(false); return; }
        anim = requestAnimationFrame(loop);
      };
      anim = requestAnimationFrame(loop);
    }

    function selesai(kena) {
      cancelAnimationFrame(anim); anim = null;
      const jarak = Math.round((ball.x - LAUNCHER_X) / 10);
      ball = null;
      if (kena) {
        sfx("win"); confetti();
        addXp(40);
        recordRound("smp/lab", 1, 1, 3);
        setBest("smp/lab", level);
        toast(`Sasaran kena! Jarak ${jarak} m. +40 XP`, "🎯");
        setTimeout(() => {
          level = level < 5 ? level + 1 : 1;
          newTarget();
        }, 1200);
      } else {
        sfx("no");
        recordRound("smp/lab", 0, 1, 0);
        const hint = jarak < (targetX - LAUNCHER_X) / 10
          ? "Masih kurang jauh — coba besarkan kekuatan atau dekatkan sudut ke 45°."
          : "Terlalu jauh — kurangi kekuatan atau kecilkan sudut.";
        toast(`Meleset (${jarak} m). ${hint}`, "💨");
        paint();
      }
    }

    stage.querySelector("#lab-fire").addEventListener("click", fire);
    ["lab-angle", "lab-power"].forEach(id => stage.querySelector("#" + id).addEventListener("input", (e) => {
      stage.querySelector("#" + id.replace("lab-", "lab-") + "-v").textContent = e.target.value + (id === "lab-angle" ? "°" : "");
    }));
    newTarget();
  };

  /* =====================================================
     SMA — Simulasi UTBK
     ===================================================== */
  GAMES["sma/utbk"] = function (stage) {
    runQuiz(stage, {
      title: "Simulasi UTBK",
      questions: shuffle(DATA.utbk).slice(0, 12),
      gameId: "sma/utbk",
      timer: 600,
      customResult: (correct, stars, results, qs) => {
        const skor = Math.round(correct / qs.length * 100);
        setBest("sma/utbk", skor);
        /* Analisis per kategori */
        const perKat = {};
        qs.forEach((q, i) => {
          const k = q.kat || "Umum";
          perKat[k] = perKat[k] || { benar: 0, total: 0 };
          perKat[k].total++;
          if (results[i]) perKat[k].benar++;
        });
        const s = [1, 2, 3].map(i => `<span class="${i <= stars ? "" : "off"}">⭐</span>`).join("");
        const baris = Object.entries(perKat).map(([k, v]) => {
          const pct = Math.round(v.benar / v.total * 100);
          return `<div class="career-bar">
            <div class="cb-label"><span>${k}</span><span>${v.benar}/${v.total} (${pct}%)</span></div>
            <div class="cb-track"><div class="cb-fill" style="width:${pct}%"></div></div>
          </div>`;
        }).join("");
        const saran = skor >= 85 ? "Luar biasa! Pertahankan dan coba soal-soal HOTS untuk tantangan lebih."
          : skor >= 70 ? "Bagus! Perkuat kategori dengan persentase terendah, lalu ulangi simulasi minggu depan."
          : "Jangan menyerah! Pelajari kembali pembahasan soal yang salah, lalu coba lagi. Konsistensi adalah kuncinya.";
        stage.innerHTML = "";
        const card = el(`<div class="result-card">
          <div class="r-emoji">${skor >= 85 ? "🏆" : skor >= 70 ? "🎓" : "💪"}</div>
          <h2>Skor Simulasi: <span style="color:var(--purple)">${skor}</span></h2>
          <div class="result-stars">${s}</div>
          <div class="result-stats">
            <span class="stat-chip">✅ ${correct}/${qs.length} benar</span>
            <span class="stat-chip">⚡ +${correct * 10 + stars * 10} XP</span>
          </div>
          <div style="text-align:left;margin:14px 0">${baris}</div>
          <div class="q-fact" style="text-align:left">📌 ${saran}</div>
          <div class="result-actions">
            <button class="btn-primary">Coba Set Baru</button>
            <a class="btn-ghost" href="#/sma">Kembali</a>
          </div>
        </div>`);
        card.querySelector(".btn-primary").addEventListener("click", () => GAMES["sma/utbk"](stage));
        stage.appendChild(card);
        if (stars >= 2) { sfx("win"); confetti(); }
      },
      home: "#/sma",
    });
  };

  /* =====================================================
     SMA — Kartu Hafalan (flashcards)
     ===================================================== */
  GAMES["sma/kartu"] = function (stage) {
    const kartu = shuffle(DATA.flashcards.map((k, i) => ({ ...k, idx: i })));
    let cur = 0;
    const known = new Set((Core.state.progress["sma/kartu"] || {}).known || []);

    stage.innerHTML = "";
    stage.appendChild(el(`<div class="quiz-wrap" style="text-align:center">
      <h2 style="font-size:24px">🃏 Kartu Hafalan</h2>
      <p style="color:var(--ink-soft);font-weight:700">Ketuk kartu untuk membalik. Tandai yang sudah kamu hafal!</p>
    </div>`));
    const zone = el(`<div class="flash-zone"></div>`);
    stage.appendChild(zone);

    function paint() {
      const k = kartu[cur];
      zone.innerHTML = "";
      zone.appendChild(el(`<p style="font-weight:800;color:var(--ink-soft)">Kartu ${cur + 1} / ${kartu.length} • ${known.size} sudah hafal</p>`));
      const card = el(`<div class="flash-card ${k.tampakBelakang ? "flipped" : ""}">
        <div class="flash-inner">
          <div class="flash-face front"><div>${k.depan}<small>Ketuk untuk melihat jawaban 👆</small></div></div>
          <div class="flash-face back"><div>${k.belakang}</div></div>
        </div>
      </div>`);
      card.addEventListener("click", () => { k.tampakBelakang = !k.tampakBelakang; card.classList.toggle("flipped"); sfx("click"); });
      zone.appendChild(card);
      const nav = el(`<div>
        <div class="flash-nav">
          <button class="btn-ghost" id="fc-prev">← Sebelumnya</button>
          <button class="btn-primary" id="fc-known">${known.has(k.idx) ? "✅ Sudah Hafal" : "Sudah Hafal!"}</button>
          <button class="btn-ghost" id="fc-next">Berikutnya →</button>
        </div>
        <div class="flash-nav" style="margin-top:10px">
          <button class="btn-ghost" id="fc-done" style="width:100%">🏁 Selesai Sesi Belajar</button>
        </div>
      </div>`);
      zone.appendChild(nav);
      nav.querySelector("#fc-prev").addEventListener("click", () => { cur = (cur - 1 + kartu.length) % kartu.length; paint(); });
      nav.querySelector("#fc-next").addEventListener("click", () => { cur = (cur + 1) % kartu.length; paint(); });
      nav.querySelector("#fc-known").addEventListener("click", (e) => {
        if (known.has(k.idx)) { known.delete(k.idx); toast("Ditandai belum hafal", "🔄"); }
        else {
          known.add(k.idx);
          addXp(5);
          toast("Hebat! +5 XP", "🧠");
          if (known.size === kartu.length) { confetti(); toast("Semua kartu sudah terhafal. Luar biasa!", "🎉"); }
        }
        simpanKnown();
        paint();
      });
      nav.querySelector("#fc-done").addEventListener("click", () => {
        const correct = known.size, total = kartu.length;
        const stars = starsFor(correct, total);
        addXp(stars * 10);
        recordRound("sma/kartu", correct, total, stars);
        roundResult(stage, {
          correct, total, stars, xp: stars * 10, coins: 0, gameId: "sma/kartu",
          retryLabel: "Belajar Lagi", retry: () => GAMES["sma/kartu"](stage),
          home: "#/sma",
          headline: correct === total ? "Hafalan Sempurna!" : "Sesi Hafalan Selesai",
        });
      });
    }
    function simpanKnown() {
      const pr = Core.state.progress["sma/kartu"] || {};
      pr.known = [...known];
      Core.state.progress["sma/kartu"] = pr;
      Core.save();
    }
    paint();
  };

  /* =====================================================
     SMA — Petunjuk Karier
     ===================================================== */
  GAMES["sma/karier"] = function (stage) {
    const qs = shuffle([...DATA.careerQuestions]);
    let idx = 0;
    const skor = {};
    Object.keys(DATA.careerFields).forEach(k => skor[k] = 0);

    function paint() {
      if (idx >= qs.length) { hasil(); return; }
      const q = qs[idx];
      stage.innerHTML = "";
      const wrap = el(`<div class="quiz-wrap"></div>`);
      wrap.appendChild(el(`<div class="quiz-top"><span class="quiz-count">Pertanyaan ${idx + 1} dari ${qs.length}</span></div>`));
      wrap.appendChild(el(`<div class="quiz-progress"><div class="q-fill" style="width:${idx / qs.length * 100}%"></div></div>`));
      const card = el(`<div class="question-card"></div>`);
      card.appendChild(el(`<div class="q-prompt">${q.q}</div>`));
      const grid = el(`<div class="options"></div>`);
      q.o.forEach(opt => {
        const b = el(`<button class="opt-btn" style="font-family:var(--font-body)">${opt.t}</button>`);
        b.addEventListener("click", () => { skor[opt.f] += 1; idx++; sfx("ok"); paint(); });
        grid.appendChild(b);
      });
      card.appendChild(grid);
      wrap.appendChild(card);
      stage.appendChild(wrap);
    }

    function hasil() {
      stage.innerHTML = "";
      addXp(60);
      recordRound("sma/karier", 1, 1, 3);
      const urut = Object.entries(skor).sort((a, b) => b[1] - a[1]);
      const juara = DATA.careerFields[urut[0][0]];
      const total = qs.length;
      const bars = urut.map(([k, v]) => {
        const f = DATA.careerFields[k];
        const pct = Math.round(v / total * 100);
        return `<div class="career-bar">
          <div class="cb-label"><span>${f.emoji} ${f.nama}</span><span>${pct}%</span></div>
          <div class="cb-track"><div class="cb-fill" style="width:${pct}%"></div></div>
        </div>`;
      }).join("");
      const card = el(`<div class="result-card" style="max-width:600px">
        <div class="r-emoji">${juara.emoji}</div>
        <h2>Cocoknya: ${juara.nama}</h2>
        <div style="max-width:340px;margin:10px auto">${bars}</div>
        <p style="font-weight:600;color:var(--ink-soft);line-height:1.6;margin:10px 0">${juara.desk}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:12px 0">
          ${juara.jurusan.map(j => `<span class="pill" style="background:#ede9fe;color:var(--purple-deep)">${j}</span>`).join("")}
        </div>
        <p style="font-size:12.5px;color:var(--ink-soft);font-weight:700">⚠️ Hasil ini hanya petunjuk awal, bukan vonis. Diskusikan dengan guru BK dan terus eksplorasi minatmu!</p>
        <div class="result-actions">
          <button class="btn-primary">Uji Ulang Minat</button>
          <a class="btn-ghost" href="#/sma">Kembali</a>
        </div>
      </div>`);
      card.querySelector(".btn-primary").addEventListener("click", () => { idx = 0; Object.keys(skor).forEach(k => skor[k] = 0); paint(); });
      stage.appendChild(card);
      sfx("win"); confetti();
    }

    paint();
  };
})();
