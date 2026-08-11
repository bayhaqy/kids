/* =================================================================
   Bayhaqy Kids — Shared shell (header + footer + theme + i18n + TTS)
   v2 — Logo image header (matches apps/games/portfolio),
        language-aware natural TTS, kid-friendly design.
   ================================================================= */
(function () {
  'use strict';

  /* ---------- 1. Apply saved theme BEFORE paint ---------- */
  try {
    var t = localStorage.getItem('bayhaqy-kids-theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    } else {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  /* ---------- 2. i18n ---------- */
  var LANGS = ['en', 'id'];
  var currentLang = (function () {
    try {
      var saved = localStorage.getItem('bayhaqy-kids-lang');
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('id') === 0 ? 'id' : 'en';
  })();

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = window.I18N && window.I18N[currentLang] && window.I18N[currentLang][key];
      if (val) el.textContent = val;
    });
    document.documentElement.setAttribute('lang', currentLang === 'id' ? 'id' : 'en');
    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = currentLang === 'en' ? 'ID' : 'EN';
    // Update speak buttons' labels
    document.querySelectorAll('.speak-btn[data-i18n-label]').forEach(function (btn) {
      var key = btn.getAttribute('data-i18n-label');
      var val = window.I18N && window.I18N[currentLang] && window.I18N[currentLang][key];
      if (val) btn.setAttribute('aria-label', val);
    });
  }

  window.setLang = function (l) {
    if (LANGS.indexOf(l) === -1) return;
    currentLang = l;
    try { localStorage.setItem('bayhaqy-kids-lang', l); } catch (e) {}
    applyI18n();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: l } }));
  };

  window.toggleLang = function () {
    window.setLang(currentLang === 'en' ? 'id' : 'en');
  };

  window.getLang = function () { return currentLang; };

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  /* ---------- 3. Text-to-Speech with natural, language-aware voices ---------- */
  // Voice selection: prefer neural/natural voices for the active language.
  // Browsers (Chrome/Edge/Safari) expose both standard and "natural"/"Google"/"Microsoft" voices.
  // We rank them so kids hear the most human-sounding voice available.

  var voiceCache = { en: null, id: null };
  var voicesLoaded = false;

  function rankVoice(voice, lang) {
    var name = (voice.name || '').toLowerCase();
    var score = 0;
    // Prefer natural/neural/premium voices
    if (name.indexOf('natural') !== -1) score += 100;
    if (name.indexOf('neural') !== -1) score += 100;
    if (name.indexOf('premium') !== -1) score += 80;
    if (name.indexOf('enhanced') !== -1) score += 60;
    // Google voices tend to sound natural
    if (name.indexOf('google') !== -1) score += 50;
    // Microsoft Online voices (Safari/Edge on macOS/iOS) are neural
    if (name.indexOf('microsoft') !== -1 && name.indexOf('online') !== -1) score += 90;
    // Apple voices
    if (name.indexOf('samantha') !== -1) score += 40; // high-quality EN
    if (name.indexOf('daniel') !== -1) score += 30;  // high-quality EN-GB
    if (name.indexOf('damayanti') !== -1) score += 60; // Apple ID voice
    // Default voice gets small bonus (likely tuned by OS)
    if (voice.default) score += 5;
    // Local voices load instantly; online voices may need network but sound better.
    // We don't penalize either; let the rank decide.
    return score;
  }

  function pickVoiceForLang(lang) {
    if (!('speechSynthesis' in window)) return null;
    var voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;
    var langCode = lang === 'id' ? 'id' : 'en';
    var candidates = voices.filter(function (v) {
      var vl = (v.lang || '').toLowerCase();
      return vl.indexOf(langCode) === 0;
    });
    if (!candidates.length) {
      // Fallback: try any voice (better than silence)
      candidates = voices;
    }
    candidates.sort(function (a, b) { return rankVoice(b, lang) - rankVoice(a, lang); });
    return candidates[0];
  }

  function loadVoices() {
    if (voicesLoaded) return;
    voiceCache.en = pickVoiceForLang('en');
    voiceCache.id = pickVoiceForLang('id');
    voicesLoaded = true;
  }

  if ('speechSynthesis' in window) {
    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = function () {
      voicesLoaded = false;
      loadVoices();
    };
    // Try initial load
    setTimeout(loadVoices, 100);
    setTimeout(loadVoices, 500);
  }

  /**
   * speak(text, opts?) — Natural-sounding TTS for kids.
   * - Automatically picks the best voice for the active language.
   * - Uses slower rate for younger learners (K-3) by default.
   * - Adds slight pitch variation to sound less robotic.
   * - Falls back gracefully if speechSynthesis unavailable.
   */
  window.speak = function (text, opts) {
    opts = opts || {};
    if (!('speechSynthesis' in window)) {
      if (window.showToast) window.showToast(window.t ? window.t('speech_unsupported') : 'Speech not supported');
      return;
    }
    if (!text || !text.trim()) return;
    // Cancel any in-flight speech so rapid taps don't queue up.
    window.speechSynthesis.cancel();

    var lang = opts.lang || window.getLang();
    if (!voiceCache[lang]) loadVoices();
    var voice = voiceCache[lang] || pickVoiceForLang(lang);

    var u = new SpeechSynthesisUtterance(text);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = lang === 'id' ? 'id-ID' : 'en-US';
    }
    // Kid-friendly defaults: slightly slower, natural pitch, friendly rate.
    // For young learners (K-3), slow down a bit more.
    var grade = opts.grade || '';
    var isYoung = grade === 'K' || grade === '1' || grade === '2' || grade === '3';
    u.rate = opts.rate != null ? opts.rate : (isYoung ? 0.88 : 0.95);
    u.pitch = opts.pitch != null ? opts.pitch : 1.05; // slightly higher = friendlier
    u.volume = opts.volume != null ? opts.volume : 1;

    // Visually mark the speaking element if provided
    var target = opts.target;
    if (target) target.classList.add('speaking');
    u.onend = function () {
      if (target) target.classList.remove('speaking');
    };
    u.onerror = function () {
      if (target) target.classList.remove('speaking');
    };

    // Small delay helps Chrome cancel cleanly
    setTimeout(function () {
      window.speechSynthesis.speak(u);
    }, 50);
  };

  /** speakElement(el) — Speaks all text content of an element, in order. */
  window.speakElement = function (el, opts) {
    if (!el) return;
    var text = '';
    el.querySelectorAll('h1, h2, h3, h4, p, li, .speakable').forEach(function (node) {
      var t = node.textContent.trim();
      if (t) text += t + '. ';
    });
    if (!text) text = el.textContent.trim();
    window.speak(text, opts);
  };

  /** stopSpeaking() — Stops any in-flight speech. */
  window.stopSpeaking = function () {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  /* ---------- 4. Build header + footer ---------- */
  ready(function () {
    var appName = document.body.getAttribute('data-app-name') || '';
    var subject = document.body.getAttribute('data-subject') || '';

    // Header — logo image + nav + lang toggle + theme toggle (matches apps format)
    var header = document.createElement('header');
    header.className = 'kids-header';
    header.id = 'kidsHeader';
    header.innerHTML =
      '<div class="kids-header-inner">' +
        '<a class="kids-brand" href="/kids/" aria-label="Bayhaqy Kids home">' +
          '<img src="/kids/icons/logo.png" alt="Bayhaqy" class="kids-brand-logo" />' +
        '</a>' +
        '<button class="menu-toggle" id="menuToggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>' +
        '<nav class="kids-nav" id="kidsNav" aria-label="Primary">' +
          '<a href="/kids/math/" data-i18n="nav_math">Math</a>' +
          '<a href="/kids/language/" data-i18n="nav_language">Language</a>' +
          '<a href="/kids/science/" data-i18n="nav_science">Science</a>' +
          '<a href="/kids/tech/" data-i18n="nav_tech">Tech</a>' +
          '<a href="/kids/history/" data-i18n="nav_history">History</a>' +
          '<a href="/kids/games/" data-i18n="nav_games">Games</a>' +
          '<button class="lang-toggle" id="langToggle" type="button" aria-label="Switch language">ID</button>' +
          '<button class="theme-toggle" type="button" aria-label="Toggle dark mode" id="themeToggle">' +
            '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
            '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><line x1="12" y1="1.5" x2="12" y2="3.5"/><line x1="12" y1="20.5" x2="12" y2="22.5"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1.5" y1="12" x2="3.5" y2="12"/><line x1="20.5" y1="12" x2="22.5" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
          '</button>' +
        '</nav>' +
      '</div>';
    document.body.insertBefore(header, document.body.firstChild);

    // Footer — logo + standardized copyright text (matches apps/games format)
    var footer = document.createElement('footer');
    footer.className = 'kids-footer';
    footer.innerHTML =
      '<div class="kids-footer-inner">' +
        '<a class="brand-mini" href="/kids/" aria-label="Bayhaqy Kids home">' +
          '<img src="/kids/icons/logo.png" alt="Bayhaqy" />' +
        '</a>' +
        '<span class="copy">© 2026 Achmad Bayhaqy. All rights reserved.</span>' +
        '<span class="footer-links">' +
          '<a href="https://bayhaqy.my.id/">Portfolio</a>' +
          '<a href="https://bayhaqy.my.id/apps/">Apps</a>' +
          '<a href="https://bayhaqy.my.id/games/">Games</a>' +
        '</span>' +
      '</div>';
    document.body.appendChild(footer);

    // Set document title
    if (appName) {
      document.title = appName + ' · Bayhaqy Kids';
    }

    // Theme toggle
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('bayhaqy-kids-theme', next); } catch (e) {}
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
      });
    }

    // Lang toggle
    var langBtn = document.getElementById('langToggle');
    if (langBtn) {
      langBtn.addEventListener('click', window.toggleLang);
    }

    // Menu toggle (mobile)
    var menuBtn = document.getElementById('menuToggle');
    var nav = document.getElementById('kidsNav');
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { nav.classList.remove('open'); });
      });
    }

    // Header scrolled state
    var lastY = 0;
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (y > 4 && lastY <= 4) header.classList.add('scrolled');
      else if (y <= 4 && lastY > 4) header.classList.remove('scrolled');
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Apply i18n now
    applyI18n();

    // Helpers
    initHelpers();
  });

  /* ---------- 5. Global helpers ---------- */
  function initHelpers() {
    if (!window.showToast) {
      var toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
      var toastTimer = null;
      window.showToast = function (msg, ms) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 1800);
      };
    }

    // t(key) — translate a key in current language.
    if (!window.t) {
      window.t = function (key) {
        var lang = window.getLang();
        return (window.I18N && window.I18N[lang] && window.I18N[lang][key]) || key;
      };
    }

    // Random integer in [min, max]
    if (!window.randInt) {
      window.randInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
    }

    // Shuffle array
    if (!window.shuffle) {
      window.shuffle = function (arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
      };
    }

    // Auto-wire any element with [data-speak] to speak its text on click
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-speak]');
      if (target) {
        var text = target.getAttribute('data-speak') || target.textContent;
        var grade = target.getAttribute('data-grade') || '';
        window.speak(text, { target: target, grade: grade });
      }
    });

    // Stop speech when navigating away
    window.addEventListener('beforeunload', function () {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    });
  }
})();
