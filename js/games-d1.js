/* ============================================================
   BelajarSeru! 3D — games-d1.js
   Game SMP: smp-circuit (Sirkuit Lab), smp-molecule (Bangun
   Molekul), smp-cell (Petualangan Sel 3D)
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ================= SMP: SIRKUIT LAB ================= */
  BS.GAMES = BS.GAMES || {};
  BS.GAMES['smp-circuit'] = {
    name: 'Sirkuit Lab', icon: '⚡', world: 'smp', worldName: 'Dunia SMP', sticker: 'sky',
    desc: 'Tutup saklar, amati arus & lampu — pahami rangkaian seri dan paralel!',
    topics: ['smp9-ipa-listrik', 'sd5-ipas-listrik'], tags: ['ipa', 'fisika'],
    render(el) {
      function drawCircuit(cv, T, state) {
        const s = BS.gsim(cv, {
          h: 300,
          draw(ctx) {
            const w = cv.clientWidth || 680, h = 300;
            const x0 = 60, x1 = w - 60, y0 = 50, y1 = h - 50;
            ctx.lineWidth = 4; ctx.strokeStyle = '#2A2140'; ctx.lineCap = 'round';
            /* kabel kotak */
            ctx.beginPath(); ctx.strokeRect ? (ctx.moveTo(x0, y0), ctx.lineTo(x1, y0), ctx.lineTo(x1, y1), ctx.lineTo(x0, y1), ctx.closePath()) : null; ctx.stroke();
            /* baterai kiri */
            ctx.fillStyle = '#FFC53D'; ctx.fillRect(x0 - 12, (y0 + y1) / 2 - 20, 24, 40); ctx.strokeRect(x0 - 12, (y0 + y1) / 2 - 20, 24, 40);
            ctx.fillStyle = '#2A2140'; ctx.font = '800 12px Nunito'; ctx.textAlign = 'center';
            ctx.fillText('3V', x0, (y0 + y1) / 2 + 36);
            /* saklar atas tengah */
            const sx = (x0 + x1) / 2;
            ctx.save(); ctx.translate(sx, y0);
            ctx.strokeStyle = state.on ? '#1EA864' : '#E04F42';
            ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.stroke();
            ctx.beginPath(); ctx.lineWidth = 6; ctx.moveTo(-24, 0); ctx.lineTo(state.on ? 24 : 14, state.on ? 0 : -20); ctx.stroke();
            ctx.restore(); ctx.lineWidth = 4; ctx.strokeStyle = '#2A2140';
            ctx.fillStyle = state.on ? '#1EA864' : '#E04F42';
            ctx.font = '800 11px Baloo 2'; ctx.fillText(state.on ? 'SAKLAAR ON (tap)' : 'SAKLAAR OFF (tap)', sx, y0 - 28);
            /* lampu */
            const bulbs = T.bulbs; // [{x,y}]
            bulbs.forEach((b, i) => {
              const R = 16;
              ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, Math.PI * 2);
              const lit = state.on && !b.removed && !state.short;
              ctx.fillStyle = lit ? `rgba(255,197,61,${Math.min(1, 0.35 + state.glow)})` : '#fff';
              ctx.fill(); ctx.stroke();
              if (lit) { ctx.beginPath(); ctx.arc(b.x, b.y, R + 6, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,197,61,.6)'; ctx.stroke(); ctx.strokeStyle = '#2A2140'; }
              ctx.fillStyle = '#2A2140'; ctx.font = '800 13px Nunito';
              ctx.fillText(b.removed ? '❌' : '💡', b.x, b.y + 4);
              ctx.font = '700 10px Nunito';
              if (lit) ctx.fillText(b.brightness.toFixed(2) + ' A', b.x, b.y + R + 14);
              ctx.font = '800 10px Baloo 2';
              ctx.fillText('L' + (i + 1) + (b.removed ? ' (dicabut)' : ''), b.x, b.y - R - 8);
            });
            /* label topologi */
            ctx.fillStyle = '#6B6484'; ctx.font = '800 12px Baloo 2';
            ctx.fillText('Rangkaian: ' + T.label, w / 2, h - 12);
            if (state.short) { ctx.fillStyle = '#E04F42'; ctx.font = '800 15px Baloo 2'; ctx.fillText('💥 KORSLET! Jangan coba ini di rumah ya!', w / 2, 26); }
            else if (state.on) { ctx.fillStyle = '#1EA864'; ctx.font = '800 14px Baloo 2'; ctx.fillText(`Arus total: ${state.I.toFixed(2)} A  ·  Hambatan: ${state.R.toFixed(1)} Ω`, w / 2, 26); }
          },
        });
        return s;
      }
      function makeT(tier) {
        const w = 680;
        if (tier === 'mudah') return { label: 'Seri — 1 lampu', bulbs: [{ x: w / 2, y: 150, removed: false }], topology: 'seri', ask: 'Tutup saklarnya! Berapa lampu yang menyala?' };
        if (tier === 'sedang') return pick([
          { label: 'Seri — 2 lampu', bulbs: [{ x: w / 2 - 90, y: 150, removed: false }, { x: w / 2 + 90, y: 150, removed: false }], topology: 'seri', ask: 'Kedua lampu seri. Jika L1 dicabut, L2 masih menyala?' },
          { label: 'Paralel — 2 lampu', bulbs: [{ x: w / 2 - 90, y: 100, removed: false }, { x: w / 2 + 90, y: 200, removed: false }], topology: 'paralel', ask: 'Kedua lampu paralel. Jika L1 dicabut, L2 masih menyala?' },
        ]);
        return pick([
          { label: 'Campuran — seri + paralel', bulbs: [{ x: w / 2 - 110, y: 150, removed: false }, { x: w / 2 + 40, y: 100, removed: false }, { x: w / 2 + 40, y: 200, removed: false }], topology: 'campur', ask: 'L1 seri dengan (L2 // L3). Jika L2 dicabut, lampu yang tetap menyala?' },
          { label: 'Korslet!', bulbs: [{ x: w / 2, y: 150, removed: false }], topology: 'korslet', ask: 'Kabel terpasang tanpa lampu di jalurnya. Tutup saklar — apa yang terjadi?' },
        ]);
      }
      function round(rEl, tier, r, api) {
        const T = makeT(tier);
        const state = { on: false, short: false, glow: 0, I: 0, R: 0 };
        rEl.innerHTML = `<div class="g-q">⚡ ${T.ask}</div>
          <canvas class="game-canvas" id="cir-cv"></canvas>
          <div class="choice-row" id="cir-opts" style="margin-top:10px"></div>
          <div class="g-hintbox" id="cir-hint" style="display:none"></div>`;
        const cv = rEl.querySelector('#cir-cv');
        const sim = drawCircuit(cv, T, state);
        const opts = rEl.querySelector('#cir-opts'), hint = rEl.querySelector('#cir-hint');
        let prediction = null, correctAns = null;
        function askPrediction(q, optsArr, correct, onOk) {
          opts.innerHTML = optsArr.map((o) => `<button class="choice-btn" style="font-size:.98rem">${o}</button>`).join('');
          opts.querySelectorAll('.choice-btn').forEach((b) => {
            b.onclick = () => {
              if (b.textContent === correct) { b.classList.add('correct'); BS.sound('correct'); BS.fx.confetti(14); api.msg(api.praise()); setTimeout(onOk, 900); }
              else { b.classList.add('wrong'); b.disabled = true; BS.sound('wrong'); hint.style.display = ''; hint.textContent = 'Belum tepat — amati dulu lalu coba opsi lain 💡'; }
            };
          });
        }
        /* fase 1: operasikan */
        if (T.topology === 'korslet') {
          correctAns = 'Semua lampu mati & arus membesar berbahaya';
          api.msg('Tap tombol prediksi dulu, lalu tap saklar untuk membuktikan!');
          askPrediction('pred', ['Lampu menyala terang', 'Semua lampu mati & arus membesar berbahaya', 'Tidak terjadi apa-apa'], correctAns, () => api.done(true));
        } else if (T.topology === 'seri' && T.bulbs.length === 1) {
          correctAns = '1 lampu menyala terang';
          askPrediction('pred', ['1 lampu menyala', 'Tidak ada yang menyala', 'Lampu meledak'], correctAns, () => api.done(true));
        } else {
          correctAns = T.topology === 'paralel' ? 'Ya, tetap menyala' : 'Tidak, ikut mati';
          api.msg('Prediksi dulu di bawah, lalu tap saklar & cabut lampu L1 untuk membuktikan!');
          askPrediction('pred', ['Ya, tetap menyala', 'Tidak, ikut mati'], correctAns, () => api.done(true));
        }
        /* interaksi canvas: tap saklar (segitiga atas) & lampu */
        cv.addEventListener('pointerdown', (e) => {
          const p = sim.pt(e);
          const w = cv.clientWidth || 680;
          const sx = w / 2;
          if (Math.abs(p.x - sx) < 40 && p.y < 70) {
            state.on = !state.on; BS.sound('pop');
            if (state.on) {
              const alive = T.bulbs.filter((b) => !b.removed).length;
              if (T.topology === 'korslet' || alive === 0) { state.short = true; BS.sound('wrong'); BS.fx.confetti(10); }
              else {
                const rBulb = 1;
                let R = 0;
                if (T.topology === 'seri') R = rBulb * alive;
                else if (T.topology === 'paralel') R = rBulb / alive;
                else { /* campur: 1 seri + (n-1) paralel */
                  const par = alive - 1;
                  R = rBulb + (par > 0 ? rBulb / par : 0);
                }
                state.R = R; state.I = 3 / R;
                T.bulbs.forEach((b) => { if (!b.removed) b.brightness = T.topology === 'seri' ? state.I : (T.topology === 'paralel' ? state.I : state.I); });
              }
            }
          } else {
            T.bulbs.forEach((b) => {
              if (Math.hypot(p.x - b.x, p.y - b.y) < 26) {
                if (!state.on) { b.removed = !b.removed; BS.sound('pop'); api.msg(b.removed ? 'Lampu dicabut 🔧 sekarang tutup saklarnya!' : 'Lampu dipasang kembali'); }
                else api.msg('Buka saklarnya dulu sebelum mencabut lampu 🔒');
              }
            });
          }
        });
      }
      BS.grun(el, {
        gameId: 'smp-circuit', title: '⚡ Sirkuit Lab',
        intro: 'Prediksi dulu, lalu buktikan lewat simulasi rangkaian. Hati-hati dengan korslet! 🔌',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: '1 lampu, rangkaian tertutup' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'seri vs paralel + prediksi' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'campuran & korslet' },
        ],
        total: 5, make: round, winTitle: 'Insinyur listrik muda! 🔌', tryTitle: 'Coba eksperimen lagi ya! ⚡',
        onRound: (ok) => BS.recordAnswer('smp9-ipa-listrik', ok),
      });
    },
  };

  /* ================= SMP: BANGUN MOLEKUL ================= */
  BS.GAMES['smp-molecule'] = {
    name: 'Bangun Molekul', icon: '🧪', world: 'smp', worldName: 'Dunia SMP', sticker: 'leaf',
    desc: 'Ikatkan atom-atom jadi molekul: air, karbon dioksida, dan sahabatnya!',
    topics: ['smp7-ipa-zat'], tags: ['ipa', 'kimia'],
    render(el) {
      const ATOMS = {
        H: { color: '#FFFFFF', text: '#2A2140', val: 1, name: 'Hidrogen' },
        O: { color: '#FF6B5E', text: '#fff', val: 2, name: 'Oksigen' },
        C: { color: '#2A2140', text: '#fff', val: 4, name: 'Karbon' },
        N: { color: '#38A9F5', text: '#fff', val: 3, name: 'Nitrogen' },
      };
      const TARGETS = {
        mudah: [
          { f: 'H₂', name: 'Hidrogen', recipe: { H: 2 }, bonds: [[0, 1]], say: 'Gas hidrogen, dua atom kembar!' },
          { f: 'O₂', name: 'Oksigen', recipe: { O: 2 }, bonds: [[0, 1]], say: 'Oksigen yang kita hirup!' },
          { f: 'H₂O', name: 'Air', recipe: { H: 2, O: 1 }, bonds: [[1, 0], [1, 2]], say: 'Air — dua hidrogen satu oksigen!' },
        ],
        sedang: [
          { f: 'CO₂', name: 'Karbon Dioksida', recipe: { C: 1, O: 2 }, bonds: [[0, 1], [0, 2]], say: 'Karbon dioksida, gas pernapasan tumbuhan!' },
          { f: 'CH₄', name: 'Metana', recipe: { C: 1, H: 4 }, bonds: [[0, 1], [0, 2], [0, 3], [0, 4]], say: 'Metana, gas bio dari kotoran sapi!' },
        ],
        sulit: [
          { f: 'NH₃', name: 'Amonia', recipe: { N: 1, H: 3 }, bonds: [[0, 1], [0, 2], [0, 3]], say: 'Amonia, bau menyengat!' },
          { f: 'CO₂', name: 'Karbon Dioksida', recipe: { C: 1, O: 2 }, bonds: [[0, 1], [0, 2]], guess: true, say: 'Tebak rumus dari modelnya!' },
        ],
      };
      function round(rEl, tier, r, api) {
        const list = TARGETS[tier] || TARGETS.mudah;
        const T = JSON.parse(JSON.stringify(list[r % list.length])); /* deep copy agar replay bersih */
        const atoms = [];
        Object.entries(T.recipe).forEach(([k, n]) => { for (let i = 0; i < n; i++) atoms.push({ k, x: 0, y: 0, used: 0, placed: false, id: atoms.length }); });
        let sel = null, solved = false, failed = false;
        rEl.innerHTML = `
          <div class="g-q">${T.guess ? '🕵️ Mode tebak: ikatkan sesuai valensi, lalu tebak rumusnya!' : `🎯 Bangun <b>${T.name}</b>: ${Object.entries(T.recipe).map(([k, n]) => `${n}× ${k}`).join(' + ')}`}</div>
          <div class="g-panel" style="position:relative;height:230px" id="mol-area">
            <svg id="mol-svg" viewBox="0 0 460 230" style="width:100%;height:100%"></svg>
          </div>
          <div class="g-row" id="mol-tray" style="margin-top:10px"></div>
          <div class="btn-row" style="justify-content:center;margin-top:10px">
            <button class="btn btn-leaf btn-big" id="mol-check">✅ Cek Molekul</button>
            <button class="btn btn-ghost" id="mol-reset">🔄 Ulang</button>
          </div>
          <div class="g-hintbox" id="mol-hint" style="display:none"></div>`;
        const area = rEl.querySelector('#mol-area'), svg = rEl.querySelector('#mol-svg');
        const tray = rEl.querySelector('#mol-tray'), hint = rEl.querySelector('#mol-hint');
        function paint() {
          /* posisikan dulu atom yang belum ditempatkan, baru render */
          atoms.forEach((a, i) => {
            if (a.placed) return;
            const ang = (i / atoms.length) * Math.PI * 2;
            a.x = 230 + Math.cos(ang) * 70; a.y = 115 + Math.sin(ang) * 62; a.placed = true;
          });
          let inner = '';
          /* ikatan */
          T.bonds.forEach(([a, b]) => {
            const A = atoms[a], B = atoms[b];
            if (A.placed && B.placed) inner += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="#2A2140" stroke-width="5" stroke-linecap="round"/>`;
          });
          atoms.forEach((a) => {
            if (!a.placed) return;
            const m = ATOMS[a.k];
            const r = a.k === 'H' ? 17 : 22;
            inner += `<circle cx="${a.x}" cy="${a.y}" r="${r}" fill="${m.color}" stroke="#2A2140" stroke-width="3.5" style="cursor:pointer"/>
              <text x="${a.x}" y="${a.y + 6}" text-anchor="middle" font-weight="800" font-size="15" fill="${m.text}" font-family="Baloo 2" style="pointer-events:none">${a.k}</text>`;
          });
          svg.innerHTML = inner;
          /* titik valensi sisa */
          svg.querySelectorAll('circle').forEach((c, i) => {
            const a = atoms[i];
            if (!a) return;
            const m = ATOMS[a.k], r = a.k === 'H' ? 17 : 22;
            for (let v = 0; v < m.val - a.used; v++) {
              const ang = (v / m.val) * Math.PI * 2 - Math.PI / 2;
              const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              dot.setAttribute('cx', +c.getAttribute('cx') + Math.cos(ang) * (r + 6));
              dot.setAttribute('cy', +c.getAttribute('cy') + Math.sin(ang) * (r + 6));
              dot.setAttribute('r', 3); dot.setAttribute('fill', '#FFC53D'); dot.setAttribute('stroke', '#2A2140');
              svg.appendChild(dot);
            }
          });
          /* klik atom = pilih untuk ikat */
          svg.querySelectorAll('circle').forEach((c, i) => {
            const a = atoms[i];
            if (!a) return;
            c.addEventListener('click', () => {
              if (solved) return;
              if (!sel) { sel = a; c.setAttribute('stroke', '#FF6B5E'); c.setAttribute('stroke-width', '6'); return; }
              if (sel === a) { sel = null; paint(); return; }
              const pairExists = T.bonds.some(([p, q]) => (atoms[p] === sel && atoms[q] === a) || (atoms[p] === a && atoms[q] === sel));
              const bonded = sel.used >= ATOMS[sel.k].val || a.used >= ATOMS[a.k].val;
              if (!pairExists && !bonded && sel.used < ATOMS[sel.k].val && a.used < ATOMS[a.k].val) {
                /* ikatan bebas di luar resep: anggap valid struktur bila valensi cocok */
                T.bonds.push([atoms.indexOf(sel), atoms.indexOf(a)]);
                sel.used++; a.used++; sel = null; BS.sound('pop'); paint();
              } else if (pairExists) {
                if (bonded) { hint.style.display = ''; hint.textContent = `${a.k} sudah penuh ikatannya 💡`; sel = null; paint(); return; }
                sel.used++; a.used++; sel = null; BS.sound('pop'); paint();
              } else { hint.style.display = ''; hint.textContent = `${sel.k} & ${a.k} tidak saling berikatan di molekul ini 💡`; sel = null; paint(); }
            });
          });
        }
        paint();
        /* resep kecepatan: tombol auto-tempatkan atom dari resep */
        const autoBtn = document.createElement('button');
        autoBtn.className = 'btn btn-sun'; autoBtn.textContent = '✨ Taruh semua atom';
        autoBtn.onclick = () => { atoms.forEach((a) => { a.placed = false; }); paint(); BS.sound('pop'); };
        rEl.querySelector('#mol-check').before ? null : null;
        tray.innerHTML = `<span style="font-weight:800;color:var(--ink-soft)">Piringan atom:</span> ${Object.entries(T.recipe).map(([k, n]) => `<span class="g-tile" style="cursor:default;font-size:.95rem">${n}× ${k}</span>`).join('')}`;
        tray.appendChild(autoBtn);
        rEl.querySelector('#mol-reset').onclick = () => {
          atoms.forEach((a) => { a.used = 0; a.placed = false; });
          T.bonds = T.bonds.slice(0, (T.f === 'H₂' || T.f === 'O₂') ? 1 : T.f === 'H₂O' ? 2 : T.f === 'CO₂' ? 2 : T.f === 'CH₄' ? 4 : 3);
          atoms.forEach((a) => { a.placed = false; });
          paint(); BS.sound('pop');
        };
        rEl.querySelector('#mol-check').onclick = () => {
          if (solved) return;
          const bondedOK = T.bonds.every(([a, b]) => atoms[a].placed && atoms[b].placed);
          const fullVal = atoms.every((a) => a.used >= ATOMS[a.k].val);
          if (bondedOK && fullVal) {
            solved = true;
            svg.style.transition = 'transform 1s'; svg.style.transform = 'rotateY(0deg) scale(1.06)';
            BS.sound('coin'); BS.fx.confetti(16);
            if (T.guess) {
              hint.style.display = '';
              hint.innerHTML = `Molekul jadi! Rumusnya? <div class="choice-row" style="margin-top:8px">${shuffle([...new Set([T.f, 'H₂O', 'CH₄', 'NH₃'])]).map((f) => `<button class="choice-btn" data-f="${f}" style="font-size:1.2rem">${f}</button>`).join('')}</div>`;
              hint.querySelectorAll('[data-f]').forEach((b) => {
                b.onclick = () => {
                  if (b.dataset.f === T.f) { b.classList.add('correct'); api.msg(`${T.say} ${api.praise()}`); setTimeout(() => api.done(true), 900); }
                  else { b.classList.add('wrong'); b.disabled = true; api.msg('Rumusnya ' + T.f + ' 💡'); }
                };
              });
            } else {
              api.msg(`${T.say} ${api.praise()}`);
              setTimeout(() => api.done(!failed), 1200);
            }
          } else {
            failed = true; BS.sound('wrong');
            const hang = atoms.filter((a) => a.used < ATOMS[a.k].val).map((a) => a.k);
            hint.style.display = '';
            hint.textContent = hang.length ? `Atom ${[...new Set(hang)].join(', ')} masih punya ikatan bebas 💡 Pastikan semua valensi terpenuhi!` : 'Susunan ikatan belum tepat — cek pasangannya 💡';
            api.msg(api.nudge());
          }
        };
        if (!T.guess) BS.speak(`Bangun ${T.name}`);
      }
      BS.grun(el, {
        gameId: 'smp-molecule', title: '🧪 Bangun Molekul',
        intro: 'Zat tersusun dari atom! Ikatkan atom sesuai titik valensinya hingga molekul jadi.',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'H₂, O₂, air' },
          { k: 'sedang', label: '🟡 Sedang', desc: 'CO₂ & metana' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'amonia + tebak rumus' },
        ],
        total: 6, make: round, winTitle: 'Kimiawan cilik! ⚗️', tryTitle: 'Ayo bangun molekul lagi! 🧪',
        onRound: (ok) => BS.recordAnswer('smp7-ipa-zat', ok),
      });
    },
  };

  /* ================= SMP: PETUALANGAN SEL 3D ================= */
  BS.GAMES['smp-cell'] = {
    name: 'Petualangan Sel 3D', icon: '🦠', world: 'smp', worldName: 'Dunia SMP', sticker: 'grape',
    desc: 'Menyelamlah ke dalam sel! Kenali organel dan tugasnya lewat 3D.',
    topics: ['smp7-ipa-ekosistem'], tags: ['ipa', 'biologi'],
    render(el) {
      const ORGANELS = [
        { k: 'inti', name: 'Inti Sel', color: 0x9B5CF6, emoji: '🧠', r: 0.85, fn: 'Otak sel — penyimpan & pengatur DNA.' },
        { k: 'mito', name: 'Mitokondria', color: 0xFF8F1F, emoji: '⚡', r: 0.55, fn: 'Pabrik energi — tempat respirasi sel.' },
        { k: 'vakuola', name: 'Vakuola', color: 0x38A9F5, emoji: '💧', r: 0.95, fn: 'Gudang air & cadangan makanan.' },
        { k: 'liso', name: 'Lisosom', color: 0xFF8FAB, emoji: '🗑️', r: 0.32, fn: 'Pencerna limbah & pembersih sel.' },
        { k: 'ribosom', name: 'Ribosom', color: 0xFFC53D, emoji: '🏭', r: 0.28, fn: 'Pabrik pembuat protein.' },
      ];
      const EXTRA = [{ k: 'kloro', name: 'Kloroplas', color: 0x2EC77E, emoji: '🌿', r: 0.5, fn: 'Dapur sel — tempat fotosintesis (khas tumbuhan).' }];
      function stage3D(rEl, mode, api, tier) {
        const orgList = tier === 'mudah' ? ORGANELS : [...ORGANELS, ...EXTRA];
        const wrap = rEl.querySelector('#cell-wrap');
        let renderer, scene, camera, group, raycaster, mouse;
        let rotX = 0.4, rotY = 0.6, camZ = 14, targetZ = 7.5;
        const found = new Set();
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(wrap.clientWidth || 560, 340);
          wrap.innerHTML = ''; wrap.appendChild(renderer.domElement);
          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera(50, (wrap.clientWidth || 560) / 340, 0.1, 100);
          camera.position.z = camZ;
          scene.add(new THREE.AmbientLight(0xffffff, 0.75));
          const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(3, 5, 6); scene.add(dl);
          group = new THREE.Group(); scene.add(group);
          const membrane = new THREE.Mesh(new THREE.SphereGeometry(3.2, 40, 32), new THREE.MeshPhongMaterial({ color: 0xFFB088, transparent: true, opacity: 0.28 }));
          group.add(membrane);
          if (tier !== 'mudah') {
            const wall = new THREE.Mesh(new THREE.SphereGeometry(3.45, 40, 32), new THREE.MeshPhongMaterial({ color: 0x2EC77E, transparent: true, opacity: 0.18, wireframe: true }));
            group.add(wall);
          }
          orgList.forEach((o, i) => {
            const m = new THREE.Mesh(new THREE.SphereGeometry(o.r, 24, 18), new THREE.MeshPhongMaterial({ color: o.color }));
            const ang = (i / orgList.length) * Math.PI * 2;
            m.position.set(Math.cos(ang) * 1.7, Math.sin(ang * 1.3) * 1.1, Math.sin(ang) * 1.7);
            if (o.k === 'mito') m.scale.set(1.9, 0.8, 0.8);
            m.userData = o;
            group.add(m);
          });
          raycaster = new THREE.Raycaster(); mouse = new THREE.Vector2();
        } catch (err) { return fallback2D(rEl, mode, api, orgList); }
        let dragging = false, lx = 0, ly = 0;
        const cvs = renderer.domElement;
        cvs.style.touchAction = 'none';
        cvs.addEventListener('pointerdown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; });
        window.addEventListener('pointerup', () => { dragging = false; }, { passive: true });
        cvs.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          rotY += (e.clientX - lx) * 0.008; rotX += (e.clientY - ly) * 0.008;
          lx = e.clientX; ly = e.clientY;
        });
        cvs.addEventListener('click', (e) => {
          const rect = cvs.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const hits = raycaster.intersectObjects(group.children);
          const hit = hits.find((h) => h.object.userData && h.object.userData.k);
          if (hit) {
            const o = hit.object.userData;
            found.add(o.k);
            const label = rEl.querySelector('#cell-label');
            if (label) { label.innerHTML = `<b>${o.emoji} ${o.name}</b><br>${o.fn}`; label.style.display = ''; }
            BS.sound('coin'); BS.speak(o.name);
            const chip = rEl.querySelector(`[data-oc="${o.k}"]`);
            if (chip) chip.classList.add('got');
            if (mode === 'explore') {
              const ready = rEl.querySelector('#cell-ready');
              if (found.size >= 4 && ready) ready.style.display = '';
            } else if (mode === 'quiz' && api._want && o.k === api._want) {
              api.msg(`${o.emoji} Benar! ${o.fn} ${api.praise()}`);
              BS.fx.confetti(14);
              setTimeout(() => api.done(true), 1000);
            } else if (mode === 'quiz') {
              api.msg(`Itu ${o.name} — bukan yang dicari 💡`);
              setTimeout(() => api.done(false), 1200);
            }
          }
        });
        let raf = 0;
        (function loop() {
          if (!wrap.isConnected) return;
          raf = requestAnimationFrame(loop);
          group.rotation.y += 0.003;
          group.rotation.x = rotX * 0.4 + Math.sin(Date.now() / 3000) * 0.03;
          group.rotation.y += rotY * 0;
          camZ += (targetZ - camZ) * 0.04;
          camera.position.z = camZ;
          renderer.render(scene, camera);
        })();
        const cleanup = () => { cancelAnimationFrame(raf); renderer.dispose(); window.removeEventListener('hashchange', cleanup); };
        window.addEventListener('hashchange', cleanup, { once: true });
      }
      function fallback2D(rEl, mode, api, orgList) {
        rEl.querySelector('#cell-wrap').innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 40% 30%, #FFE9D2 0%, #FFD7B8 70%);display:grid;place-items:center">
            <div style="position:relative;width:min(280px,80%);aspect-ratio:1;border:4px solid #2A2140;border-radius:50%;background:#FFCDA8CC" id="fb-cell">
              ${orgList.map((o, i) => { const ang = (i / orgList.length) * Math.PI * 2; const sz = o.r * 44; return `<button data-oc2="${o.k}" title="${o.name}" style="position:absolute;left:${46 + Math.cos(ang) * 30}%;top:${46 + Math.sin(ang) * 30}%;width:${sz}px;height:${sz}px;border-radius:50%;border:3px solid #2A2140;background:#${o.color.toString(16).padStart(6, '0')};cursor:pointer"></button>`; }).join('')}
            </div>
          </div>`;
        rEl.querySelectorAll('[data-oc2]').forEach((b) => {
          b.onclick = () => {
            const o = orgList.find((x) => x.k === b.dataset.oc2);
            found.add(o.k);
            const label = rEl.querySelector('#cell-label');
            if (label) { label.innerHTML = `<b>${o.emoji} ${o.name}</b><br>${o.fn}`; label.style.display = ''; }
            BS.sound('coin'); BS.speak(o.name);
            const chip = rEl.querySelector(`[data-oc="${o.k}"]`); if (chip) chip.classList.add('got');
            if (mode === 'explore') { const ready = rEl.querySelector('#cell-ready'); if (found.size >= 4 && ready) ready.style.display = ''; }
            else if (mode === 'quiz' && api._want === o.k) { api.msg(`${o.emoji} Benar! ${o.fn}`); setTimeout(() => api.done(true), 900); }
            else if (mode === 'quiz') { api.msg(`Itu ${o.name} 💡`); setTimeout(() => api.done(false), 1100); }
          };
        });
      }
      function round(rEl, tier, r, api) {
        const orgList = tier === 'mudah' ? ORGANELS : [...ORGANELS, ...EXTRA];
        if (r === 0) {
          rEl.innerHTML = `<div class="g-q">🔬 Menyelam ke dalam sel... Kenali 4 organel dulu!</div>
            <div class="g-cell3d-wrap" id="cell-wrap"><div class="g-cell-label" id="cell-label" style="display:none"></div></div>
            <div class="g-row" style="margin-top:10px">${orgList.map((o) => `<span class="g-organel-chip" data-oc="${o.k}">${o.emoji} ${o.name}</span>`).join('')}</div>
            <div class="btn-row" style="justify-content:center;margin-top:12px">
              <button class="btn btn-coral btn-big" id="cell-ready" style="display:none">🎯 Aku siap berburu misi!</button>
            </div>
            <p class="g-center" style="font-weight:700;color:var(--ink-soft);font-size:.85rem">👆 Tap organel untuk kenalan · geser untuk memutar · (mode 3D)</p>`;
          stage3D(rEl, 'explore', api, tier);
          rEl.querySelector('#cell-ready').onclick = () => api.done(true);
        } else {
          const want = tier === 'sulit' ? orgList[ri(0, orgList.length - 1)] : orgList[ri(0, orgList.length - 1)];
          api._want = want.k;
          const fnMode = tier === 'sulit';
          rEl.innerHTML = `<div class="g-q">${fnMode ? `❓ Organel mana yang: <b>${want.fn.split('—')[1] || want.fn}</b>?` : `🎯 Temukan <b>${want.name}</b> dan tap dia!`}</div>
            <div class="g-cell3d-wrap" id="cell-wrap"><div class="g-cell-label" id="cell-label" style="display:none"></div></div>
            <p class="g-center" style="font-weight:700;color:var(--ink-soft);font-size:.85rem">Tap organel yang tepat di dalam sel!</p>`;
          stage3D(rEl, 'quiz', api, tier);
        }
      }
      BS.grun(el, {
        gameId: 'smp-cell', title: '🦠 Petualangan Sel 3D',
        intro: 'Selamat datang di dunia mikroskopis! Jelajahi sel, lalu selesaikan misi organel.',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'sel hewan 5 organel' },
          { k: 'sedang', label: '🟡 Sedang', desc: '+ kloroplas & dinding sel' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'dari fungsi ke organel' },
        ],
        total: 6, make: round, winTitle: 'Biolog muda! 🧫', tryTitle: 'Sel masih menantimu! 🦠',
        onRound: (ok) => BS.recordAnswer('smp7-ipa-ekosistem', ok),
      });
    },
  };
})();
