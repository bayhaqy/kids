/* ============================================================
   BelajarSeru! 3D — games-a.js
   Game TK: tebak-huruf, hitung-mainan, warna-bentuk, memory-hewan
   Game SD: mtk-petualangan, robot-koding, tebak-kata
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function stage(title, inner, statusHtml) {
    return `
      <div class="view" style="max-width:760px;margin:0 auto">
        <div class="game-head" style="margin-top:16px">
          <button class="btn btn-ghost" data-exit>← Keluar</button>
          <h2 style="margin:0">${title}</h2>
          <div class="game-status">${statusHtml || ''}</div>
        </div>
        <div class="game-stage">${inner}</div>
      </div>`;
  }
  function finishCard(scorePct, title, extra) {
    const stars = scorePct >= 90 ? 3 : scorePct >= 65 ? 2 : scorePct >= 40 ? 1 : 0;
    return `
      <div class="reward-pop">
        <div class="result-stars">${'⭐'.repeat(stars)}<span class="${stars < 3 ? 'dim' : 'hidden'}">${'⭐'.repeat(3 - stars)}</span></div>
        <h2 class="result-title">${title}</h2>
        <p class="result-title" style="font-weight:700">${extra || ''}</p>
        <div class="btn-row" style="justify-content:center;margin-top:14px">
          <button class="btn btn-leaf btn-big" data-replay>🔁 Main Lagi</button>
          <button class="btn btn-sun btn-big" data-exit2>🏠 Selesai</button>
        </div>
      </div>`;
  }
  function hookFinish(el, gameId, scorePct, title, extra) {
    el.querySelector('.game-stage').innerHTML = finishCard(scorePct, title, extra);
    el.querySelector('[data-replay]').onclick = () => BS.openGame(gameId, true);
    el.querySelector('[data-exit2]').onclick = () => { location.hash = '#/petualangan'; };
    BS.gameDone(gameId, scorePct);
    if (scorePct >= 65) BS.fx.confetti(50);
    BS.sound('fanfare');
  }

  /* ================= TK 1: TEBAK HURUF ================= */
  BS.GAMES = BS.GAMES || {};
  BS.GAMES['tebak-huruf'] = {
    name: 'Tebak Huruf Berbunyi', icon: '🔤', world: 'tk', worldName: 'Dunia TK', sticker: 'pink',
    desc: 'Dengarkan suara Pipo, temukan huruf yang benar di antara balon-balon huruf!',
    render(el) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const vowels = 'AEIOU'.split('');
      let round = 0, score = 0, total = 8, target = '';
      function ask() {
        target = Math.random() < 0.4 ? pick(vowels) : pick(letters);
        const opts = shuffle([target, ...shuffle(letters.filter((l) => l !== target)).slice(0, 2)]);
        el.innerHTML = stage('🔤 Tebak Huruf', `
          <p style="text-align:center;font-weight:800">Pipo membunyikan sebuah huruf. Mana hurufnya?</p>
          <div class="big-display" style="color:var(--pink)">🔊 🔊</div>
          <div class="choice-row">${opts.map((l) => `<button class="choice-btn" data-l="${l}" style="background:${pick(['#FFE3EE', '#E5F3FF', '#E9FBF2', '#FFF3C9'])}">${l}</button>`).join('')}</div>
          <div class="game-msg" id="g-msg"></div>`,
          `<span class="gs-pill">Ronde ${round + 1}/${total}</span><span class="gs-pill">⭐ ${score}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/tk';
        BS.speak(`Huruf ${target}`);
        el.querySelectorAll('.choice-btn').forEach((b) => {
          b.onclick = () => {
            round++;
            if (b.dataset.l === target) { score++; b.classList.add('correct'); BS.sound('correct'); el.querySelector('#g-msg').textContent = pick(['Hebat! 🎉', 'Betul sekali! 🌟', 'Pintar! 👏']); }
            else { b.classList.add('wrong'); BS.sound('wrong'); el.querySelector('#g-msg').textContent = `Huruf yang benar: ${target}`; el.querySelectorAll('.choice-btn').forEach((x) => { if (x.dataset.l === target) x.classList.add('correct'); }); }
            el.querySelectorAll('.choice-btn').forEach((x) => x.disabled = true);
            setTimeout(() => { round < total ? ask() : hookFinish(el, 'tebak-huruf', Math.round(score / total * 100), score >= total * 0.65 ? 'Mata elang huruf! 🦉' : 'Terus berlatih ya! 💪', `Skor: ${score}/${total}`); }, 1100);
          };
        });
      }
      ask();
    },
  };

  /* ================= TK 2: HITUNG MAINAN ================= */
  BS.GAMES['hitung-mainan'] = {
    name: 'Hitung Mainan', icon: '🧮', world: 'tk', worldName: 'Dunia TK', sticker: 'sun',
    desc: 'Hitung mainan kesukaanmu, lalu pilih jumlah yang benar!',
    render(el) {
      const toys = ['🧸', '🚗', '🎈', '⚽', '🪀', '🧩', '🎨', '🚂'];
      let round = 0, score = 0, total = 8;
      function ask() {
        const n = ri(1, 12), toy = pick(toys);
        const opts = shuffle([...new Set([n, n + 1, n - 1 > 0 ? n - 1 : n + 2, n + 2])]).slice(0, 3);
        while (opts.length < 3) opts.push(n + 3);
        const shown = shuffle(opts.map(String));
        el.innerHTML = stage('🧮 Hitung Mainan', `
          <p style="text-align:center;font-weight:800">Ada berapa mainan di bawah ini?</p>
          <div style="text-align:center;font-size:clamp(1.8rem,6vw,2.6rem);letter-spacing:6px;line-height:1.9;max-width:420px;margin:10px auto">${Array.from({ length: n }, () => toy).join(' ')}</div>
          <div class="choice-row">${shown.map((v) => `<button class="choice-btn" data-v="${v}">${v}</button>`).join('')}</div>
          <div class="game-msg" id="g-msg"></div>`,
          `<span class="gs-pill">Ronde ${round + 1}/${total}</span><span class="gs-pill">⭐ ${score}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/tk';
        el.querySelectorAll('.choice-btn').forEach((b) => {
          b.onclick = () => {
            round++;
            if (+b.dataset.v === n) { score++; b.classList.add('correct'); BS.sound('correct'); el.querySelector('#g-msg').textContent = 'Tepat! 🎉'; }
            else { b.classList.add('wrong'); BS.sound('wrong'); el.querySelector('#g-msg').textContent = `Jumlahnya ${n}`; }
            el.querySelectorAll('.choice-btn').forEach((x) => x.disabled = true);
            setTimeout(() => { round < total ? ask() : hookFinish(el, 'hitung-mainan', Math.round(score / total * 100), score >= total * 0.65 ? 'Jago berhitung! 🔢' : 'Ayo latihan lagi! 🌱', `Skor: ${score}/${total}`); }, 900);
          };
        });
      }
      ask();
    },
  };

  /* ================= TK 3: WARNA & BENTUK ================= */
  BS.GAMES['warna-bentuk'] = {
    name: 'Warna & Bentuk', icon: '🎨', world: 'tk', worldName: 'Dunia TK', sticker: 'sky',
    desc: 'Temukan bentuk dengan warna yang diminta Pipo!',
    render(el) {
      const colors = { merah: '#FF6B5E', biru: '#38A9F5', kuning: '#FFC53D', hijau: '#2EC77E', ungu: '#9B5CF6', pink: '#FF8FAB' };
      const shapes = ['circle', 'square', 'triangle', 'star'];
      const shapeName = { circle: 'bulat ⭕', square: 'persegi ⬜', triangle: 'segitiga 🔺', star: 'bintang ⭐' };
      let round = 0, score = 0, total = 8;
      function ask() {
        const cName = pick(Object.keys(colors));
        const shape = pick(shapes);
        const others = shuffle(Object.keys(colors).filter((c) => c !== cName)).slice(0, 2);
        const trio = shuffle([cName, ...others]);
        el.innerHTML = stage('🎨 Warna & Bentuk', `
          <p style="text-align:center;font-weight:800;font-size:1.15rem">Sentuh bentuk yang berwarna <b style="color:${colors[cName]}">${cName.toUpperCase()}</b>!</p>
          <div class="choice-row">${trio.map((c) => {
            const col = colors[c];
            const svg = shape === 'circle' ? `<circle cx='50' cy='50' r='42' fill='${col}' stroke='#2A2140' stroke-width='6'/>`
              : shape === 'square' ? `<rect x='12' y='12' width='76' height='76' rx='10' fill='${col}' stroke='#2A2140' stroke-width='6'/>`
              : shape === 'triangle' ? `<polygon points='50,10 92,88 8,88' fill='${col}' stroke='#2A2140' stroke-width='6'/>`
              : `<polygon points='50,6 61,38 95,38 67,58 78,90 50,70 22,90 33,58 5,38 39,38' fill='${col}' stroke='#2A2140' stroke-width='6'/>`;
            return `<button class="choice-btn" data-c="${c}" style="min-width:110px"><svg viewBox='0 0 100 100' width='84' height='84'>${svg}</svg></button>`;
          }).join('')}</div>
          <p style="text-align:center;font-weight:700;color:var(--ink-soft)">Bentuknya: ${shapeName[shape]}</p>
          <div class="game-msg" id="g-msg"></div>`,
          `<span class="gs-pill">Ronde ${round + 1}/${total}</span><span class="gs-pill">⭐ ${score}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/tk';
        el.querySelectorAll('.choice-btn').forEach((b) => {
          b.onclick = () => {
            round++;
            if (b.dataset.c === cName) { score++; b.classList.add('correct'); BS.sound('correct'); el.querySelector('#g-msg').textContent = 'Wah, hebat! 🎉'; }
            else { b.classList.add('wrong'); BS.sound('wrong'); el.querySelector('#g-msg').textContent = `Yang ${cName} ya!`; }
            el.querySelectorAll('.choice-btn').forEach((x) => x.disabled = true);
            setTimeout(() => { round < total ? ask() : hookFinish(el, 'warna-bentuk', Math.round(score / total * 100), score >= total * 0.65 ? 'Mata tajam! 👀' : 'Ayo coba lagi! 🌈', `Skor: ${score}/${total}`); }, 900);
          };
        });
      }
      ask();
    },
  };

  /* ================= TK 4: MEMORY HEWAN ================= */
  BS.GAMES['memory-hewan'] = {
    name: 'Memory Hewan', icon: '🐾', world: 'tk', worldName: 'Dunia TK', sticker: 'leaf',
    desc: 'Balik kartu dan temukan pasangan hewan yang sama!',
    render(el) {
      const animals = ['🐶', '🐱', '🐮', '🐔', '🦆', '🐸', '🦋', '🐝'];
      let moves = 0, matched = 0, t0 = Date.now();
      function deal() {
        const pair = shuffle(animals).slice(0, 6);
        const deck = shuffle([...pair, ...pair]);
        el.innerHTML = stage('🐾 Memory Hewan', `
          <p style="text-align:center;font-weight:800">Temukan 6 pasangan hewan!</p>
          <div class="grid-memory">${deck.map((a, i) => `
            <button class="mem-card" data-i="${i}" data-a="${a}">
              <span class="mem-face mem-front">?</span>
              <span class="mem-face mem-back">${a}</span>
            </button>`).join('')}</div>
          <div class="game-msg" id="g-msg">Langkah: 0</div>`,
          `<span class="gs-pill">🐾 ${matched}/6</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/tk';
        let first = null, lock = false;
        el.querySelectorAll('.mem-card').forEach((c) => {
          c.onclick = () => {
            if (lock || c.classList.contains('flipped')) return;
            c.classList.add('flipped'); BS.sound('pop');
            if (!first) { first = c; return; }
            moves++; el.querySelector('#g-msg').textContent = `Langkah: ${moves}`;
            if (first.dataset.a === c.dataset.a) {
              first.classList.add('matched'); c.classList.add('matched');
              matched++; BS.sound('coin'); first = null;
              el.querySelector('.game-status').innerHTML = `<span class="gs-pill">🐾 ${matched}/6</span>`;
              if (matched === 6) {
                const score = Math.max(40, 100 - moves * 4);
                setTimeout(() => hookFinish(el, 'memory-hewan', score, 'Semua pasangan ketemu! 🎉', `${moves} langkah`), 600);
              }
            } else {
              lock = true; BS.sound('wrong');
              setTimeout(() => { first.classList.remove('flipped'); c.classList.remove('flipped'); first = null; lock = false; }, 800);
            }
          };
        });
      }
      deal();
    },
  };

  /* ================= SD 1: MTK PETUALANGAN ================= */
  BS.GAMES['mtk-petualangan'] = {
    name: 'Matematika Petualangan', icon: '🗺️', world: 'sd', worldName: 'Dunia SD', sticker: 'leaf',
    desc: '10 pulau berisi tantangan hitung. Kumpulkan bintang di tiap pulau!',
    render(el) {
      const levels = [
        { name: 'Pulau Penjumlahan', gen: null, f: () => { const a = ri(5, 30), b = ri(5, 30); return { q: `${a} + ${b} = ?`, ans: a + b }; } },
        { name: 'Pulau Pengurangan', f: () => { const a = ri(20, 60), b = ri(5, 19); return { q: `${a} − ${b} = ?`, ans: a - b }; } },
        { name: 'Teluk Perkalian', f: () => { const a = ri(2, 9), b = ri(2, 9); return { q: `${a} × ${b} = ?`, ans: a * b }; } },
        { name: 'Gua Pembagian', f: () => { const b = ri(2, 9), r = ri(2, 9); return { q: `${b * r} ÷ ${b} = ?`, ans: r }; } },
        { name: 'Samudra Campuran', f: () => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9); return { q: `${a} + ${b} × ${c} = ?`, ans: a + b * c }; } },
        { name: 'Hutan Pecahan', f: () => { const d = pick([2, 3, 4, 5]); return { q: `1/${d} + 1/${d} = ?`, ans: '2/' + d, text: true }; } },
        { name: 'Gunung Ratusan', f: () => { const a = ri(2, 9) * 100 + ri(1, 9) * 10 + ri(1, 9), b = ri(1, 9) * 100; return { q: `${a} + ${b} = ?`, ans: a + b }; } },
        { name: 'Danau Waktu', f: () => { const h = ri(1, 5), m = ri(1, 5) * 15; return { q: `Film mulai 18:00, durasi ${h} jam ${m} menit. Selesai pukul ...`, ans: `${18 + h}:${String(m).padStart(2, '0')}`, text: true }; } },
        { name: 'Kastil Uang', f: () => { const a = pick([5000, 10000, 20000]), b = pick([1000, 2000, 5000]); return { q: `Rp${a.toLocaleString('id')} + Rp${b.toLocaleString('id')} = ?`, ans: 'Rp' + (a + b).toLocaleString('id'), text: true }; } },
        { name: 'Vulkanus Tantangan', f: () => { const a = ri(11, 19), b = ri(2, 9), c = ri(2, 9); return { q: `${a} × ${b} − ${c} = ?`, ans: a * b - c }; } },
      ];
      let lv = 0, lives = 3, stars = 0;
      function drawMap() {
        el.innerHTML = stage('🗺️ Matematika Petualangan', `
          <p style="text-align:center;font-weight:800">Pilih pulau berikutnya: <b>${levels[lv].name}</b></p>
          <div class="map-nodes" style="grid-template-columns:repeat(5,1fr)">
            ${levels.map((L, i) => `
              <div class="map-node ${i < lv ? '' : i === lv ? '' : 'locked'}">
                <span class="n-ico">${i < lv ? '🏝️' : i === lv ? '⛵' : '🌫️'}</span>
                <b style="font-size:.72rem">${i < lv ? 'Selesai' : i === lv ? L.name : '???'}</b>
                <span class="n-stars">${i < lv ? '⭐' : ''}</span>
              </div>`).join('')}
          </div>`,
          `<span class="gs-pill">❤️ ${'❤️'.repeat(lives)}</span><span class="gs-pill">⭐ ${stars}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/sd';
        if (lv >= levels.length) return;
        setTimeout(ask, 400);
      }
      function ask() {
        const { q, ans, text } = levels[lv].f();
        const opts = text
          ? shuffle([...new Set([ans, ans + ' (hampir)', ans + '!', ans.replace(/\d+/, (m) => String(+m + 1))])]).slice(0, 4)
          : shuffle([...new Set([ans, ans + 1, ans - 1, ans + 2])]).map(String);
        while (opts.length < 4) opts.push(String(ans + opts.length * 3));
        el.querySelector('.game-stage').innerHTML = `
          <span class="sticker sun">Level ${lv + 1}: ${levels[lv].name}</span>
          <div class="big-display" style="font-size:clamp(1.6rem,5vw,2.4rem);color:var(--sky-d)">${q}</div>
          <div class="choice-row">${opts.map((o) => `<button class="choice-btn" data-v="${o}" style="font-size:1.2rem">${o}</button>`).join('')}</div>
          <div class="game-msg" id="g-msg"></div>`;
        el.querySelectorAll('.choice-btn').forEach((b) => {
          b.onclick = () => {
            if (b.dataset.v === String(ans)) {
              stars++; BS.sound('correct'); BS.fx.xpBurst('+10 XP');
              lv++; drawMap();
            } else {
              lives--; BS.sound('wrong');
              el.querySelector('#g-msg').textContent = `Jawaban: ${ans}`;
              el.querySelectorAll('.choice-btn').forEach((x) => { x.disabled = true; if (x.dataset.v === String(ans)) x.classList.add('correct'); });
              setTimeout(() => { lives <= 0 ? hookFinish(el, 'mtk-petualangan', Math.round(stars / levels.length * 100), lives <= 0 ? 'Sampai jumpa di pulau berikutnya! 🏝️' : '', `Pulau ditaklukkan: ${stars}/${levels.length}`) : drawMap(); }, 1300);
            }
          };
        });
        el.querySelector('.game-status').innerHTML = `<span class="gs-pill">❤️ ${'❤️'.repeat(Math.max(0, lives))}</span><span class="gs-pill">⭐ ${stars}</span>`;
      }
      drawMap();
    },
  };

  /* ================= SD 2: ROBOT KODING ================= */
  BS.GAMES['robot-koding'] = {
    name: 'Robot Koding', icon: '🤖', world: 'sd', worldName: 'Dunia SD', sticker: 'sky',
    desc: 'Susun perintah panah untuk mengantarkan robot ke bendera. Belajar logika pemrograman!',
    render(el) {
      const levels = [
        { cols: 4, rows: 3, start: [0, 2], goal: [3, 0], walls: [] },
        { cols: 4, rows: 3, start: [0, 2], goal: [3, 0], walls: [[1, 1]] },
        { cols: 5, rows: 3, start: [0, 1], goal: [4, 1], walls: [[1, 1], [3, 1]] },
        { cols: 5, rows: 4, start: [0, 3], goal: [4, 0], walls: [[2, 2], [2, 1], [1, 1]] },
        { cols: 5, rows: 4, start: [2, 3], goal: [2, 0], walls: [[1, 1], [2, 1], [3, 1]] },
      ];
      let lv = 0, cmds = [], score = 0;
      const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
      const ICON = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
      function draw() {
        const L = levels[lv];
        el.innerHTML = stage('🤖 Robot Koding', `
          <p style="text-align:center;font-weight:800">Level ${lv + 1}: antar 🤖 ke 🚩. Susun perintah lalu jalankan!</p>
          <div class="rob-grid" style="--cols:${L.cols}">
            ${Array.from({ length: L.cols * L.rows }, (_, i) => {
              const x = i % L.cols, y = Math.floor(i / L.cols);
              const wall = L.walls.some((w) => w[0] === x && w[1] === y);
              return `<div class="rob-cell ${wall ? 'wall' : ''} ${L.goal[0] === x && L.goal[1] === y ? 'goal' : ''}" data-x="${x}" data-y="${y}">${L.goal[0] === x && L.goal[1] === y ? '🚩' : ''}</div>`;
            }).join('')}
          </div>
          <div class="cmd-strip" id="cmd-strip"><span style="color:var(--ink-soft);font-weight:700">Klik panah untuk menambah perintah...</span></div>
          <div class="choice-row" style="margin-top:12px">
            ${Object.keys(DIRS).map((d) => `<button class="choice-btn" data-dir="${d}" style="min-width:64px">${ICON[d]}</button>`).join('')}
            <button class="choice-btn" id="run" style="background:var(--leaf);color:#fff;min-width:110px">▶ Jalankan</button>
            <button class="choice-btn" id="clr" style="min-width:110px">🗑️ Hapus</button>
          </div>
          <div class="game-msg" id="g-msg"></div>`,
          `<span class="gs-pill">Level ${lv + 1}/${levels.length}</span><span class="gs-pill">⭐ ${score}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/sd';
        const strip = el.querySelector('#cmd-strip');
        el.querySelectorAll('[data-dir]').forEach((b) => {
          b.onclick = () => {
            if (cmds.length >= 12) return;
            cmds.push(b.dataset.dir);
            strip.innerHTML = cmds.map((c) => `<span class="cmd-chip">${ICON[c]}</span>`).join('');
            BS.sound('pop');
          };
        });
        el.querySelector('#clr').onclick = () => { cmds = []; strip.innerHTML = '<span style="color:var(--ink-soft);font-weight:700">Klik panah untuk menambah perintah...</span>'; };
        el.querySelector('#run').onclick = run;
        placeRobot(L.start);
      }
      function placeRobot(pos) {
        el.querySelectorAll('.rob-cell .rob-bot').forEach((n) => n.remove());
        const cell = el.querySelector(`.rob-cell[data-x="${pos[0]}"][data-y="${pos[1]}"]`);
        if (cell) { const d = document.createElement('span'); d.className = 'rob-bot'; d.textContent = '🤖'; cell.appendChild(d); }
      }
      function run() {
        const L = levels[lv];
        let pos = L.start.slice(), dead = false;
        el.querySelectorAll('[data-dir],#run,#clr').forEach((b) => b.disabled = true);
        let i = 0;
        const step = () => {
          if (i >= cmds.length) { setTimeout(() => check(), 350); return; }
          const d = cmds[i++]; const [dx, dy] = DIRS[d];
          pos = [pos[0] + dx, pos[1] + dy];
          const hitWall = L.walls.some((w) => w[0] === pos[0] && w[1] === pos[1]);
          const out = pos[0] < 0 || pos[1] < 0 || pos[0] >= L.cols || pos[1] >= L.rows;
          if (hitWall || out) { dead = true; }
          placeRobot(pos);
          BS.sound('pop');
          setTimeout(step, 320);
        };
        const check = () => {
          const win = !dead && pos[0] === L.goal[0] && pos[1] === L.goal[1];
          const msg = el.querySelector('#g-msg');
          if (win) {
            score++; BS.sound('correct'); msg.textContent = '🎉 Robot sampai! Hebat!';
            lv++;
            setTimeout(() => { lv < levels.length ? draw() : hookFinish(el, 'robot-koding', Math.round(score / levels.length * 100), 'Insinyur robot muda! 🤖', `${score}/${levels.length} level selesai`); }, 1100);
          } else {
            BS.sound('wrong'); msg.textContent = dead ? '💥 Robot menabrak! Coba susun ulang.' : ' belum sampai bendera. Tambah perintah!';
            setTimeout(() => { cmds = []; el.querySelectorAll('[data-dir],#run,#clr').forEach((b) => b.disabled = false); draw(); }, 1200);
          }
        };
        step();
      }
      draw();
    },
  };

  /* ================= SD 3: TEBAK KATA ================= */
  BS.GAMES['tebak-kata'] = {
    name: 'Tebak Kata', icon: '🔤', world: 'sd', worldName: 'Dunia SD', sticker: 'grape',
    desc: 'Tebak kata misteri huruf demi huruf. Bahasa Indonesia jadi seru!',
    render(el) {
      const words = [
        { w: 'GARUDA', h: 'Burung lambang negara Indonesia' },
        { w: 'PANTUN', h: 'Puisi bersajak a-b-a-b' },
        { w: 'KOMODO', h: 'Hewan purba dari Pulau Komodo' },
        { w: 'SEKOLAH', h: 'Tempat belajar bersama teman' },
        { w: 'PERPUSTAKAAN', h: 'Tempat pinjam buku' },
        { w: 'BOROBUDUR', h: 'Candi besar di Jawa Tengah' },
        { w: 'MONAS', h: 'Monumen nasional di Jakarta' },
        { w: 'RENDA', h: 'Kerajinan jahitan khas Cilacap' },
        { w: 'WAYANG', h: 'Pertunjukan boneka tradisional' },
        { w: 'SATE', h: 'Makanan tusuk bakar dengan bumbu kacang' },
      ];
      let round = 0, score = 0, total = 5;
      function ask() {
        const { w, h } = pick(words);
        let revealed = new Set(), wrong = 0, maxWrong = 6, done = false;
        el.innerHTML = stage('🔤 Tebak Kata', `
          <p style="text-align:center;font-weight:800">Petunjuk: ${h}</p>
          <div class="big-display" id="word-display" style="letter-spacing:10px"></div>
          <div style="text-align:center" class="chip-row" id="key-row" >
            ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => `<button class="chip" data-k="${l}" style="padding:7px 12px">${l}</button>`).join('')}
          </div>
          <div class="game-msg" id="g-msg"></div>`,
          `<span class="gs-pill">Ronde ${round + 1}/${total}</span><span class="gs-pill">❤️ ${maxWrong}</span><span class="gs-pill">⭐ ${score}</span>`);
        el.querySelector('[data-exit]').onclick = () => location.hash = '#/w/sd';
        const disp = el.querySelector('#word-display');
        function paint() {
          disp.innerHTML = w.split('').map((c) => revealed.has(c) ? c : '_').join(' ');
        }
        paint();
        el.querySelectorAll('[data-k]').forEach((b) => {
          b.onclick = () => {
            if (done || b.disabled) return;
            b.disabled = true; b.style.opacity = .45;
            const k = b.dataset.k;
            if (w.includes(k)) {
              revealed.add(k); BS.sound('coin'); paint();
              if (w.split('').every((c) => revealed.has(c))) {
                done = true; score++; BS.sound('correct'); el.querySelector('#g-msg').textContent = `🎉 Benar! Kata: ${w}`;
                next();
              }
            } else {
              wrong++; BS.sound('wrong');
              el.querySelectorAll('.gs-pill')[1].textContent = `❤️ ${maxWrong - wrong}`;
              el.querySelector('#g-msg').textContent = `Huruf ${k} tidak ada (${wrong}/${maxWrong})`;
              if (wrong >= maxWrong) { done = true; el.querySelector('#g-msg').textContent = `Kata: ${w}. Coba ronde berikutnya!`; next(); }
            }
          };
        });
        function next() {
          setTimeout(() => { round++; round < total ? ask() : hookFinish(el, 'tebak-kata', Math.round(score / total * 100), score >= total * .6 ? 'Sang juara kata! 📖' : 'Perbanyak baca ya! 📚', `Skor: ${score}/${total}`); }, 1400);
        }
      }
      ask();
    },
  };
})();
