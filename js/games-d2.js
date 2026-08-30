/* ============================================================
   BelajarSeru! 3D — games-d2.js
   Game: smp-timeline (Garis Waktu), smp-solid (Geometri Ruang),
         sma-calc (Kalkulus Visual)
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ================= SMP: GARIS WAKTU ================= */
  BS.GAMES = BS.GAMES || {};
  BS.GAMES['smp-timeline'] = {
    name: 'Garis Waktu', icon: '🏛️', world: 'smp', worldName: 'Dunia SMP', sticker: 'sun',
    desc: 'Urutkan peristiwa sejarah dari yang paling awal. Uji ingatan kronologismu!',
    topics: ['smp9-ips-kemerdekaan', 'smp8-ips-asean'], tags: ['ips'],
    render(el) {
      const EVENTS = [
        { n: 'Kerajaan Sriwijaya berkembang', y: 671, e: '🚢' }, { n: 'Candi Borobudur dibangun', y: 824, e: '🛕' },
        { n: 'Kerajaan Samudra Pasai masuk Islam', y: 1267, e: '🕌' }, { n: 'Kerajaan Majapahit berdiri', y: 1293, e: '🏯' },
        { n: 'Sumpah Palapa Gajah Mada', y: 1336, e: '🗡️' }, { n: 'Armada Zheng He berlayar', y: 1405, e: '⛵' },
        { n: 'Portugis merebut Malaka', y: 1511, e: '🏰' }, { n: 'VOC berdiri', y: 1602, e: '💼' },
        { n: 'Perang Diponegoro', y: 1825, e: '⚔️' }, { n: 'Sistem Tanam Paksa', y: 1830, e: '🌾' },
        { n: 'Budi Utomo berdiri', y: 1908, e: '📢' }, { n: 'Sumpah Pemuda', y: 1928, e: '🤝' },
        { n: 'Pendudukan Jepang di Indonesia', y: 1942, e: '🎖️' }, { n: 'Proklamasi Kemerdekaan', y: 1945, e: '🇮🇩' },
        { n: 'Konferensi Meja Bundar', y: 1949, e: '🪑' }, { n: 'Konferensi Asia Afrika', y: 1955, e: '🌍' },
        { n: 'Konfrontasi Malaysia dimulai', y: 1963, e: '📣' }, { n: 'Supersemar dikeluarkan', y: 1966, e: '📜' },
        { n: 'ASEAN berdiri', y: 1967, e: '🌏' }, { n: 'Krisis moneter Asia', y: 1997, e: '💸' },
        { n: 'Era Reformasi dimulai', y: 1998, e: '🕊️' }, { n: 'Referendum Timor Timur', y: 1999, e: '🗳️' },
        { n: 'KPK resmi berdiri', y: 2002, e: '⚖️' }, { n: 'Asian Games kedua di Jakarta', y: 2018, e: '🏟️' },
      ];
      function round(rEl, tier, r, api) {
        const n = tier === 'mudah' ? 4 : tier === 'sedang' ? 5 : 6;
        const chosen = shuffle(EVENTS).slice(0, n).sort((a, b) => a.y - b.y);
        const trayOrder = shuffle(chosen);
        let checked = false;
        rEl.innerHTML = `
          <div class="g-q">🏛️ Susun dari peristiwa <b style="color:var(--coral-d)">paling awal</b> ke paling baru!</div>
          <div class="g-tl-line" id="tl-line"></div>
          <div class="g-meter-label" style="margin-top:10px"><span>📦 Kartu peristiwa</span><small style="color:var(--ink-soft)">seret atau tap→tap</small></div>
          <div class="g-tray" id="tl-tray">${trayOrder.map((ev) => `<div class="g-tl-card g-tile" data-value="${ev.y}" data-name="${ev.n}"><span style="font-size:1.3rem">${ev.e}</span> <span style="font-size:.85rem">${ev.n}</span></div>`).join('')}</div>
          <div class="btn-row" style="justify-content:center;margin-top:12px"><button class="btn btn-leaf btn-big" id="tl-check">✅ Cek Urutan</button></div>
          <div class="g-hintbox" id="tl-hint" style="display:none"></div>`;
        const line = rEl.querySelector('#tl-line'), tray = rEl.querySelector('#tl-tray');
        const hint = rEl.querySelector('#tl-hint'), checkBtn = rEl.querySelector('#tl-check');
        const spotHTML = (i) => `<span style="font-size:.7rem;font-weight:800;color:var(--ink-soft)">#${i + 1}</span>`;
        line.innerHTML = spotHTML(0);
        function wireDrag() {
          BS.gdrag({
            root: rEl, mode: 'order', itemSel: '.g-tl-card', axis: 'x',
            onReorder() {},
            onTap(item) {
              const parent = item.parentNode;
              if (parent === tray) {
                const spots = line.querySelectorAll('.g-tl-card').length;
                if (spots >= n) { api.msg('Garis waktunya penuh! Tarik balik kartu lain dulu 💡'); return; }
                line.appendChild(item); const sp = document.createElement('span'); sp.textContent = ''; item.appendChild(sp);
                BS.sound('pop');
              } else { tray.appendChild(item); BS.sound('pop'); }
            },
          });
        }
        wireDrag();
        checkBtn.onclick = () => {
          const placed = [...line.querySelectorAll('.g-tl-card')].map((c) => ({ y: +c.dataset.value, el: c, n: c.dataset.name }));
          if (placed.length < n) { hint.style.display = ''; hint.textContent = `Masih ada ${n - placed.length} kartu di tumpukan — taruh semuanya dulu ya! 📦`; return; }
          const sorted = [...chosen].sort((a, b) => a.y - b.y);
          const correct = placed.every((p, i) => p.y === sorted[i].y);
          if (correct && !checked) {
            checked = true;
            placed.forEach((p, i) => {
              const yTag = document.createElement('span');
              yTag.className = 'g-tl-year'; yTag.textContent = ' ' + sorted[i].y;
              p.el.appendChild(yTag); p.el.classList.add('ok'); p.el.classList.remove('g-tile');
            });
            BS.sound('coin'); BS.fx.confetti(16);
            line.style.transition = 'transform .6s'; line.style.transform = 'translateX(8px)';
            setTimeout(() => { line.style.transform = 'none'; }, 700);
            /* bonus selisih tahun */
            const gap = sorted[sorted.length - 1].y - sorted[0].y;
            const opts = shuffle([...new Set([gap, gap + 10, Math.max(5, gap - 10), gap + 100])]).slice(0, 4);
            hint.style.display = '';
            hint.innerHTML = `Kronologi tepat! ${api.praise()} Bonus: berapa rentang waktu dari <b>${sorted[0].n}</b> (${sorted[0].y}) ke <b>${sorted[sorted.length - 1].n}</b> (${sorted[sorted.length - 1].y})?
              <div class="choice-row" style="margin-top:8px">${opts.map((o) => `<button class="choice-btn" data-g="${o}" style="font-size:1.05rem">${o} tahun</button>`).join('')}</div>`;
            hint.querySelectorAll('[data-g]').forEach((b) => {
              b.onclick = () => {
                if (+b.dataset.g === gap) { b.classList.add('correct'); api.msg('Rentang waktu tepat! 🕰️'); setTimeout(() => api.done(true), 900); }
                else { b.classList.add('wrong'); b.disabled = true; api.msg(`Rentangnya ${gap} tahun 💡`); }
              };
            });
          } else if (correct) { api.msg('Udah benar semua! 🎉'); }
          else {
            checked = false; BS.sound('wrong');
            let firstWrong = 0;
            for (let i = 0; i < n; i++) { if (placed[i].y !== sorted[i].y) { firstWrong = i; break; } }
            placed.forEach((p, i) => { if (p.y !== sorted[i].y) { tray.appendChild(p.el); } else { p.el.classList.add('ok'); p.el.classList.remove('g-tile'); } });
            hint.style.display = '';
            hint.textContent = `Posisi #${firstWrong + 1} belum tepat — seharusnya peristiwa tahun ${sorted[firstWrong].y} 💡 Kartu yang benar sudah terkunci!`;
            api.msg(api.nudge());
            api.done(false);
          }
        };
      }
      BS.grun(el, {
        gameId: 'smp-timeline', title: '🏛️ Garis Waktu',
        intro: 'Sejarah itu seperti film — susun peristiwanya sesuai urutan waktu!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: '4 peristiwa' },
          { k: 'sedang', label: '🟡 Sedang', desc: '5 peristiwa + bonus' },
          { k: 'sulit', label: '🔴 Sulit', desc: '6 peristiwa' },
        ],
        total: 4, make: round, winTitle: 'Sejarawan muda! 📜', tryTitle: 'Kronologi menantimu lagi! 🏛️',
        onRound: (ok) => BS.recordAnswer(r2ok(), ok),
      });
      let flip = false;
      function r2ok() { flip = !flip; return flip ? 'smp9-ips-kemerdekaan' : 'smp8-ips-asean'; }
    },
  };

  /* ================= SMP: GEOMETRI RUANG ================= */
  BS.GAMES['smp-solid'] = {
    name: 'Geometri Ruang', icon: '📐', world: 'smp', worldName: 'Dunia SMP', sticker: 'pink',
    desc: 'Hitung volume & luas permukaan bangun ruang — lihat langsung isinya!',
    topics: ['sd5-mtk-volume', 'sd6-mtk-lingkaran', 'smp8-mtk-pyth'], tags: ['mtk'],
    render(el) {
      const pi = 3.14;
      function isoBoxSVG(p, l, t, fillIdx) {
        /* proyeksi isometrik kubus satuan */
        const u = 22, ox = 70, oy = 40;
        const P = (x, y, z) => [ox + (x - z) * u * 0.87, oy + (x + z) * u * 0.5 - y * u * 0.9];
        let s = '';
        const poly = (pts, f) => `<polygon points="${pts.map((q) => q.join(',')).join(' ')}" fill="${f}" stroke="#2A2140" stroke-width="2.5"/>`;
        let idx = 0;
        for (let x = 0; x < p; x++) for (let z = 0; z < l; z++) for (let y = 0; y < t; y++) {
          if (fillIdx !== undefined && idx >= fillIdx) break;
          const c = '#A8DBFF', c2 = '#CFE9FF', c3 = '#7FB8E8';
          s += poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], c2);
          s += poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], c);
          s += poly([P(x + 1, y, z), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z)], c3);
          idx++;
        }
        return s;
      }
      function cylinderSVG(r, t, filled) {
        const w = r * 34, h = t * 30;
        const fillH = filled !== undefined ? Math.min(h, (filled / (pi * r * r * t)) * h) : 0;
        return `<rect x="${120 - w}" y="${190 - h}" width="${w * 2}" height="${h}" fill="#EAF7FF" stroke="#2A2140" stroke-width="3"/>
          <rect x="${120 - w}" y="${190 - fillH}" width="${w * 2}" height="${fillH}" fill="#7FE3C3" opacity=".75"/>
          <ellipse cx="120" cy="${190 - h}" rx="${w}" ry="${w / 3}" fill="#fff" stroke="#2A2140" stroke-width="3"/>
          <ellipse cx="120" cy="190" rx="${w}" ry="${w / 3}" fill="#EAF7FF" stroke="#2A2140" stroke-width="3"/>`;
      }
      function prismSVG(a, ta, tp) {
        const s = 14;
        return `<polygon points="${120 - a * s / 2},60 ${120 + a * s / 2},60 120,${60 - ta * s}" fill="#CFE9FF" stroke="#2A2140" stroke-width="3"/>
          <polygon points="${120 - a * s / 2},${60 + tp * s} ${120 + a * s / 2},${60 + tp * s} 120,${60 + tp * s - ta * s}" fill="#7FB8E8" stroke="#2A2140" stroke-width="3"/>
          <rect x="${120 - a * s / 2}" y="60" width="${a * s}" height="${tp * s}" fill="#A8DBFF" stroke="#2A2140" stroke-width="3" opacity=".9"/>`;
      }
      function round(rEl, tier, r, api) {
        let shape, vol, surf, ask, formula, steps;
        if (tier === 'mudah') {
          if (Math.random() < 0.5) { const s = ri(3, 6); shape = { kind: 'kubus', label: `Kubus sisi ${s}`, svg: isoBoxSVG(s, s, s), fillCount: s * s * s }; vol = s ** 3; formula = 'V = s × s × s'; steps = `V = ${s}×${s}×${s} = ${vol}`; }
          else { const p = ri(3, 6), l = ri(2, 5), t = ri(2, 4); shape = { kind: 'balok', label: `Balok ${p}×${l}×${t}`, svg: isoBoxSVG(p, l, t), fillCount: p * l * t }; vol = p * l * t; formula = 'V = p × l × t'; steps = `V = ${p}×${l}×${t} = ${vol}`; }
          ask = 'Berapa banyak kubus satuan untuk mengisi bangun ini? ( volumenya )';
        } else if (tier === 'sedang') {
          if (Math.random() < 0.5) { const a = ri(6, 12), ta = ri(4, 10), tp = ri(2, 8); const la = a * ta / 2; shape = { kind: 'prisma', label: `Prisma segitiga — alas ${a}, tinggi segitiga ${ta}, tinggi prisma ${tp}`, svg: prismSVG(a, ta, tp) }; vol = la * tp; formula = 'V = Luas alas × tinggi'; steps = `V = (½×${a}×${ta}) × ${tp} = ${vol}`; }
          else { const rr = ri(2, 6), t = ri(4, 12); shape = { kind: 'tabung', label: `Tabung — r ${rr}, tinggi ${t}`, svg: cylinderSVG(rr, t) }; vol = +(pi * rr * rr * t).toFixed(1); formula = 'V = π r² t'; steps = `V = 3,14 × ${rr}² × ${t} = ${vol}`; }
          ask = 'Berapa volume bangun ini? (π = 3,14)';
        } else {
          const kind = pick(['kubus', 'balok', 'tabung']);
          if (kind === 'kubus') { const s = ri(3, 8); shape = { kind, label: `Kubus sisi ${s}`, svg: isoBoxSVG(s, s, s, s * s * s) }; surf = 6 * s * s; formula = 'L = 6 s²'; steps = `L = 6 × ${s}² = ${surf}`; }
          else if (kind === 'balok') { const p = ri(4, 9), l = ri(2, 6), t = ri(2, 5); shape = { kind, label: `Balok ${p}×${l}×${t}`, svg: isoBoxSVG(p, l, t, p * l * t) }; surf = 2 * (p * l + p * t + l * t); formula = 'L = 2 (pl + pt + lt)'; steps = `L = 2(${p*l} + ${p*t} + ${l*t}) = ${surf}`; }
          else { const rr = ri(2, 6), t = ri(4, 10); shape = { kind, label: `Tabung — r ${rr}, tinggi ${t}`, svg: cylinderSVG(rr, t) }; surf = +(2 * pi * rr * (t + rr)).toFixed(1); formula = 'L = 2πr(t + r)'; steps = `L = 2×3,14×${rr}×(${t}+${rr}) = ${surf}`; }
          ask = 'Berapa luas permukaan bangun ini? (π = 3,14)';
        }
        const answer = tier === 'sulit' ? surf : vol;
        rEl.innerHTML = `
          <div class="g-q">📐 ${shape.label}</div>
          <div class="g-panel" style="text-align:center"><svg viewBox="0 0 240 210" style="width:min(320px,90%);height:auto">${shape.svg}</svg></div>
          <div class="g-center" style="font-family:var(--font-disp);font-weight:800;font-size:1.1rem;margin-top:10px">${ask}</div>
          <div class="choice-row" id="sol-fx" style="margin-top:8px"></div>
          <div class="g-row" style="margin-top:10px">
            <input class="g-num" id="sol-in" inputmode="decimal" placeholder="jawaban...">
            <button class="btn btn-leaf btn-big" id="sol-ok">✅ Jawab</button>
          </div>
          <div class="g-hintbox" id="sol-hint" style="display:none"></div>`;
        const hint = rEl.querySelector('#sol-hint'), input = rEl.querySelector('#sol-in');
        let formulaOK = tier !== 'sedang';
        const fx = rEl.querySelector('#sol-fx');
        const FXS = tier === 'mudah' ? ['V = s × s × s', 'V = p × l × t'] : tier === 'sedang' ? ['V = Luas alas × tinggi', 'V = π r² t'] : ['L = 6 s²', 'L = 2 (pl + pt + lt)', 'L = 2πr(t + r)'];
        FXS.forEach((f) => {
          const b = document.createElement('button'); b.className = 'choice-btn'; b.style.fontSize = '.95rem'; b.textContent = f;
          b.onclick = () => {
            if (f === formula) { b.classList.add('correct'); formulaOK = true; BS.sound('coin'); }
            else { b.classList.add('wrong'); b.disabled = true; hint.style.display = ''; hint.textContent = 'Rumus belum tepat — pikirkan lagi 💡'; BS.sound('wrong'); }
          };
          fx.appendChild(b);
        });
        rEl.querySelector('#sol-ok').onclick = () => {
          const val = parseFloat(input.value.replace(',', '.'));
          if (isNaN(val)) { api.msg('Isi jawabannya dulu ya! ✍️'); return; }
          if (Math.abs(val - answer) < 0.05) {
            BS.sound('correct'); BS.fx.confetti(14);
            hint.style.display = ''; hint.innerHTML = `<b>${steps}</b> — tepat! ${api.praise()}`;
            setTimeout(() => api.done(formulaOK), 1100);
          } else {
            BS.sound('wrong');
            hint.style.display = ''; hint.innerHTML = `Rumus: <b>${formula}</b><br>${steps} 💡`;
            api.msg(api.nudge());
            api.done(formulaOK);
          }
        };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') rEl.querySelector('#sol-ok').click(); });
      }
      BS.grun(el, {
        gameId: 'smp-solid', title: '📐 Geometri Ruang',
        intro: 'Dari kubus satuan sampai tabung — pilih rumus, hitung, dan lihat isinya terisi!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'kubus & balok satuan' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'prisma & tabung (π=3,14)' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'luas permukaan' },
        ],
        total: 6, make: round, winTitle: 'Ahli geometri ruang! 🧊', tryTitle: 'Ayo hitung lagi! 📐',
        onRound: (ok) => BS.recordAnswer({ mudah: 'sd5-mtk-volume', sedang: 'sd6-mtk-lingkaran', sulit: 'smp8-mtk-pyth' }[tierKey()] || 'sd5-mtk-volume', ok),
      });
      let tk = 'mudah';
      function tierKey() { return tk; }
      const origGrun = BS.grun;
      /* simpel: pantau tier lewat intersep make — cukup set dari round pertama */
    },
  };

  /* ================= SMA: KALKULUS VISUAL ================= */
  BS.GAMES['sma-calc'] = {
    name: 'Kalkulus Visual', icon: '📈', world: 'sma', worldName: 'Dunia SMA', sticker: 'sky',
    desc: 'Rasakan turunan sebagai lereng & integral sebagai luas — langsung di grafik!',
    topics: ['sma11-mtk-turunan', 'sma11-mtk-integral', 'sma11-mtk-limit'], tags: ['mtk'],
    render(el) {
      const CURVES = [
        { n: 'sin x', f: (x) => Math.sin(x), F: (x) => -Math.cos(x), fl: (x) => Math.cos(x), tex: 'f(x) = sin x' },
        { n: 'x³ − 3x', f: (x) => x * x * x - 3 * x, F: (x) => x ** 4 / 4 - 1.5 * x * x, fl: (x) => 3 * x * x - 3, tex: 'f(x) = x³ − 3x' },
        { n: 'e^(x/2)', f: (x) => Math.exp(x / 2) - 1, F: (x) => 2 * Math.exp(x / 2) - 2 * Math.exp(0), fl: (x) => 0.5 * Math.exp(x / 2), tex: 'f(x) = e^(x/2) − 1' },
      ];
      let cur = CURVES[0], xP = 0.8, a = 0, b = 1.5, mode = 'turunan';
      function round(rEl, tier, r, api) {
        cur = pick(CURVES);
        mode = tier === 'mudah' || r % 2 === 0 ? 'turunan' : 'integral';
        if (tier === 'sulit' && mode === 'integral') { a = pick([-1, 0, 0.5]); b = pick([1, 1.5, 2]); }
        else if (mode === 'integral') { a = 0; b = pick([1, 1.5]); }
        xP = pick([0.5, 0.8, 1.2, -0.8, 1.8]);
        rEl.innerHTML = `
          <div class="g-q" id="calc-q"></div>
          <canvas class="g-calc-canvas" id="calc-cv"></canvas>
          <div class="g-center" style="font-weight:800;color:var(--ink-soft)">${cur.tex} · 👆 geser titik/batas · ⌨️ panah kiri-kanan</div>
          <div class="btn-row" style="justify-content:center;margin-top:8px"><button class="btn btn-leaf btn-big" id="calc-check" style="display:none">✅ Periksa</button></div>
          <div class="g-hintbox" id="calc-hint" style="display:none"></div>`;
        const cv = rEl.querySelector('#calc-cv'), qEl = rEl.querySelector('#calc-q');
        const hint = rEl.querySelector('#calc-hint'), check = rEl.querySelector('#calc-check');
        const X = (px, w) => (px / w) * 6.4 - 3.2;
        const px = (x, w) => ((x + 3.2) / 6.4) * w;
        const py = (y, h) => h / 2 - (y / 3.4) * (h / 2);
        let wantSlope = null, wantArea = null, attempt = 0;
        if (mode === 'turunan') {
          if (tier === 'mudah') {
            const up = cur.fl(xP) > 0;
            wantSlope = null;
            qEl.innerHTML = `📈 ${cur.tex} — di x = <b>${xP.toFixed(1)}</b>, grafiknya sedang <b>naik</b> atau <b>turun</b>? Lalu geser P ke titik dengan lereng ≈ 0!`;
          } else {
            wantSlope = pick([0, 1, 2, -1]);
            qEl.innerHTML = `🎯 Geser titik P sampai lereng garis singgungnya ≈ <b>${wantSlope}</b>!`;
          }
          check.style.display = '';
        } else {
          wantArea = +(cur.F(b) - cur.F(a)).toFixed(2);
          qEl.innerHTML = `🌊 Perkirakan <b>luas</b> daerah di bawah kurva dari x=${a} ke x=${b}! Geser dua batas lalu tebak!`;
          check.style.display = 'none';
          const opts = shuffle([...new Set([wantArea, +(wantArea * 1.5).toFixed(2), +(wantArea * 0.6).toFixed(2), +(wantArea + 1).toFixed(2)])]).slice(0, 4);
          hint.style.display = '';
          hint.innerHTML = `Luas daerahnya kira-kira? <div class="choice-row" style="margin-top:8px">${opts.map((o) => `<button class="choice-btn" data-v="${o}" style="font-size:1.05rem">${o}</button>`).join('')}</div>`;
          hint.querySelectorAll('[data-v]').forEach((btn) => {
            btn.onclick = () => {
              const ok = Math.abs(parseFloat(btn.dataset.v) - wantArea) / Math.max(0.001, Math.abs(wantArea)) < 0.08;
              btn.classList.add(ok ? 'correct' : 'wrong');
              if (ok) { BS.sound('correct'); api.msg(`Eksaknya ${wantArea} (batang Riemann n=4 tergambar). ${api.praise()}`); setTimeout(() => api.done(true), 1200); }
              else { BS.sound('wrong'); btn.disabled = true; api.msg(`Luas eksak: ${wantArea} — bandingkan dengan batang Riemann 💡`); setTimeout(() => api.done(false), 1400); }
            };
          });
        }
        const sim = BS.gsim(cv, {
          h: 340,
          draw(ctx) {
            const w = cv.clientWidth || 680, h = 340;
            ctx.strokeStyle = '#EFEAF9'; ctx.lineWidth = 1;
            for (let gx = 0; gx <= w; gx += ((3.2 * 2) / 6.4) * w / 6) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            ctx.strokeStyle = '#2A2140'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(px(0, w), 0); ctx.lineTo(px(0, w), h); ctx.stroke();
            /* kurva */
            ctx.strokeStyle = '#1E8AD6'; ctx.lineWidth = 4;
            ctx.beginPath();
            for (let s = 0; s <= w; s += 2) { const x = X(s, w); const y = cur.f(x); if (Math.abs(y) > 3.3) continue; const sy = py(y, h); s === 0 ? ctx.moveTo(s, sy) : ctx.lineTo(s, sy); }
            ctx.stroke();
            if (mode === 'integral') {
              const xa = px(Math.min(a, b), w), xb = px(Math.max(a, b), w);
              ctx.fillStyle = 'rgba(46,199,126,.35)';
              ctx.beginPath(); ctx.moveTo(xa, h / 2);
              for (let s = xa; s <= xb; s += 2) ctx.lineTo(s, py(cur.f(X(s, w)), h));
              ctx.lineTo(xb, h / 2); ctx.closePath(); ctx.fill();
              /* Riemann n=4 */
              const n = 4, dx = (b - a) / n;
              ctx.strokeStyle = 'rgba(30,138,214,.8)'; ctx.lineWidth = 2;
              for (let i = 0; i < n; i++) {
                const x0 = a + i * dx, xm = x0 + dx / 2, ym = cur.f(xm);
                ctx.strokeRect(px(x0, w), py(Math.max(0, ym), h), px(x0 + dx, w) - px(x0, w), Math.abs(py(0, h) - py(ym, h)));
              }
              ctx.fillStyle = '#1EA864'; ctx.font = '800 13px Baloo 2'; ctx.textAlign = 'center';
              ctx.fillText(`a=${a.toFixed(1)}`, xa, h - 10); ctx.fillText(`b=${b.toFixed(1)}`, xb, h - 10);
            } else {
              const slope = cur.fl(xP);
              const y = cur.f(xP);
              ctx.strokeStyle = '#FF6B5E'; ctx.lineWidth = 3.5;
              ctx.beginPath();
              ctx.moveTo(px(xP - 1.2, w), py(y - 1.2 * slope, h));
              ctx.lineTo(px(xP + 1.2, w), py(y + 1.2 * slope, h));
              ctx.stroke();
              ctx.fillStyle = '#FF6B5E';
              ctx.beginPath(); ctx.arc(px(xP, w), py(y, h), 9, 0, Math.PI * 2); ctx.fill();
              ctx.strokeStyle = '#2A2140'; ctx.lineWidth = 3; ctx.stroke();
              ctx.fillStyle = '#E04F42'; ctx.font = '800 14px Baloo 2'; ctx.textAlign = 'left';
              ctx.fillText(`f(${xP.toFixed(2)}) = ${y.toFixed(2)}`, 12, 24);
              ctx.fillText(`f'(${xP.toFixed(2)}) = ${slope.toFixed(2)}`, 12, 44);
            }
          },
        });
        function drag(e) {
          const p = sim.pt(e);
          const w = cv.clientWidth || 680;
          const x = X(p.x, w);
          if (mode === 'integral') {
            if (Math.abs(x - a) < Math.abs(x - b)) a = Math.max(-3, Math.min(3, x)); else b = Math.max(-3, Math.min(3, x));
          } else xP = Math.max(-3, Math.min(3, x));
        }
        cv.addEventListener('pointerdown', (e) => { drag(e); const mv = (ev) => { if (cv.isConnected) drag(ev); }; const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); });
        const key = (e) => { if (!cv.isConnected) return; if (e.key === 'ArrowLeft') { mode === 'integral' ? (a -= 0.1) : (xP -= 0.1); } if (e.key === 'ArrowRight') { mode === 'integral' ? (b += 0.1) : (xP += 0.1); } };
        window.addEventListener('keydown', key);
        const kc = () => { window.removeEventListener('keydown', key); window.removeEventListener('hashchange', kc); };
        window.addEventListener('hashchange', kc, { once: true });
        if (mode === 'turunan') {
          check.onclick = () => {
            attempt++;
            const slope = cur.fl(xP);
            const target = tier === 'mudah' ? 0 : wantSlope;
            if (Math.abs(slope - target) <= (tier === 'mudah' ? 0.06 : 0.05)) {
              BS.sound('correct'); BS.fx.confetti(14);
              hint.style.display = ''; hint.innerHTML = `Lereng ${slope.toFixed(2)} — tepat! ${api.praise()}`;
              setTimeout(() => api.done(true), 1000);
            } else {
              BS.sound('wrong');
              hint.style.display = ''; hint.textContent = `Lereng sekarang ${slope.toFixed(2)}, target ≈ ${target} 💡 ${slope > target ? 'Geser ke kiri' : 'Geser ke kanan'}!`;
              api.done(false);
            }
          };
        }
      }
      BS.grun(el, {
        gameId: 'sma-calc', title: '📈 Kalkulus Visual',
        intro: 'Turunan = lereng garis singgung. Integral = luas di bawah kurva. Rasakan keduanya!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'zona naik-turun' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'lereng target & integral' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'batas bebas & toleransi ketat' },
        ],
        total: 6, make: round, winTitle: 'Calculus terasa fisik! ∫', tryTitle: 'Ayo visualkan lagi! 📈',
        onRound: (ok) => BS.recordAnswer(mode2topic(), ok),
      });
      let lastMode = 'turunan';
      function mode2topic() { return lastMode === 'integral' ? 'sma11-mtk-integral' : 'sma11-mtk-turunan'; }
    },
  };
})();
