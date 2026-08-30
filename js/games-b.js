/* ============================================================
   BelajarSeru! 3D — games-b.js
   Game SMP: lab-lontaran, lab-ph, kuis-kilat
   Game SMA: utbk-sim, flashcard-3d, grafik-fungsi, karier
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function stage(title, inner, statusHtml) {
    return `
      <div class="view" style="max-width:820px;margin:0 auto">
        <div class="game-head" style="margin-top:16px">
          <button class="btn btn-ghost" data-exit>← Keluar</button>
          <h2 style="margin:0">${title}</h2>
          <div class="game-status">${statusHtml || ''}</div>
        </div>
        <div class="game-stage">${inner}</div>
      </div>`;
  }
  function hookFinish(el, gameId, scorePct, title, extra) {
    const stars = scorePct >= 90 ? 3 : scorePct >= 65 ? 2 : scorePct >= 40 ? 1 : 0;
    el.querySelector('.game-stage').innerHTML = `
      <div class="reward-pop">
        <div class="result-stars">${'⭐'.repeat(stars)}<span class="${stars < 3 ? 'dim' : 'hidden'}">${'⭐'.repeat(3 - stars)}</span></div>
        <h2 class="result-title">${title}</h2>
        <p class="result-title" style="font-weight:700">${extra || ''}</p>
        <div class="btn-row" style="justify-content:center;margin-top:14px">
          <button class="btn btn-leaf btn-big" data-replay>🔁 Main Lagi</button>
          <button class="btn btn-sun btn-big" data-exit2>🏠 Selesai</button>
        </div>
      </div>`;
    el.querySelector('[data-replay]').onclick = () => BS.openGame(gameId, true);
    el.querySelector('[data-exit2]').onclick = () => { location.hash = '#/petualangan'; };
    BS.gameDone(gameId, scorePct);
    if (scorePct >= 65) BS.fx.confetti(50);
    BS.sound('fanfare');
  }

  BS.GAMES = BS.GAMES || {};

  /* ================= SMP 1: LAB LONTARAN ================= */
  BS.GAMES['lab-lontaran'] = {
    name: 'Lab Fisika: Lontaran', icon: '🎯', world: 'smp', worldName: 'Dunia SMP', sticker: 'sky',
    desc: 'Atur sudut & kecepatan untuk mengenai target. Belajar gerak parabola ala PhET!',
    render(el) {
      let angle = 45, speed = 22, targetX = ri(30, 80), tries = 0, hits = 0;
      el.innerHTML = stage('🎯 Lab Lontaran', `
        <p style="font-weight:800;text-align:center">Kenai target 🎯 dengan meriam laba-laba! G = 10 m/s²</p>
        <canvas class="game-canvas" id="proj-c" height="300"></canvas>
        <div class="lab-controls" style="grid-template-columns:1fr 1fr;max-width:560px;margin:12px auto">
          <div><label>Sudut tembak: <b id="a-val">${angle}°</b></label><input type="range" id="a-slider" min="10" max="80" value="${angle}"></div>
          <div><label>Kecepatan awal: <b id="v-val">${speed} m/s</b></label><input type="range" id="v-slider" min="10" max="40" value="${speed}"></div>
        </div>
        <div class="btn-row" style="justify-content:center">
          <button class="btn btn-coral btn-big" id="fire">🚀 Tembak!</button>
          <button class="btn btn-sky" id="hint">💡 Rumus</button>
        </div>
        <div class="game-msg" id="g-msg"></div>`,
        `<span class="gs-pill">🎯 ${hits}/${tries}</span>`);
      el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/smp';
      const c = el.querySelector('#proj-c');
      function fit() { c.width = c.clientWidth || 680; }
      fit();
      el.querySelector('#a-slider').oninput = (e) => { angle = +e.target.value; el.querySelector('#a-val').textContent = angle + '°'; drawScene(); };
      el.querySelector('#v-slider').oninput = (e) => { speed = +e.target.value; el.querySelector('#v-val').textContent = speed + ' m/s'; drawScene(); };
      el.querySelector('#hint').onclick = () => BS.modal(`<h2>Rumus Gerak Parabola</h2><p style="font-weight:600">Jarak x = v·cos(θ)·t &nbsp;•&nbsp; Tinggi y = v·sin(θ)·t − ½·g·t²</p><p style="font-weight:600">Jarak maksimum terjadi saat <b>θ = 45°</b> (tanpa hambatan udara). Jarak = v²·sin(2θ)/g.</p><div class="btn-row" style="justify-content:flex-end"><button class="btn" data-md-close>OK!</button></div>`);
      function drawScene(traj) {
        const ctx = c.getContext('2d');
        const W = c.width, H = c.height, ground = H - 26;
        const sx = (x) => 20 + (x / 110) * (W - 40), sy = (y) => ground - (y / 45) * (H - 50);
        ctx.clearRect(0, 0, W, H);
        // langit & tanah
        ctx.fillStyle = '#EAF7FF'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#7ED957'; ctx.fillRect(0, ground, W, 26);
        ctx.strokeStyle = '#2A2140'; ctx.lineWidth = 3; ctx.strokeRect(0, 0, W, H);
        // target
        ctx.font = '26px serif'; ctx.fillText('🎯', sx(targetX) - 13, ground - 2);
        // meriam
        ctx.font = '24px serif'; ctx.fillText('💥', sx(0) - 12, ground - 2);
        // sudut guide
        ctx.beginPath(); ctx.moveTo(sx(0), ground);
        ctx.lineTo(sx(0) + 46 * Math.cos(angle * Math.PI / 180), ground - 46 * Math.sin(angle * Math.PI / 180));
        ctx.strokeStyle = '#FF6B5E'; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
        if (traj) {
          ctx.beginPath(); ctx.moveTo(sx(0), sy(0));
          traj.forEach((p) => ctx.lineTo(sx(p.x), sy(p.y)));
          ctx.strokeStyle = '#9B5CF6'; ctx.lineWidth = 3.5; ctx.stroke();
          const last = traj[traj.length - 1];
          ctx.font = '24px serif'; ctx.fillText('🪨', sx(last.x) - 10, sy(last.y) + 10);
        }
        ctx.fillStyle = '#2A2140'; ctx.font = 'bold 12px Nunito';
        ctx.fillText(`Target: ±${targetX} m`, sx(targetX) - 34, ground - 34);
      }
      drawScene();
      el.querySelector('#fire').onclick = () => {
        tries++;
        const rad = angle * Math.PI / 180, g = 10, dt = 0.05;
        const traj = []; let t = 0, x = 0, y = 0;
        while (y >= 0 && x < 130 && t < 30) {
          x = speed * Math.cos(rad) * t;
          y = speed * Math.sin(rad) * t - 0.5 * g * t * t;
          traj.push({ x, y }); t += dt;
        }
        const land = traj[traj.length - 1];
        const miss = Math.abs(land.x - targetX);
        const hit = miss <= 4;
        if (hit) { hits++; BS.sound('correct'); BS.fx.confetti(24); }
        else BS.sound('wrong');
        drawScene(traj);
        el.querySelector('.game-status').innerHTML = `<span class="gs-pill">🎯 ${hits}/${tries}</span>`;
        const msg = el.querySelector('#g-msg');
        msg.textContent = hit ? `🎯 KENA! Jarak ${land.x.toFixed(1)} m (target ${targetX} m). ${hits >= 3 ? 'Anak panah fisika!' : 'Coba target baru!'}` : `Meleset ${miss.toFixed(1)} m — mendarat di ${land.x.toFixed(1)} m. ${land.x < targetX ? 'Tambah kecepatan/sudut' : 'Kurangi kecepatan'}!`;
        if (hit && tries >= 3 || tries >= 6) {
          setTimeout(() => hookFinish(el, 'lab-lontaran', Math.min(100, Math.round(hits / Math.max(tries, 3) * 100)), hits >= 3 ? 'Ahli balistik parabola! 🚀' : 'Kerjakan lagi ya! 💪', `${hits} kena dari ${tries} tembakan`), 1400);
          if (hit) { targetX = ri(30, 80); tries = 0; hits = 0; }
        } else if (hit) { targetX = ri(30, 80); drawScene(); }
      };
    },
  };

  /* ================= SMP 2: LAB pH ================= */
  BS.GAMES['lab-ph'] = {
    name: 'Lab Kimia: pH', icon: '🧪', world: 'smp', worldName: 'Dunia SMP', sticker: 'leaf',
    desc: 'Campurkan larutan, amati warna indikator, tebak nilai pH-nya!',
    render(el) {
      const liquids = [
        { n: 'Air Sabun', ph: 9, c: '#B9E3FF' }, { n: 'Cuka', ph: 3, c: '#FFD9C2' }, { n: 'Air Jeruk', ph: 4, c: '#FFE28A' },
        { n: 'Soda Kue', ph: 11, c: '#D9F2D0' }, { n: 'Air Murni', ph: 7, c: '#EAEAF2' }, { n: 'Susu', ph: 6.5, c: '#FFFDF2' },
        { n: 'Pembersih Lantai', ph: 12, c: '#CDEFC9' }, { n: 'Coca-cola', ph: 2.5, c: '#5A3A22' },
      ];
      let score = 0, round = 0, total = 6;
      function phColor(p) {
        const stops = [[0, '#E23B3B'], [3, '#FF8C42'], [5, '#FFD23F'], [7, '#7ED957'], [9, '#3FA9F5'], [12, '#7B2FBE'], [14, '#4B0F72']];
        for (let i = 0; i < stops.length - 1; i++) {
          if (p <= stops[i + 1][0]) {
            const f = (p - stops[i][0]) / (stops[i + 1][0] - stops[i][0]);
            const mix = (a, b) => Math.round(a + (b - a) * f);
            const c1 = stops[i][1].match(/\w\w/g).map((x) => parseInt(x, 16));
            const c2 = stops[i + 1][1].match(/\w\w/g).map((x) => parseInt(x, 16));
            return `rgb(${c1.map((v, j) => mix(v, c2[j])).join(',')})`;
          }
        }
        return stops[stops.length - 1][1];
      }
      function ask() {
        const a = pick(liquids), b = pick(liquids.filter((l) => l !== a));
        const ph = +(((a.ph + b.ph) / 2)).toFixed(1);
        const col = phColor(ph);
        el.innerHTML = stage('🧪 Lab pH', `
          <p style="text-align:center;font-weight:800">Campurkan <b>${a.n}</b> + <b>${b.n}</b>. Perkirakan pH campurannya!</p>
          <div class="beaker-row">
            <div class="beaker"><div class="liquid" style="background:${a.c}"></div><span class="b-label">${a.n}</span></div>
            <div style="font-size:34px">➕</div>
            <div class="beaker"><div class="liquid" style="background:${b.c}"></div><span class="b-label">${b.n}</span></div>
            <div style="font-size:34px">🧪</div>
            <div class="beaker"><div class="liquid" style="background:${col};height:60%"></div><span class="b-label">Campuran</span></div>
          </div>
          <div class="ph-scale">${Array.from({ length: 14 }, (_, i) => `<i style="background:${phColor(i + 0.5)}" title="${i + 1}"></i>`).join('')}</div>
          <p style="text-align:center;font-size:.8rem;font-weight:800;color:var(--ink-soft)">Asam ◀ 1 — 7 Netral — 14 ▶ Basa</p>
          <div class="choice-row">${shuffle([...new Set([ph, Math.max(1, +(ph - 2).toFixed(1)), Math.min(14, +(ph + 2).toFixed(1)), ph > 7 ? +(ph - 1).toFixed(1) : +(ph + 1).toFixed(1)])]).map((v) => `<button class="choice-btn" data-v="${v}" style="font-size:1.2rem">pH ${v}</button>`).join('')}</div>
          <div class="game-msg" id="g-msg"></div>`,
          `<span class="gs-pill">Ronde ${round + 1}/${total}</span><span class="gs-pill">⭐ ${score}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/smp';
        el.querySelectorAll('.choice-btn').forEach((btn) => {
          btn.onclick = () => {
            round++;
            if (+btn.dataset.v === ph) { score++; btn.classList.add('correct'); BS.sound('correct'); el.querySelector('#g-msg').textContent = `Benar! pH ≈ ${ph} (${ph < 7 ? 'bersifat ASAM' : ph > 7 ? 'bersifat BASA' : 'NETRAL'}) 🎉`; }
            else { btn.classList.add('wrong'); BS.sound('wrong'); el.querySelector('#g-msg').textContent = `pH-nya ${ph} (${ph < 7 ? 'asam' : ph > 7 ? 'basa' : 'netral'})`; }
            el.querySelectorAll('.choice-btn').forEach((x) => x.disabled = true);
            setTimeout(() => { round < total ? ask() : hookFinish(el, 'lab-ph', Math.round(score / total * 100), score >= total * .65 ? 'Ahli kimia cilik! 🧑‍🔬' : 'Pelajari lagi skala pH ya!', `Skor: ${score}/${total}`); }, 1300);
          };
        });
      }
      ask();
    },
  };

  /* ================= SMP 3: KUIS KILAT ================= */
  BS.GAMES['kuis-kilat'] = {
    name: 'Kuis Kilat 60 Detik', icon: '⚡', world: 'smp', worldName: 'Dunia SMP', sticker: 'sun',
    desc: 'Sebanyak mungkin soal benar dalam 60 detik. Adrenalin + otak!',
    render(el) {
      const pool = BS.questionsOfGrade('smp-7', 'smp-8', 'smp-9');
      let score = 0, wrong = 0, left = 60, timer = null, cur = null, t0;
      function next() {
        cur = pick(pool);
        el.querySelector('.game-stage').innerHTML = `
          <span class="sticker sun">⚡ Mode Kilat</span>
          <div class="big-display" style="font-size:clamp(1.3rem,4.5vw,2rem);color:var(--sky-d)">${cur.q}</div>
          <div class="choice-row">${cur.opts.map((o, i) => `<button class="choice-btn" data-i="${i}" style="font-size:1.05rem;min-width:200px">${o}</button>`).join('')}</div>`;
        el.querySelectorAll('.choice-btn').forEach((b) => {
          b.onclick = () => {
            if (+b.dataset.i === cur.a) { score++; BS.sound('coin'); }
            else { wrong++; BS.sound('wrong'); }
            updateStatus(); next();
          };
        });
      }
      function updateStatus() {
        el.querySelector('.game-status').innerHTML = `<span class="gs-pill">⏱️ ${left}s</span><span class="gs-pill">⭐ ${score}</span><span class="gs-pill">❌ ${wrong}</span>`;
      }
      el.innerHTML = stage('⚡ Kuis Kilat', `
        <div style="text-align:center;padding:30px 0">
          <p style="font-weight:800;font-size:1.1rem">Jawab sebanyak mungkin dalam 60 detik!<br>Soal campuran MTK, IPA & IPS SMP.</p>
          <button class="btn btn-coral btn-big" id="go">⚡ MULAI!</button>
        </div>`, '');
      el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/smp';
      el.querySelector('#go').onclick = () => {
        t0 = Date.now(); updateStatus(); next();
        timer = setInterval(() => {
          left--; updateStatus();
          if (left <= 0) {
            clearInterval(timer);
            const acc = score + wrong ? Math.round(score / (score + wrong) * 100) : 0;
            hookFinish(el, 'kuis-kilat', acc, score >= 10 ? 'Kilat sejati! ⚡' : 'Terus asah kecepatanmu! ⏱️', `${score} benar, ${wrong} salah dalam 60 detik`);
          }
        }, 1000);
      };
    },
  };

  /* ================= SMA 1: SIMULATOR UTBK ================= */
  BS.GAMES['utbk-sim'] = {
    name: 'Simulator UTBK', icon: '🎓', world: 'sma', worldName: 'Dunia SMA', sticker: 'grape',
    desc: '25 soal • 25 menit • analisis kelemahan per subtes. Siapkan dirimu!',
    render(el) {
      const subs = [
        { t: 'utbk-pu', n: 'Potensi Unjuk Pemahaman' }, { t: 'utbk-ppu', n: 'Pengetahuan & Pemahaman Umum' },
        { t: 'utbk-pmm', n: 'Pemahaman Matematika' }, { t: 'utbk-lbi', n: 'Literasi B. Indonesia' }, { t: 'utbk-lbing', n: 'Literasi B. Inggris' },
      ];
      const qs = [];
      subs.forEach((s) => qs.push(...shuffle(BS.questionsByTopic[s.t] || []).slice(0, 5)));
      if (qs.length < 5) { el.innerHTML = stage('🎓 UTBK', '<p>Bank soal UTBK sedang dimuat...</p>', ''); return; }
      const N = Math.min(25, qs.length);
      const list = shuffle(qs).slice(0, N);
      let i = 0, answers = new Array(N).fill(-1), left = 25 * 60, timer = null;
      function fmt(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
      function draw() {
        const q = list[i];
        el.innerHTML = stage('🎓 Simulator UTBK', `
          <div class="utbk-timer ${left < 300 ? 'hurry' : ''}" id="utimer">⏱ ${fmt(left)}</div>
          <p style="text-align:center;font-weight:800;margin:8px 0">${subs.find((s) => s.t === q.t)?.n || q.t} · Soal ${i + 1}/${N}</p>
          <div class="card card-pad-lg q-card">
            <div class="q-text">${q.q}</div>
            <div class="opts">${q.opts.map((o, oi) => `
              <button class="opt ${answers[i] === oi ? 'correct' : ''}" data-i="${oi}"><span class="opt-key">${'ABCD'[oi]}</span><span>${o}</span></button>`).join('')}
            </div>
          </div>
          <div class="utbk-map">${list.map((_, j) => `<button class="um ${answers[j] >= 0 ? 'ans' : ''} ${j === i ? 'cur' : ''}" data-j="${j}">${j + 1}</button>`).join('')}</div>
          <div class="btn-row" style="justify-content:space-between;margin-top:14px">
            <button class="btn" id="u-prev" ${i === 0 ? 'disabled' : ''}>← Sebelumnya</button>
            <button class="btn btn-coral btn-big" id="u-fin">Kumpulkan 📤</button>
            <button class="btn" id="u-next" ${i === N - 1 ? 'disabled' : ''}>Lanjut →</button>
          </div>`, '');
        el.querySelector('[data-exit]').onclick = () => { clearInterval(timer); location.hash = '#/w/sma'; };
        el.querySelectorAll('.opt').forEach((b) => { b.onclick = () => { answers[i] = +b.dataset.i; BS.sound('pop'); draw(); }; });
        el.querySelectorAll('.um').forEach((b) => { b.onclick = () => { i = +b.dataset.j; draw(); }; });
        el.querySelector('#u-prev').onclick = () => { i--; draw(); };
        el.querySelector('#u-next').onclick = () => { i++; draw(); };
        el.querySelector('#u-fin').onclick = finish;
      }
      function finish() {
        clearInterval(timer);
        const per = {};
        let correct = 0;
        list.forEach((q, j) => {
          per[q.t] = per[q.t] || { ok: 0, n: 0 };
          per[q.t].n++;
          if (answers[j] === q.a) { per[q.t].ok++; correct++; }
        });
        const score = Math.round(correct / N * 100);
        BS.recordUTBK(per, score);
        el.querySelector('.game-stage').innerHTML = `
          <div class="reward-pop">
            <div class="result-stars">${'🎓'.repeat(1)}</div>
            <h2 class="result-title">Skor Simulasi: <span style="color:var(--grape-d)">${score}</span> / 100</h2>
            <p class="result-title" style="font-weight:700">Benar ${correct} dari ${N} soal</p>
            <div class="utbk-analysis">
              ${subs.filter((s) => per[s.t]).map((s) => {
                const p = per[s.t], pct = Math.round(p.ok / p.n * 100);
                return `<div class="bar-row"><b style="font-size:.8rem">${s.n}</b><div class="bar"><i style="width:${pct}%;background:${pct >= 60 ? 'var(--leaf)' : 'var(--coral)'}"></i></div><b>${pct}%</b></div>`;
              }).join('')}
            </div>
            <div class="card" style="margin-top:14px;background:#F1E9FF">
              <b>🦉 Saran Pipo:</b> ${(() => {
                const worst = subs.filter((s) => per[s.t]).sort((a, b) => per[a.t].ok / per[a.t].n - per[b.t].ok / per[b.t].n)[0];
                return `Fokuskan latihan pada <b>${worst.n}</b> — subtes terlemahmu (${Math.round(per[worst.t].ok / per[worst.t].n * 100)}%). Ulangi materi terkait, lalu simulasi ulang dalam 3 hari (spaced repetition).`;
              })()}
            </div>
            <div class="btn-row" style="justify-content:center;margin-top:14px">
              <button class="btn btn-leaf btn-big" data-replay>🔁 Simulasi Ulang</button>
              <button class="btn btn-sun btn-big" data-exit2>🏠 Selesai</button>
            </div>
          </div>`;
        el.querySelector('[data-replay]').onclick = () => BS.openGame('utbk-sim', true);
        el.querySelector('[data-exit2]').onclick = () => { location.hash = '#/w/sma'; };
        BS.gameDone('utbk-sim', score);
        BS.award('utbk-try');
        if (score >= 65) BS.fx.confetti(70);
        BS.sound('fanfare');
      }
      el.innerHTML = stage('🎓 Simulator UTBK', `
        <div style="text-align:center;padding:26px 0">
          <span style="font-size:52px">🎓</span>
          <h2>Siap simulasi UTBK?</h2>
          <p style="font-weight:700;max-width:420px;margin:8px auto">25 soal campuran 5 subtes (PU, PPU, PMM, Literasi Indonesia & Inggris) dengan waktu <b>25 menit</b>. Skor & analisis kelemahan muncul di akhir.</p>
          <button class="btn btn-grape btn-big" id="go">🚀 Mulai Simulasi</button>
          <p style="font-size:.82rem;font-weight:700;color:var(--ink-soft);margin-top:10px">Soal diacak dari bank soal UTBK — tiap sesi berbeda.</p>
        </div>`, '');
      el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/sma';
      el.querySelector('#go').onclick = () => {
        draw();
        timer = setInterval(() => {
          left--;
          const t = el.querySelector('#utimer');
          if (t) { t.textContent = `⏱ ${fmt(left)}`; if (left < 300) t.classList.add('hurry'); }
          if (left <= 0) finish();
        }, 1000);
      };
    },
  };

  /* ================= SMA 2: FLASHCARD 3D ================= */
  BS.GAMES['flashcard-3d'] = {
    name: 'Kartu Hafalan 3D', icon: '🃏', world: 'sma', worldName: 'Dunia SMA', sticker: 'pink',
    desc: 'Kartu putar 3D: ide inti di depan, jawaban & tips di belakang!',
    render(el) {
      const topics = BS.allTopics().filter((t) => ['sma-10', 'sma-11', 'sma-12'].includes(t.grade) && t.materi && t.materi.core);
      const cards = shuffle(topics).slice(0, 12).map((t) => ({ front: `${t.icon} ${t.name}`, back: t.materi.core, tag: BS.subjectMeta(t.subject).name }));
      let i = 0, known = 0;
      function draw() {
        if (i >= cards.length) {
          hookFinish(el, 'flashcard-3d', Math.round(known / cards.length * 100), 'Hafalan selesai! 🧠', `${known}/${cards.length} kartu kamu tandai "sudah paham"`);
          return;
        }
        const c = cards[i];
        el.innerHTML = stage('🃏 Kartu Hafalan 3D', `
          <div class="fc-stage">
            <div class="fc-card" id="fc">
              <div class="fc-face fc-front"><span class="fc-tag sticker sky">${c.tag} · ${i + 1}/${cards.length}</span><div class="fc-q">${c.front}</div><span class="fc-hint">👆 klik untuk membalik</span></div>
              <div class="fc-face fc-back"><span class="fc-tag sticker leaf">${c.tag}</span><div class="fc-a">${c.back}</div><span class="fc-hint">👆 klik untuk kembali</span></div>
            </div>
          </div>
          <div class="btn-row" style="justify-content:center">
            <button class="btn btn-coral btn-big" id="f-again">🔁 Belum Paham</button>
            <button class="btn btn-leaf btn-big" id="f-ok">✅ Sudah Paham</button>
          </div>`,
          `<span class="gs-pill">🧠 ${known}/${cards.length}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/sma';
        el.querySelector('#fc').onclick = () => { el.querySelector('#fc').classList.toggle('flipped'); BS.sound('pop'); };
        el.querySelector('#f-ok').onclick = () => { known++; BS.sound('coin'); i++; draw(); };
        el.querySelector('#f-again').onclick = () => { BS.sound('wrong'); i++; draw(); };
      }
      draw();
    },
  };

  /* ================= SMA 3: GRAFIK FUNGSI ================= */
  BS.GAMES['grafik-fungsi'] = {
    name: 'Laboratorium Grafik', icon: '📈', world: 'sma', worldName: 'Dunia SMA', sticker: 'grape',
    desc: 'Geser koefisien a, b, c — lihat perubahannya pada parabola secara langsung!',
    render(el) {
      let a = 1, b = 0, c = -2;
      el.innerHTML = stage('📈 Laboratorium Grafik', `
        <p style="text-align:center;font-weight:800">y = <span id="fn-label" style="color:var(--grape-d)"></span></p>
        <canvas class="fn-canvas" id="fn-c"></canvas>
        <div class="fn-controls">
          <div><label>a: <span class="fn-val" id="va">1</span></label><input type="range" id="sa" min="-4" max="4" step="0.5" value="1"></div>
          <div><label>b: <span class="fn-val" id="vb">0</span></label><input type="range" id="sb" min="-6" max="6" step="0.5" value="0"></div>
          <div><label>c: <span class="fn-val" id="vc">-2</span></label><input type="range" id="sc" min="-6" max="6" step="0.5" value="-2"></div>
        </div>
        <div class="card" style="margin-top:12px;background:#F1E9FF"><b id="fn-fact"></b></div>`,
        '');
      el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/sma';
      const cv = el.querySelector('#fn-c');
      function fit() { cv.width = cv.clientWidth || 680; cv.height = 320; draw(); }
      function draw() {
        const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
        const sc = 26, ox = W / 2, oy = H / 2;
        ctx.clearRect(0, 0, W, H);
        // grid
        ctx.strokeStyle = '#EEE9F8'; ctx.lineWidth = 1;
        for (let x = ox % sc; x < W; x += sc) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = oy % sc; y < H; y += sc) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        // axis
        ctx.strokeStyle = '#2A2140'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
        // curve
        ctx.strokeStyle = '#9B5CF6'; ctx.lineWidth = 3.5; ctx.beginPath();
        for (let px = 0; px <= W; px++) {
          const x = (px - ox) / sc;
          const y = a * x * x + b * x + c;
          const py = oy - y * sc;
          px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        // vertex & akar
        const vx = -b / (2 * a), vy = a * vx * vx + b * vx + c;
        const D = b * b - 4 * a * c;
        ctx.fillStyle = '#FF6B5E';
        ctx.beginPath(); ctx.arc(ox + vx * sc, oy - vy * sc, 6, 0, 7); ctx.fill();
        el.querySelector('#fn-label').textContent = `${a}x² ${b >= 0 ? '+' : '−'} ${Math.abs(b)}x ${c >= 0 ? '+' : '−'} ${Math.abs(c)}`;
        const facts = [];
        facts.push(a > 0 ? 'Parabola MELUKUP KE ATAS (a > 0)' : a < 0 ? 'Parabola MELUKUP KE BAWAH (a < 0)' : 'Garis lurus (a = 0)');
        if (a !== 0) {
          facts.push(`Titik puncak: (${(-b / (2 * a)).toFixed(2)}, ${vy.toFixed(2)})`);
          facts.push(D > 0 ? `Diskriminan D = ${D.toFixed(1)} > 0 → 2 akar real` : D === 0 ? 'D = 0 → 1 akar (menyinggung sumbu-x)' : `D = ${D.toFixed(1)} < 0 → tidak punya akar real`);
        }
        el.querySelector('#fn-fact').textContent = '💡 ' + facts.join('  •  ');
      }
      ['sa', 'sb', 'sc'].forEach((id, k) => {
        el.querySelector('#' + id).oninput = (e) => {
          const v = +e.target.value;
          if (k === 0) a = v; else if (k === 1) b = v; else c = v;
          el.querySelector('#va').textContent = a; el.querySelector('#vb').textContent = b; el.querySelector('#vc').textContent = c;
          draw(); BS.sound('pop');
        };
      });
      new ResizeObserver(fit).observe(cv);
      fit();
      BS.gameDone('grafik-fungsi', 80);
    },
  };

  /* ================= SMA 4: PENJELAJAH KARIER ================= */
  BS.GAMES['karier'] = {
    name: 'Penjelajah Karier', icon: '🧭', world: 'sma', worldName: 'Dunia SMA', sticker: 'sky',
    desc: 'Jawab 5 pertanyaan minat — temukan arah jurusan & karier yang cocok!',
    render(el) {
      const QUIZ = [
        { q: 'Kegiatan yang paling kamu nikmati?', opts: ['🧮 Memecahkan soal logika/angka', '🔬 Eksperimen & menyelidiki', '✍️ Menulis & bercerita', '🤝 Organisasi & memimpin'] },
        { q: 'Mata pelajaran favoritmu?', opts: ['Matematika/Fisika', 'Biologi/Kimia', 'Bahasa/Sejarah', 'Ekonomi/Geografi/Sosiologi'] },
        { q: 'Bagaimana caramu menyelesaikan masalah?', opts: ['Hitung & analisis data', 'Coba-coba di lab / observasi', 'Baca & rangkum informasi', 'Diskusi & koordinasi tim'] },
        { q: 'Cita-cita lingkungan kerja impianmu?', opts: ['Kantor/industri teknologi', 'Laboratorium/rumah sakit', 'Media/akademia/hukum', 'Bisnis/pemerintahan/wirausaha'] },
        { q: 'Proyek yang paling menarik bagimu?', opts: ['Membuat aplikasi/AI', 'Riset obat/lingkungan', 'Menulis jurnal/dokumenter', 'Membangun startup/community'] },
      ];
      const PATHS = [
        { n: 'STEM — Teknik, Informatika & Data', ico: '💻', uni: 'Teknik Informatika, Sistem Informasi, Teknik Elektro', jobs: ['Software Engineer', 'Data Scientist', 'AI Engineer', 'Cyber Security'], mapel: 'Matematika & Fisika jadi fondasi utamamu. Perkuat algoritma (coba Robot Koding & grafik fungsi!), dan bangun portofolio proyek kode.' },
        { n: 'Kesehatan & Sains Hayati', ico: '🔬', uni: 'Kedokteran, Farmasi, Biologi, Gizi', jobs: ['Dokter', 'Apoteker', 'Peneliti Biologi', 'Analis Lab'], mapel: 'Biologi & Kimia kuncinya. Hafal konsep lewat Kartu Hafalan 3D, lalu uji pemahaman lewat latihan Biomolekul & Genetika.' },
        { n: 'Humaniora, Hukum & Media', ico: '⚖️', uni: 'Ilmu Hukum, Ilmu Komunikasi, Sastra, Psikologi', jobs: ['Advokat', 'Jurnalis', 'Content Strategist', 'Psikolog'], mapel: 'Bahasa Indonesia & literasi adalah senjatamu. Latih analisis teks argumentasi dan tulis setiap hari.' },
        { n: 'Bisnis, Ekonomi & Sosial', ico: '📊', uni: 'Manajemen, Akuntansi, Ekonomi, Hubungan Internasional', jobs: ['Entrepreneur', 'Analis Keuangan', 'Marketing', 'Ekonom'], mapel: 'Matematika keuangan & statistika sangat berguna. Coba Matematika Keuangan di kelas 12 dan pahami data.' },
      ];
      const tally = [0, 0, 0, 0];
      let i = 0;
      function draw() {
        if (i >= QUIZ.length) {
          const best = tally.indexOf(Math.max(...tally));
          const p = PATHS[best];
          el.querySelector('.game-stage').innerHTML = `
            <div class="reward-pop" style="text-align:center">
              <span style="font-size:60px">${p.ico}</span>
              <h2 class="result-title">Arahmu: ${p.n}</h2>
              <div class="career-grid" style="text-align:left;margin-top:12px">
                <div class="career-card"><div class="c-top">🏛️</div><b>Jurusan Kuliah</b><p>${p.uni}</p></div>
                <div class="career-card"><div class="c-top">💼</div><b>Profesi</b><p>${p.jobs.join(' • ')}</p></div>
              </div>
              <div class="card" style="margin-top:12px;text-align:left;background:#E9FBF2"><b>🦉 Saran Pipo:</b> ${p.mapel}</div>
              <div class="btn-row" style="justify-content:center;margin-top:14px">
                <button class="btn btn-leaf btn-big" data-replay>🔁 Coba Lagi</button>
                <button class="btn btn-sun btn-big" data-exit2>🏠 Selesai</button>
              </div>
            </div>`;
          el.querySelector('[data-replay]').onclick = () => BS.openGame('karier', true);
          el.querySelector('[data-exit2]').onclick = () => { location.hash = '#/w/sma'; };
          BS.gameDone('karier', 80);
          BS.fx.confetti(40);
          return;
        }
        const q = QUIZ[i];
        el.querySelector('.game-stage').innerHTML = `
          <span class="sticker sky">Pertanyaan ${i + 1}/${QUIZ.length}</span>
          <div class="big-display" style="font-size:clamp(1.2rem,4vw,1.8rem);color:var(--sky-d)">${q.q}</div>
          <div class="choice-row" style="flex-direction:column;align-items:center">
            ${q.opts.map((o, j) => `<button class="choice-btn" data-j="${j}" style="font-size:1rem;min-width:min(420px,90%)">${o}</button>`).join('')}
          </div>`;
        el.querySelectorAll('.choice-btn').forEach((b) => { b.onclick = () => { tally[+b.dataset.j]++; i++; BS.sound('pop'); draw(); }; });
      }
      el.innerHTML = stage('🧭 Penjelajah Karier', `
        <div style="text-align:center;padding:24px 0">
          <span style="font-size:52px">🧭</span>
          <p style="font-weight:700;max-width:420px;margin:10px auto">5 pertanyaan singkat untuk memetakan minatmu ke arah jurusan & karier. Hasilnya saran — bukan vonis 😉</p>
          <button class="btn btn-sky btn-big" id="go">🧭 Mulai Eksplorasi</button>
        </div>`, '');
      el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/sma';
      el.querySelector('#go').onclick = draw;
    },
  };
})();
