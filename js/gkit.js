/* ============================================================
   BelajarSeru! 3D — gkit.js
   Mini-framework shared untuk game baru (gkit/gsim/gdrag/grun).
   Prinsip: ramah anak (tanpa GAME OVER keras), kontrol ganda
   (drag + tap-tap), sesi pendek, tingkat bisa diganti kapan pun.
   Dimuat SEBELUM games-c/d/x dan SEBELUM app.js.
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});
  BS.gkit = BS.gkit || {};
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- kosakata semangat ---------- */
  BS.gkit.praise = () => pick(['Hebat! 🎉', 'Pintar sekali! 🌟', 'Keren! 👏', 'Mantap! 💪', 'Wah, benar! ✨', 'Tepat sekali! 🥳']);
  BS.gkit.nudge = () => pick(['Hampir! Coba lihat… 💡', 'Belum tepat, ayo lagi! 💪', 'Sedikit lagi, kamu pasti bisa! 🌱', 'Coba pikirkan lagi ya! 🤔']);

  /* ---------- stage dasar (identik pola games-a.js) ---------- */
  BS.gkit.stage = function (title, inner, statusHtml) {
    return `
      <div class="view" style="max-width:780px;margin:0 auto">
        <div class="game-head" style="margin-top:16px">
          <button class="btn btn-ghost" data-exit>← Keluar</button>
          <h2 style="margin:0">${title}</h2>
          <div class="game-status">${statusHtml || ''}</div>
        </div>
        <div class="game-stage">${inner}</div>
      </div>`;
  };

  /* ---------- kartu akhir + reward (panggil SEKALI di akhir) ---------- */
  BS.gkit.finish = function (el, gameId, pct, title, extra) {
    pct = Math.max(0, Math.min(100, Math.round(pct || 0)));
    const stars = pct >= 90 ? 3 : pct >= 65 ? 2 : pct >= 40 ? 1 : 0;
    const t = title || (pct >= 65 ? 'Kerja bagus! 🎉' : 'Terus berlatih ya! 💪');
    el.querySelector('.game-stage').innerHTML = `
      <div class="reward-pop">
        <div class="result-stars">${'⭐'.repeat(stars)}<span class="${stars < 3 ? 'dim' : 'hidden'}">${'⭐'.repeat(3 - stars)}</span></div>
        <h2 class="result-title">${t}</h2>
        <p class="result-title" style="font-weight:700">${extra || ''}</p>
        <div class="btn-row" style="justify-content:center;margin-top:14px">
          <button class="btn btn-leaf btn-big" data-replay>🔁 Main Lagi</button>
          <button class="btn btn-sun btn-big" data-exit2>🏠 Selesai</button>
        </div>
      </div>`;
    const rp = el.querySelector('[data-replay]');
    const ex = el.querySelector('[data-exit2]');
    if (rp) rp.onclick = () => BS.openGame(gameId, true);
    if (ex) ex.onclick = () => { location.hash = '#/petualangan'; };
    BS.gameDone(gameId, pct);
    if (pct >= 65) BS.fx.confetti(50);
    BS.sound('fanfare');
  };

  /* ---------- gsim: kanvas DPR-aware + loop rAF (auto-stop) ----------
     const s = BS.gsim(cv, { h:300, draw(ctx,t,dt){}, tick(dt){} });
     s.pt(e) → {x,y} koordinat CSS px dari PointerEvent; s.stop()      */
  BS.gsim = function (cv, opts) {
    opts = opts || {};
    const H = opts.h || 300;
    let W = cv.clientWidth || 680;
    const ctx = cv.getContext('2d');
    function fit() {
      W = cv.clientWidth || W || 680;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(fit); ro.observe(cv); }
    let raf = 0, last = performance.now(), t0 = last, stopped = false;
    function loop(now) {
      if (stopped) return;
      if (!cv.isConnected) { stop(); return; }
      const dt = Math.min(50, now - last) / 1000; last = now;
      if (opts.tick) opts.tick(dt);
      ctx.clearRect(0, 0, W, H);
      if (opts.draw) opts.draw(ctx, (now - t0) / 1000, dt);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    function pt(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function stop() {
      if (stopped) return; stopped = true;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      window.removeEventListener('hashchange', onHash);
    }
    function onHash() { stop(); }
    window.addEventListener('hashchange', onHash, { once: true });
    return { pt, stop, ctx, get w() { return W; }, get h() { return H; } };
  };

  /* ---------- gdrag: drag&drop / urutan / pasangan generik ----------
     BS.gdrag({ root, mode:'snap'|'order'|'pair', itemSel, targetSel,
                onDrop(item,target), onReorder(values), onTap(item), ghostClass })
     Fallback tap-tap: tanpa geser >8px → onTap(item) (games tie sendiri).
     Sementara drag: item asal .drag-src, klon .drag-ghost mengikuti jari. */
  BS.gdrag = function (cfg) {
    const root = cfg.root;
    if (!root) return { destroy() {} };
    const itemSel = cfg.itemSel || '.g-tile';
    const targetSel = cfg.targetSel || '.g-slot';
    let drag = null;

    function targets() { return [...root.querySelectorAll(targetSel)]; }
    function hitTarget(x, y) {
      let best = null, bestD = 1e9;
      targets().forEach((t) => {
        if (t.classList.contains('g-nodrop') || t === drag.el) return;
        const r = t.getBoundingClientRect();
        if (!r.width) return;
        const cx = Math.max(r.left, Math.min(x, r.right));
        const cy = Math.max(r.top, Math.min(y, r.bottom));
        const d = Math.hypot(x - cx, y - cy);
        if (d < bestD) { bestD = d; best = t; }
      });
      return bestD < 70 ? best : null;
    }
    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      const item = e.target.closest(itemSel);
      if (!item || !root.contains(item)) return;
      const r = item.getBoundingClientRect();
      drag = { el: item, sx: e.clientX, sy: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, moved: false, ghost: null };
      try { item.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    }
    function onMove(e) {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 8) {
        drag.moved = true;
        const r = drag.el.getBoundingClientRect();
        const g = drag.el.cloneNode(true);
        g.classList.add(cfg.ghostClass || 'drag-ghost');
        g.style.width = r.width + 'px'; g.style.height = r.height + 'px';
        g.style.left = r.left + 'px'; g.style.top = r.top + 'px';
        document.body.appendChild(g);
        drag.ghost = g;
        drag.el.classList.add('drag-src');
        BS.sound('pop');
      }
      if (drag.moved && drag.ghost) {
        drag.ghost.style.left = (e.clientX - drag.ox) + 'px';
        drag.ghost.style.top = (e.clientY - drag.oy) + 'px';
        root.querySelectorAll('.drop-hint').forEach((n) => n.classList.remove('drop-hint'));
        if (cfg.mode === 'order') {
          const ref = nearestSibling(e.clientX, e.clientY);
          if (ref && ref !== drag.el) ref.classList.add('drop-hint');
        } else {
          const t = hitTarget(e.clientX, e.clientY);
          if (t) t.classList.add('drop-hint');
        }
      }
    }
    function nearestSibling(x, y) {
      let best = null, bestD = 1e9;
      [...root.querySelectorAll(itemSel)].forEach((n) => {
        if (n === drag.el) return;
        const r = n.getBoundingClientRect();
        const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        if (d < bestD) { bestD = d; best = n; }
      });
      return bestD < 90 ? best : null;
    }
    function onUp(e) {
      if (!drag) return;
      const d = drag; drag = null;
      root.querySelectorAll('.drop-hint').forEach((n) => n.classList.remove('drop-hint'));
      if (d.ghost) d.ghost.remove();
      d.el.classList.remove('drag-src');
      if (!d.moved) { if (cfg.onTap) cfg.onTap(d.el, e); return; }
      if (cfg.mode === 'order' && cfg.onReorder) {
        const ref = nearestSibling(e.clientX, e.clientY);
        if (ref && ref !== d.el) {
          const rref = ref.getBoundingClientRect();
          const after = (cfg.axis !== 'y' ? e.clientX > rref.left + rref.width / 2 : e.clientY > rref.top + rref.height / 2);
          ref.parentNode.insertBefore(d.el, after ? ref.nextSibling : ref);
        }
        cfg.onReorder([...root.querySelectorAll(itemSel)].map((n) => n.dataset.value));
      } else {
        const t = hitTarget(e.clientX, e.clientY);
        if (t && cfg.onDrop) cfg.onDrop(d.el, t);
        else if (cfg.onCancel) cfg.onCancel(d.el);
      }
    }
    root.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    function destroy() {
      root.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    }
    const onHash = () => { destroy(); window.removeEventListener('hashchange', onHash); };
    window.addEventListener('hashchange', onHash, { once: true });
    return { destroy };
  };

  /* ---------- grun: session runner (tier + skip + ganti tingkat) ----------
     BS.grun(el, { gameId, title, tiers:[{k,label,desc}], defaultTier,
                   total, make(roundEl, tier, r, api), onRound(ok), winTitle, tryTitle })
     api = { done(ok), skip(), msg(html), praise(), nudge() }            */
  BS.grun = function (el, cfg) {
    const total = cfg.total || 6;
    const tiers = cfg.tiers && cfg.tiers.length ? cfg.tiers : [{ k: 'mudah', label: '🟢 Mudah' }, { k: 'sedang', label: '🟡 Sedang' }, { k: 'sulit', label: '🔴 Sulit' }];
    let tier = cfg.defaultTier || tiers[0].k;
    let r = 0, correct = 0, answered = 0, finished = false, awaiting = false;
    function pct() {
      const denom = Math.max(answered, Math.ceil(total / 2));
      return Math.min(100, Math.round((correct / denom) * 100));
    }
    function finishCard() {
      if (finished) return; finished = true;
      const good = pct() >= 65;
      BS.gkit.finish(el, cfg.gameId, pct(),
        good ? (cfg.winTitle || 'Kerja bagus! 🎉') : (cfg.tryTitle || 'Terus berlatih ya! 💪'),
        `Skor: ${correct} benar · ${answered} ronde dimainkan`);
    }
    function exitSave() { /* keluar lewat tombol/kembali → kartu hasil proporsional (hanya bila masih di game ini) */
      if (finished || !el.isConnected) return;
      if (!String(location.hash).startsWith('#/game/' + cfg.gameId)) return;
      finishCard();
    }
    function statusHtml() {
      return `<span class="gs-pill">Ronde ${Math.min(r + 1, total)}/${total}</span><span class="gs-pill">⭐ ${correct}</span>` +
        (tiers.length > 1 ? `<button class="gs-pill gs-asbtn" id="gr-tier" title="Ganti tingkat kesulitan">🎚️ Tingkat</button>` : '');
    }
    function bindCommon(api) {
      const ex = el.querySelector('[data-exit]');
      if (ex) { ex.onclick = exitSave; ex.dataset.bound = '1'; }
      const skip = el.querySelector('#gr-skip');
      if (skip) skip.onclick = () => api.skip();
      const tb = el.querySelector('#gr-tier');
      if (tb) tb.onclick = () => {
        BS.modal(`<h2>🎚️ Ganti Tingkat</h2><p style="font-weight:600">Pilih tingkat. Skor ronde yang sudah dimainkan tetap dihargai.</p>
          <div class="chip-row">${tiers.map((t) => `<button class="chip ${t.k === tier ? 'on' : ''}" data-tier="${t.k}">${t.label}</button>`).join('')}</div>`, () => {
          document.querySelectorAll('[data-tier]').forEach((c) => {
            c.onclick = () => { tier = c.dataset.tier; BS.closeModal(); BS.sound('pop'); r = r; next(); };
          });
        });
      };
    }
    function next() {
      if (finished) return;
      if (r >= total) { finishCard(); return; }
      el.innerHTML = BS.gkit.stage(cfg.title,
        `<div id="gr-round"></div>
         <div class="btn-row" style="justify-content:center;margin-top:14px">
           <button class="btn btn-ghost" id="gr-skip" title="Lewati ronde ini">⏭ Lewati</button>
         </div>
         <div class="game-msg" id="g-msg"></div>`,
        statusHtml());
      const roundEl = el.querySelector('#gr-round');
      const api = {
        done(ok) {
          if (awaiting || finished) return; awaiting = true;
          answered++; if (ok) correct++;
          if (cfg.onRound) cfg.onRound(ok);
          setTimeout(() => { awaiting = false; r++; next(); }, ok ? 1000 : 1600);
        },
        skip() { if (awaiting || finished) return; awaiting = true; setTimeout(() => { awaiting = false; r++; next(); }, 200); },
        msg(t) { const m = el.querySelector('#g-msg'); if (m) m.innerHTML = t; },
        praise: BS.gkit.praise,
        nudge: BS.gkit.nudge,
        roundEl,
      };
      bindCommon(api);
      try { cfg.make(roundEl, tier, r, api); }
      catch (err) { console.error('game round error', err); api.msg('Ups, ada gangguan kecil. Coba main lagi ya! 🛠️'); }
    }
    /* layar pembuka: pilih tingkat (bisa langsung mulai) */
    el.innerHTML = BS.gkit.stage(cfg.title, `
      <div style="text-align:center;padding:8px 4px">
        <p style="font-family:var(--font-disp);font-weight:800;font-size:1.15rem">${cfg.intro || 'Pilih tingkat tantangan, lalu ayo mulai!'}</p>
        <div class="chip-row" style="justify-content:center;margin-top:12px">
          ${tiers.map((t, i) => `<button class="chip ${t.k === tier ? 'on' : ''}" data-tier0="${t.k}" style="min-height:48px">${t.label}${t.desc ? ` <small style="font-weight:600">· ${t.desc}</small>` : ''}</button>`).join('')}
        </div>
        <button class="btn btn-coral btn-big" id="gr-start" style="margin-top:16px">🚀 Mulai!</button>
      </div>`, `<span class="gs-pill">${total} ronde</span>`);
    const ex0 = el.querySelector('[data-exit]');
    if (ex0) ex0.dataset.bound = '1';
    el.querySelector('#gr-start').onclick = () => { BS.sound('pop'); next(); };
    el.querySelectorAll('[data-tier0]').forEach((c) => {
      c.onclick = () => { tier = c.dataset.tier0; el.querySelectorAll('[data-tier0]').forEach((x) => x.classList.toggle('on', x.dataset.tier0 === tier)); BS.sound('pop'); };
    });
    const onHash = () => exitSave();
    window.addEventListener('hashchange', onHash, { once: true });
  };
})();
