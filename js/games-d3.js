/* ============================================================
   BelajarSeru! 3D — games-d3.js
   Game SMA: sma-gene (Genetika Lab), sma-chem (Setara Reaksi),
             sma-econ (Pasar & Uang), sma-vector (Vektor Arena)
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

  /* ================= SMA: GENETIKA LAB ================= */
  BS.GAMES = BS.GAMES || {};
  BS.GAMES['sma-gene'] = {
    name: 'Genetika Lab', icon: '🧬', world: 'sma', worldName: 'Dunia SMA', sticker: 'leaf',
    desc: 'Persilangkan makhluk, prediksi rasio fenotipe lewat kotak Punnett!',
    topics: ['sma12-bio-genetika', 'sma12-bio-biotech'], tags: ['biologi'],
    render(el) {
      const CROSS = {
        mudah: [
          { p1: 'BB', p2: 'bb', dom: 100, ratio: '100% Bb — semua seragam dominan', mice: 4 },
          { p1: 'BB', p2: 'Bb', dom: 100, ratio: '100% fenotipe dominan', mice: 4 },
        ],
        sedang: [
          { p1: 'Bb', p2: 'Bb', dom: 75, ratio: '3 : 1 (dominan : resesif)', mice: 3 },
          { p1: 'Bb', p2: 'bb', dom: 50, ratio: '1 : 1 (dominan : resesif)', mice: 2 },
          { p1: 'bb', p2: 'bb', dom: 0, ratio: '100% resesif', mice: 0 },
        ],
        sulit: [
          { p1: 'BbRr', p2: 'BbRr', dom: 81.25, ratio: '13 : 3 untuk kombinasi dominan penuh vs lainnya (9:3:3:1 klasik)', mice: 13, di: true },
          { p1: 'Bb', p2: 'Bb', dom: 75, ratio: '3 : 1', mice: 3 },
        ],
      };
      function round(rEl, tier, r, api) {
        const list = CROSS[tier] || CROSS.mudah;
        const T = list[r % list.length];
        const parent = (p) => p.split('');
        let answered = false;
        rEl.innerHTML = `
          <div class="g-q">🧬 Persilangan: <b style="color:var(--grape-d)">${T.p1}</b> × <b style="color:var(--leaf-d)">${T.p2}</b></div>
          <div class="g-center" style="font-weight:800">Pertanyaan: berapa % keturunan berfenotipe <b>DOMINAN</b>${T.di ? ' (kedua sifat)' : ''}?</div>
          <div class="choice-row" id="gene-opts" style="margin-top:8px"></div>
          <div id="gene-grid"></div>
          <div class="g-hintbox" id="gene-hint" style="display:none"></div>
          <div class="g-row" id="gene-mice" style="margin-top:12px"></div>`;
        const opts = rEl.querySelector('#gene-opts'), grid = rEl.querySelector('#gene-grid');
        const hint = rEl.querySelector('#gene-hint'), miceRow = rEl.querySelector('#gene-mice');
        const PERCS = ['0', '25', '50', '75', '100'];
        PERCS.forEach((p) => {
          const b = document.createElement('button');
          b.className = 'choice-btn'; b.style.fontSize = '1.2rem'; b.textContent = p + '%';
          b.onclick = () => {
            if (answered) return;
            answered = true;
            const ok = parseFloat(p) === T.dom;
            b.classList.add(ok ? 'correct' : 'wrong');
            fillGrid(ok);
            if (ok) { BS.sound('correct'); BS.fx.confetti(14); }
            else BS.sound('wrong');
          };
          opts.appendChild(b);
        });
        function fillGrid(ok) {
          const a = parent(T.p1), b = parent(T.p2);
          let html = `<div class="g-punnett" style="grid-template-columns:${T.di ? 'repeat(5,1fr)' : `56px repeat(${b.length},1fr)`}">`;
          html += `<div class="pc ph"></div>${b.map((x) => `<div class="pc ph">${x}</div>`).join('')}`;
          const cells = [];
          a.forEach((m) => {
            html += `<div class="pc ph">${m}</div>`;
            b.forEach((n) => { const g = m + n; cells.push(g); html += `<div class="pc ${g.includes('B') || (T.di && g.includes('R')) ? 'dom' : ''}" data-g="${g}" style="${g.includes('B') || (T.di && g.includes('R')) ? 'background:#D2F5E5' : 'background:#fff'}">${g}</div>`; });
          });
          html += '</div>';
          grid.innerHTML = html;
          hint.style.display = '';
          hint.innerHTML = `${ok ? 'Prediksimu tepat! 🎉' : 'Belum tepat — lihat kotaknya! 💡'} Rasio: <b>${T.ratio}</b>`;
          api.msg(ok ? api.praise() : 'Hitung ulang dari kotak Punnett ya 💡');
          /* makhluk mini sesuai persentase dominan */
          const domCount = Math.round(T.mice);
          for (let i = 0; i < 4; i++) {
            const m = document.createElement('span');
            m.className = 'g-ava';
            m.textContent = i < domCount ? '🐭' : '🐹';
            m.style.animationDelay = (i * 0.3) + 's';
            miceRow.appendChild(m);
          }
          setTimeout(() => api.done(ok), 1600);
        }
      }
      BS.grun(el, {
        gameId: 'sma-gene', title: '🧬 Genetika Lab',
        intro: 'Prediksi dulu, buktikan dengan kotak Punnett — seperti peneliti sungguhan!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'monohibrid seragam' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'rasio 3:1 & 1:1' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'dihibrid 16 kotak' },
        ],
        total: 5, make: round, winTitle: 'Genetisiawan! 🧬', tryTitle: 'Ayo silang lagi! 🐭',
        onRound: (ok) => BS.recordAnswer('sma12-bio-genetika', ok),
      });
    },
  };

  /* ================= SMA: SETARA REAKSI ================= */
  BS.GAMES['sma-chem'] = {
    name: 'Setara Reaksi', icon: '⚗️', world: 'sma', worldName: 'Dunia SMA', sticker: 'sun',
    desc: 'Setarakan persamaan reaksi — timbang atom kiri & kanan sampai seimbang!',
    topics: ['sma10-kimia-mol', 'sma11-kimia-redoks'], tags: ['kimia'],
    render(el) {
      const RX = [
        { r: [['H₂', { H: 2 }]], p: [['H₂O', { H: 2, O: 1 }]], ans: [2, 1, 2], mol: { q: '2 mol H₂ bereaksi, berapa mol H₂O terbentuk?', a: 2 } },
        { r: [['O₂', { O: 2 }]], p: [['O₃', { O: 3 }]], ans: [3, 2], mol: null },
        { r: [['Mg', { Mg: 1 }], ['O₂', { O: 2 }]], p: [['MgO', { Mg: 1, O: 1 }]], ans: [2, 1, 2], mol: null },
        { r: [['CH₄', { C: 1, H: 4 }], ['O₂', { O: 2 }]], p: [['CO₂', { C: 1, O: 2 }], ['H₂O', { H: 2, O: 1 }]], ans: [1, 2, 1, 2], mol: { q: '1 mol CH₄ bereaksi, berapa mol CO₂?', a: 1 } },
        { r: [['Al', { Al: 1 }], ['HCl', { H: 1, Cl: 1 }]], p: [['AlCl₃', { Al: 1, Cl: 3 }], ['H₂', { H: 2 }]], ans: [2, 6, 2, 3], mol: null },
        { r: [['Fe', { Fe: 1 }], ['O₂', { O: 2 }]], p: [['Fe₂O₃', { Fe: 2, O: 3 }]], ans: [4, 3, 2], mol: null },
        { r: [['C₃H₈', { C: 3, H: 8 }], ['O₂', { O: 2 }]], p: [['CO₂', { C: 1, O: 2 }], ['H₂O', { H: 2, O: 1 }]], ans: [1, 5, 3, 4], mol: { q: '1 mol C₃H₈, berapa mol H₂O?', a: 4 } },
        { r: [['N₂', { N: 2 }], ['H₂', { H: 2 }]], p: [['NH₃', { N: 1, H: 3 }]], ans: [1, 3, 2], mol: null },
        { r: [['Zn', { Zn: 1 }], ['HCl', { H: 1, Cl: 1 }]], p: [['ZnCl₂', { Zn: 1, Cl: 2 }], ['H₂', { H: 2 }]], ans: [1, 2, 1, 1], mol: null },
        { r: [['KClO₃', { K: 1, Cl: 1, O: 3 }]], p: [['KCl', { K: 1, Cl: 1 }], ['O₂', { O: 2 }]], ans: [2, 2, 3], mol: null },
        { r: [['Fe', { Fe: 1 }], ['O₂', { O: 2 }]], p: [['Fe₃O₄', { Fe: 3, O: 4 }]], ans: [3, 2, 1], mol: null },
        { r: [['Na', { Na: 1 }], ['H₂O', { H: 2, O: 1 }]], p: [['NaOH', { Na: 1, O: 1, H: 1 }], ['H₂', { H: 2 }]], ans: [2, 2, 2, 1], mol: null },
      ];
      function round(rEl, tier, r, api) {
        const pool = tier === 'mudah' ? RX.filter((x) => x.ans.every((v) => v <= 3)) : tier === 'sedang' ? RX.filter((x) => Math.max(...x.ans) <= 6) : RX;
        const T = pick(pool);
        const coefs = T.ans.map(() => 1);
        let failed = 0, done = false;
        const sides = { left: {}, right: {} };
        T.r.forEach(([_, comp]) => Object.entries(comp).forEach(([k, v]) => sides.left[k] = (sides.left[k] || 0)));
        T.p.forEach(([_, comp]) => Object.entries(comp).forEach(([k, v]) => sides.right[k] = (sides.right[k] || 0)));
        rEl.innerHTML = `
          <div class="g-q">⚗️ Setarakan reaksi: <span style="color:var(--sky-d)">naik-turunkan koefisien</span> sampai bar atom seimbang!</div>
          <div class="g-chem-row" id="chem-eq"></div>
          <div class="g-atombars" id="chem-bars"></div>
          <div class="btn-row" style="justify-content:center;margin-top:12px">
            <button class="btn btn-leaf btn-big" id="chem-ok">✅ Cek Keseimbangan</button>
          </div>
          <div class="g-hintbox" id="chem-hint" style="display:none"></div>`;
        const eq = rEl.querySelector('#chem-eq'), bars = rEl.querySelector('#chem-bars');
        const hint = rEl.querySelector('#chem-hint');
        function paint() {
          let html = '';
          T.r.forEach(([f], i) => {
            html += `<span class="g-coef"><button data-s="-1" data-i="${i}">−</button><b>${coefs[i]}</b><button data-s="1" data-i="${i}">+</button></span><span>${f}</span>${i < T.r.length - 1 ? '<span>+</span>' : ''}`;
          });
          html += '<span style="font-size:1.5rem">⟶</span>';
          T.p.forEach(([f], i) => {
            const j = i + T.r.length;
            html += `<span class="g-coef"><button data-s="-1" data-i="${j}">−</button><b>${coefs[j]}</b><button data-s="1" data-i="${j}">+</button></span><span>${f}</span>${i < T.p.length - 1 ? '<span>+</span>' : ''}`;
          });
          eq.innerHTML = html;
          eq.querySelectorAll('[data-s]').forEach((b) => {
            b.onclick = () => { const i = +b.dataset.i; coefs[i] = Math.max(1, Math.min(10, coefs[i] + +b.dataset.s)); BS.sound('pop'); paint(); };
          });
          const count = {};
          ['left', 'right'].forEach((side) => {
            const arr = side === 'left' ? T.r : T.p;
            arr.forEach(([_, comp], i) => {
              const c = coefs[side === 'left' ? i : i + T.r.length];
              Object.entries(comp).forEach(([k, v]) => {
                count[k] = count[k] || { l: 0, rr: 0 };
                count[k][side === 'left' ? 'l' : 'rr'] += c * v;
              });
            });
          });
          const keys = Object.keys(count);
          let balanced = keys.every((k) => count[k].l === count[k].rr);
          bars.innerHTML = keys.map((k) => {
            const c = count[k], bal = c.l === c.rr;
            const max = Math.max(c.l, c.rr, 1);
            return `<div class="ab ${bal ? 'balanced' : ''}"><b>${k}</b> ${c.l} : ${c.rr}
              <div class="abbar"><i style="width:${c.l / max * 100}%;background:var(--sky)"></i></div>
              <div class="abbar"><i style="width:${c.rr / max * 100}%;background:var(--leaf)"></i></div></div>`;
          }).join('') + `<div class="ab ${balanced ? 'balanced' : ''}" style="display:grid;place-items:center">${balanced ? '⚖️ SEIMBANG' : '⚖️ BELUM'}</div>`;
          return balanced;
        }
        paint();
        rEl.querySelector('#chem-ok').onclick = () => {
          if (done) return;
          const balanced = paint();
          if (balanced && coefs.every((c, i) => c === T.ans[i])) {
            done = true;
            BS.sound('coin'); BS.fx.confetti(18);
            eq.style.background = '#E9FBF2';
            api.msg(`Reaksi setara! ${T.ans.map((c) => c).join(':')} ${api.praise()}`);
            const askMol = tier === 'sulit' && T.mol;
            if (askMol) {
              hint.style.display = '';
              hint.innerHTML = `${T.mol.q} <div class="choice-row" style="margin-top:8px">${shuffle([...new Set([T.mol.a, T.mol.a + 1, T.mol.a * 2, T.mol.a - 1 > 0 ? T.mol.a - 1 : T.mol.a + 3])]).slice(0, 4).map((o) => `<button class="choice-btn" data-m="${o}" style="font-size:1.1rem">${o} mol</button>`).join('')}</div>`;
              hint.querySelectorAll('[data-m]').forEach((b) => {
                b.onclick = () => {
                  const ok = +b.dataset.m === T.mol.a;
                  b.classList.add(ok ? 'correct' : 'wrong');
                  if (ok) api.msg('Stoikiometri tepat! 🧮');
                  else api.msg(`Jawaban: ${T.mol.a} mol — pakai rasio koefisien 💡`);
                  setTimeout(() => api.done(ok), 1000);
                };
              });
            } else setTimeout(() => api.done(failed === 0), 1200);
          } else {
            failed++; BS.sound('wrong');
            const wrongKeys = Object.keys(sides).length && Object.keys(coefs);
            hint.style.display = '';
            hint.textContent = failed >= 2 ? `Hint: satu koefisien yang benar ${T.ans[0]} — perhatikan unsurnya! 💡` : 'Belum seimbang — jumlah tiap atom kiri harus = kanan 💡';
            api.msg(api.nudge());
          }
        };
      }
      BS.grun(el, {
        gameId: 'sma-chem', title: '⚗️ Setara Reaksi',
        intro: 'Hukum kekekalan massa: jumlah atom tidak berkurang! Naik-turunkan koefisien sampai seimbang.',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'koefisien kecil' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'koefisien menengah' },
          { k: 'sulit', label: '🔴 Sulit', desc: '+ soal mol' },
        ],
        total: 5, make: round, winTitle: 'Stoikiometri dikuasai! ⚖️', tryTitle: 'Ayo timbang atom lagi! ⚗️',
        onRound: (ok) => BS.recordAnswer('sma10-kimia-mol', ok),
      });
    },
  };

  /* ================= SMA: PASAR & UANG ================= */
  BS.GAMES['sma-econ'] = {
    name: 'Pasar & Uang', icon: '💰', world: 'sma', worldName: 'Dunia SMA', sticker: 'grape',
    desc: 'Kelola warung 7 hari: beli stok, pasang harga, untung-rugi, dan bunga deposito!',
    topics: ['smp7-mtk-sosial', 'sma12-mtk-keuangan', 'smp8-ips-uang'], tags: ['ips', 'mtk'],
    render(el) {
      const ITEMS = [
        { e: '🍜', n: 'Mie ayam', buy: 5000, sell: 8000 }, { e: '🍚', n: 'Nasi goreng', buy: 4500, sell: 8000 },
        { e: '🥤', n: 'Es jeruk', buy: 2000, sell: 5000 }, { e: '🍌', n: 'Pisang goreng', buy: 1500, sell: 4000 },
      ];
      const CONCEPTS = [
        { q: 'Barang Rp100.000 didiskon 20% lalu 10% lagi. Harga akhirnya?', a: 'Rp72.000', w: ['Rp70.000', 'Rp80.000', 'Rp68.000'], why: 'Diskon ganda DIKALI, bukan dijumlah: 100rb × 0,8 × 0,9 = 72rb' },
        { q: 'Deposito Rp1.000.000 bunga 5%/bulan (bunga sederhana). Bunga 3 bulan?', a: 'Rp150.000', w: ['Rp157.625', 'Rp50.000', 'Rp115.000'], why: 'Bunga sederhana: 5% × 3 = 15% × 1jt = 150rb' },
        { q: 'Modal Rp50.000, jual Rp65.000. Persen keuntungan?', a: '30%', w: ['15%', '23%', '50%'], why: 'Untung 15rb dari modal 50rb = 30%' },
        { q: 'Harga jual harus apa supaya tidak rugi bila biaya tetap Rp10.000 dan modal barang Rp30.000?', a: 'Minimal Rp40.000', w: ['Minimal Rp30.000', 'Minimal Rp35.000', 'Minimal Rp45.000'], why: 'BEP = modal + biaya tetap = 40rb' },
      ];
      function run(el2, tier) {
        let cash = 100000, stock = 0, day = 0, profits = [], conceptOK = 0, conceptN = 0;
        const log = [];
        function screen() {
          day++;
          if (day > 7) return finish();
          const item = pick(ITEMS);
          const disc = tier !== 'mudah' && Math.random() < 0.4;
          const price = disc ? Math.round(item.buy * (tier === 'sulit' ? 0.7 : 0.85) / 100) * 100 : item.buy;
          const demand = ri(3, 9) + (tier === 'sulit' ? ri(0, 4) : 0);
          el2.innerHTML = `
            <div class="g-q">🏪 Hari ke-${day}/7 — Kas: <b style="color:var(--leaf-d)">${rp(cash)}</b> · Stok ${item.e}: <b>${stock}</b></div>
            <div class="g-panel">
              <b>Kesempatan 1 — Pembelian:</b> ${item.n} harga supplier ${rp(price)} ${disc ? '<span class="sticker sun">DISKON!</span>' : ''}<br>
              <small style="color:var(--ink-soft)">Permintaan diperkirakan ${demand} porsi/hari · harga jual ${rp(item.sell)}</small>
              <div class="g-row" style="margin-top:8px">
                <input class="g-num" id="ec-q" inputmode="numeric" placeholder="beli berapa?" style="width:150px">
                <button class="btn btn-leaf" id="ec-buy">🛒 Beli</button>
                <button class="btn btn-ghost" id="ec-skip">Lewati belanja</button>
              </div>
              <div class="g-hintbox" id="ec-hint" style="display:none"></div>
            </div>
            <div class="g-market-log" id="ec-log">${log.map((l) => `<div class="g-profit-row">${l}</div>`).join('') || '<small>Belum ada catatan — ayo mulai!</small>'}</div>`;
          const hint = el2.querySelector('#ec-hint');
          const inp = el2.querySelector('#ec-q');
          el2.querySelector('#ec-skip').onclick = () => { sellPhase(0, item); };
          el2.querySelector('#ec-buy').onclick = () => {
            const q = parseInt(inp.value, 10) || 0;
            const cost = q * price;
            if (cost > cash) { hint.style.display = ''; hint.textContent = `Kas kurang! Maksimal ${Math.floor(cash / price)} porsi 💡`; BS.sound('wrong'); return; }
            cash -= cost; stock += q;
            log.unshift(`🛒 Hari ${day}: beli ${q} ${item.e} — ${rp(cost)}`);
            BS.sound('coin');
            sellPhase(q, item);
          };
          function sellPhase(bought, it) {
            const sold = Math.min(stock, demand + ri(-1, 2) > 0 ? Math.min(stock, Math.max(0, demand + ri(-1, 2))) : 0);
            const revenue = sold * it.sell;
            cash += revenue; stock -= sold;
            const profit = revenue - sold * it.buy;
            profits.push(profit);
            log.unshift(`💵 Hari ${day}: laku ${sold} — masuk ${rp(revenue)} (untung ${rp(profit)})`);
            const concept = CONCEPTS[ri(0, CONCEPTS.length - 1)];
            el2.innerHTML = `
              <div class="g-q">💵 Hari ${day}: terjual <b>${sold}</b> ${it.e} × ${rp(it.sell)} = ${rp(revenue)}</div>
              <div class="g-profit-row" style="margin:8px 20px"><span>Untung hari ini</span><div class="pbar"><i style="width:${Math.min(100, Math.abs(profit) / 500)}%;background:${profit >= 0 ? 'var(--leaf)' : 'var(--coral)'}"></i></div><b style="color:${profit >= 0 ? 'var(--leaf-d)' : 'var(--coral-d)'}">${profit >= 0 ? '+' : ''}${rp(profit)}</b></div>
              <div class="g-panel"><b>🧠 Soal konsep finansial:</b> ${concept.q}
                <div class="choice-row" style="margin-top:8px">${shuffle([concept.a, ...concept.w]).map((o) => `<button class="choice-btn" data-c="${o}" style="font-size:.95rem">${o}</button>`).join('')}</div>
              </div>
              <div class="btn-row" style="justify-content:center;margin-top:10px"><button class="btn btn-coral btn-big" id="ec-next">➡️ Hari berikutnya</button></div>`;
            el2.querySelectorAll('[data-c]').forEach((b) => {
              b.onclick = () => {
                conceptN++;
                if (b.dataset.c === concept.a) { b.classList.add('correct'); conceptOK++; BS.sound('correct'); }
                else { b.classList.add('wrong'); BS.sound('wrong'); }
                el2.querySelectorAll('[data-c]').forEach((x) => { x.disabled = true; if (x.dataset.c === concept.a) x.classList.add('correct'); });
                const tip = document.createElement('div'); tip.className = 'g-hintbox'; tip.textContent = '💡 ' + concept.why;
                el2.querySelector('.g-panel').appendChild(tip);
              };
            });
            el2.querySelector('#ec-next').onclick = screen;
          }
        }
        function finish() {
          const totalProfit = profits.reduce((a, b) => a + b, 0);
          const target = tier === 'sulit' ? 50000 : tier === 'sedang' ? 30000 : 15000;
          const depo = cash >= 20000 && Math.random() < 2 ? true : null;
          el2.innerHTML = `
            <div class="g-q">📊 Rekap 7 hari — Kas akhir: <b style="color:var(--leaf-d)">${rp(cash)}</b> · Total untung: <b>${rp(totalProfit)}</b></div>
            ${profits.map((p, i) => `<div class="g-profit-row"><span>H${i + 1}</span><div class="pbar"><i style="width:${Math.min(100, Math.abs(p) / 300)}%;background:${p >= 0 ? 'var(--leaf)' : 'var(--coral)'}"></i></div><span>${p >= 0 ? '+' : '−'}${rp(Math.abs(p))}</span></div>`).join('')}
            <div class="g-panel" style="margin-top:10px"><b>🏦 Penawaran deposito:</b> kunci kas akhir 1 minggu, bunga 5% sederhana → dapat ${rp(cash * 0.05)}. Ambil?
              <div class="btn-row" style="margin-top:8px"><button class="btn btn-leaf" id="ec-yes">Ya, deposito!</button><button class="btn" id="ec-no">Nanti dulu</button></div>
              <div class="g-hintbox" id="ec-dep" style="display:none"></div>
            </div>`;
          const hint = el2.querySelector('#ec-dep');
          el2.querySelector('#ec-yes').onclick = () => {
            hint.style.display = ''; hint.textContent = `Bunga ${rp(cash * 0.05)} masuk! Bunga sederhana = modal × persen × waktu.`;
            BS.sound('coin');
            setTimeout(() => wrapUp(true), 1200);
          };
          el2.querySelector('#ec-no').onclick = () => { hint.style.display = ''; hint.textContent = 'Tidak apa-apa — uang tunai lebih fleksibel untuk belanja stok!'; setTimeout(() => wrapUp(false), 1200); };
          function wrapUp(depoOk) {
            const moneyScore = Math.min(1, Math.max(0, totalProfit / target));
            const conceptScore = conceptN ? conceptOK / conceptN : 0;
            const pct = Math.round(60 * moneyScore * 100 / 100 * 1 + 40 * conceptScore);
            BS.gkit.finish(el, 'sma-econ', pct,
              pct >= 65 ? 'Pengusaha warung sukses! 🏪' : 'Terus belajar mengelola uang ya! 💰',
              `Laba 7 hari: ${rp(totalProfit)} (target ${rp(target)}) · Konsep benar ${conceptOK}/${conceptN}`);
          }
        }
        screen();
      }
      /* layar tier + mulai */
      el.innerHTML = BS.gkit.stage('💰 Pasar & Uang', `
        <div style="text-align:center;padding:8px 4px">
          <p style="font-family:var(--font-disp);font-weight:800;font-size:1.15rem">Modal Rp100.000. Kelola warungmu 7 hari — keputusanmu menentukan untung-rugi!</p>
          <div class="chip-row" style="justify-content:center;margin-top:12px">
            <button class="chip on" data-tier="mudah">🟢 Mudah</button>
            <button class="chip" data-tier="sedang">🟡 Sedang · diskon & permintaan</button>
            <button class="chip" data-tier="sulit">🔴 Sulit · target laba Rp50.000</button>
          </div>
          <button class="btn btn-coral btn-big" id="ec-start" style="margin-top:16px">🚀 Buka Warung!</button>
        </div>`, `<span class="gs-pill">7 hari</span>`);
      let tier = 'mudah';
      el.querySelectorAll('[data-tier]').forEach((c) => {
        c.onclick = () => { tier = c.dataset.tier; el.querySelectorAll('[data-tier]').forEach((x) => x.classList.toggle('on', x === c)); BS.sound('pop'); };
      });
      el.querySelector('#ec-start').onclick = () => { BS.sound('pop'); run(el.querySelector('.game-stage'), tier); };
    },
  };

  /* ================= SMA: VEKTOR ARENA ================= */
  BS.GAMES['sma-vector'] = {
    name: 'Vektor Arena', icon: '🏹', world: 'sma', worldName: 'Dunia SMA', sticker: 'pink',
    desc: 'Tarik panah gaya, lihat resultannya, meluncurkan balok ke target!',
    topics: ['sma10-fisika-kinematika', 'sma10-fisika-newton', 'smp8-ipa-gaya'], tags: ['fisika'],
    render(el) {
      const N2PX = 6; /* skala: 1 N = 6 px */
      function round(rEl, tier, r, api) {
        const w0 = 680, h0 = 380;
        const target = { x: w0 * 0.78, y: h0 / 2, r: 26 };
        const block = { x: w0 * 0.22, y: h0 / 2, vx: 0, vy: 0, m: 2 };
        let vecs = [];
        if (tier === 'mudah') vecs = [{ F: 12, th: 0 }];
        else if (tier === 'sedang') vecs = [{ F: 10, th: 0 }, { F: 8, th: 90 }];
        else vecs = [{ F: 10, th: ri(0, 60) }, { F: 8, th: ri(120, 200) }, { F: 6, th: ri(220, 340) }];
        const targetV = { F: 14, th: ri(0, 360) };
        let launched = false, solved = false, slideT = 0;
        const comp = (v) => ({ x: v.F * Math.cos(v.th * Math.PI / 180), y: -v.F * Math.sin(v.th * Math.PI / 180) });
        function result() {
          const s = vecs.reduce((acc, v) => { const c = comp(v); return { x: acc.x + c.x, y: acc.y + c.y }; }, { x: 0, y: 0 });
          return s;
        }
        rEl.innerHTML = `
          <div class="g-q" id="vec-q"></div>
          <canvas class="g-vector-canvas" id="vec-cv"></canvas>
          <div class="g-center" style="font-weight:700;color:var(--ink-soft);font-size:.85rem">👆 seret ujung panah untuk mengubah arah & besar gaya (skala 1 N = 6 px)</div>
          <div class="btn-row" style="justify-content:center;margin-top:8px">
            <button class="btn btn-coral btn-big" id="vec-launch">🚀 Tarik!</button>
            <button class="btn btn-ghost" id="vec-reset">🔄 Ulang</button>
          </div>
          <div class="g-hintbox" id="vec-hint" style="display:none"></div>`;
        const cv = rEl.querySelector('#vec-cv'), hint = rEl.querySelector('#vec-hint');
        const qEl = rEl.querySelector('#vec-q');
        const mode = tier === 'sulit' && r % 2 ? 'balance' : 'target';
        if (mode === 'target') qEl.innerHTML = `🎯 Geser panah gaya sehingga <b>resultan</b> menarik balok tepat ke zona target (${targetV.F} N ke arah tertentu)!`;
        else qEl.innerHTML = '⚖️ Mode seimbang: atur semua gaya agar resultan = 0 N (balok diam)!';
        const sim = BS.gsim(cv, {
          h: h0,
          tick(dt) {
            if (launched && !solved) {
              const s = result();
              block.vx += s.x / block.m * dt; block.vy += s.y / block.m * dt;
              block.vx *= 0.985; block.vy *= 0.985;
              block.x += block.vx * dt * 22; block.y += block.vy * dt * 22;
              slideT += dt;
              const d = Math.hypot(block.x - target.x, block.y - target.y);
              if (d < target.r) { solved = true; BS.sound('coin'); BS.fx.confetti(16); hint.style.display = ''; hint.innerHTML = `🎯 Tepat sasaran! Resultan ${Math.hypot(s.x, s.y).toFixed(1)} N. ${api.praise()}`; setTimeout(() => api.done(true), 1100); }
              if (slideT > 2.6 && !solved) { solved = true; hint.style.display = ''; hint.innerHTML = `Meleset — resultan kamu (${Math.hypot(s.x, s.y).toFixed(1)} N, arah ${(Math.atan2(-s.y, s.x) * 180 / Math.PI + 360) % 360 | 0}°) belum tepat 💡 Atur lagi!`; api.msg(api.nudge()); setTimeout(() => api.done(false), 1300); }
            }
          },
          draw(ctx) {
            ctx.save();
            const w = cv.clientWidth || w0;
            const sc = w / w0;
            ctx.scale(sc, sc);
            /* papan es */
            ctx.fillStyle = '#EAF7FF'; ctx.fillRect(0, 0, w0, h0);
            ctx.strokeStyle = '#A8DBFF'; ctx.lineWidth = 2;
            for (let i = 0; i < w0; i += 46) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h0); ctx.stroke(); }
            /* zona target */
            if (mode === 'target') {
              ctx.beginPath(); ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255,197,61,.5)'; ctx.fill(); ctx.strokeStyle = '#F2A900'; ctx.lineWidth = 4; ctx.stroke();
              ctx.fillStyle = '#F2A900'; ctx.font = '800 12px Baloo 2'; ctx.textAlign = 'center'; ctx.fillText('TARGET', target.x, target.y + 4);
            }
            /* panah gaya */
            const s = result();
            vecs.forEach((v, i) => {
              const c = comp(v);
              const ex = block.x + c.x * N2PX, ey = block.y + c.y * N2PX;
              ctx.strokeStyle = ['#FF6B5E', '#9B5CF6', '#2EC77E'][i % 3]; ctx.lineWidth = 5;
              ctx.beginPath(); ctx.moveTo(block.x, block.y); ctx.lineTo(ex, ey); ctx.stroke();
              const ang = Math.atan2(ey - block.y, ex - block.x);
              ctx.fillStyle = ctx.strokeStyle;
              ctx.beginPath();
              ctx.moveTo(ex, ey);
              ctx.lineTo(ex - 14 * Math.cos(ang - 0.4), ey - 14 * Math.sin(ang - 0.4));
              ctx.lineTo(ex - 14 * Math.cos(ang + 0.4), ey - 14 * Math.sin(ang + 0.4));
              ctx.closePath(); ctx.fill();
              ctx.font = '800 12px Baloo 2'; ctx.textAlign = 'center';
              ctx.fillText(`${v.F.toFixed(1)} N`, ex, ey - 10);
              v._hx = ex; v._hy = ey;
            });
            /* resultan */
            if (!launched) {
              const rl = Math.hypot(s.x, s.y) * N2PX;
              if (rl > 4) {
                ctx.strokeStyle = '#1E8AD6'; ctx.setLineDash([8, 6]); ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(block.x, block.y); ctx.lineTo(block.x + s.x * N2PX, block.y + s.y * N2PX); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = '#1E8AD6'; ctx.font = '800 14px Baloo 2'; ctx.textAlign = 'center';
                ctx.fillText(`ΣF = ${Math.hypot(s.x, s.y).toFixed(1)} N ∠${((Math.atan2(-s.y, s.x) * 180 / Math.PI + 360) % 360).toFixed(0)}°`, block.x + s.x * N2PX / 2, block.y + s.y * N2PX / 2 - 14);
              }
            }
            /* balok */
            ctx.fillStyle = '#FF8F1F'; ctx.strokeStyle = '#2A2140'; ctx.lineWidth = 3.5;
            ctx.fillRect(block.x - 16, block.y - 16, 32, 32); ctx.strokeRect(block.x - 16, block.y - 16, 32, 32);
            ctx.font = '18px'; ctx.textAlign = 'center'; ctx.fillText('📦', block.x, block.y + 6);
            ctx.restore();
          },
        });
        let dragV = null;
        cv.addEventListener('pointerdown', (e) => {
          if (launched) return;
          const p = sim.pt(e);
          vecs.forEach((v) => { if (v._hx && Math.hypot(p.x - v._hx, p.y - v._hy) < 30) dragV = v; });
        });
        cv.addEventListener('pointermove', (e) => {
          if (!dragV || launched) return;
          const p = sim.pt(e);
          const dx = p.x - block.x, dy = p.y - block.y;
          dragV.F = Math.min(30, Math.max(1, Math.hypot(dx, dy) / N2PX));
          dragV.th = ((Math.atan2(-dy, dx) * 180 / Math.PI) + 360) % 360;
        });
        window.addEventListener('pointerup', () => { dragV = null; }, { passive: true });
        rEl.querySelector('#vec-reset').onclick = () => { block.x = w0 * 0.22; block.y = h0 / 2; block.vx = 0; block.vy = 0; launched = false; solved = false; slideT = 0; hint.style.display = 'none'; BS.sound('pop'); };
        rEl.querySelector('#vec-launch').onclick = () => {
          if (launched || solved) return;
          if (mode === 'balance') {
            const s = result();
            const mag = Math.hypot(s.x, s.y);
            const ok = mag < 1.2;
            hint.style.display = '';
            hint.innerHTML = ok ? `⚖️ SEIMBANG SEMPURNA (ΣF = ${mag.toFixed(2)} N)! ${api.praise()}` : `Belum seimbang — ΣF masih ${mag.toFixed(1)} N ke arah ${((Math.atan2(-s.y, s.x) * 180 / Math.PI + 360) % 360).toFixed(0)}° 💡`;
            BS.sound(ok ? 'correct' : 'wrong');
            if (ok) BS.fx.confetti(12);
            setTimeout(() => api.done(ok), 1200);
            return;
          }
          launched = true;
          BS.sound('pop');
        };
      }
      BS.grun(el, {
        gameId: 'sma-vector', title: '🏹 Vektor Arena',
        intro: 'Gaya itu vektor — punya arah & besar. Komposisikan panahmu, tembak ke target!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: '1 vektor, mata angin' },
          { k: 'sedang', label: '🟡 Sedang', desc: '2 vektor siku-siku' },
          { k: 'sulit', label: '🔴 Sulit', desc: '3 vektor + mode seimbang' },
        ],
        total: 5, make: round, winTitle: 'Master vektor! ➡️', tryTitle: 'Ayo komposisikan lagi! 🏹',
        onRound: (ok) => BS.recordAnswer('sma10-fisika-newton', ok),
      });
    },
  };
})();
