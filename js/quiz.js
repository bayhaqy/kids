/* ============================================================
   BelajarSeru! 3D — quiz.js
   1) 18 generator soal matematika (latihan tak terbatas)
   2) Mesin kuis: feedback instan + penjelasan, combo, XP
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});

  /* ---------- util ---------- */
  const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const rp = (n) => 'Rp' + n.toLocaleString('id-ID');
  function numQ(q, ans, e, near) {
    const set = new Set([ans]); const base = Math.abs(ans) || 1;
    let guard = 0;
    while (set.size < 4 && guard++ < 60) {
      let d;
      if (near && Math.random() < 0.6) d = ans + pick(near);
      else d = ans + pick([-3, -2, -1, 1, 2, 3, 4, -4, 10, -10]) * (base > 40 ? Math.ceil(base / 30) : 1);
      if (d !== ans && !set.has(d)) set.add(d);
    }
    while (set.size < 4) set.add(ans + set.size * 7 + 1);
    const opts = shuffle([...set]);
    return { q, opts: opts.map(String), a: opts.indexOf(ans), e, d: 2 };
  }
  function fracStr(n, d) { const g = gcd(n, d); return (n / g) + '/' + (d / g); }

  /* ============================================================
     GENERATOR MTK — key harus sama dgn topic.gen di blueprint
     ============================================================ */
  const G = {};

  G['sd1-count'] = () => {
    const t = pick(['add', 'sub', 'count']);
    if (t === 'add') { const a = ri(1, 12), b = ri(1, 8); return numQ(`🍎 + 🍎... Ada ${a} apel, ibu memberi ${b} apel lagi. Berapa jumlah apel sekarang?`, a + b, `${a} + ${b} = ${a + b} apel.`, [-1, 1, 2]); }
    if (t === 'sub') { const a = ri(6, 20), b = ri(1, 5); return numQ(`Ada ${a} burung 🐦, ${b} burung terbang pergi. Berapa yang tersisa?`, a - b, `${a} − ${b} = ${a - b}.`, [-1, 1, 2]); }
    const a = ri(3, 19); return numQ(`Mana bilangan yang LEBIH BESAR dari ${a}?`, a + 1, `Bilangan sesudah ${a} adalah ${a + 1}, itu lebih besar.`, [-2, 2]);
  };
  G['sd3-tables'] = () => {
    const a = ri(2, 10), b = ri(2, 10);
    if (Math.random() < 0.5) return numQ(`${a} × ${b} = ?`, a * b, `${a} × ${b} = ${a * b} (ingat tabel perkalian!).`, [-a, a, -1, 1, -2, 2]);
    const c = a * b; return numQ(`${c} ÷ ${b} = ?`, a, `${c} ÷ ${b} = ${a} karena ${a} × ${b} = ${c}.`, [-1, 1, 2, -2]);
  };
  G['sd4-fracs'] = () => {
    const t = pick(['kpk', 'fpb', 'frac']);
    if (t === 'kpk') { const a = pick([4, 6, 8, 9, 10, 12]), b = pick([6, 8, 9, 12, 15]); return numQ(`KPK dari ${a} dan ${b} adalah ...`, (() => { let m = Math.max(a, b); while (m % a || m % b) m++; return m; })(), `KPK = kelipersekutuan terkecil dari ${a} dan ${b}.`, [2, 3, -2]); }
    if (t === 'fpb') { const a = ri(8, 24), b = ri(4, 18); return numQ(`FPB dari ${a} dan ${b} adalah ...`, gcd(a, b), `FPB = pembagi terbesar yang sama.`, [1, 2, -1]); }
    const d = pick([4, 5, 6, 8]), n1 = ri(1, d - 2);
    const res = fracStr(n1 + 1, d);
    const opts = [...new Set([res, fracStr(n1 + 2, d), fracStr(n1 + 1, d + 1), fracStr(n1 + 1, d * 2)])];
    while (opts.length < 4) opts.push(fracStr(n1 + 1, d * 3));
    const optsS = shuffle(opts.slice(0, 4));
    return { q: `${n1}/${d} + 1/${d} = ?`, opts: optsS, a: optsS.indexOf(res), e: `Penyebut sama: (${n1}+1)/${d} = ${res}.`, d: 2 };
  };
  G['sd5-mixed'] = () => {
    const t = pick(['mix', 'dec', 'pct']);
    if (t === 'mix') { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9); const ans = a + b * c; return numQ(`${a} + ${b} × ${c} = ?`, ans, `Kerjakan perkalian dulu: ${b} × ${c} = ${b * c}, lalu ${a} + ${b * c} = ${ans}.`, [-2, 2, a * (b + c) - ans || 3]); }
    if (t === 'dec') { const a = ri(11, 89) / 10, b = ri(11, 89) / 10; const ans = +(a + b).toFixed(1); return numQ(`${a} + ${b} = ?`, ans, `Luruskan koma: ${a} + ${b} = ${ans}.`, [0.1, -0.1, 1]); }
    const p = pick([10, 20, 25, 50]), n = pick([40, 60, 80, 120, 200]); const ans = n * p / 100;
    return numQ(`${p}% dari ${n} adalah ...`, ans, `${p}% × ${n} = ${p} × ${n}/100 = ${ans}.`, [1, 2, 10]);
  };
  G['sd6-integer'] = () => {
    const t = pick(['int', 'mix']);
    if (t === 'int') { const a = ri(-15, 15), b = ri(-12, 12); const ans = a + b; return numQ(`${a} + (${b}) = ?`, ans, `Ingat garis bilangan: ${a} ${b >= 0 ? '+' : '−'} ${Math.abs(b)} = ${ans}.`, [-2, 2, 1]); }
    const a = ri(2, 8), b = ri(2, 6), c = ri(2, 6); const ans = a * b - c;
    return numQ(`${a} × ${b} − ${c} = ?`, ans, `${a} × ${b} = ${a * b}, lalu ${a * b} − ${c} = ${ans}.`, [-2, 2, a * (b - c) - ans || 3]);
  };
  G['smp7-int'] = () => {
    const t = pick(['op', 'order']);
    if (t === 'op') { const a = ri(-9, 9), b = ri(-9, 9), c = ri(2, 9); const ans = a * b + c; return numQ(`(${a}) × (${b}) + ${c} = ?`, ans, `(${a}) × (${b}) = ${a * b}, lalu + ${c} = ${ans}.`, [-2, 2, 1]); }
    const a = ri(-20, 20); return numQ(`Bilangan manakah yang lebih KECIL dari ${a}?`, a - ri(1, 5), `Semakin ke kiri di garis bilangan semakin kecil.`, [-2, 2]);
  };
  G['smp7-alg'] = () => {
    const t = pick(['lin', 'eval']);
    if (t === 'lin') { const x = ri(2, 12), a = ri(2, 9), b = ri(1, 15); return numQ(`Jika ${a}x + ${b} = ${a * x + b}, maka x = ?`, x, `${a}x = ${a * x + b} − ${b} = ${a * x}, sehingga x = ${a * x}/${a} = ${x}.`, [-1, 1, 2]); }
    const x = ri(2, 8), y = ri(2, 8), a = ri(2, 5), b = ri(2, 5); const ans = a * x + b * y;
    return numQ(`Nilai ${a}x + ${b}y jika x = ${x} dan y = ${y} adalah ...`, ans, `Substitusi: ${a}(${x}) + ${b}(${y}) = ${a * x} + ${b * y} = ${ans}.`, [-2, 2, a + b]);
  };
  G['smp8-pyth'] = () => {
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25]];
    const [a, b, c] = pick(triples);
    if (Math.random() < 0.5) return numQ(`Segitiga siku-siku dengan alas ${a} cm dan tinggi ${b} cm. Panjang sisi miringnya ...`, c, `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, c = ${c} cm.`, [-1, 1, 2]);
    return numQ(`Sisi miring segitiga siku-siku ${c} cm dan salah satu sisi ${a} cm. Sisi lainnya ...`, b, `${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}, jadi sisi lain = ${b} cm.`, [-1, 2, -2]);
  };
  G['smp9-exp'] = () => {
    const t = pick(['pow', 'root']);
    if (t === 'pow') { const a = ri(2, 5), m = ri(2, 3), n = ri(2, 3); return numQ(`${a}^${m} × ${a}^${n} = ${a}^k. Nilai k?`, m + n, `Perkalian eksponen basis sama: pangkat dijumlah = ${m} + ${n} = ${m + n}.`, [-1, 1, 2]); }
    const n2 = pick([4, 9, 16, 25, 36, 49, 64, 81, 100]); return numQ(`√${n2} = ?`, Math.sqrt(n2), `√${n2} = ${Math.sqrt(n2)} karena ${Math.sqrt(n2)}² = ${n2}.`, [-1, 1, 2]);
  };
  G['smp9-seq'] = () => {
    const a = ri(2, 9), b = ri(2, 9), n = ri(5, 9); const un = a + (n - 1) * b;
    return numQ(`Barisan aritmetika: ${a}, ${a + b}, ${a + 2 * b}, ... Suku ke-${n} = ?`, un, `Un = a + (n−1)b = ${a} + ${n - 1}×${b} = ${un}.`, [-b, b, 1]);
  };
  G['sma10-log'] = () => {
    const t = pick(['basic', 'prop']);
    if (t === 'basic') { const b = pick([2, 3, 5]), n = ri(2, 4); const res = Math.pow(b, n); return numQ(`${'log'}_${b} ${res} = ?`, n, `${b}^${n} = ${res}, jadi log_${b} ${res} = ${n}.`, [-1, 1, 2]); }
    const b = pick([2, 3]), m = ri(2, 3), n = ri(2, 3);
    return numQ(`${'log'}_${b} ${Math.pow(b, m)} + ${'log'}_${b} ${Math.pow(b, n)} = ?`, m + n, `log a + log b = log ab; ${m} + ${n} = ${m + n}.`, [-1, 1, 2]);
  };
  G['sma10-seq'] = () => {
    if (Math.random() < 0.5) { const a = ri(2, 9), b = ri(2, 8), n = ri(6, 12); return numQ(`Aritmetika: a=${a}, b=${b}. Suku ke-${n} = ?`, a + (n - 1) * b, `Un = a + (n−1)b = ${a} + ${n - 1}(${b}) = ${a + (n - 1) * b}.`, [-b, b, 2]); }
    const a = ri(1, 4), r = ri(2, 3), n = ri(4, 7); const un = a * Math.pow(r, n - 1);
    return numQ(`Geometri: a=${a}, rasio=${r}. Suku ke-${n} = ?`, un, `Un = a·r^(n−1) = ${a} × ${r}^${n - 1} = ${un}.`, [-un / r | 0, un / r, 2].filter(x => x > 0 && x !== un));
  };
  G['sma10-trig'] = () => {
    const data = [[0, '0', 0], [30, '1/2', 0.5], [45, '½√2', Math.SQRT1_2], [60, '½√3', Math.sqrt(3) / 2], [90, '1', 1]];
    const [deg] = pick(data.slice(1, 4));
    const fn = pick(['sin', 'cos']);
    const val = fn === 'sin' ? Math.sin(deg * Math.PI / 180) : Math.cos(deg * Math.PI / 180);
    const nice = Math.abs(val - 0.5) < 1e-9 ? '1/2' : Math.abs(val - Math.SQRT1_2) < 1e-9 ? '½√2' : '½√3';
    const opts = shuffle(['1/2', '½√2', '½√3', '1']);
    return { q: `Nilai ${fn} ${deg}° adalah ...`, opts, a: opts.indexOf(nice), e: `Nilai eksak ${fn} ${deg}° = ${nice} (ingat tabel sudut istimewa).`, d: 2 };
  };
  G['sma11-lim'] = () => {
    const a = ri(1, 5), b = ri(1, 6); const c = ri(1, 5);
    return numQ(`lim x→${c} (${a}x + ${b}) = ?`, a * c + b, `Fungsi kontinu: substitusi langsung x = ${c} → ${a}(${c}) + ${b} = ${a * c + b}.`, [-2, 1, 2]);
  };
  G['sma11-deriv'] = () => {
    const t = pick(['poly', 'val']);
    if (t === 'poly') {
      const a = ri(2, 6), n = ri(2, 4); const res = `${a * n}x^${n - 1}`;
      const opts = shuffle([...new Set([res, `${a * n + 1}x^${n - 1}`, `${a}x^${n - 1}`, `${a * n}x^${n}`])]);
      return { q: `Turunan f(x) = ${a}x^${n} adalah ...`, opts, a: opts.indexOf(res), e: `Aturan pangkat: turunan x^n = n·x^(n−1), jadi ${a}·${n}·x^${n - 1} = ${res}.`, d: 2 };
    }
    const a = ri(2, 5), x0 = ri(1, 4); const f = a * x0 * x0 + 1; const dv = 2 * a * x0;
    const opts = shuffle([dv, dv + 2, dv - 2, dv + 1]);
    return { q: `f(x) = ${a}x² + 1. Nilai f'(x) di x = ${x0} adalah ...`, opts: opts.map(String), a: opts.indexOf(dv), e: `f'(x) = ${2 * a}x, maka f'(${x0}) = ${2 * a}(${x0}) = ${dv}.`, d: 2 };
  };
  G['sma11-integ'] = () => {
    const a = ri(2, 6), b = ri(1, 5);
    const F = (x) => (a * x * x * x) / 3 + b * x * x / 2;
    const x1 = ri(0, 2), x2 = x1 + ri(1, 3);
    const val = +((F(x2) - F(x1))).toFixed(2);
    return numQ(`∫ dari ${x1} sampai ${x2} dari (${a}x² + ${b}x) dx ≈ ?`, val, `Antiturunan: ${a}x³/3 + ${b}x²/2, evaluasi di batas → ${val}.`, [0.5, -0.5, 1]);
  };
  G['sma12-prob'] = () => {
    const t = pick(['dice', 'coin']);
    if (t === 'dice') {
      const s = pick([7, 8, 9]); const cnt = { 7: 6, 8: 5, 9: 4 }[s];
      const res = `${cnt}/36`;
      const opts = shuffle([...new Set([res, `${cnt + 1}/36`, `${cnt - 1}/36`, `1/6`])]);
      return { q: `Dua dadu dilempar. Peluang jumlah mata dadu = ${s} adalah ...`, opts, a: opts.indexOf(res), e: `Ada ${cnt} pasangan (dadu1, dadu2) yang jumlahnya ${s} dari 36 ruang sampel → ${res}.`, d: 2 };
    }
    const n = ri(3, 4); const res = `${n}/${Math.pow(2, n)}`;
    const opts = shuffle([...new Set([res, `${n - 1}/${Math.pow(2, n)}`, `${n}/${Math.pow(2, n - 1)}`, `1/${Math.pow(2, n)}`])]);
    return { q: `${n} koin dilempar. Peluang tepat ${n - 1} gambar = ...`, opts, a: opts.indexOf(res), e: `Ruang sampel 2^${n} = ${Math.pow(2, n)}; kejadian ${n - 1} gambar ada ${n} cara → ${res}.`, d: 3 };
  };
  G['sma12-fin'] = () => {
    const m = ri(5, 100), p = pick([3, 6, 12]), n = ri(1, 3); const r = p / 100;
    const juta = +(m * Math.pow(1 + r, n)).toFixed(1);
    return numQ(`Modal Rp${m} juta dibungakan majemuk ${p}%/tahun selama ${n} tahun. Nilai akhirnya ≈ Rp${'...'} juta?`, juta, `M = M₀ × (1 + i)^n = ${m} × ${(1 + r).toFixed(2)}^${n} ≈ ${juta} juta.`, [0.5, -0.5, 1]);
  };

  /* perbaiki generator yang mengembalikan {str} → jadikan string */
  Object.keys(G).forEach((k) => {
    const orig = G[k];
    G[k] = function () {
      const q = orig();
      if (!q) return numQ('1 + 1 = ?', 2, 'Dasar aritmetika.', [1, 3]);
      if (q.opts && q.opts.some((o) => typeof o === 'object' && o !== null)) {
        const ansObj = q.opts[q.a];
        const ansStr = typeof ansObj === 'object' ? ansObj.str : String(ansObj);
        const opts = shuffle([...new Set([ansStr, ...q.opts.map((o) => (typeof o === 'object' ? o.str : String(o)))])].slice(0, 4));
        while (opts.length < 4) opts.push(ansStr + ' ');
        return { q: q.q, opts, a: opts.indexOf(ansStr), e: q.e || ansStr, d: q.d || 2 };
      }
      return q;
    };
  });

  BS.GENERATORS = G;
  BS.makeGenQuestion = function (genId, d) {
    const g = G[genId]; if (!g) return null;
    try { const q = g(d); return q && q.opts && q.opts.length === 4 && q.a >= 0 && q.a < 4 ? q : null; } catch (e) { return null; }
  };

  /* ============================================================
     MESIN KUIS
     provider: { title, icon, color, questions:[{q,opts,a,e,d}], topic (opsional utk statistik), unlimitedGen (opsional) }
     ============================================================ */
  BS.runQuiz = function (provider) {
    const app = document.getElementById('app');
    const N = Math.min(provider.questions.length, provider.n || 8);
    const list = shuffle(provider.questions).slice(0, N);
    let idx = 0, correct = 0, combo = 0, bestCombo = 0, xp = 0, coins = 0;
    let answered = false;

    app.innerHTML = `
      <div class="view quiz-wrap">
        <div class="quiz-top">
          <button class="btn btn-ghost" id="qz-exit">← Keluar</button>
          <div class="quiz-progress"><i style="width:0%"></i></div>
          <span class="pill pill-xp">⭐ <b id="qz-xp">0</b></span>
          <span class="combo-badge hidden" id="qz-combo">🔥 x1</span>
        </div>
        <div id="qz-body"></div>
      </div>`;
    document.getElementById('qz-exit').onclick = () => { location.hash = provider.exitTo || '#/home'; };

    const body = document.getElementById('qz-body');
    function renderQ() {
      answered = false;
      const q = list[idx];
      body.innerHTML = `
        <div class="card card-pad-lg q-card">
          <span class="sticker ${idx % 2 ? 'sun' : 'sky'}">Soal ${idx + 1} / ${N} · Tingkat ${'⭐'.repeat(q.d || 1)}</span>
          <div class="q-text">${q.q}</div>
          <div class="opts">${q.opts.map((o, i) => `
            <button class="opt" data-i="${i}"><span class="opt-key">${'ABCD'[i]}</span><span>${o}</span></button>`).join('')}
          </div>
          <div id="qz-fb"></div>
        </div>`;
      body.querySelectorAll('.opt').forEach((b) => {
        b.onclick = () => answer(+b.dataset.i);
      });
      body.querySelector('.quiz-progress i') && (document.querySelector('.quiz-progress i').style.width = (idx / N * 100) + '%');
      document.querySelector('.quiz-progress i').style.width = (idx / N * 100) + '%';
    }

    function answer(i) {
      if (answered) return; answered = true;
      const q = list[idx];
      const opts = body.querySelectorAll('.opt');
      opts.forEach((b) => { b.disabled = true; if (+b.dataset.i === q.a) b.classList.add('correct'); });
      const ok = i === q.a;
      const fb = document.getElementById('qz-fb');
      if (ok) {
        combo++; bestCombo = Math.max(bestCombo, combo); correct++;
        const gain = 10 + (q.d - 1) * 5 + (combo >= 3 ? 5 : 0);
        xp += gain; coins += 2 + (combo >= 3 ? 1 : 0);
        document.getElementById('qz-xp').textContent = xp;
        const cb = document.getElementById('qz-combo');
        if (combo >= 2) { cb.classList.remove('hidden'); cb.textContent = `🔥 x${combo}`; }
        BS.sound('correct'); BS.fx.xpBurst('+' + gain + ' XP');
        if (combo === 3) { BS.toast('🔥 Combo 3 benar beruntun! Bonus!'); BS.fx.confetti(30); }
        fb.innerHTML = `<div class="feedback ok"><span class="fb-ico">🎉</span><div><b>Benar!</b> ${q.e || ''}</div></div>`;
      } else {
        combo = 0;
        opts[i].classList.add('wrong');
        document.getElementById('qz-combo').classList.add('hidden');
        BS.sound('wrong');
        fb.innerHTML = `<div class="feedback no"><span class="fb-ico">💡</span><div><b>Belum tepat.</b> Jawaban benar: <b>${q.opts[q.a]}</b>. ${q.e || ''}</div></div>`;
      }
      if (provider.topic && BS.recordAnswer) BS.recordAnswer(provider.topic, ok);
      const next = document.createElement('div');
      next.className = 'quiz-actions';
      const btn = document.createElement('button');
      btn.className = 'btn btn-coral btn-big';
      btn.innerHTML = idx + 1 < N ? 'Lanjut ➜' : 'Selesai 🏁';
      btn.onclick = () => { idx + 1 < N ? (idx++, renderQ()) : finish(); };
      fb.parentElement.parentElement.querySelector('.quiz-actions')?.remove();
      document.querySelector('.q-card').appendChild(next); next.appendChild(btn);
      document.querySelector('.quiz-progress i').style.width = ((idx + 1) / N * 100) + '%';
      if (BS.scrollTop) BS.scrollTop();
    }

    function finish() {
      const pct = Math.round(correct / N * 100);
      const stars = pct >= 90 ? 3 : pct >= 65 ? 2 : pct >= 40 ? 1 : 0;
      if (provider.topic && BS.recordQuiz) BS.recordQuiz(provider.topic, correct, N, pct);
      BS.addXP(xp, coins, !provider.silentFx && pct >= 65 ? 'stars' : null);
      if (pct === 100) BS.award('perfect');
      if (BS.stats) BS.stats('quiz');
      body.innerHTML = `
        <div class="card card-pad-lg reward-pop">
          <div class="result-stars">${'⭐'.repeat(stars)}<span class="${stars < 3 ? 'dim' : 'hidden'}">${'⭐'.repeat(3 - stars)}</span></div>
          <h2 class="result-title">${pct === 100 ? 'Sempurna! 🏆' : pct >= 65 ? 'Hebat! 🎉' : pct >= 40 ? 'Bagus, terus semangat! 💪' : 'Jangan menyerah ya! 🌱'}</h2>
          <p class="result-title" style="font-weight:700">Kamu menjawab <b>${correct} dari ${N}</b> soal dengan benar (${pct}%).</p>
          <div class="result-stats">
            <div class="statbox"><span class="s-ico">⭐</span><b>+${xp}</b><span>XP</span></div>
            <div class="statbox"><span class="s-ico">🪙</span><b>+${coins}</b><span>Koin</span></div>
            <div class="statbox"><span class="s-ico">🔥</span><b>x${bestCombo}</b><span>Combo terbaik</span></div>
          </div>
          <div class="btn-row" style="justify-content:center">
            <button class="btn btn-leaf btn-big" id="rs-again">🔁 Ulangi</button>
            <button class="btn btn-sky btn-big" id="rs-back">📚 Materi</button>
            <button class="btn btn-sun btn-big" id="rs-home">🏠 Beranda</button>
          </div>
        </div>`;
      document.getElementById('rs-again').onclick = () => BS.runQuiz(provider);
      document.getElementById('rs-back').onclick = () => location.hash = provider.topic ? '#/m/' + provider.topic : (provider.exitTo || '#/home');
      document.getElementById('rs-home').onclick = () => location.hash = '#/home';
      if (stars >= 2) BS.fx.confetti(60);
      BS.sound('fanfare');
      BS.checkMissions('quiz', { pct, correct });
    }
    renderQ();
    if (BS.stats) BS.stats('quizOpen');
  };
})();
