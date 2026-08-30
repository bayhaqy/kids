/* ============================================================
   BelajarSeru! 3D — games-c1.js
   4 game Dunia TK (Task 6-a):
     tk-trace    "Jejak Huruf"      — Canvas2D tracing motorik
     tk-pasang   "Siapa Makan Apa?" — matching pengetahuan (bukan memory)
     tk-pattern  "Rangkai Pola"     — lanjutkan pola token campur
     tk-shape3d  "Bentuk Pop 3D"    — Three.js / fallback SVG 2.5D
   Memakai mini-framework gkit.js (stage/grun/gsim/gdrag).
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const say = (t) => { try { BS.speak(t); } catch (e) {} };

  BS.GAMES = BS.GAMES || {};

  /* ============================================================
     G1 · tk-trace — "Jejak Huruf" (Canvas2D · motorik menulis)
     Glyph = polyline titik kontrol 0-100 (bisa >1 goresan).
     DILARANG menambah tebak bunyi huruf (rumah tebak-huruf).
     ============================================================ */
  const GLYPH = {
    A: [[[20, 90], [50, 10], [80, 90]], [[36, 56], [64, 56]]],
    B: [[[26, 10], [26, 90]], [[26, 10], [70, 10], [70, 36], [26, 36]], [[26, 36], [76, 36], [76, 90], [26, 90]]],
    C: [[[80, 20], [50, 10], [22, 30], [22, 70], [50, 90], [80, 80]]],
    D: [[[26, 10], [26, 90]], [[26, 10], [58, 10], [80, 32], [80, 68], [58, 90], [26, 90]]],
    E: [[[76, 10], [26, 10], [26, 90], [76, 90]], [[26, 50], [64, 50]]],
    F: [[[74, 10], [26, 10], [26, 90]], [[26, 50], [62, 50]]],
    G: [[[78, 20], [52, 10], [26, 30], [24, 58], [42, 82], [70, 84], [78, 70]], [[78, 70], [78, 52], [56, 52]]],
    H: [[[26, 10], [26, 90]], [[74, 10], [74, 90]], [[26, 50], [74, 50]]],
    I: [[[50, 10], [50, 90]], [[32, 10], [68, 10]], [[32, 90], [68, 90]]],
    J: [[[66, 10], [66, 62], [52, 84], [28, 84], [18, 66], [20, 52]]],
    K: [[[26, 10], [26, 90]], [[76, 10], [26, 52]], [[44, 60], [76, 90]]],
    L: [[[30, 10], [30, 90], [76, 90]]],
    M: [[[20, 90], [20, 10], [50, 58], [80, 10], [80, 90]]],
    N: [[[20, 90], [20, 10], [80, 90], [80, 10]]],
    O: [[[50, 10], [76, 24], [86, 50], [76, 76], [50, 90], [24, 76], [14, 50], [24, 24], [50, 10]]],
    P: [[[26, 90], [26, 10]], [[26, 10], [70, 10], [76, 26], [70, 40], [26, 42]]],
    Q: [[[50, 10], [78, 28], [78, 72], [50, 90], [22, 72], [22, 28], [50, 10]], [[62, 64], [86, 92]]],
    R: [[[26, 90], [26, 10]], [[26, 10], [68, 10], [74, 24], [68, 38], [26, 40]], [[44, 40], [74, 90]]],
    S: [[[76, 18], [52, 8], [30, 20], [34, 40], [58, 50], [72, 66], [60, 86], [32, 92]]],
    T: [[[20, 10], [80, 10]], [[50, 10], [50, 90]]],
    U: [[[22, 10], [22, 60], [34, 84], [52, 90], [68, 84], [78, 60], [78, 10]]],
    V: [[[20, 10], [50, 90], [80, 10]]],
    W: [[[15, 10], [30, 90], [50, 40], [70, 90], [85, 10]]],
    X: [[[20, 10], [80, 90]], [[80, 10], [20, 90]]],
    Y: [[[20, 10], [50, 46]], [[80, 10], [50, 46]], [[50, 46], [50, 90]]],
    Z: [[[20, 10], [80, 10], [20, 90], [80, 90]]],
    0: [[[50, 10], [76, 24], [86, 50], [76, 76], [50, 90], [24, 76], [14, 50], [24, 24], [50, 10]]],
    1: [[[30, 26], [48, 10], [48, 90]], [[28, 90], [70, 90]]],
    2: [[[22, 26], [34, 10], [60, 10], [72, 26], [58, 46], [22, 74], [22, 90], [78, 90]]],
    3: [[[24, 16], [50, 8], [68, 20], [64, 38], [46, 46], [70, 58], [68, 82], [44, 92], [22, 82]]],
    4: [[[64, 90], [64, 10], [20, 62], [84, 62]]],
    5: [[[72, 10], [28, 10], [26, 44], [48, 38], [66, 50], [62, 76], [40, 90], [20, 80]]],
    6: [[[70, 12], [46, 10], [26, 40], [22, 68], [40, 88], [62, 86], [68, 68], [54, 52], [32, 56]]],
    7: [[[20, 10], [80, 10], [46, 90]]],
    8: [[[50, 10], [66, 22], [58, 38], [40, 38], [34, 20], [50, 10]], [[50, 46], [68, 56], [62, 78], [42, 84], [34, 64], [50, 46]]],
    9: [[[66, 34], [58, 14], [40, 12], [30, 28], [36, 46], [56, 52], [66, 42], [66, 68], [48, 90], [26, 82]]],
  };
  const LETTER_EMOJI = { A: '🍎', B: '⚽', C: '🦎', D: '🍃', E: '🦅', F: '🦩', G: '🎸', H: '🐯', I: '🍦', J: '🦒', K: '🐴', L: '🍋', M: '🐒', N: '🍚', O: '💊', P: '🍌', Q: '📖', R: '🏠', S: '🥛', T: '🎩', U: '🐍', V: '🏺', W: '🥕', X: '🎹', Y: '🪀', Z: '🦓' };
  const LETTER_WORD = { A: 'Apel', B: 'Bola', C: 'Cicak', D: 'Daun', E: 'Elang', F: 'Flamingo', G: 'Gitar', H: 'Harimau', I: 'Es', J: 'Jerapah', K: 'Kuda', L: 'Lemon', M: 'Monyet', N: 'Nasi', O: 'Obat', P: 'Pisang', Q: 'Quran', R: 'Rumah', S: 'Susu', T: 'Topi', U: 'Ular', V: 'Vas', W: 'Wortel', X: 'Xilofon', Y: 'Yoyo', Z: 'Zebra' };
  const DIGIT_EMOJI = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

  BS.GAMES['tk-trace'] = {
    name: 'Jejak Huruf', icon: '✏️', world: 'tk', worldName: 'Dunia TK', sticker: 'pink',
    desc: 'Geser jarimu mengikuti titik 1-2-3 untuk membentuk huruf dan angka!',
    topics: ['tk-huruf', 'tk-angka'], tags: ['umum'],
    render(el) {
      const EASY = ['I', 'L', 'T'], MED = ['C', 'O', 'S'];
      const HARD = [...'ABDEFGHJKMNPRUVWXYZ'.split(''), ...'0123456789'.split('')];
      let lastCh = '';
      const pickChar = (tier) => {
        const pool = tier === 'mudah' ? EASY : tier === 'sedang' ? MED : HARD;
        let c = pick(pool); let guard = 0;
        while (c === lastCh && pool.length > 1 && guard++ < 10) c = pick(pool);
        lastCh = c; return c;
      };
      const isDigit = (c) => /[0-9]/.test(c);
      const wordOf = (c) => isDigit(c) ? `Angka ${c}` : `Huruf ${c}`;
      const popOf = (c) => isDigit(c) ? DIGIT_EMOJI[+c] : LETTER_EMOJI[c];

      BS.grun(el, {
        gameId: 'tk-trace', title: '✏️ Jejak Huruf', total: 6,
        intro: 'Geser jarimu dari titik 1 → 2 → 3 mengikuti jalur putus-putus. Ayo bentuk hurufnya!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'I, L, T' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'C, O, S' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'Huruf lain & angka' },
        ],
        winTitle: 'Jago jejak huruf! ✏️', tryTitle: 'Ayo coba jejak lagi! 💪',
        make(roundEl, tier, r, api) {
          const ch = pickChar(tier);
          /* --- bangun titik & segmen dari glyph (loop tertutup dideteksi) --- */
          const P = [], segs = [];
          GLYPH[ch].forEach((stroke) => {
            const pts = stroke.slice();
            const closed = pts.length > 2 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 2;
            if (closed) pts.pop();
            const startIdx = P.length;
            pts.forEach((p) => P.push(p));
            for (let i = 0; i < pts.length - 1; i++) segs.push({ i: startIdx + i, j: startIdx + i + 1 });
            if (closed) segs.push({ i: P.length - 1, j: startIdx });
          });
          let seg = 0, prog = 0, down = false, tracing = false, fin = false, lastWarn = 0, graceT = 0;

          roundEl.innerHTML = `
            <p style="text-align:center;font-weight:800">Ikuti titik <b style="color:var(--coral)">1</b> → <b>2</b> → <b>3</b> pelan-pelan ya!</p>
            <div style="max-width:560px;margin:0 auto">
              <canvas id="tt-cv" style="width:100%;display:block;touch-action:none;border:3px dashed var(--ink);border-radius:18px;background:#FFFDF6"></canvas>
              <div class="g-row" style="margin-top:10px">
                <button class="btn btn-ghost" id="tt-say">🔊 Dengar lagi</button>
                <span class="gs-pill">${wordOf(ch)} ${popOf(ch)}</span>
              </div>
            </div>`;
          const cv = roundEl.querySelector('#tt-cv');
          const sim = BS.gsim(cv, { h: 350, draw });
          say(wordOf(ch));
          roundEl.querySelector('#tt-say').onclick = () => { BS.sound('pop'); say(wordOf(ch)); };
          api.msg('Mulai dari titik <b>1</b> ya! 👆');

          /* --- mapping koordinat glyph → px kanvas --- */
          const geo = () => {
            const box = Math.min(sim.w - 26, sim.h - 30);
            const k = box / 100, ox = (sim.w - 100 * k) / 2, oy = 12 + (sim.h - 24 - 100 * k) / 2;
            return { k, ox, oy, X: (p) => ox + p[0] * k, Y: (p) => oy + p[1] * k };
          };
          function line(c, x1, y1, x2, y2, col, w, dash) {
            c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2);
            c.setLineDash(dash ? [10, 10] : []); c.strokeStyle = col; c.lineWidth = w; c.stroke(); c.setLineDash([]);
          }
          function draw(ctx, time) {
            const g = geo();
            segs.forEach((s) => line(ctx, g.X(P[s.i]), g.Y(P[s.i]), g.X(P[s.j]), g.Y(P[s.j]), '#CFC9BE', 6, true));
            segs.forEach((s, i) => {
              const a = P[s.i], b = P[s.j];
              if (i < seg) line(ctx, g.X(a), g.Y(a), g.X(b), g.Y(b), '#2EC77E', 15, false);
              else if (i === seg && prog > 0) {
                const cx = a[0] + (b[0] - a[0]) * prog, cy = a[1] + (b[1] - a[1]) * prog;
                line(ctx, g.X(a), g.Y(a), g.ox + cx * g.k, g.oy + cy * g.k, '#2EC77E', 15, false);
              }
            });
            P.forEach((p, i) => {
              const act = seg < segs.length && segs[seg].i === i;
              const rr = act ? 14 + Math.sin(time * 5) * 2.5 : 11;
              ctx.beginPath(); ctx.arc(g.X(p), g.Y(p), rr, 0, 7);
              ctx.fillStyle = act ? '#FFF3C9' : '#FFFFFF'; ctx.fill();
              ctx.lineWidth = 3; ctx.strokeStyle = act ? '#FF8F3D' : '#2A2140'; ctx.stroke();
              ctx.fillStyle = '#2A2140'; ctx.font = 'bold 13px sans-serif';
              ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(String(i + 1), g.X(p), g.Y(p) + 1);
            });
            if (fin) {
              const bob = Math.sin(time * 7) * 8;
              ctx.font = '86px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(popOf(ch), sim.w / 2, sim.h / 2 - 6 + bob);
              ctx.font = '30px serif';
              ctx.fillText('✨', sim.w / 2 - 90, sim.h / 2 - 40 - bob);
              ctx.fillText('✨', sim.w / 2 + 90, sim.h / 2 + 20 + bob);
            }
          }
          function closest() { /* proyeksi pointer ke segmen aktif (px) */
            if (seg >= segs.length) return null;
            const g = geo(), s = segs[seg];
            const ax = g.X(P[s.i]), ay = g.Y(P[s.i]), bx = g.X(P[s.j]), by = g.Y(P[s.j]);
            return { g, s, ax, ay, bx, by };
          }
          function sweep(e) { /* evaluasi posisi pointer terhadap jalur aktif */
            const c = closest(); if (!c || fin) return false;
            const p = sim.pt(e);
            const dx = c.bx - c.ax, dy = c.by - c.ay, len2 = dx * dx + dy * dy || 1;
            let t = ((p.x - c.ax) * dx + (p.y - c.ay) * dy) / len2;
            t = Math.max(0, Math.min(1, t));
            const cx = c.ax + dx * t, cy = c.ay + dy * t;
            const d = Math.hypot(p.x - cx, p.y - cy);
            if (d > 18) return false; /* di luar jalur */
            prog = t;
            if (Math.hypot(p.x - c.bx, p.y - c.by) < 17) {
              prog = 1; seg++; prog = 0; BS.sound('pop'); graceT = performance.now() + 700;
              if (seg >= segs.length) {
                fin = true;
                api.msg(`${api.praise()} Kamu membentuk <b>${wordOf(ch)}</b>! ${popOf(ch)}`);
                api.done(true);
              } else api.msg(`Bagus! Lanjut ke titik <b>${segs[seg].i + 1}</b> 👉`);
            }
            return true;
          }
          cv.addEventListener('pointerdown', (e) => {
            if (fin) return;
            down = true; e.preventDefault();
            const c = closest(); if (!c) return;
            const p = sim.pt(e);
            const dStart = Math.hypot(p.x - c.ax, p.y - c.ay);
            const dx = c.bx - c.ax, dy = c.by - c.ay, len2 = dx * dx + dy * dy || 1;
            let t = ((p.x - c.ax) * dx + (p.y - c.ay) * dy) / len2; t = Math.max(0, Math.min(1, t));
            const dSeg = Math.hypot(p.x - (c.ax + dx * t), p.y - (c.ay + dy * t));
            if (dStart < 26 || (prog > 0 && dSeg < 18)) { tracing = true; sweep(e); }
            else if (performance.now() - lastWarn > 1800) { lastWarn = performance.now(); api.msg(`Mulai dari titik <b>${segs[seg].i + 1}</b> ya 👆`); }
          });
          cv.addEventListener('pointermove', (e) => {
            if (!down || fin) return;
            if (sweep(e)) { tracing = true; return; }
            if (tracing) { /* keluar jalur: hanya berhenti, tanpa penalti */
              tracing = false;
              const now = performance.now();
              if (now > graceT && now - lastWarn > 1800) { lastWarn = now; api.msg('🐢 Pelan-pelan ya 💡'); }
            }
          });
          const stop = () => { down = false; tracing = false; };
          cv.addEventListener('pointerup', stop);
          cv.addEventListener('pointercancel', stop);
        },
      });
    },
  };

  /* ============================================================
     G2 · tk-pasang — "Siapa Makan Apa?" (DOM · pengetahuan hewan)
     Matching berbasis PENGETAHUAN — DILARANG mekanik memory-match.
     ============================================================ */
  const PASANG_SETS = {
    mudah: [
      { a: '🐔', an: 'Ayam', f: '🌾', fn: 'butir', say: 'Ayam makan butir!' },
      { a: '🐮', an: 'Sapi', f: '🌿', fn: 'rumput', say: 'Sapi makan rumput!' },
      { a: '🐟', an: 'Ikan', f: '🌊', fn: 'air', say: 'Ikan hidup di air!' },
    ],
    sedang: [
      { a: '🐰', an: 'Kelinci', f: '🥕', fn: 'wortel', say: 'Kelinci makan wortel!' },
      { a: '🐦', an: 'Burung', f: '🌾', fn: 'biji', say: 'Burung makan biji!' },
      { a: '🐒', an: 'Monyet', f: '🍌', fn: 'pisang', say: 'Monyet makan pisang!' },
      { a: '🐱', an: 'Kucing', f: '🥛', fn: 'susu', say: 'Kucing minum susu!' },
    ],
    sulit: [
      { a: '🐸', an: 'Katak', f: '🌊', fn: 'kolam', say: 'Katak hidup di kolam!' },
      { a: '🐪', an: 'Unta', f: '🏜️', fn: 'gurun', say: 'Unta hidup di gurun!' },
      { a: '🐧', an: 'Penguin', f: '❄️', fn: 'es', say: 'Penguin hidup di es!' },
    ],
  };

  BS.GAMES['tk-pasang'] = {
    name: 'Siapa Makan Apa?', icon: '🐔', world: 'tk', worldName: 'Dunia TK', sticker: 'sun',
    desc: 'Pasangkan hewan dengan makanan atau rumahnya. Tap atau geser kartunya!',
    topics: ['tk-hewan', 'tk-buah'], tags: ['umum', 'sains'],
    render(el) {
      let dg = null; /* instance gdrag per ronde */
      BS.grun(el, {
        gameId: 'tk-pasang', title: '🐔 Siapa Makan Apa?', total: 3,
        intro: 'Bantu hewan menemukan makanan atau rumahnya. Tap hewan dulu, lalu tap pasangannya!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: '3 pasangan' },
          { k: 'sedang', label: '🟡 Sedang', desc: '4 pasangan' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'Habitat hewan' },
        ],
        winTitle: 'Ahli makanan hewan! 🐾', tryTitle: 'Ayo kenali hewan lagi! 🌱',
        onRound(ok) { BS.recordAnswer('tk-hewan', ok); },
        make(roundEl, tier, r, api) {
          if (dg) { dg.destroy(); dg = null; }
          const pairs = shuffle(PASANG_SETS[tier]);
          const foods = shuffle(pairs.slice());
          let selA = null, wrong = 0, matched = 0, fin = false;
          const card = (p, kind, food) => `
            <button class="g-tile" data-kind="${kind}" data-id="${p.an}"
              style="font-size:2.1rem;min-width:132px;gap:10px;justify-content:flex-start">
              <span class="p-emoji" style="display:inline-block;transition:transform .5s">${food ? p.f : p.a}</span>
              <span style="font-size:.78rem;font-weight:800">${food ? cap(p.fn) : p.an}</span>
            </button>`;
          roundEl.innerHTML = `
            <div class="g-duo" id="pk-board" style="max-width:600px;margin:0 auto">
              <div class="g-panel"><div class="g-q" style="font-size:1rem;margin:0 0 8px">🐾 Hewan</div>
                ${pairs.map((p) => card(p, 'a')).join('')}</div>
              <div class="g-panel"><div class="g-q" style="font-size:1rem;margin:0 0 8px">🍽️ Makanan / Rumah</div>
                ${foods.map((p) => card(p, 'f', true)).join('')}</div>
            </div>
            <div class="g-hintbox">👆 Tap hewan, lalu tap pasangannya — atau langsung geser kartunya!</div>`;
          const board = roundEl.querySelector('#pk-board');

          function tryMatch(x, y) {
            if (fin) return;
            const aEl = x.dataset.kind === 'a' ? x : y, fEl = x.dataset.kind === 'f' ? x : y;
            if (!aEl || !fEl || aEl === fEl) return;
            if (aEl.classList.contains('ok')) return;
            if (aEl.dataset.id === fEl.dataset.id) {
              const p = pairs.find((q) => q.an === aEl.dataset.id);
              aEl.classList.add('ok'); fEl.classList.add('ok');
              aEl.classList.remove('sel'); selA = null;
              BS.sound('coin'); say(p.say);
              api.msg(`${BS.gkit.praise()} ${p.say}`);
              matched++;
              if (matched === pairs.length) {
                fin = true;
                board.querySelectorAll('[data-kind="a"] .p-emoji').forEach((n) => { n.style.transform = 'scale(.5)'; });
                setTimeout(() => { if (el.isConnected) api.msg('Nyam nyam! Semua hewan kenyang 🍽️😊'); }, 250);
                setTimeout(() => api.done(wrong === 0), 950);
              }
            } else { /* salah: goyang lembut, tanpa hukuman */
              wrong++;
              BS.sound('pop');
              api.msg(BS.gkit.nudge());
              [aEl, fEl].forEach((n) => n.classList.add('bad'));
              setTimeout(() => { if (el.isConnected) [aEl, fEl].forEach((n) => n.classList.remove('bad')); }, 480);
            }
          }
          function tap(item) {
            if (fin) return;
            if (item.dataset.kind === 'a') {
              if (item.classList.contains('ok')) return;
              board.querySelectorAll('.g-tile.sel').forEach((n) => n.classList.remove('sel'));
              item.classList.add('sel'); selA = item; BS.sound('pop');
              api.msg('Sekarang tap makanan / rumahnya ya! 👉');
            } else if (selA) tryMatch(selA, item);
            else api.msg('Pilih hewan dulu ya 👈');
          }
          dg = BS.gdrag({
            root: board, mode: 'pair', itemSel: '.g-tile', targetSel: '.g-tile',
            onTap: tap,
            onDrop: (item, target) => {
              if (item.dataset.kind !== target.dataset.kind) tryMatch(item, target);
              else { item.classList.add('bad'); setTimeout(() => { if (el.isConnected) item.classList.remove('bad'); }, 400); }
            },
          });
        },
      });
    },
  };

  /* ============================================================
     G3 · tk-pattern — "Rangkai Pola" (DOM · logika pola)
     Token HARUS campur (emoji buah/hewan/angka/ukuran) — bukan warna saja.
     ============================================================ */
  const TOK1 = ['🍎', '🍌', '🍇', '🍓', '🍊', '🐭', '🐰', '🐱', '🐼', '🐸', '🚗', '⭐', '🧸', '🎈', '🌻'].map((e) => ({ e }));
  const TOK2 = ['🐭', '🐘', '🐟', '🐳', '🐝', '🐢'];
  const tokKey = (t) => (t.e || '') + (t.num || '') + (t.big ? '*' : '');
  const tokHtml = (t) => t.num
    ? `<b style="font-size:1.7rem;font-family:var(--font-disp)">${t.num}</b>`
    : `<span style="font-size:${t.big ? '2.5rem' : '1.7rem'};line-height:1">${t.e}</span>`;

  function genPattern(tier) {
    let seq = [], hide = [];
    if (tier === 'mudah') {
      const a = pick(TOK1), b = pick(TOK1.filter((t) => t.e !== a.e));
      for (let i = 0; i < 6; i++) seq.push(i % 2 ? b : a);
      hide = [ri(2, 5)];
    } else if (tier === 'sedang') {
      let unit;
      if (Math.random() < 0.5) {
        const a = pick(TOK1), b = pick(TOK1.filter((t) => t.e !== a.e));
        unit = Math.random() < 0.5 ? [a, a, b] : [a, b, b];
      } else { /* pola ukuran: kecil kecil BESAR */
        const s = pick(TOK2), b = pick(TOK2.filter((t) => t !== s));
        unit = [{ e: s }, { e: s }, { e: b, big: true }];
      }
      for (let i = 0; i < 6; i++) seq.push(unit[i % 3]);
      hide = [ri(3, 5)];
      if (Math.random() < 0.45) hide.push(Math.max(1, hide[0] - 2));
    } else {
      if (Math.random() < 0.5) { /* bilangan +1/+2 */
        const st = ri(1, 4), stp = pick([1, 2]);
        for (let i = 0; i < 6; i++) seq.push({ num: String(st + i * stp) });
        hide = Math.random() < 0.4 ? [4, 5] : [5];
      } else { /* ABCC ABCC… */
        const a = pick(TOK1), b = pick(TOK1.filter((t) => t.e !== a.e)), c = pick(TOK1.filter((t) => t.e !== a.e && t.e !== b.e));
        const unit = [a, b, c, c];
        for (let i = 0; i < 7; i++) seq.push(unit[i % 4]);
        hide = Math.random() < 0.4 ? [3, 6] : [6];
      }
    }
    hide = [...new Set(hide)].sort((x, y) => x - y);
    return { seq, hide };
  }

  BS.GAMES['tk-pattern'] = {
    name: 'Rangkai Pola', icon: '🔁', world: 'tk', worldName: 'Dunia TK', sticker: 'sky',
    desc: 'Lanjutkan pola yang berulang: buah, hewan, ukuran, sampai bilangan!',
    topics: ['tk-banding', 'tk-warna', 'tk-angka'], tags: ['umum', 'logika'],
    render(el) {
      let streak = 0;
      BS.grun(el, {
        gameId: 'tk-pattern', title: '🔁 Rangkai Pola', total: 6,
        intro: 'Lihat polanya baik-baik, lalu pilih token yang hilang. Pola itu berulang, lho!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'ABAB' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'AAB, ABB & ukuran' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'Bilangan & ABCC' },
        ],
        winTitle: 'Mata pola tajam! 🔁', tryTitle: 'Ayo latihan pola lagi! 🌱',
        onRound(ok) { BS.recordAnswer('tk-banding', ok); },
        make(roundEl, tier, r, api) {
          const { seq, hide } = genPattern(tier);
          const used = new Set(seq.map(tokKey));
          const corrects = [];
          hide.forEach((i) => { const t = seq[i]; if (!corrects.some((c) => tokKey(c) === tokKey(t))) corrects.push(t); });
          const distract = [];
          if (seq[0].num) {
            const nums = seq.map((t) => +t.num), mx = Math.max(...nums), mn = Math.min(...nums);
            [mx + 1, mx + 2, mn - 1].forEach((n) => {
              if (distract.length < 2 && n >= 0 && !used.has(String(n))) distract.push({ num: String(n) });
            });
            while (distract.length < 2) distract.push({ num: String(mx + 3 + distract.length) });
          } else {
            const pool = shuffle([...TOK1, ...TOK2.map((e) => ({ e })), ...TOK2.map((e) => ({ e, big: true }))]);
            pool.forEach((t) => { if (distract.length < 2 && !used.has(tokKey(t))) distract.push(t); });
          }
          const cands = shuffle([...corrects, ...distract.slice(0, 3 - corrects.length)]);
          let cur = 0, fin = false;

          roundEl.innerHTML = `
            <p style="text-align:center;font-weight:800">Token mana yang hilang? Pola berulang terus! 👀</p>
            <div class="g-row" id="pt-row" style="margin:6px auto 4px;max-width:560px">
              ${seq.map((t, i) => hide.includes(i)
                ? `<div class="g-tile pt-slot" data-i="${i}" style="min-width:64px;min-height:64px;border-style:dashed;background:#fff">❓</div>`
                : `<div class="g-tile" style="min-width:64px;min-height:64px;background:#FFF3C9;cursor:default">${tokHtml(t)}</div>`).join('')}
            </div>
            <div class="g-row" id="pt-cands" style="margin-top:16px">
              ${cands.map((t, i) => `<button class="choice-btn" data-ci="${i}" style="min-width:74px;min-height:74px">${tokHtml(t)}</button>`).join('')}
            </div>
            <div class="g-hintbox">🔎 Cari kunci polanya: apa yang berulang? Token kecil & besar juga dihitung, lho!</div>`;
          const rowEl = roundEl.querySelector('#pt-row');
          say('Lanjutkan polanya!');

          function fill(slotEl, t, dim) {
            slotEl.innerHTML = tokHtml(t);
            slotEl.style.borderStyle = 'solid';
            if (dim) slotEl.style.opacity = '.55';
          }
          roundEl.querySelectorAll('.choice-btn').forEach((b) => {
            b.onclick = () => {
              if (fin) return;
              const t = cands[+b.dataset.ci];
              const slotEl = rowEl.querySelector(`.pt-slot[data-i="${hide[cur]}"]`);
              const exp = seq[hide[cur]];
              if (tokKey(t) === tokKey(exp)) {
                BS.sound('pop');
                fill(slotEl, t);
                cur++;
                if (cur >= hide.length) {
                  fin = true;
                  BS.sound('correct');
                  streak++;
                  [...rowEl.children].forEach((tile, i) => {
                    setTimeout(() => { if (el.isConnected) tile.classList.add('ok'); }, i * 110);
                  });
                  if (streak >= 3) { BS.sound('coin'); try { BS.fx.confetti(16); } catch (e) {} }
                  api.msg(`${api.praise()} Polanya beres! ${seq[0].num ? 'Bilangannya bertambah terus! 🔢' : 'Pola itu berulang, lho! 🔁'}`);
                  api.done(true);
                } else api.msg('Satu lagi! 👀');
              } else {
                fin = true;
                BS.sound('pop');
                b.classList.add('wrong');
                slotEl.classList.add('bad');
                fill(slotEl, exp, true);
                api.msg(`Hampir! Token yang benar: <b>${exp.num ? exp.num : exp.e}</b> — lihat polanya lagi ya 💡`);
                api.done(false);
              }
            };
          });
        },
      });
    },
  };

  /* ============================================================
     G4 · tk-shape3d — "Bentuk Pop 3D" (Three.js + fallback SVG 2.5D)
     DILARANG menguji warna — semua benda netral & sama warna per ronde.
     ============================================================ */
  const SHAPE3D = {
    bola: { nm: 'bola', pop: '⚽', real: '🏀' },
    kubus: { nm: 'kubus', pop: '🧊', real: '🧊' },
    kerucut: { nm: 'kerucut', pop: '🍦', real: '🍦' },
    silinder: { nm: 'silinder', pop: '🥫', real: '🥫' },
    balok: { nm: 'balok', pop: '🎁', real: '🎁' },
  };

  BS.GAMES['tk-shape3d'] = {
    name: 'Bentuk Pop 3D', icon: '🧊', world: 'tk', worldName: 'Dunia TK', sticker: 'leaf',
    desc: 'Sentuh bola, kubus, kerucut & teman-temannya di panggung 3D yang bisa diputar!',
    topics: ['tk-warna', 'sd1-mtk-bangun'], tags: ['umum', 'logika'],
    render(el) {
      /* --- Three.js disiapkan SEKALI per render(); gagal → fallback SVG --- */
      let renderer = null, cv = null, use3d = false, geoCache = {}, curMat = null, raycaster = null;
      try {
        if (window.THREE && THREE.WebGLRenderer) {
          cv = document.createElement('canvas');
          cv.style.cssText = 'width:100%;height:340px;display:block;touch-action:none;border-radius:18px;background:#F7F3E8;cursor:grab';
          renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          raycaster = new THREE.Raycaster();
          use3d = true;
        }
      } catch (e) { use3d = false; }

      let raf = 0, rdead = true, scene = null, camera = null, grp = null, meshes = [], anims = [];
      let dragging = false, moved = false, px = 0;
      function stopLoop() {
        rdead = true;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        anims = []; meshes = [];
      }
      function stopAll() {
        stopLoop();
        if (curMat) { try { curMat.dispose(); } catch (e) {} curMat = null; }
        if (ground) { try { ground.geometry.dispose(); ground.material.dispose(); } catch (e) {} ground = null; }
        Object.keys(geoCache).forEach((k) => { try { geoCache[k].dispose(); } catch (e) {} delete geoCache[k]; });
        if (renderer) { try { renderer.dispose(); } catch (e) {} renderer = null; }
      }
      window.addEventListener('hashchange', stopAll, { once: true });

      function geoFor(k) {
        if (!geoCache[k]) {
          if (k === 'bola') geoCache[k] = new THREE.SphereGeometry(0.8, 24, 18);
          else if (k === 'kubus') geoCache[k] = new THREE.BoxGeometry(1.25, 1.25, 1.25);
          else if (k === 'balok') geoCache[k] = new THREE.BoxGeometry(1.7, 0.85, 1.05);
          else if (k === 'kerucut') geoCache[k] = new THREE.ConeGeometry(0.8, 1.5, 26);
          else geoCache[k] = new THREE.CylinderGeometry(0.62, 0.62, 1.4, 26);
        }
        return geoCache[k];
      }
      const BASE_Y = { bola: 0.8, kubus: 0.63, balok: 0.43, kerucut: 0.75, silinder: 0.7 };
      let ground = null; /* panggung dibuat sekali, dipakai ulang tiap ronde */
      function getGround() {
        if (!ground && window.THREE) {
          ground = new THREE.Mesh(new THREE.CircleGeometry(3.4, 40), new THREE.MeshBasicMaterial({ color: 0xEFE9D8 }));
          ground.rotation.x = -Math.PI / 2;
        }
        return ground;
      }

      /* --- fallback 2.5D: SVG dengan shading gradient --- */
      let uid = 0;
      const INK = '#2A2140';
      function svgShape(k) {
        const n = ++uid;
        const sh = '<ellipse cx="45" cy="86" rx="27" ry="5" fill="rgba(42,33,64,.13)"/>';
        const steel = `<defs><linearGradient id="st${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDF1F3"/><stop offset="1" stop-color="#AEBCC3"/></linearGradient></defs>`;
        if (k === 'bola') return `<svg viewBox="0 0 90 92" width="82" height="84"><defs><radialGradient id="sp${n}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#D3DBDE"/><stop offset="1" stop-color="#9FB0B8"/></radialGradient></defs>${sh}<circle cx="45" cy="45" r="32" fill="url(#sp${n})" stroke="${INK}" stroke-width="3"/></svg>`;
        if (k === 'kubus') return `<svg viewBox="0 0 90 92" width="82" height="84">${steel}${sh}<polygon points="26,26 44,14 78,14 60,26" fill="#F2F6F7" stroke="${INK}" stroke-width="3"/><polygon points="60,26 78,14 78,52 60,64" fill="#96A8B0" stroke="${INK}" stroke-width="3"/><rect x="26" y="26" width="34" height="38" fill="url(#st${n})" stroke="${INK}" stroke-width="3"/></svg>`;
        if (k === 'balok') return `<svg viewBox="0 0 90 92" width="82" height="84">${steel}${sh}<polygon points="12,44 26,32 82,32 68,44" fill="#F2F6F7" stroke="${INK}" stroke-width="3"/><polygon points="68,44 82,32 82,54 68,66" fill="#96A8B0" stroke="${INK}" stroke-width="3"/><rect x="12" y="44" width="56" height="22" fill="url(#st${n})" stroke="${INK}" stroke-width="3"/></svg>`;
        if (k === 'kerucut') return `<svg viewBox="0 0 90 92" width="82" height="84"><defs><linearGradient id="co${n}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#EDF1F3"/><stop offset=".5" stop-color="#C3CFD5"/><stop offset="1" stop-color="#8FA2AB"/></linearGradient></defs>${sh}<polygon points="45,12 68,70 22,70" fill="url(#co${n})" stroke="${INK}" stroke-width="3"/><ellipse cx="45" cy="70" rx="23" ry="7" fill="#B7C4CA" stroke="${INK}" stroke-width="3"/></svg>`;
        return `<svg viewBox="0 0 90 92" width="82" height="84"><defs><linearGradient id="cy${n}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#96A8B0"/><stop offset=".5" stop-color="#EDF1F3"/><stop offset="1" stop-color="#A9B8BF"/></linearGradient></defs>${sh}<path d="M25,25 L25,63 A20,7 0 0 0 65,63 L65,25 Z" fill="url(#cy${n})" stroke="${INK}" stroke-width="3"/><ellipse cx="45" cy="25" rx="20" ry="7" fill="#F2F6F7" stroke="${INK}" stroke-width="3"/></svg>`;
      }

      BS.grun(el, {
        gameId: 'tk-shape3d', title: '🧊 Bentuk Pop 3D', total: 6,
        intro: 'Panggung 3D penuh benda keren. Sentuh bentuk yang Pipo minta — geser untuk memutar panggungnya!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'Bola & kubus' },
          { k: 'sedang', label: '🟡 Sedang', desc: '+ kerucut & silinder' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'Balok & benda nyata' },
        ],
        winTitle: 'Ahli bentuk 3D! 🧊', tryTitle: 'Ayo kenalan lagi dengan bentuk! 💪',
        make(roundEl, tier, r, api) {
          stopLoop();
          const pools = {
            mudah: () => { const b = shuffle(['bola', 'kubus']); return [b[0], b[1], pick(b)]; },
            sedang: () => shuffle(['bola', 'kubus', 'kerucut', 'silinder']),
            sulit: () => shuffle(['balok', 'kubus', 'bola', 'silinder']),
          };
          const kinds = pools[tier]();
          const targetK = pick(kinds);
          const S = SHAPE3D[targetK];
          const popEmoji = tier === 'sulit' ? S.real : S.pop;
          let fin = false;

          roundEl.innerHTML = `
            <p class="g-q" style="margin-bottom:6px">Pipo: “Sentuh <b style="color:var(--coral)">${S.nm}</b>!”
              <button class="gs-pill gs-asbtn" id="s3-say" title="Dengar lagi">🔊</button></p>
            <div id="s3-stage" style="text-align:center"></div>`;
          const stage = roundEl.querySelector('#s3-stage');
          roundEl.querySelector('#s3-say').onclick = () => { BS.sound('pop'); say(`Sentuh ${S.nm}!`); };
          say(`Sentuh ${S.nm}!`);

          function win(atX, atY) { /* pop emoji benda nyata + selesai */
            fin = true;
            BS.sound('correct');
            api.msg(`${api.praise()} Betul, itu <b>${S.nm}</b>! ${popEmoji}`);
            if (use3d) {
              const wrap = stage.querySelector('#s3-wrap');
              const pop = document.createElement('span');
              pop.textContent = popEmoji;
              pop.style.cssText = `position:absolute;left:${atX}px;top:${atY}px;transform:translate(-50%,-50%) scale(.4);font-size:3rem;transition:transform .35s cubic-bezier(.2,1.6,.4,1),opacity .35s;pointer-events:none;z-index:5`;
              wrap.appendChild(pop);
              requestAnimationFrame(() => { pop.style.transform = 'translate(-50%,-50%) scale(1.3)'; });
              setTimeout(() => { pop.style.opacity = '0'; }, 700);
              setTimeout(() => { if (pop.isConnected) pop.remove(); }, 1100);
            }
            setTimeout(() => api.done(true), 250);
          }
          function lose(label) {
            fin = true;
            BS.sound('pop');
            api.msg(`Bukan itu! Cari <b>${S.nm}</b> ya 🔍 ${label || ''}`);
            api.done(false);
          }

          if (use3d) {
            stage.innerHTML = `<div id="s3-wrap" style="position:relative;max-width:560px;margin:0 auto"></div>`;
            const wrap = stage.querySelector('#s3-wrap');
            wrap.appendChild(cv);
            const W = wrap.clientWidth || 520;
            renderer.setSize(W, 340, false);
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(40, W / 340, 0.1, 60);
            camera.position.set(0, 2.6, 7.4); camera.lookAt(0, 0.5, 0);
            scene.add(new THREE.AmbientLight(0xffffff, 0.72));
            const dl = new THREE.DirectionalLight(0xffffff, 0.85); dl.position.set(3, 6, 4); scene.add(dl);
            const gr = getGround(); if (gr) scene.add(gr);
            grp = new THREE.Group(); scene.add(grp);
            if (curMat) { try { curMat.dispose(); } catch (e) {} }
            curMat = new THREE.MeshLambertMaterial({ color: pick(['#D8CBB4', '#C9D4D8', '#D9D3C2', '#DCCFD8', '#CDD8C8']) });
            kinds.forEach((k, i) => {
              const m = new THREE.Mesh(geoFor(k), curMat);
              const ang = (i / kinds.length) * Math.PI * 2;
              m.position.set(Math.cos(ang) * 2.05, BASE_Y[k], Math.sin(ang) * 2.05);
              m.rotation.y = Math.random() * Math.PI;
              m.userData = { k, baseX: m.position.x, baseY: m.position.y };
              grp.add(m); meshes.push(m);
            });

            let last = performance.now();
            function loop(now) {
              if (rdead || !cv.isConnected || !el.isConnected) { stopLoop(); return; }
              const dt = Math.min(0.05, (now - last) / 1000); last = now;
              if (!dragging) grp.rotation.y += dt * 0.35;
              anims.forEach((a) => {
                a.t += dt;
                if (a.type === 'jump') a.m.position.y = a.m.userData.baseY + Math.sin(Math.min(1, a.t / 0.7) * Math.PI) * 1.3;
                else a.m.position.x = a.m.userData.baseX + Math.sin(a.t * 40) * 0.13 * Math.max(0, 1 - a.t / 0.6);
              });
              anims = anims.filter((a) => {
                const dur = a.type === 'jump' ? 0.7 : 0.6;
                if (a.t >= dur) { a.m.position.y = a.m.userData.baseY; a.m.position.x = a.m.userData.baseX; return false; }
                return true;
              });
              renderer.render(scene, camera);
              raf = requestAnimationFrame(loop);
            }
            rdead = false; last = performance.now();
            raf = requestAnimationFrame(loop);

            cv.onpointerdown = (e) => { dragging = true; moved = false; px = e.clientX; try { cv.setPointerCapture(e.pointerId); } catch (err) {} };
            cv.onpointermove = (e) => {
              if (!dragging) return;
              const dx = e.clientX - px; px = e.clientX;
              if (Math.abs(dx) > 1) { moved = true; grp.rotation.y += dx * 0.012; }
            };
            cv.onpointerup = (e) => {
              dragging = false;
              if (moved || fin) return;
              const rect = cv.getBoundingClientRect();
              const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
              try {
                scene.updateMatrixWorld();
                raycaster.setFromCamera(ndc, camera);
                const hit = raycaster.intersectObjects(meshes, false)[0];
                if (!hit) return;
                const m = hit.object;
                if (m.userData.k === targetK) {
                  anims.push({ m, t: 0, type: 'jump' });
                  const v = m.position.clone(); v.y += 1.5; v.project(camera);
                  const x = (v.x * 0.5 + 0.5) * rect.width, y = (-v.y * 0.5 + 0.5) * rect.height;
                  win(x, y);
                } else {
                  anims.push({ m, t: 0, type: 'shake' });
                  lose('');
                }
              } catch (err) { console.error('raycast', err); }
            };
            cv.onpointercancel = () => { dragging = false; };
          } else {
            /* --- FALLBACK 2.5D: tombol SVG bentuk 3D-look, alur sama --- */
            stage.innerHTML = `<div class="g-row" style="gap:14px;margin-top:4px">
              ${kinds.map((k) => `<button class="choice-btn" data-k="${k}" style="min-width:118px;min-height:126px;background:#FFFDF6">${svgShape(k)}</button>`).join('')}
            </div>`;
            stage.querySelectorAll('.choice-btn').forEach((b) => {
              b.onclick = () => {
                if (fin) return;
                if (b.dataset.k === targetK) {
                  b.innerHTML = `<span style="font-size:2.7rem">${popEmoji}</span>`;
                  b.classList.add('correct');
                  win(0, 0);
                } else {
                  b.classList.add('wrong');
                  setTimeout(() => { if (el.isConnected) b.classList.remove('wrong'); }, 500);
                  lose('☝️');
                }
              };
            });
          }
        },
      });
    },
  };
})();
