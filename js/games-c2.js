/* ============================================================
   BelajarSeru! 3D — games-c2.js
   Game SD: sd-money (Uang Kita), sd-clock (Jam Pintar),
            sd-geo (Peta Indonesia)
   Dibangun di atas gkit.js (stage/grun/gdrag).
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rp = (n) => 'Rp' + n.toLocaleString('id-ID');

  /* ================= SD: UANG KITA ================= */
  BS.GAMES = BS.GAMES || {};
  BS.GAMES['sd-money'] = {
    name: 'Uang Kita', icon: '🪙', world: 'sd', worldName: 'Dunia SD', sticker: 'sun',
    desc: 'Belanja di warung: bayar pas, cek kembalian, jadi jago uang Rupiah!',
    topics: ['sd1-mtk-uang', 'sd2-ipas-pasar'], tags: ['mtk', 'ipas'],
    render(el) {
      const GOODS = [
        { e: '🍵', n: 'Es Teh', p: 3000 }, { e: '📕', n: 'Buku Tulis', p: 5500 }, { e: '🍩', n: 'Gorengan', p: 2000 },
        { e: '✏️', n: 'Pensil', p: 4000 }, { e: '🍦', n: 'Es Krim', p: 8000 }, { e: '🍞', n: 'Roti', p: 12000 },
        { e: '💧', n: 'Air Mineral', p: 4000 }, { e: '🧁', n: 'Kue', p: 6500 },
      ];
      const COINS = [500, 1000], NOTES = [2000, 5000, 10000, 20000];
      function walletHTML() {
        const list = [];
        [1, 2].forEach(() => list.push(20000));
        [1, 2, 3].forEach(() => list.push(10000));
        [1, 2, 3, 4].forEach(() => list.push(5000));
        [1, 2, 3, 4, 5].forEach(() => list.push(2000));
        [1, 2, 3, 4, 5, 6, 7, 8].forEach(() => list.push(1000));
        [1, 2, 3, 4, 5, 6, 7, 8].forEach(() => list.push(500));
        return shuffle(list).map((v, i) => `<div class="g-money ${v >= 2000 ? 'paper' : ''}" data-value="${v}" data-id="w${i}">${v >= 2000 ? rp(v) : v}</div>`).join('');
      }
      function round(rEl, tier, r, api) {
        const goods = pick(GOODS);
        if (tier === 'mudah') { const p = pick(GOODS.filter((g) => g.p <= 10000)); goods.e = p.e; goods.n = p.n; goods.p = p.p; }
        let wrong = 0, paid = false;
        rEl.innerHTML = `
          <div class="g-center">
            <div style="font-size:56px">${goods.e}</div>
            <div class="g-q">${goods.n} — <b style="color:var(--coral-d)">${rp(goods.p)}</b></div>
          </div>
          <div class="g-panel">
            <div class="g-meter-label"><span>🧾 Nampan Kasir</span><b class="g-chip-cur" id="tray-total">Rp0</b></div>
            <div class="g-slot g-tray" id="tray" style="min-height:84px"></div>
          </div>
          <div class="g-meter-label" style="margin-top:12px"><span>👛 Dompetmu</span><small style="color:var(--ink-soft)">tap atau seret uang ke nampan</small></div>
          <div class="g-wallet" id="wallet">${walletHTML()}</div>
          <div class="btn-row" style="justify-content:center;margin-top:12px">
            <button class="btn btn-leaf btn-big" id="pay-btn">💰 Bayar!</button>
          </div>
          <div class="g-hintbox" id="pay-hint" style="display:none"></div>`;
        const tray = rEl.querySelector('#tray'), wallet = rEl.querySelector('#wallet');
        const totalEl = rEl.querySelector('#tray-total'), hint = rEl.querySelector('#pay-hint');
        const total = () => [...tray.querySelectorAll('.g-money')].reduce((s, m) => s + (+m.dataset.value), 0);
        const paint = () => { totalEl.textContent = rp(total()); hint.style.display = 'none'; };
        function move(node, dest) { dest.appendChild(node); paint(); BS.sound('pop'); }
        BS.gdrag({
          root: rEl, mode: 'snap', itemSel: '.g-money',
          onDrop(item, target) {
            const inTray = item.parentElement === tray;
            if (inTray && target && target.id === 'tray') return; /* dilepas di tempat semula */
            move(item, inTray ? wallet : tray);
          },
          onTap(item) { move(item, item.closest('#wallet') ? tray : wallet); },
        });
        rEl.querySelector('#pay-btn').onclick = () => {
          const t = total();
          if (paid) return;
          if (t === goods.p) {
            paid = true;
            tray.querySelectorAll('.g-money').forEach((m) => m.classList.add('ok'));
            BS.sound('coin'); BS.fx.confetti(18);
            api.msg(`<b style="color:var(--leaf-d)">LUNAS 🎉 ${api.praise()}</b>`);
            setTimeout(() => api.done(wrong === 0), 1100);
          } else if (t < goods.p) {
            wrong++; BS.sound('wrong');
            hint.style.display = ''; hint.innerHTML = `Kurang <b>${rp(goods.p - t)}</b> 💡 Tambah uangnya ya!`;
            api.msg(api.nudge());
          } else {
            wrong++; BS.sound('wrong');
            const back = t - goods.p;
            const opts = shuffle([...new Set([back, back + 500, back - 500 > 0 ? back - 500 : back + 1000, back * 2])]).slice(0, 4);
            hint.style.display = '';
            hint.innerHTML = `Kelebihan! Kasir beri kembalian <b>${rp(back)}</b> — pilih struk yang benar 🧾`;
            api.msg('Hampir! Hitung kembaliannya 💡');
            const row = document.createElement('div');
            row.className = 'choice-row'; row.style.marginTop = '10px';
            row.innerHTML = opts.map((o) => `<button class="choice-btn" style="font-size:1.05rem;min-width:130px">${rp(o)}</button>`).join('');
            hint.appendChild(row);
            row.querySelectorAll('.choice-btn').forEach((b) => {
              b.onclick = () => {
                if (b.textContent === rp(back)) { b.classList.add('correct'); BS.sound('coin'); setTimeout(() => api.done(wrong <= 1), 800); }
                else { b.classList.add('wrong'); b.disabled = true; BS.sound('wrong'); api.msg('Kembalian yang benar: ' + rp(back)); }
              };
            });
          }
        };
      }
      BS.grun(el, {
        gameId: 'sd-money', title: '🪙 Uang Kita',
        intro: 'Seret uang ke nampan kasir sampai jumlahnya pas. Hati-hati, jangan kurang atau lebih!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'bayar pas' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'ada kembalian' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'kombinasi banyak pecahan' },
        ],
        total: 5, make: round, winTitle: 'Kasir handal! 🏪', tryTitle: 'Terus berlatih hitung uang ya! 💪',
        onRound: (ok) => BS.recordAnswer('sd1-mtk-uang', ok),
      });
    },
  };

  /* ================= SD: JAM PINTAR ================= */
  BS.GAMES['sd-clock'] = {
    name: 'Jam Pintar', icon: '⏰', world: 'sd', worldName: 'Dunia SD', sticker: 'leaf',
    desc: 'Geser jarum jam analog, pelajari waktu & durasi kegiatanmu!',
    topics: ['sd2-mtk-ukur', 'sd4-bing-routine'], tags: ['mtk'],
    render(el) {
      const ACT = [
        { e: '🍚', n: 'Sarapan', m: 7 * 60 }, { e: '🎒', n: 'Berangkat sekolah', m: 7 * 60 + 30 },
        { e: '🍱', n: 'Makan siang', m: 12 * 60 }, { e: '⚽', n: 'Main di lapangan', m: 16 * 60 },
        { e: '📖', n: 'Belajar malam', m: 19 * 60 }, { e: '🛏️', n: 'Waktu tidur', m: 20 * 60 + 30 },
      ];
      let cur = { m: 7 * 60 + 30 };
      const fmt = (mm) => `${String(Math.floor((mm % 1440) / 60) || 12).padStart(2, '0')}.${String(mm % 60).padStart(2, '0')}`;
      const bgClass = (mm) => { const h = Math.floor((mm % 1440) / 60); return h < 4 || h >= 18 ? 'night' : h < 10 ? 'morning' : h < 15 ? 'day' : 'afternoon'; };
      function clockSVG() {
        let nums = '';
        for (let i = 1; i <= 12; i++) {
          const a = (i * 30 - 90) * Math.PI / 180;
          nums += `<text x="${100 + 74 * Math.cos(a)}" y="${100 + 74 * Math.sin(a) + 4}" text-anchor="middle" font-size="12" font-weight="800" fill="#2A2140" font-family="Baloo 2">${i}</text>`;
        }
        return `<svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" fill="#fff" stroke="#2A2140" stroke-width="6"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="#EFEAF9" stroke-width="2"/>
          ${nums}
          <line id="hand-h" class="hand" x1="100" y1="100" x2="100" y2="55" stroke="#2A2140" stroke-width="9" stroke-linecap="round" transform="rotate(${(cur.m / 60) * 30} 100 100)"/>
          <line id="hand-m" class="hand" x1="100" y1="100" x2="100" y2="30" stroke="#FF6B5E" stroke-width="6" stroke-linecap="round" transform="rotate(${(cur.m % 60) * 6} 100 100)"/>
          <circle cx="100" cy="100" r="7" fill="#2A2140"/>
          <circle data-grab="m" cx="100" cy="30" r="14" fill="transparent" style="cursor:grab"/>
          <circle data-grab="h" cx="100" cy="55" r="14" fill="transparent" style="cursor:grab"/>
        </svg>`;
      }
      function paintClock(rEl) {
        const hh = rEl.querySelector('#hand-h'), mm = rEl.querySelector('#hand-m');
        if (hh) hh.setAttribute('transform', `rotate(${(cur.m / 60) * 30} 100 100)`);
        if (mm) mm.setAttribute('transform', `rotate(${(cur.m % 60) * 6} 100 100)`);
        const stage = rEl.closest('.game-stage');
        if (stage) { stage.className = 'game-stage clock-' + bgClass(cur.m); }
      }
      function bindHands(rEl, api) {
        let hand = null;
        function angle(e, rect) { const x = e.clientX - rect.left - rect.width / 2, y = e.clientY - rect.top - rect.height / 2; return (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360; }
        rEl.querySelectorAll('[data-grab]').forEach((g) => {
          g.addEventListener('pointerdown', (e) => { hand = g.dataset.grab; e.preventDefault(); try { g.setPointerCapture(e.pointerId); } catch (err) {} });
        });
        const svg = rEl.querySelector('svg');
        const mv = (e) => {
          if (!hand || !svg.isConnected) return;
          const rect = svg.getBoundingClientRect();
          const scale = 200 / rect.width;
          const deg = angle(e, rect) * scale;
          if (hand === 'm') cur.m = Math.floor(cur.m / 60) * 60 + Math.round(deg / 6) % 60;
          else { const h = Math.round(deg / 30) % 12; cur.m = h * 60 + (cur.m % 60); }
          paintClock(rEl);
        };
        const up = () => { hand = null; };
        svg.addEventListener('pointermove', mv);
        window.addEventListener('pointerup', up, { once: false });
        const cleanup = () => { svg.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('hashchange', cleanup); };
        window.addEventListener('hashchange', cleanup, { once: true });
      }
      function nudgeBtns(rEl, api) {
        const row = document.createElement('div');
        row.className = 'choice-row';
        row.innerHTML = `<button class="choice-btn" data-n="h-1" style="min-width:64px;font-size:1rem">−1j</button>
          <button class="choice-btn" data-n="h1" style="min-width:64px;font-size:1rem">+1j</button>
          <button class="choice-btn" data-n="m-5" style="min-width:64px;font-size:1rem">−5m</button>
          <button class="choice-btn" data-n="m5" style="min-width:64px;font-size:1rem">+5m</button>`;
        row.querySelectorAll('[data-n]').forEach((b) => {
          b.onclick = () => {
            const d = b.dataset.n;
            if (d === 'm5') cur.m += 5; if (d === 'm-5') cur.m -= 5;
            if (d === 'h1') cur.m += 60; if (d === 'h-1') cur.m -= 60;
            cur.m = ((cur.m % 720) + 720) % 720;
            paintClock(rEl); BS.sound('pop');
          };
        });
        rEl.appendChild(row);
      }
      function round(rEl, tier, r, api) {
        const kind = r % 3;
        cur.m = 7 * 60 + 30;
        rEl.innerHTML = `<div class="g-clockwrap">${clockSVG()}</div>
          <div class="g-center" id="clk-q" style="font-family:var(--font-disp);font-weight:800;font-size:1.2rem;margin-top:6px"></div>
          <div class="choice-row" id="clk-opts" style="margin-top:8px"></div>
          <div class="btn-row" style="justify-content:center;margin-top:8px"><button class="btn btn-leaf btn-big" id="clk-check" style="display:none">✅ Cek Jam</button></div>
          <p style="text-align:center;font-size:.82rem;font-weight:700;color:var(--ink-soft)">Geser jarum, atau pakai tombol ±1j/±5m</p>`;
        paintClock(rEl);
        bindHands(rEl, api);
        const qEl = rEl.querySelector('#clk-q'), optsEl = rEl.querySelector('#clk-opts'), check = rEl.querySelector('#clk-check');
        if (kind === 0) {
          const act = pick(ACT);
          cur.m = 12 * 60; paintClock(rEl);
          qEl.innerHTML = `${act.e} Atur jam ke <b>${fmt(act.m)}</b> (${act.n})!`;
          check.style.display = '';
          check.onclick = () => {
            const diff = Math.min(Math.abs(cur.m - act.m), 720 - Math.abs(cur.m - act.m));
            const tol = tier === 'mudah' ? 2 : 0;
            if (diff <= tol) { BS.sound('correct'); api.msg(`${api.praise()} Jam tepat!`); BS.fx.confetti(12); setTimeout(() => api.done(true), 900); }
            else { BS.sound('wrong'); api.msg(`Jam sekarang ${fmt(cur.m)} — target ${fmt(act.m)} 💡 Jarum menit di angka ${Math.round((act.m % 60) / 5) || 12} = ${(act.m % 60)} menit`); api.done(false); }
          };
        } else if (kind === 1) {
          const step = tier === 'mudah' ? 30 : 5;
          cur.m = ri(1, 11) * 60 + (step === 30 ? pick([0, 30]) : ri(0, 11) * step); paintClock(rEl);
          qEl.innerHTML = '⏰ Pukul berapa sekarang?';
          const ans = fmt(cur.m);
          const wrongs = [fmt(cur.m + 30), fmt(cur.m - 60 < 0 ? cur.m + 300 : cur.m - 60), fmt(cur.m + 15)].filter((x) => x !== ans);
          shuffle([ans, ...shuffle(wrongs).slice(0, 3)]).forEach((o) => {
            const b = document.createElement('button');
            b.className = 'choice-btn'; b.textContent = o; b.style.fontSize = '1.2rem';
            b.onclick = () => {
              if (o === ans) { b.classList.add('correct'); BS.sound('correct'); api.msg(api.praise()); setTimeout(() => api.done(true), 850); }
              else { b.classList.add('wrong'); BS.sound('wrong'); api.msg(`Pukul ${ans} — jarum panjang = menit, pendek = jam 💡`); setTimeout(() => api.done(false), 1100); }
            };
            optsEl.appendChild(b);
          });
        } else {
          const act = pick(ACT.slice(0, 5));
          const dur = tier === 'sulit' ? pick([90, 105, 150, 165]) : pick([30, 45, 60]);
          const target = (act.m + dur) % 720;
          cur.m = act.m; paintClock(rEl);
          qEl.innerHTML = `${act.e} ${act.n} mulai <b>${fmt(act.m)}</b>, selama <b>${dur} menit</b>. Atur jam selesai!`;
          check.style.display = '';
          check.onclick = () => {
            const diff = Math.min(Math.abs(cur.m - target), 720 - Math.abs(cur.m - target));
            const tol = tier === 'mudah' ? 5 : 0;
            if (diff <= tol) { BS.sound('correct'); api.msg(`${api.praise()} Tepat waktu!`); setTimeout(() => api.done(true), 900); }
            else { BS.sound('wrong'); api.msg(`Seharusnya ${fmt(target)} 💡 ${dur} menit = jarum menit bergerak ${dur / 5} langkah`); api.done(false); }
          };
        }
        nudgeBtns(rEl, api);
      }
      const style = document.createElement('style');
      style.textContent = `.clock-morning{background:#FFF3C9}.clock-day{background:#EAF7FF}.clock-afternoon{background:#FFE9D2}.clock-night{background:#2A2140;color:#fff}.clock-night .g-q{color:#fff}`;
      document.head.appendChild(style);
      const onHash = () => style.remove(); window.addEventListener('hashchange', onHash, { once: true });
      BS.grun(el, {
        gameId: 'sd-clock', title: '⏰ Jam Pintar',
        intro: 'Atur jarum jam dengan jarimu — atau tombol ±1j/±5m — lalu cek jawabanmu!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'tepat & setengah, toleransi 5 menit' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'kelipatan 5 menit, harus eksak' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'durasi lintas pukul 12' },
        ],
        total: 6, make: round, winTitle: 'Ahli waktu! 🕐', tryTitle: 'Ayo kenali jam lagi! ⏰',
        onRound: (ok) => BS.recordAnswer('sd2-mtk-ukur', ok),
      });
    },
  };

  /* ================= SD: PETA INDONESIA ================= */
  BS.GAMES['sd-geo'] = {
    name: 'Peta Indonesia', icon: '🗺️', world: 'sd', worldName: 'Dunia SD', sticker: 'sky',
    desc: 'Jelajahi pulau, ibu kota & arah mata angin di peta Indonesia!',
    topics: ['sd4-ipas-siklus', 'sd3-ipas-daerah'], tags: ['ipas', 'ips'],
    render(el) {
      const ISLANDS = [
        { id: 'sumatera', name: 'Sumatera', d: 'M20,40 L70,22 92,58 78,112 42,132 16,92 Z', cap: 'Medan', fact: 'Ibu kota Sumatera Utara: Medan 🏙️' },
        { id: 'jawa', name: 'Jawa', d: 'M118,182 L215,168 252,182 212,196 128,194 Z', cap: 'Jakarta', fact: 'Ibu kota negara: Jakarta 🇮🇩' },
        { id: 'kalimantan', name: 'Kalimantan', d: 'M178,28 L252,18 278,70 236,122 184,96 Z', cap: 'Pontianak', fact: 'Pulau tiga negara — Indonesia, Malaysia, Brunei 🌳' },
        { id: 'sulawesi', name: 'Sulawesi', d: 'M298,42 L318,26 338,44 330,78 352,108 322,124 306,92 Z', cap: 'Makassar', fact: 'Bentuknya mirip huruf K! 🌺' },
        { id: 'bali-nt', name: 'Bali & Nusa Tenggara', d: 'M258,190 L332,180 348,192 266,200 Z', cap: 'Denpasar', fact: 'Rumah Komodo, kadal raksasa! 🦎' },
        { id: 'maluku', name: 'Maluku', d: 'M372,78 L396,64 410,104 388,122 Z', cap: 'Ambon', fact: 'Dijuluki pulau rempah 🌶️' },
        { id: 'papua', name: 'Papua', d: 'M428,118 L492,102 498,158 446,176 424,150 Z', cap: 'Jayapura', fact: 'Puncak Jaya ada salju abadi! 🏔️' },
      ];
      const KOTA = [
        { c: 'Jakarta', prov: 'DKI Jakarta' }, { c: 'Bandung', prov: 'Jawa Barat' }, { c: 'Surabaya', prov: 'Jawa Timur' },
        { c: 'Medan', prov: 'Sumatera Utara' }, { c: 'Denpasar', prov: 'Bali' }, { c: 'Jayapura', prov: 'Papua' },
      ];
      const DIRS = [
        { k: 'U', label: 'U ⬆', full: 'Utara' }, { k: 'TL', label: 'TL ↗', full: 'Timur Laut' }, { k: 'T', label: 'T ➡', full: 'Timur' },
        { k: 'TG', label: 'TG ↘', full: 'Tenggara' }, { k: 'S', label: 'S ⬇', full: 'Selatan' }, { k: 'BD', label: 'BD ↙', full: 'Barat Daya' },
        { k: 'B', label: 'B ⬅', full: 'Barat' }, { k: 'BL', label: 'BL ↖', full: 'Barat Laut' },
      ];
      const ROUTES = [
        { q: 'Dari Jakarta ke Surabaya', a: 'T' }, { q: 'Dari Jakarta ke Medan', a: 'BL' }, { q: 'Dari Jakarta ke Makassar', a: 'TG' },
        { q: 'Dari Jakarta ke Jayapura', a: 'T' }, { q: 'Dari Medan ke Jakarta', a: 'TG' }, { q: 'Dari Surabaya ke Jakarta', a: 'B' },
        { q: 'Dari Jakarta ke Pontianak', a: 'U' }, { q: 'Dari Pontianak ke Jakarta', a: 'S' },
      ];
      function mapSVG() {
        return `<svg viewBox="0 0 500 240" style="width:100%;height:auto">
          <rect x="0" y="0" width="500" height="240" rx="14" fill="#DFF1FF" stroke="#2A2140" stroke-width="3"/>
          <text x="14" y="22" font-size="11" font-weight="800" fill="#1E8AD6" font-family="Baloo 2">SAMUDRA</text>
          ${ISLANDS.map((s) => `<path class="g-prov" data-id="${s.id}" d="${s.d}" fill="#2EC77E" stroke="#2A2140" stroke-width="3" style="transition:filter .2s"><title>${s.name}</title></path>`).join('')}
          <text x="250" y="232" text-anchor="middle" font-size="10" font-weight="800" fill="#6B6484" font-family="Nunito">Peta stilasi — posisi relatif, bukan skala</text>
        </svg>`;
      }
      function compassRow(cb) {
        return `<div class="choice-row" style="margin-top:10px">${DIRS.map((d) => `<button class="choice-btn" data-dir="${d.k}" title="${d.full}" style="min-width:64px;font-size:1.05rem">${d.label}</button>`).join('')}</div>`;
      }
      function round(rEl, tier, r, api) {
        const kind = tier === 'mudah' ? 0 : (r % 3 === 2 && tier === 'sedang' ? 2 : r % 2);
        rEl.innerHTML = `<div class="g-mapbox">${mapSVG()}</div>
          <div class="g-center" id="geo-q" style="font-family:var(--font-disp);font-weight:800;font-size:1.15rem;margin-top:10px"></div>
          <div id="geo-opts"></div>`;
        const qEl = rEl.querySelector('#geo-q'), opts = rEl.querySelector('#geo-opts');
        const islands = [...rEl.querySelectorAll('.g-prov')];
        if (kind === 0) {
          const target = pick(ISLANDS);
          qEl.innerHTML = `🌏 Pulau mana <b>${target.name}</b>?`;
          islands.forEach((p) => {
            p.onclick = () => {
              if (p.dataset.id === target.id) { p.classList.add('done'); BS.sound('correct'); api.msg(target.fact + ' ' + api.praise()); islands.forEach((x) => x.onclick = null); setTimeout(() => api.done(true), 1400); }
              else { BS.sound('wrong'); const t = islands.find((x) => x.dataset.id === target.id); t.style.animation = 'shake .4s 2'; setTimeout(() => t.style.animation = '', 900); api.msg(`Itu ${ISLANDS.find((x) => x.id === p.dataset.id).name}. Cari ${target.name}! 💡`); }
            };
          });
        } else if (kind === 1) {
          const route = pick(ROUTES);
          qEl.innerHTML = `🧭 Dari <b>${route.q.replace('Dari ', '').replace(' ke ', ' → ')}</b> kamu menuju arah…?`;
          opts.innerHTML = compassRow();
          opts.querySelectorAll('[data-dir]').forEach((b) => {
            b.onclick = () => {
              const d = DIRS.find((x) => x.k === b.dataset.dir);
              if (b.dataset.dir === route.a) { b.classList.add('correct'); BS.sound('correct'); api.msg(`Benar, menuju ${d.full}! ${api.praise()}`); setTimeout(() => api.done(true), 900); }
              else { b.classList.add('wrong'); b.disabled = true; BS.sound('wrong'); api.msg(`Arah ${d.full} belum tepat. Ingat: kanan = Timur! 💡`); }
            };
          });
        } else {
          const pairs = shuffle(KOTA).slice(0, 6);
          const rights = shuffle(pairs.map((p) => p.c));
          qEl.innerHTML = '🏙️ Pasangkan provinsi dengan ibu kotanya!';
          opts.innerHTML = `<div class="g-duo"><div><b style="font-size:.85rem">PROVINSI</b><div class="g-row" id="pk-left" style="justify-content:flex-start">${pairs.map((p) => `<button class="g-tile" data-prov="${p.prov}" data-c="${p.c}" style="font-size:.9rem;padding:9px 12px">${p.prov}</button>`).join('')}</div></div>
            <div><b style="font-size:.85rem">IBU KOTA</b><div class="g-row" id="pk-right" style="justify-content:flex-start">${rights.map((c) => `<button class="g-tile" data-c="${c}" style="font-size:.9rem;padding:9px 12px;background:#CFE9FF">${c}</button>`).join('')}</div></div></div>`;
          let selProv = null, donePairs = 0;
          rEl.querySelectorAll('#pk-left .g-tile').forEach((b) => {
            b.onclick = () => {
              if (b.classList.contains('ok')) return;
              rEl.querySelectorAll('#pk-left .g-tile').forEach((x) => x.classList.remove('sel'));
              selProv = b; b.classList.add('sel'); BS.sound('pop');
            };
          });
          rEl.querySelectorAll('#pk-right .g-tile').forEach((b) => {
            b.onclick = () => {
              if (!selProv || b.classList.contains('ok')) return;
              if (selProv.dataset.c === b.dataset.c) { selProv.classList.add('ok'); selProv.classList.remove('sel'); b.classList.add('ok'); donePairs++; BS.sound('coin'); selProv = null;
                if (donePairs === pairs.length) { api.msg('Semua ibu kota tepat! ' + api.praise()); BS.fx.confetti(16); setTimeout(() => api.done(true), 1000); } }
              else { b.classList.add('bad'); BS.sound('wrong'); setTimeout(() => b.classList.remove('bad'), 500); api.msg('Bukan pasangannya — coba lagi! 💡'); }
            };
          });
        }
      }
      BS.grun(el, {
        gameId: 'sd-geo', title: '🗺️ Peta Indonesia',
        intro: 'Kenalan dengan pulau-pulau Indonesia, arah mata angin, dan ibu kota provinsi!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'kenal pulau besar' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'kompas & ibu kota' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'rute & arah lintas pulau' },
        ],
        total: 8, make: round, winTitle: 'Penjelajah Nusantara! 🇮🇩', tryTitle: 'Peta Indonesia menantimu lagi! 🗺️',
        onRound: (ok) => BS.recordAnswer(r % 2 ? 'sd4-ipas-siklus' : 'sd3-ipas-daerah', ok),
      });
    },
  };
})();
