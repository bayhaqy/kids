/* =================================================================
   Bayhaqy Kids — Lesson Kit runtime (v1 — Aug 2026)
   Shared learning-experience layer for every lesson/game page.
   Header & footer are owned by app-shell.js — this kit NEVER touches them.

   What it adds (grounded in 2025-26 learning-science practice):
   1. Visible lesson arc: Learn -> Practice -> Finish (self-direction)
   2. Chunk-level read-aloud buttons on every section (pre-readers)
   3. Finish & collect stars + effort-praising celebration (mastery loop)
   4. Progress saved locally (bk-progress-v1) — no accounts, no tracking
   5. Prev / Next lesson navigation (spaced revisit made easy)
   6. Kurikulum Merdeka phase badge (Fase A-D) next to the grade
   7. "Continue learning" card on the landing page
   ================================================================= */
(function () {
  'use strict';

  var VER = '20260829a';

  /* ---------- tiny i18n (merges with shell language) ---------- */
  var T = {
    en: {
      arc_learn: 'Learn', arc_practice: 'Practice', arc_finish: 'Finish',
      listen: 'Listen', stop: 'Stop',
      finish_cta: 'Finish & collect stars',
      finish_hint: 'Try a practice activity above first — then collect your stars!',
      cel_title: 'Great job!',
      cel_msg: 'You worked hard and finished this lesson. Come back tomorrow to remember it even better!',
      cel_go: 'Next lesson', cel_close: 'Stay here',
      prev: 'Previous', next: 'Next',
      all_lessons: 'All lessons',
      phase: 'Phase', phase_tip: 'Indonesian curriculum (Kurikulum Merdeka) phase',
      continue_label: 'Continue learning', continue_go: 'Start',
      lesson: 'Lesson', grade_word: 'Grade'
    },
    id: {
      arc_learn: 'Belajar', arc_practice: 'Latihan', arc_finish: 'Selesai',
      listen: 'Dengarkan', stop: 'Berhenti',
      finish_cta: 'Selesai & kumpulkan bintang',
      finish_hint: 'Coba dulu satu latihan di atas — lalu kumpulkan bintangmu!',
      cel_title: 'Kerja hebat!',
      cel_msg: 'Kamu sudah berusaha keras menyelesaikan pelajaran ini. Kembali lagi besok agar makin ingat, ya!',
      cel_go: 'Pelajaran berikutnya', cel_close: 'Di sini dulu',
      prev: 'Sebelumnya', next: 'Berikutnya',
      all_lessons: 'Semua pelajaran',
      phase: 'Fase', phase_tip: 'Fase Kurikulum Merdeka',
      continue_label: 'Lanjutkan belajar', continue_go: 'Mulai',
      lesson: 'Pelajaran', grade_word: 'Kelas'
    }
  };
  function lang() { return (window.getLang && window.getLang()) || 'en'; }
  function tr(k) { return (T[lang()] && T[lang()][k]) || T.en[k] || k; }

  /* ---------- location -> subject/slug ---------- */
  var m = location.pathname.match(/\/kids\/([a-z]+)\/([\w-]+)\/?$/);
  var SUBJECT = m ? m[1] : null;
  var SLUG = m ? m[2] : null;
  var IS_TOPIC = !!(SUBJECT && SLUG && window.LESSONS && window.LESSONS[SUBJECT]);
  var META = null, IDX = -1;
  if (IS_TOPIC) {
    window.LESSONS[SUBJECT].forEach(function (l, i) {
      if (l.slug === SLUG) { META = l; IDX = i; }
    });
    IS_TOPIC = !!META;
  }

  /* ---------- progress store (local only) ---------- */
  var STORE_KEY = 'bk-progress-v1';
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveProgress(subject, slug, stars) {
    var all = loadAll();
    var key = subject + '/' + slug;
    var prev = all[key] || {};
    all[key] = { s: Math.max(prev.s || 0, stars), t: Date.now() };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(all)); } catch (e) {}
  }
  function getStars(subject, slug) {
    var e = loadAll()[subject + '/' + slug];
    return e ? (e.s || 0) : 0;
  }

  /* ---------- Kurikulum Merdeka phase ---------- */
  function phaseOf(grade) {
    if (grade === 'K' || grade === '1' || grade === '2') return 'A';
    if (grade === '3' || grade === '4') return 'B';
    if (grade === '5' || grade === '6') return 'C';
    return 'D';
  }

  function subjectName(sub) {
    var key = 'nav_' + sub;
    var v = window.t ? window.t(key) : key;
    return (v && v !== key) ? v : sub.charAt(0).toUpperCase() + sub.slice(1);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- state ---------- */
  var practiced = false;
  var finished = false;

  /* ---------- 1. Lesson arc bar ---------- */
  function starHtml(n, total) {
    var h = '<span class="bk-stars" aria-label="' + n + '/' + total + '">';
    for (var i = 0; i < total; i++) {
      h += '<span class="' + (i < n ? 'on' : 'off') + '">⭐</span>';
    }
    return h + '</span>';
  }

  function renderArc(main) {
    var bar = document.createElement('div');
    bar.className = 'bk-arc';
    bar.id = 'bkArc';
    bar.innerHTML =
      '<span class="bk-arc-step is-active" data-step="learn"><span class="n">1</span><span class="txt">' + tr('arc_learn') + '</span></span>' +
      '<span class="bk-arc-link"></span>' +
      '<span class="bk-arc-step" data-step="practice"><span class="n">2</span><span class="txt">' + tr('arc_practice') + '</span></span>' +
      '<span class="bk-arc-link"></span>' +
      '<span class="bk-arc-step" data-step="finish"><span class="n">3</span><span class="txt">' + tr('arc_finish') + '</span></span>' +
      '<span class="bk-arc-spacer"></span>' +
      '<span id="bkArcStars">' + starHtml(getStars(SUBJECT, SLUG), 3) + '</span>';
    var crumbs = main === document.body ? document.querySelector('.breadcrumbs') : null;
    if (crumbs && crumbs.parentNode) crumbs.parentNode.insertBefore(bar, crumbs);
    else main.insertBefore(bar, main.firstChild);
  }

  function setStep(step) {
    var order = ['learn', 'practice', 'finish'];
    var idx = order.indexOf(step);
    var steps = document.querySelectorAll('#bkArc .bk-arc-step');
    steps.forEach(function (el, i) {
      el.classList.toggle('is-active', i === idx);
      el.classList.toggle('is-done', i < idx);
    });
  }

  /* ---------- 2. Read-aloud buttons ---------- */
  function speakText(el) {
    var parts = [];
    el.querySelectorAll('h1,h2,h3,h4,p,li,.speakable').forEach(function (n) {
      var t = n.textContent.trim();
      if (t) parts.push(t);
    });
    if (!parts.length) parts.push(el.textContent.trim());
    window.speak(parts.join('. '), { target: el, grade: META ? META.grade : '' });
  }

  function injectListenButtons(main) {
    // hero subtitle read-aloud
    var sub = main.querySelector('.app-hero .app-subtitle, .lesson-sub, .app-subtitle');
    if (sub && !sub.querySelector('.bk-listen')) {
      var b = mkListen();
      sub.appendChild(document.createTextNode(' '));
      sub.appendChild(b);
    }
    // every section heading inside main (skip ones already wired)
    var heads = main.querySelectorAll('h2.card-title, section h2, section h3, .learn h3');
    heads.forEach(function (h) {
      if (h.closest('.bk-celebrate')) return;
      if (h.parentElement && h.parentElement.querySelector('.bk-listen')) return;
      var row = document.createElement('div');
      row.className = 'bk-listen-row';
      h.parentNode.insertBefore(row, h);
      row.appendChild(h);
      row.appendChild(mkListen());
    });
  }

  function mkListen() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'bk-listen';
    b.innerHTML = '<span class="ico">🔊</span><span class="lbl">' + tr('listen') + '</span>';
    b.addEventListener('click', function () {
      var row = b.closest('.bk-listen-row');
      var scope = row || b.closest('.app-subtitle') || b.closest('section') || b.closest('main');
      // stop any other speaking state
      document.querySelectorAll('.bk-listen.is-speaking').forEach(function (x) {
        if (x !== b) x.classList.remove('is-speaking');
      });
      var speaking = b.classList.toggle('is-speaking');
      if (speaking) {
        b.querySelector('.lbl').textContent = tr('stop');
        speakText(scope);
        var check = setInterval(function () {
          if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
            b.classList.remove('is-speaking');
            b.querySelector('.lbl').textContent = tr('listen');
            clearInterval(check);
          }
        }, 500);
      } else {
        b.querySelector('.lbl').textContent = tr('listen');
        window.stopSpeaking && window.stopSpeaking();
      }
      markPracticed();
    });
    return b;
  }

  /* ---------- 3. Practice detection ---------- */
  var PRACTICE_SEL = [
    '.choices button', '.choice', '.rush-choices button', '.rush-choice',
    '.practice-box button', '.quiz-choices button', '.opt', '.option',
    '.answer', '[data-correct]', '.flashcard', '.word-card', '.letter-card',
    '.count-card', '.shape-card', '.color-dot', '.mix-btn', '.planet',
    '.mem-card', '.key-btn', 'canvas', '.timeline .event', '.flag-q button'
  ].join(',');

  function markPracticed() {
    if (practiced) return;
    practiced = true;
    setStep('practice');
    var f = document.getElementById('bkFinish');
    if (f) {
      f.disabled = false;
      var hint = document.getElementById('bkFinishHint');
      if (hint) hint.textContent = tr('finish_cta');
    }
  }
  document.addEventListener('click', function (e) {
    if (!IS_TOPIC) return;
    if (e.target.closest && e.target.closest(PRACTICE_SEL)) markPracticed();
  }, true);

  /* auto-celebrate when a score element shows full marks (e.g. "5/5") */
  function watchScore(main) {
    if (!('MutationObserver' in window)) return;
    var el = main.querySelector('.score, #score, .score-row .score');
    if (!el) return;
    var mo = new MutationObserver(function () {
      var mm = (el.textContent || '').match(/(\d+)\s*\/\s*(\d+)/);
      if (mm && Number(mm[1]) === Number(mm[2]) && Number(mm[2]) > 0) {
        mo.disconnect();
        setTimeout(function () { finish(true); }, 350);
      }
    });
    mo.observe(el, { childList: true, characterData: true, subtree: true });
  }

  /* ---------- 4. Finish + celebration ---------- */
  function nextLesson() {
    var list = window.LESSONS[SUBJECT];
    for (var i = IDX + 1; i < list.length; i++) return list[i];
    return null;
  }

  function finish(auto) {
    if (finished) return;
    finished = true;
    saveProgress(SUBJECT, SLUG, 3);
    setStep('finish');
    var st = document.getElementById('bkArcStars');
    if (st) st.innerHTML = starHtml(3, 3);
    showCelebrate(!!auto);
  }

  function showCelebrate() {
    var ov = document.getElementById('bkCelebrate');
    if (!ov) return;
    var nx = nextLesson();
    var nxHtml = '';
    if (nx) {
      var t = (nx[lang()] || nx.en).title;
      nxHtml = '<a class="bk-btn-next" href="/kids/' + SUBJECT + '/' + nx.slug + '/">' + tr('cel_go') + ' →</a>';
      ov.querySelector('.bk-cel-next-title').textContent = t;
      ov.querySelector('.bk-cel-next').style.display = '';
    } else {
      ov.querySelector('.bk-cel-next').style.display = 'none';
      nxHtml = '<a class="bk-btn-next" href="/kids/' + SUBJECT + '/">' + tr('all_lessons') + ' →</a>';
    }
    ov.querySelector('.bk-cel-actions').innerHTML =
      nxHtml + '<button type="button" class="bk-btn-ghost2" id="bkCelClose">' + tr('cel_close') + '</button>';
    ov.querySelector('.bk-cel-stars').innerHTML = '<span class="on">⭐</span><span class="on">⭐</span><span class="on">⭐</span>';
    ov.classList.add('show');
    var close = document.getElementById('bkCelClose');
    if (close) close.addEventListener('click', function () { ov.classList.remove('show'); });
    ov.addEventListener('click', function (e) {
      if (e.target === ov) ov.classList.remove('show');
    });
  }

  function renderFinish(main) {
    var wrap = document.createElement('div');
    wrap.className = 'bk-finish-wrap';
    var done = getStars(SUBJECT, SLUG) > 0;
    wrap.innerHTML =
      '<button type="button" class="bk-finish" id="bkFinish"' + (done ? '' : ' disabled') + '>🎉 <span>' + tr('finish_cta') + '</span></button>' +
      '<p class="bk-finish-hint" id="bkFinishHint">' + (done ? tr('cel_msg') : tr('finish_hint')) + '</p>';
    var footer = document.querySelector('.kids-footer');
    if (main !== document.body && footer && main.contains(footer)) {
      footer.parentNode.insertBefore(wrap, footer);
    } else if (main !== document.body) {
      main.appendChild(wrap);
    } else if (footer) {
      footer.parentNode.insertBefore(wrap, footer);
    } else {
      document.body.appendChild(wrap);
    }
    wrap.querySelector('#bkFinish').addEventListener('click', function () { finish(false); });
    if (done) { practiced = true; setStep('practice'); }
  }

  /* ---------- 5. Prev / Next navigation ---------- */
  function renderPN() {
    if (document.getElementById('bkPn')) return;
    var list = window.LESSONS[SUBJECT];
    var prev = IDX > 0 ? list[IDX - 1] : null;
    var nxt = nextLesson();
    var nav = document.createElement('nav');
    nav.className = 'bk-pn';
    nav.id = 'bkPn';
    nav.setAttribute('aria-label', 'Lesson navigation');
    var html = '';
    if (prev) {
      var pt = (prev[lang()] || prev.en).title;
      html += '<a href="/kids/' + SUBJECT + '/' + prev.slug + '/"><span class="dir">← ' + tr('prev') + '</span><span class="t">' + esc(pt) + '</span></a>';
    } else {
      html += '<span></span>';
    }
    if (nxt) {
      var nt = (nxt[lang()] || nxt.en).title;
      html += '<a class="next" href="/kids/' + SUBJECT + '/' + nxt.slug + '/"><span class="dir">' + tr('next') + ' →</span><span class="t">' + esc(nt) + '</span></a>';
    } else {
      html += '<a class="next" href="/kids/' + SUBJECT + '/"><span class="dir">🏆 ' + tr('all_lessons') + '</span><span class="t">' + esc(SUBJECT) + '</span></a>';
    }
    html += '<a class="all" href="/kids/' + SUBJECT + '/">' + tr('all_lessons') + ' · ' + esc(SUBJECT) + '</a>';
    nav.innerHTML = html;

    var footer = document.querySelector('.kids-footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(nav, footer);
    } else {
      // footer built on DOMContentLoaded — retry briefly
      var tries = 0;
      var iv = setInterval(function () {
        var f = document.querySelector('.kids-footer');
        if (f) { f.parentNode.insertBefore(nav, f); clearInterval(iv); }
        else if (++tries > 40) clearInterval(iv);
      }, 120);
    }
  }

  /* ---------- 6. Phase badge ---------- */
  function renderPhase(main) {
    var eyebrow = main.querySelector('.app-hero .app-eyebrow, .lesson-eyebrow, .app-eyebrow, .eyebrow');
    if (!eyebrow || eyebrow.querySelector('.bk-phase')) return;
    var ph = document.createElement('span');
    ph.className = 'bk-phase';
    ph.innerHTML = tr('phase') + ' ' + phaseOf(META.grade) +
      ' <span class="info" title="' + tr('phase_tip') + '">ⓘ</span>';
    eyebrow.appendChild(ph);
  }

  /* ---------- 7. Celebration overlay (built once) ---------- */
  function buildCelebrate() {
    if (document.getElementById('bkCelebrate')) return;
    var ov = document.createElement('div');
    ov.className = 'bk-celebrate';
    ov.id = 'bkCelebrate';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.innerHTML =
      '<div class="bk-celebrate-card">' +
        '<div class="bk-confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="bk-cel-emoji">🎉</div>' +
        '<h2 class="bk-cel-title">' + tr('cel_title') + '</h2>' +
        '<p class="bk-cel-msg">' + tr('cel_msg') + '</p>' +
        '<div class="bk-cel-stars"></div>' +
        '<p class="bk-cel-msg bk-cel-next" style="margin-top:-0.4rem"><span class="bk-cel-next-title"></span></p>' +
        '<div class="bk-cel-actions"></div>' +
      '</div>';
    document.body.appendChild(ov);
  }

  /* ---------- 8. Landing continue card ---------- */
  function renderContinue() {
    var slot = document.getElementById('bkContinue');
    if (!slot) return;
    var all = loadAll();
    var best = null, bestKey = null;
    Object.keys(all).forEach(function (k) {
      if (!best || all[k].t > best.t) { best = all[k]; bestKey = k; }
    });
    if (!best) return;
    var parts = bestKey.split('/');
    var subject = parts[0], slug = parts[1];
    var meta = null;
    (window.LESSONS[subject] || []).forEach(function (l) { if (l.slug === slug) meta = l; });
    if (!meta) return;
    var t = (meta[lang()] || meta.en).title;
    slot.href = '/kids/' + subject + '/' + slug + '/';
    slot.innerHTML =
      '<span class="emoji">📍</span>' +
      '<span class="meta">' +
        '<span class="label">' + tr('continue_label') + '</span>' +
        '<span class="title">' + esc(t) + '</span>' +
        '<span class="sub">' + esc(subjectName(subject)) + ' · ' + (window.GRADE_LABEL ? window.GRADE_LABEL(meta.grade) : meta.grade) + '</span>' +
      '</span>' +
      '<span class="go">' + tr('continue_go') + ' →</span>';
    slot.classList.add('has');
  }

  /* ---------- refresh on language change ---------- */
  function refreshText() {
    if (IS_TOPIC) {
      var steps = { learn: 'arc_learn', practice: 'arc_practice', finish: 'arc_finish' };
      document.querySelectorAll('#bkArc .bk-arc-step').forEach(function (el) {
        var k = steps[el.getAttribute('data-step')];
        var txt = el.querySelector('.txt');
        if (k && txt) txt.textContent = tr(k);
      });
      document.querySelectorAll('.bk-listen .lbl').forEach(function (el) { el.textContent = tr('listen'); });
      var f = document.getElementById('bkFinish');
      if (f) f.querySelector('span').textContent = tr('finish_cta');
      var hint = document.getElementById('bkFinishHint');
      if (hint && !finished) hint.textContent = practiced ? tr('finish_cta') : tr('finish_hint');
      var pn = document.getElementById('bkPn');
      if (pn) { pn.remove(); renderPN(); }
      var ph = document.querySelector('.bk-phase');
      if (ph) ph.innerHTML = tr('phase') + ' ' + phaseOf(META.grade) + ' <span class="info" title="' + tr('phase_tip') + '">ⓘ</span>';
    }
    renderContinue();
  }
  document.addEventListener('langchange', refreshText);

  /* ---------- boot ---------- */
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  ready(function () {
    buildCelebrate();
    renderContinue();
    if (!IS_TOPIC) return;
    var main = document.querySelector('main.app-main') || document.querySelector('main') || document.body;
    if (!main) return;
    renderArc(main);
    renderPhase(main);
    injectListenButtons(main);
    renderFinish(main);
    watchScore(main);
    renderPN();
  });

  /* ---------- public API ---------- */
  window.BK = {
    version: VER,
    subject: SUBJECT,
    slug: SLUG,
    markPracticed: markPracticed,
    complete: function () { finish(true); },
    stars: function (subject, slug) { return getStars(subject || SUBJECT, slug || SLUG); },
    progress: loadAll
  };
})();
