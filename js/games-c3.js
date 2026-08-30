/* ============================================================
   BelajarSeru! 3D — games-c3.js
   3 game Dunia SD (Task 6-b2):
     sd-word   "Susun Kata"   — suku kata / kalimat / kata baku (order drag)
     sd-type   "Ketik Cepat"  — balon kata jatuh (keyboard, TANPA grun)
     sd-plant  "Kebun Ajaib"  — sim tumbuhan air/cahaya/pupuk + refleksi
   Memakai mini-framework gkit.js (stage/finish/grun/gdrag).
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const say = (t) => { try { BS.speak(t); } catch (e) {} };
  const pop = (n) => { try { n.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }], { duration: 300 }); } catch (e) {} };
  const confetti = (n) => { try { BS.fx.confetti(n); } catch (e) {} };

  BS.GAMES = BS.GAMES || {};

  /* ============================================================
     G8 · sd-word — "Susun Kata" (produksi bahasa: suku kata,
     kalimat, kata baku). Drag mode 'order' pada wadah kereta+tray
     (kartu masuk slot dengan mengerakkan kartu tetangga) +
     fallback tap-tap. Tanpa nyawa; salah → bentuk benar ditunjukkan.
     ============================================================ */
  const SUKU2 = [ /* [kata, pemenggalan, emoji] */
    ['buku', 'bu-ku', '📚'], ['kera', 'ke-ra', '🐒'], ['gajah', 'ga-jah', '🐘'], ['jeruk', 'je-ruk', '🍊'],
    ['kompor', 'kom-por', '🍳'], ['bakso', 'bak-so', '🍜'], ['sapu', 'sa-pu', '🧹'], ['topi', 'to-pi', '🎩'],
    ['kuda', 'ku-da', '🐴'], ['roti', 'ro-ti', '🍞'], ['singa', 'si-nga', '🦁'], ['daun', 'da-un', '🍃'],
    ['api', 'a-pi', '🔥'], ['ikan', 'i-kan', '🐟'], ['bolu', 'bo-lu', '🍰'], ['payung', 'pa-yung', '☂️'],
  ];
  const SUKU34 = [
    ['sepeda', 'se-pe-da', '🚲'], ['kelapa', 'ke-la-pa', '🥥'], ['semangat', 'se-ma-ngat', '💪'], ['matahari', 'ma-ta-ha-ri', '☀️'],
  ];
  const KAL3 = [['Aku suka buku', '📚'], ['Adik makan bakso', '🍜']];
  const KAL4 = [
    ['Ibu memasak nasi goreng', '🍳'], ['Kami bermain di taman', '🌳'],
    ['Budi membaca buku baru', '📖'], ['Kita belajar bersama guru', '🏫'],
  ];
  const KAL56 = [
    ['Ibu memasak rendang di dapur', '🍲'], ['Ayah membaca koran di teras', '📰'],
    ['Kami bermain sepak bola di lapangan', '⚽'], ['Adik minum susu hangat sebelum tidur', '🥛'],
  ];
  const BAKU = [ /* [tidak baku, baku] */
    ['praktek', 'praktik'], ['aktifitas', 'aktivitas'], ['nasehat', 'nasihat'], ['resiko', 'risiko'],
    ['obyek', 'objek'], ['hakekat', 'hakikat'], ['azas', 'asas'], ['atlit', 'atlet'],
    ['analisa', 'analisis'], ['komplek', 'kompleks'], ['konkrit', 'konkret'], ['standarisasi', 'standardisasi'],
  ];

  BS.GAMES['sd-word'] = {
    name: 'Susun Kata', icon: '🚂', world: 'sd', worldName: 'Dunia SD', sticker: 'pink',
    desc: 'Susun suku kata jadi kata, kata jadi kalimat, dan pilih kata baku!',
    topics: ['sd1-bindo-suku', 'sd1-bindo-kalimat', 'sd4-bindo-baku'], tags: ['bindo'],
    render(el) {
      let curTopic = 'sd1-bindo-suku'; /* topic aktif utk recordAnswer */
      const used = {};
      const nextItem = (key, arr) => {
        used[key] = used[key] || new Set();
        if (used[key].size >= arr.length) used[key].clear();
        let it, guard = 0;
        do { it = pick(arr); } while (used[key].has(it[0]) && guard++ < 30);
        used[key].add(it[0]); return it;
      };
      const modeOf = (tier, r) => {
        if (tier === 'mudah') return r % 2 === 0 ? 'suku2' : 'kal3';
        if (tier === 'sedang') return r % 2 === 0 ? 'suku34' : 'kal4';
        return r % 2 === 0 ? 'kal56' : 'baku';
      };
      const card = (v) => `<div class="g-tile" data-value="${v}" style="font-size:1.3rem;min-width:56px;justify-content:center">${v}</div>`;

      BS.grun(el, {
        gameId: 'sd-word', title: '🚂 Susun Kata', total: 6,
        intro: 'Naikkan kartu ke gerbong kereta! Tap kartu lalu tap slotnya — atau seret langsung. Lalu tekan ✅ Cek!',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: '2 suku kata · kalimat 3 kata' },
          { k: 'sedang', label: '🟡 Sedang', desc: '3-4 suku · kalimat 4 kata' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'kalimat 5-6 kata + kata baku' },
        ],
        winTitle: 'Juragan kata! 🚂', tryTitle: 'Ayo susun kata lagi! 💪',
        onRound(ok) { BS.recordAnswer(curTopic, ok); },
        make(roundEl, tier, r, api) {
          const mode = modeOf(tier, r);
          let word = '', emoji = '', parts = [];
          if (mode === 'suku2' || mode === 'suku34') {
            curTopic = 'sd1-bindo-suku';
            const it = nextItem(mode, mode === 'suku2' ? SUKU2 : SUKU34);
            word = it[0]; emoji = it[2]; parts = it[1].split('-');
          } else if (mode === 'kal3' || mode === 'kal4' || mode === 'kal56') {
            curTopic = 'sd1-bindo-kalimat';
            const pool = mode === 'kal3' ? KAL3 : mode === 'kal4' ? KAL4 : KAL56;
            const it = nextItem(mode, pool);
            word = it[0]; emoji = it[1]; parts = word.split(' ');
          } else {
            curTopic = 'sd4-bindo-baku';
            const it = nextItem('baku', BAKU);
            api.msg('Pipo: “Mana tulisan yang <b>baku</b> (benar) ya? 🤔”');
            roundEl.innerHTML = `
              <p class="g-q">Mana tulisan yang <b style="color:var(--coral)">BAKU</b>? ✍️</p>
              <div class="g-row" style="gap:16px;margin:14px 0">
                ${shuffle([it[0], it[1]]).map((w) => `<button class="choice-btn" data-w="${w}" style="min-width:180px;min-height:70px;font-size:1.2rem">${w}</button>`).join('')}
              </div>
              <div class="g-hintbox">📌 Kata baku = ejaan yang sesuai kamus. Hati-hati, ada kata yang sering tertukar!</div>`;
            let fin = false;
            roundEl.querySelectorAll('.choice-btn').forEach((b) => {
              b.onclick = () => {
                if (fin) return; fin = true;
                if (b.dataset.w === it[1]) {
                  b.classList.add('correct'); BS.sound('correct'); say(`Kata bakunya ${it[1]}!`);
                  api.msg(`${api.praise()} <b>${it[1]}</b> memang tulisan bakunya! ✍️`);
                  api.done(true);
                } else {
                  b.classList.add('wrong'); BS.sound('pop');
                  roundEl.querySelectorAll('.choice-btn').forEach((x) => { if (x.dataset.w === it[1]) x.classList.add('correct'); });
                  api.msg(`Hampir! Tulisan bakunya: <b>${it[1]}</b>, bukan <b>${b.dataset.w}</b> 💡`);
                  api.done(false);
                }
              };
            });
            return;
          }

          /* --- mode suku & kalimat: kereta slot + tray kartu acak --- */
          const n = parts.length;
          roundEl.innerHTML = `
            <div style="text-align:center">
              <span style="font-size:3.4rem;line-height:1">${emoji}</span>
              <div class="g-row" style="margin:4px 0 2px">
                <button class="gs-pill gs-asbtn" id="sw-say">🔊 Dengar lagi</button>
                <span class="gs-pill">${n} ${mode.indexOf('kal') === 0 ? 'kata' : 'suku kata'}</span>
              </div>
            </div>
            <div id="sw-board" style="max-width:680px;margin:10px auto 0">
              <div class="g-row" id="sw-train" style="background:#FFFDF6;border:3px solid var(--ink);border-radius:16px;padding:10px;min-height:74px">
                <span style="font-size:1.9rem">🚂</span>
                ${Array.from({ length: n }, (_, i) => `<div class="g-slot" data-idx="${i}" style="min-width:74px;min-height:52px;font-family:var(--font-disp);font-weight:800;font-size:1.25rem"></div>`).join('')}
                <span style="font-size:1.6rem">🚃</span>
              </div>
              <div class="g-tray" id="sw-tray" style="margin-top:12px"></div>
            </div>
            <div class="btn-row" style="justify-content:center;margin-top:12px">
              <button class="btn btn-leaf" id="sw-check">✅ Cek</button>
            </div>
            <div class="g-hintbox">👆 Tap kartu, lalu tap slotnya — atau seret kartunya ke gerbong. Kartu di slot bisa dikembalikan dengan tap!</div>`;
          const board = roundEl.querySelector('#sw-board');
          const train = roundEl.querySelector('#sw-train');
          const tray = roundEl.querySelector('#sw-tray');
          const slots = [...roundEl.querySelectorAll('.g-slot')];
          let sel = null, fin = false, dg = null;

          shuffle(parts.slice()).forEach((p) => { tray.insertAdjacentHTML('beforeend', card(p)); });
          say(word);
          roundEl.querySelector('#sw-say').onclick = () => { BS.sound('pop'); say(word); };

          function sync() { /* rapihkan hasil drag: 1 kartu per slot, sisa ke tray */
            slots.forEach((s) => {
              const cs = [...s.querySelectorAll('.g-tile')];
              cs.slice(0, -1).forEach((c) => tray.appendChild(c));
            });
            [...board.children].forEach((node) => {
              if (node.classList && node.classList.contains('g-tile')) tray.appendChild(node);
            });
            slots.forEach((s) => {
              const c = s.querySelector('.g-tile');
              s.classList.toggle('filled', !!c);
              s.textContent = ''; if (c) s.appendChild(c);
            });
          }
          function tap(item) {
            if (fin) return;
            const inSlot = item.parentElement && item.parentElement.classList.contains('g-slot');
            if (inSlot) { /* kartu di slot → kembali ke tray */
              tray.appendChild(item); sel = null; BS.sound('pop'); sync();
              api.msg('Kartu kembali ke stasiun. Susun ulang ya! 🚉');
              return;
            }
            board.querySelectorAll('.g-tile.sel').forEach((x) => x.classList.remove('sel'));
            sel = item; item.classList.add('sel'); BS.sound('pop');
            api.msg('Bagus! Sekarang tap slot kosongnya 👉');
          }
          slots.forEach((s) => s.addEventListener('click', () => {
            if (fin) return;
            if (!sel) { api.msg('Pilih kartunya dulu ya 👈'); return; }
            const old = s.querySelector('.g-tile');
            if (old) tray.appendChild(old);
            s.appendChild(sel); sel.classList.remove('sel'); sel = null;
            BS.sound('pop'); sync();
          }));
          dg = BS.gdrag({
            root: board, mode: 'order', itemSel: '.g-tile', axis: 'x',
            onTap: tap,
            onReorder() { sel = null; sync(); },
          });

          roundEl.querySelector('#sw-check').onclick = () => {
            if (fin) return;
            const vals = slots.map((s) => { const c = s.querySelector('.g-tile'); return c ? c.dataset.value : ''; });
            if (vals.some((v) => !v)) { api.msg('Isi semua gerbong dulu ya! 🚂'); return; }
            fin = true; if (dg) dg.destroy();
            const ok = vals.join(' ') === parts.join(' ');
            if (ok) {
              slots.forEach((s) => { s.classList.add('done'); const c = s.querySelector('.g-tile'); if (c) c.classList.add('ok'); });
              BS.sound('coin'); say(word);
              train.style.transition = 'transform .7s cubic-bezier(.2,.8,.3,1)';
              train.style.transform = 'translateX(56px)';
              api.msg(`${api.praise()} <b>${word}</b>! Keretanya berangkat! 🚂💨`);
              confetti(12);
              api.done(true);
            } else {
              slots.forEach((s) => { const c = s.querySelector('.g-tile'); if (c) { c.classList.add('bad'); tray.appendChild(c); } s.classList.remove('filled'); });
              BS.sound('pop');
              api.msg(`Hampir! Bentuk yang benar: <b>${parts.join(' · ')}</b> 💡 Coba susun lagi ya!`);
              api.done(false);
            }
          };
        },
      });
    },
  };

  /* ============================================================
     G9 · sd-type — "Ketik Cepat" (balon kata jatuh, TANPA grun:
     timer sendiri 60 detik). 🟢 huruf · 🟡 kata · 🔴 kalimat.
     Rekor di BS.S.typingBest. Cleanup: 3 interval + keydown +
     hashchange once. TANPA recordAnswer.
     ============================================================ */
  const TY_WORDS = ['kucing', 'buku', 'sekolah', 'bola', 'makan', 'minum', 'main', 'kuda', 'bunga', 'daun', 'air', 'api', 'rumah', 'meja', 'kursi', 'jam', 'bulan', 'bintang', 'ikan', 'ayam', 'cat', 'book', 'sun', 'moon'];
  const TY_SENT = ['Aku belajar hari ini', 'Saya pergi ke sekolah', 'The cat is cute', 'Ibu masak di dapur', 'Kami bermain bola', 'Buku baru bagus', 'Kami suka bermain', 'Good morning teacher'];
  const TY_CFG = {
    mudah: { speed: 1.1, label: '🟢 Huruf tunggal' },
    sedang: { speed: 1.5, label: '🟡 Kata 3-6 huruf' },
    sulit: { speed: 1.0, label: '🔴 Kalimat pendek' },
  };

  BS.GAMES['sd-type'] = {
    name: 'Ketik Cepat', icon: '⌨️', world: 'sd', worldName: 'Dunia SD', sticker: 'grape',
    desc: 'Letuskan balon kata dengan mengetik — secepat dan setepat mungkin!',
    topics: ['sd1-bindo-kalimat', 'sd4-bing-routine'], tags: ['bindo', 'bing', 'lintas'],
    render(el) {
      let tier = 'mudah';
      const best0 = (BS.S && BS.S.typingBest) || 0;
      const recPill = best0 ? `<span class="gs-pill">🏆 Rekor: ${best0} KPM</span>` : '<span class="gs-pill">60 detik</span>';

      /* ---------- layar awal: pilih tier ---------- */
      el.innerHTML = BS.gkit.stage('⌨️ Ketik Cepat', `
        <div style="text-align:center;padding:8px 4px">
          <p style="font-family:var(--font-disp);font-weight:800;font-size:1.15rem">Balon kata jatuh dari langit — <b>ketik untuk meletuskannya!</b> 🎈⌨️</p>
          <div class="chip-row" style="justify-content:center;margin-top:12px">
            <button class="chip on" data-tytier="mudah" style="min-height:48px">🟢 Huruf</button>
            <button class="chip" data-tytier="sedang" style="min-height:48px">🟡 Kata</button>
            <button class="chip" data-tytier="sulit" style="min-height:48px">🔴 Kalimat</button>
          </div>
          <button class="btn btn-coral btn-big" id="ty-start" style="margin-top:16px">🚀 Mulai!</button>
        </div>`, recPill);
      const ex0 = el.querySelector('[data-exit]');
      if (ex0) ex0.onclick = () => { location.hash = '#/petualangan'; };
      el.querySelectorAll('[data-tytier]').forEach((c) => {
        c.onclick = () => { tier = c.dataset.tytier; el.querySelectorAll('[data-tytier]').forEach((x) => x.classList.toggle('on', x.dataset.tytier === tier)); BS.sound('pop'); };
      });
      el.querySelector('#ty-start').onclick = () => { BS.sound('pop'); arena(); };

      /* ---------- arena permainan ---------- */
      function arena() {
        const cfg = TY_CFG[tier];
        let dead = false, poin = 0, benar = 0, totalKetik = 0, sisa = 60;
        let seq = shuffle('abcdefghijklmnopqrstuvwxyz'.split('')), seqI = 0;
        let pool = shuffle(tier === 'sedang' ? TY_WORDS.slice() : TY_SENT.slice()), poolI = 0;
        let ivSpawn = 0, ivTick = 0, ivClock = 0;
        let arenaEl, inp, targetEl;

        el.innerHTML = BS.gkit.stage('⌨️ Ketik Cepat', `
          <div id="ty-target" class="g-panel" style="text-align:center;font-family:var(--font-disp);font-weight:800;margin-bottom:10px"></div>
          <div id="ty-arena" style="position:relative;height:420px;overflow:hidden;border:3px solid var(--ink);border-radius:16px;background:linear-gradient(#EAF7FF,#fff)"></div>
          <input id="ty-in" class="g-num" style="width:100%;margin-top:10px" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ketik di sini…">
          <div class="g-hintbox" style="margin-top:10px">⌨️ Ketik yang ada di balon lalu biarkan jatuh meletus. Salah ketik? Balonnya goyang, coba lagi! 💪</div>`,
          '<span class="gs-pill" id="ty-time">⏱️ 60s</span><span class="gs-pill" id="ty-score">🎯 0</span>');
        const ex = el.querySelector('[data-exit]');
        if (ex) ex.onclick = () => { stopAll(); location.hash = '#/petualangan'; };
        arenaEl = el.querySelector('#ty-arena');
        inp = el.querySelector('#ty-in');
        targetEl = el.querySelector('#ty-target');
        const upd = () => {
          const t = el.querySelector('#ty-time'), s = el.querySelector('#ty-score');
          if (t) t.textContent = `⏱️ ${sisa}s`;
          if (s) s.textContent = `🎯 ${poin}`;
        };

        function renderTarget() {
          if (tier === 'mudah') {
            targetEl.innerHTML = `Ketik huruf: <b style="font-size:2.4rem;color:var(--coral)">${seq[seqI] ? seq[seqI].toUpperCase() : '✨'}</b>`;
          } else if (tier === 'sedang') {
            targetEl.innerHTML = '🎯 Ketik kata yang ada di balon!';
          } else {
            const act = [...(arenaEl ? arenaEl.querySelectorAll('.g-balloon') : [])].sort((a, b) => b._top - a._top)[0];
            const w = act && act.dataset.word ? act.dataset.word : (poolI < pool.length ? pool[poolI] : '');
            targetEl.style.fontSize = '1.25rem';
            targetEl.innerHTML = 'Ketik kalimatnya:<br>' + [...w].map((ch, i) => `<span style="color:${i < curTyped ? (ch.toLowerCase() === (curVal[i] || ' ').toLowerCase() ? 'var(--leaf)' : 'var(--coral)') : 'var(--ink)'}">${ch === ' ' ? '␣' : ch}</span>`).join('');
          }
        }

        function spawn() {
          if (dead || !el.isConnected || !arenaEl.isConnected) return stopAll();
          const active = arenaEl.querySelectorAll('.g-balloon').length;
          if (tier === 'mudah' && active > 0) return;
          if (active >= 5) return;
          let w;
          if (tier === 'mudah') { w = seq[seqI]; }
          else { if (poolI >= pool.length) { pool = shuffle(pool); poolI = 0; } w = pool[poolI++]; }
          if (!w) return;
          const b = document.createElement('div');
          b.className = 'g-balloon';
          b.dataset.word = w;
          b.textContent = w;
          b._top = 0; b._speed = cfg.speed * (0.9 + Math.random() * 0.25);
          b.style.left = (5 + Math.random() * 75) + '%';
          b.style.top = '0px';
          b.style.animation = 'none';
          if (tier === 'mudah') { b.style.fontSize = '2rem'; b.style.background = '#DFF1FF'; }
          if (tier === 'sulit') b.style.fontSize = '1.05rem';
          arenaEl.appendChild(b);
          renderTarget();
        }

        function tick() {
          if (dead || !el.isConnected || !arenaEl.isConnected) return stopAll();
          [...arenaEl.querySelectorAll('.g-balloon')].forEach((b) => {
            b._top += b._speed;
            b.style.top = b._top + 'px';
            if (b._top > 400) { b.remove(); if (tier === 'mudah') { seqI++; renderTarget(); } }
          });
        }

        function activeBalloons() {
          return [...arenaEl.querySelectorAll('.g-balloon')].filter((b) => b._top > 60);
        }
        function popBalloon(b) {
          b.remove(); poin++;
          BS.sound('pop'); confetti(6);
          if (poin % 5 === 0) confetti(14);
          upd();
        }

        inp.addEventListener('input', onType);
        function onType() {
          if (dead) return;
          const v = (inp.value || '').toLowerCase().trim();
          if (!v) return;
          totalKetik++;
          const hit = activeBalloons().find((b) => b.dataset.word.toLowerCase() === v);
          if (hit) {
            if (tier === 'mudah') { seqI++; renderTarget(); }
            if (tier === 'sulit') confetti(8);
            popBalloon(hit);
            benar++; inp.value = ''; curVal = ''; curTyped = 0;
            renderTarget();
            return;
          }
          /* bukan kata penuh: cek progres awalan */
          const isPrefix = activeBalloons().some((b) => b.dataset.word.toLowerCase().indexOf(v) === 0);
          if (isPrefix) { benar++; if (tier === 'sulit') { curVal = v; curTyped = v.length; renderTarget(); } }
          else {
            inp.style.borderColor = 'var(--coral)';
            setTimeout(() => { if (inp && inp.isConnected) inp.style.borderColor = ''; }, 250);
            if (tier === 'sulit') { curVal = ''; curTyped = 0; renderTarget(); }
            if (v.length > 12) { inp.value = ''; }
          }
        }
        let curVal = '', curTyped = 0;

        function refocus(e) {
          if (dead || !el.isConnected || !inp || !inp.isConnected) return;
          if (/^(input|textarea|button|select)$/i.test((e.target && e.target.tagName) || '')) return;
          inp.focus();
        }
        window.addEventListener('keydown', refocus);

        function stopAll() {
          if (dead) return; dead = true;
          [ivSpawn, ivTick, ivClock].forEach((id) => clearInterval(id));
          window.removeEventListener('keydown', refocus);
          window.removeEventListener('hashchange', onHash);
        }
        const onHash = () => stopAll();
        window.addEventListener('hashchange', onHash, { once: true });

        ivClock = setInterval(() => {
          if (dead || !el.isConnected) return stopAll();
          sisa--; upd();
          if (sisa <= 0) {
            stopAll();
            const KPM = Math.round(poin);
            const akurasi = Math.round((benar / Math.max(1, totalKetik)) * 100) || 0;
            if (BS.S) BS.S.typingBest = Math.max(BS.S.typingBest || 0, KPM);
            if (BS.save) { try { BS.save(); } catch (e) {} }
            const pct = Math.min(100, Math.round(0.6 * akurasi + 0.4 * Math.min(100, KPM * 2)));
            BS.gkit.finish(el, 'sd-type', pct,
              `Hasil: ${KPM} KPM · Akurasi ${akurasi}%`,
              `Rekor pribadi: ${(BS.S && BS.S.typingBest) || KPM} KPM`);
          }
        }, 1000);
        ivSpawn = setInterval(spawn, 1100);
        ivTick = setInterval(tick, 50);

        arenaEl.addEventListener('click', () => { if (!dead) inp.focus(); });
        renderTarget();
        upd();
        spawn();
        try { inp.focus(); } catch (e) {}
      }
    },
  };

  /* ============================================================
     G10 · sd-plant — "Kebun Ajaib" (sim kebutuhan hidup tumbuhan:
     air / cahaya / pupuk + cuaca). 10 hari (1 detik = 1 hari),
     SVG digambar ulang tiap hari, lalu 1 soal refleksi.
     3 eksperimen via BS.grun. recordAnswer sd2-ipas-hidup.
     ============================================================ */
  const PL_SEEDS = [
    { id: 'sun', emoji: '🌻', name: 'Bunga Matahari', ideal: { air: 6, cahaya: 8, pupuk: 4 }, petal: '#FFC93C', center: '#8A5A2B' },
    { id: 'car', emoji: '🥕', name: 'Wortel', ideal: { air: 5, cahaya: 6, pupuk: 3 }, petal: '#FF8F3D', center: '#FFF3C9' },
    { id: 'tul', emoji: '🌷', name: 'Tulip', ideal: { air: 6, cahaya: 5, pupuk: 4 }, petal: '#FF6FA5', center: '#FFC93C' },
  ];
  function plantSVG(seed, score, outcome) { /* outcome: grow|bloom|bush|wilt */
    const h = 16 + (score / 10) * 60;
    const topY = 100 - h;
    const stem = outcome === 'wilt' ? '#8A5A2B' : '#2E9E5B';
    let nLeaf = Math.max(1, Math.round((score / 10) * 6));
    if (outcome === 'bush') nLeaf = 8;
    if (outcome === 'wilt') nLeaf = 2;
    let s = '<svg viewBox="0 0 120 112" width="250" height="234" style="max-width:82vw;height:auto">';
    s += '<ellipse cx="60" cy="103" rx="38" ry="7" fill="#C08A52"/><ellipse cx="60" cy="101" rx="30" ry="5" fill="#8A5A2B"/>';
    if (outcome === 'wilt') {
      s += `<path d="M60,100 C58,${100 - h * 0.45} 66,${100 - h * 0.62} 74,${100 - h * 0.72} q8,-2 10,8" stroke="${stem}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      s += `<circle cx="84" cy="${100 - h * 0.72 + 10}" r="6" fill="#B98A4E" stroke="#2A2140" stroke-width="2"/>`;
      s += `<ellipse cx="48" cy="${100 - h * 0.3}" rx="10" ry="4.5" fill="#A9C08B" stroke="#2A2140" stroke-width="2" transform="rotate(24 48 ${100 - h * 0.3})"/>`;
    } else {
      s += `<line x1="60" y1="100" x2="60" y2="${topY}" stroke="${stem}" stroke-width="5" stroke-linecap="round"/>`;
      for (let i = 0; i < nLeaf; i++) {
        const ly = 95 - ((i + 0.6) / (nLeaf + 0.7)) * (h - 6);
        const side = i % 2 === 0 ? -1 : 1;
        const lx = 60 + side * 15;
        const rot = side < 0 ? -18 : 18;
        s += `<ellipse cx="${lx}" cy="${ly.toFixed(1)}" rx="11.5" ry="5" fill="#5FC97A" stroke="#2A2140" stroke-width="2" transform="rotate(${rot * (side < 0 ? 1 : 1)} ${lx} ${ly.toFixed(1)})"/>`;
      }
      if (outcome === 'bloom') {
        const petals = [0, 60, 120, 180, 240, 300].map((a) =>
          `<ellipse cx="60" cy="${(topY - 11).toFixed(1)}" rx="6.5" ry="11.5" fill="${seed.petal}" stroke="#2A2140" stroke-width="2" transform="rotate(${a} 60 ${topY.toFixed(1)})"/>`).join('');
        s += petals + `<circle cx="60" cy="${topY.toFixed(1)}" r="7" fill="${seed.center}" stroke="#2A2140" stroke-width="2"/>`;
      } else if (outcome === 'bush') {
        s += `<circle cx="60" cy="${topY.toFixed(1)}" r="6" fill="#B6E3A0" stroke="#2A2140" stroke-width="2"/>`;
      }
    }
    s += '</svg>';
    return s;
  }
  function plDevMsg(k, d) {
    if (k === 'air') return d > 0 ? 'Air terlalu banyak, akar busuk 💧' : 'Air terlalu sedikit, tanaman haus 💧';
    if (k === 'cahaya') return d > 0 ? 'Cahaya terlalu terang, daun terbakar ☀️' : 'Kurang cahaya, tanaman pucat 🌥️';
    return d > 0 ? 'Pupuk terlalu banyak, akar terbakar 🌱' : 'Pupuk terlalu sedikit, tanaman lemas 🌱';
  }

  BS.GAMES['sd-plant'] = {
    name: 'Kebun Ajaib', icon: '🌱', world: 'sd', worldName: 'Dunia SD', sticker: 'leaf',
    desc: 'Pilih benih, atur air-cahaya-pupuk, lalu tonton 10 hari ke depan!',
    topics: ['sd2-ipas-hidup', 'sd2-ipas-air', 'sd4-ipas-adaptasi'], tags: ['ipas'],
    render(el) {
      BS.grun(el, {
        gameId: 'sd-plant', title: '🌱 Kebun Ajaib', total: 3,
        intro: 'Tumbuhan butuh air, cahaya, dan pupuk dengan jumlah yang pas. Eksperimen 10 hari (1 detik = 1 hari). Layu? Tanpa hukuman — ilmu baru! 🌱',
        tiers: [
          { k: 'mudah', label: '🟢 Mudah', desc: 'atur air saja' },
          { k: 'sedang', label: '🟡 Sedang', desc: '3 variabel + cuaca' },
          { k: 'sulit', label: '🔴 Sulit', desc: 'mekar dengan air ≤ 5' },
        ],
        winTitle: 'Tukang kebun hebat! 🌸', tryTitle: 'Ayo bereksperimen lagi! 🌱',
        onRound(ok) { BS.recordAnswer('sd2-ipas-hidup', ok); },
        make(roundEl, tier, r, api) {
          let iv = 0, dead = false;
          const stopTimer = () => { if (iv) { clearInterval(iv); iv = 0; } window.removeEventListener('hashchange', onHash); };
          const onHash = () => { dead = true; stopTimer(); };
          window.addEventListener('hashchange', onHash, { once: true });

          /* ---------- Layar 1: pilih benih ---------- */
          api.msg('Pilih benih yang ingin kamu tanam! 👇');
          roundEl.innerHTML = `
            <p class="g-q">Benih mana yang mau ditanam? 🌱</p>
            <div class="g-row" style="gap:16px;margin:12px 0">
              ${PL_SEEDS.map((s) => `<button class="choice-btn" data-seed="${s.id}" style="min-width:150px;min-height:130px">
                <span style="font-size:3rem;display:block;line-height:1.15">${s.emoji}</span>
                <b style="font-size:.95rem">${s.name}</b></button>`).join('')}
            </div>
            <div class="g-hintbox">🧪 Tiap benih punya kebutuhan berbeda. Amati hasilnya, lalu jawab pertanyaan Pipo!</div>`;
          roundEl.querySelectorAll('[data-seed]').forEach((b) => {
            b.onclick = () => { BS.sound('pop'); setup(PL_SEEDS.find((s) => s.id === b.dataset.seed)); };
          });

          /* ---------- Layar 2: atur air / cahaya / pupuk ---------- */
          function setup(seed) {
            const lock = tier === 'mudah';
            const set = { air: 5, cahaya: seed.ideal.cahaya, pupuk: seed.ideal.pupuk };
            const rows = [
              { k: 'air', icon: '💧', label: 'Air' },
              { k: 'cahaya', icon: '☀️', label: 'Cahaya' },
              { k: 'pupuk', icon: '🌱', label: 'Pupuk' },
            ];
            api.msg(lock ? 'Fokus atur airnya! 💧' : 'Atur ketiga kebutuhannya, lalu tumbuhkan! 🌿');
            roundEl.innerHTML = `
              <div class="g-row" style="justify-content:center;margin-bottom:6px">
                <span style="font-size:2.4rem">${seed.emoji}</span><span class="gs-pill">${seed.name}</span>
                ${tier === 'sulit' ? '<span class="gs-pill" style="background:#FFE3EE">🎯 Misi: mekar dengan air ≤ 5</span>' : ''}
              </div>
              <div style="max-width:440px;margin:0 auto">
                ${rows.map((row) => `
                  <div style="margin:12px 0;${lock && row.k !== 'air' ? 'opacity:.55' : ''}">
                    <div style="display:flex;justify-content:space-between;font-weight:800">
                      <span>${row.icon} ${row.label}${lock && row.k !== 'air' ? ' <small>(sudah pas ✅)</small>' : ''}</span>
                      <span id="pl-v-${row.k}">${set[row.k]}</span>
                    </div>
                    <input type="range" id="pl-r-${row.k}" min="0" max="10" step="1" value="${set[row.k]}"
                      style="width:100%" ${lock && row.k !== 'air' ? 'disabled' : ''}>
                  </div>`).join('')}
                <div class="btn-row" style="justify-content:center;margin-top:14px">
                  <button class="btn btn-leaf btn-big" id="pl-grow">🌿 Tumbuhkan!</button>
                </div>
              </div>
              <div class="g-hintbox">${lock ? '🔑 Tier mudah: cahaya & pupuk sudah di angka ideal — <b>Fokus atur airnya!</b> 💧' : '🎚️ Geser slidernya 0-10. Tiap tanaman suka jumlah berbeda — toleransi sekitar ±2 dari kebutuhan idealnya.'}</div>`;
            rows.forEach((row) => {
              const rg = roundEl.querySelector('#pl-r-' + row.k);
              rg.addEventListener('input', () => {
                set[row.k] = +rg.value;
                const lb = roundEl.querySelector('#pl-v-' + row.k);
                if (lb) lb.textContent = rg.value;
                if (row.k === 'air' && tier === 'sulit' && set.air > 5) {
                  const lb2 = roundEl.querySelector('#pl-v-air');
                  if (lb2) lb2.textContent = rg.value + ' (>5!)';
                }
              });
            });
            roundEl.querySelector('#pl-grow').onclick = () => { BS.sound('pop'); simulate(seed, set); };
          }

          /* ---------- Layar 3: 10 hari (1 detik = 1 hari) ---------- */
          function simulate(seed, set) {
            const box = {};
            api.msg('Siap-siap… hari demi hari berlalu! ⏳');
            roundEl.innerHTML = `
              <div class="g-row" style="justify-content:center">
                <span class="g-daychip" id="pl-day">Hari ke-1</span>
                <span class="gs-pill" id="pl-skor">Kondisi: –</span>
                <span class="gs-pill" id="pl-cuaca">☀️ Cerah</span>
              </div>
              <div class="g-plantbox" id="pl-box" style="position:relative;min-height:250px;margin-top:6px"></div>
              <div class="g-hintbox" id="pl-note">Pipo: “Ayo kita amati tanamanmu tumbuh…” 🌱</div>`;
            const dayEl = roundEl.querySelector('#pl-day');
            const skorEl = roundEl.querySelector('#pl-skor');
            const cuacaEl = roundEl.querySelector('#pl-cuaca');
            const boxEl = roundEl.querySelector('#pl-box');
            const noteEl = roundEl.querySelector('#pl-note');
            let day = 1, last = null;

            function step() {
              if (dead || !el.isConnected || !boxEl.isConnected) { stopTimer(); return; }
              const weather = tier === 'mudah' ? 'cerah' : pick(['cerah', 'cerah', 'hujan', 'mendung']);
              const eff = {
                air: Math.min(10, set.air + (weather === 'hujan' ? 2 : 0)),
                cahaya: Math.max(0, set.cahaya - (weather === 'mendung' ? 1 : 0)),
                pupuk: set.pupuk,
              };
              const dev = Math.abs(eff.air - seed.ideal.air) + Math.abs(eff.cahaya - seed.ideal.cahaya) + Math.abs(eff.pupuk - seed.ideal.pupuk);
              const score = Math.max(0, Math.min(10, 10 - dev));
              const outcome = day < 10 ? 'grow' : score >= 7 ? 'bloom' : score >= 4 ? 'bush' : 'wilt';
              const wEmoji = weather === 'hujan' ? '🌧️ Hujan' : weather === 'mendung' ? '⛅ Mendung' : '☀️ Cerah';
              dayEl.textContent = `Hari ke-${day}${tier === 'mudah' ? '' : ' · ' + wEmoji}`;
              skorEl.textContent = `Kondisi: ${score}/10`;
              cuacaEl.textContent = tier === 'mudah' ? '☀️ Cerah' : wEmoji;
              boxEl.innerHTML = plantSVG(seed, score, outcome) +
                (outcome === 'bloom' ? '<span style="position:absolute;left:62%;top:14%;font-size:1.7rem;animation:floaty 3s ease-in-out infinite">🦋</span><span style="position:absolute;left:24%;top:34%;font-size:1.2rem">✨</span>' : '');
              if (day < 10) {
                noteEl.innerHTML = weather === 'hujan' ? '🌧️ Hujan hari ini — tanaman dapat air ekstra!' : weather === 'mendung' ? '⛅ Mendung — cahaya sedikit berkurang…' : '☀️ Cerah. Tanamanmu tumbuh pelan-pelan… 🌱';
              } else {
                last = { eff, score, outcome };
                finish();
                return;
              }
              day++;
            }
            function finish() {
              stopTimer();
              BS.sound(last.outcome === 'bloom' ? 'correct' : 'pop');
              if (last.outcome === 'bloom') confetti(16);
              const devs = [
                ['air', last.eff.air - seed.ideal.air],
                ['cahaya', last.eff.cahaya - seed.ideal.cahaya],
                ['pupuk', last.eff.pupuk - seed.ideal.pupuk],
              ].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
              const cause = Math.abs(devs[0][1]) > 2 ? plDevMsg(devs[0][0], devs[0][1]) : 'Pengaturannya hampir pas, tapi belum sempurna 💡';
              noteEl.innerHTML = last.outcome === 'bloom'
                ? `🌸 <b>Mekar!</b> Kupu-kupu datang. ${seed.emoji} Pipo: “Kebutuhan tanamanmu terpenuhi dengan pas!”`
                : last.outcome === 'bush'
                  ? `🌿 Tanamanmu tumbuh jadi semak, tapi belum berbunga. Pipo mencatat: <b>${cause}</b>`
                  : `🥀 Tanamanmu layu… Pipo mencatat: <b>${cause}</b>`;
              setTimeout(() => { if (el.isConnected && !dead) reflect(seed, last); }, 1500);
            }
            boxEl.innerHTML = plantSVG(seed, 3, 'grow');
            step();
            iv = setInterval(step, 1000);
          }

          /* ---------- Layar 4: refleksi ---------- */
          function reflect(seed, last) {
            stopTimer();
            const bloomed = last.outcome === 'bloom';
            const devs = [
              ['air', last.eff.air - seed.ideal.air],
              ['cahaya', last.eff.cahaya - seed.ideal.cahaya],
              ['pupuk', last.eff.pupuk - seed.ideal.pupuk],
            ].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
            const correct = bloomed
              ? 'Air, cahaya, dan pupuknya sesuai kebutuhan'
              : Math.abs(devs[0][1]) > 2 ? plDevMsg(devs[0][0], devs[0][1]) : 'Pengaturannya hampir pas, tapi belum sempurna 💡';
            const others = bloomed
              ? ['Cukup disiram banyak saja', 'Pupuk dibanyak terus tanpa batas', 'Dibiarkan tanpa cahaya']
              : ['Air terlalu banyak, akar busuk 💧', 'Air terlalu sedikit, tanaman haus 💧', 'Cahaya terlalu terang, daun terbakar ☀️', 'Kurang cahaya, tanaman pucat 🌥️', 'Pupuk terlalu banyak, akar terbakar 🌱', 'Pupuk terlalu sedikit, tanaman lemas 🌱'].filter((m) => m !== correct);
            const opts = shuffle([correct, ...shuffle(others).slice(0, 3)]);
            const q = bloomed
              ? 'Tanamanmu mekar sempurna! 🌸 Menurutmu, apa yang membuatnya tumbuh subur?'
              : last.outcome === 'wilt'
                ? 'Tanamanmu layu. 🥀 Apa penyebab paling mungkin?'
                : 'Tanamanmu hanya jadi semak, belum berbunga. 🌿 Apa yang paling kurang?';
            api.msg('Satu pertanyaan refleksi dari Pipo! 🤔');
            roundEl.innerHTML = `
              <div class="g-row" style="justify-content:center;margin-bottom:4px">
                <span style="font-size:2.4rem">${seed.emoji}</span><span class="g-daychip">Hari ke-10 · ${last.score}/10</span>
              </div>
              <p class="g-q">${q}</p>
              <div style="max-width:520px;margin:10px auto 0;display:grid;gap:10px">
                ${opts.map((o) => `<button class="choice-btn" style="width:100%;min-height:56px;font-weight:700">${o}</button>`).join('')}
              </div>
              <div class="g-hintbox">💡 Tidak apa-apa salah — justru dari eksperimen kita belajar!</div>`;
            let fin = false;
            [...roundEl.querySelectorAll('.choice-btn')].forEach((b) => {
              b.onclick = () => {
                if (fin) return; fin = true;
                const ok = b.textContent === correct;
                if (ok) {
                  b.classList.add('correct'); BS.sound('correct');
                  api.msg(`${api.praise()} ${bloomed ? 'Kamu paham kebutuhan makhluk hidup! 🌱' : 'Kamu menemukan sebabnya — ilmuan kecil! 🔎'}`);
                } else {
                  b.classList.add('wrong'); BS.sound('pop');
                  [...roundEl.querySelectorAll('.choice-btn')].forEach((x) => { if (x.textContent === correct) x.classList.add('correct'); });
                  api.msg(`Penyebab/pemicu yang tepat: <b>${correct}</b> 💡`);
                }
                api.done(ok);
              };
            });
          }
        },
      });
    },
  };
})();
