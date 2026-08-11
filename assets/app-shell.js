/* =================================================================
   Bayhaqy Kids — Shared shell (header + footer + theme + i18n)
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
    document.documentElement.setAttribute('lang', currentLang);
    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = currentLang === 'en' ? 'ID' : 'EN';
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

  /* ---------- 3. Build header + footer ---------- */
  ready(function () {
    var appName = document.body.getAttribute('data-app-name') || '';
    var subject = document.body.getAttribute('data-subject') || '';

    // Header
    var header = document.createElement('header');
    header.className = 'kids-header';
    header.id = 'kidsHeader';
    header.innerHTML =
      '<div class="kids-header-inner">' +
        '<a class="kids-brand" href="/kids/" aria-label="Bayhaqy Kids home">' +
          '<span class="kids-brand-logo">B</span>' +
          '<span class="kids-brand-name">Bayhaqy <span class="accent">Kids</span></span>' +
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

    // Footer
    var footer = document.createElement('footer');
    footer.className = 'kids-footer';
    var year = new Date().getFullYear();
    footer.innerHTML =
      '<div class="kids-footer-inner">' +
        '<a class="brand-mini" href="/kids/" aria-label="Bayhaqy Kids home">' +
          '<span class="logo">B</span>' +
          '<span>Bayhaqy Kids</span>' +
        '</a>' +
        '<span>© ' + year + ' Achmad Bayhaqy · <a href="https://bayhaqy.my.id/">bayhaqy.my.id</a></span>' +
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

  /* ---------- 4. Global helpers ---------- */
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
  }
})();
