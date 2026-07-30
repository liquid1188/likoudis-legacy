/* ─── LLF MAIN.JS ─── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ── 2. NAV: shrink + highlight on scroll ── */
  const nav = document.querySelector('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 3. BACK-TO-TOP BUTTON ── */
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = '↑';
  document.body.appendChild(btt);

  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 4. MOBILE HAMBURGER NAV ── */
  if (nav) {
    const links = nav.querySelector('.nav-links');
    if (links) {
      const btn = document.createElement('button');
      btn.className = 'nav-hamburger';
      btn.setAttribute('aria-label', 'Menu');
      btn.innerHTML = '<span></span><span></span><span></span>';
      nav.appendChild(btn);

      btn.addEventListener('click', () => {
        const open = links.classList.toggle('mobile-open');
        btn.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
          links.style.cssText = 'display:flex!important;position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100vh!important;z-index:9999!important;background:var(--navy)!important;flex-direction:column!important;padding:5rem 2.5rem 2rem!important;gap:0!important;overflow-y:auto!important;list-style:none!important;margin:0!important;';
        } else {
          links.style.cssText = '';
        }
      });

      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          links.classList.remove('mobile-open');
          links.style.cssText = '';
          btn.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ── 5. ACTIVE NAV LINK ── */
  const pathParts = window.location.pathname.split('/');
  const currentFile = pathParts.pop() || pathParts.pop() || 'index.html';
  const normalizedFile = (currentFile === '' || currentFile === '/') ? 'index.html' : currentFile;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const hrefFile = href.split('/').pop();
    if (hrefFile === normalizedFile) {
      a.classList.add('nav-active');
    }
  });

  /* ── 6. SMOOTH ANCHOR SCROLL (offset for fixed nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 7. MOBILE DROPDOWN ACCORDION ── */
  document.querySelectorAll('.nav-dropdown').forEach(function(dropdown) {
    const toggle = dropdown.querySelector(':scope > a');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function(e) {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.toggle('mobile-dd-open');
      menu.style.display = isOpen ? 'block' : 'none';
      menu.style.position = 'static';
      menu.style.background = 'rgba(255,255,255,0.05)';
      menu.style.padding = isOpen ? '0.5rem 0 0.5rem 1rem' : '';
      menu.style.marginBottom = isOpen ? '0.5rem' : '';
      menu.style.borderLeft = isOpen ? '1px solid rgba(200,169,110,0.2)' : '';
    });

    menu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        menu.classList.remove('mobile-dd-open');
        menu.style.cssText = '';
      });
    });
  });


  /* ── 6. EBGS PROMO / GIVE POPUP ── */
  (function () {
    var LS = 'llf_ebgs_promo_v1';   // cross-session suppression
    var SS = 'llf_promo_shown';     // once per browsing session
    var now = Date.now(), DAY = 864e5;

    try {
      var rec = JSON.parse(localStorage.getItem(LS) || 'null');
      if (rec && rec.until && now < rec.until) return;   // still suppressed
      if (sessionStorage.getItem(SS)) return;            // already shown this session
    } catch (e) {}

    function suppress(days) {
      try { localStorage.setItem(LS, JSON.stringify({ until: Date.now() + days * DAY })); } catch (e) {}
    }

    var overlay = document.createElement('div');
    overlay.className = 'llf-promo-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Ending the Byzantine Greek Schism');
    overlay.innerHTML =
      '<div class="llf-promo-card" role="document">' +
        '<button class="llf-promo-close" aria-label="Close">\u00D7</button>' +
        '<div class="llf-promo-media">' +
          '<img src="/images/book-ending-schism.jpg" alt="Ending the Byzantine Greek Schism" loading="lazy">' +
        '</div>' +
        '<div class="llf-promo-body">' +
          '<p class="llf-promo-eyebrow">Newly Published \u00B7 2026</p>' +
          '<h3 class="llf-promo-title">Ending the Byzantine Greek Schism</h3>' +
          '<p class="llf-promo-sub">James Likoudis \u00B7 Foreword by Scott Hahn \u00B7 Third Edition</p>' +
          '<blockquote class="llf-promo-quote">\u201CJames Likoudis left us a legacy of timely analysis and rationale for navigating a path to unity between the Catholic and Orthodox Churches.\u201D</blockquote>' +
          '<div class="llf-promo-attr">' +
            '<img src="/images/abp-cordileone.jpg" alt="Archbishop Salvatore J. Cordileone" loading="lazy">' +
            '<div class="llf-promo-attr-text">' +
              '<span class="llf-promo-name">Most Rev. Salvatore J. Cordileone</span>' +
              '<span class="llf-promo-role">Archbishop of San Francisco</span>' +
            '</div>' +
          '</div>' +
          '<div class="llf-promo-actions">' +
            '<a class="llf-promo-btn llf-promo-btn-gold" href="https://a.co/d/0eh9qEv6" target="_blank" rel="noopener">Order the Book</a>' +
            '<a class="llf-promo-btn llf-promo-btn-navy" href="/donate.html">Support the Foundation</a>' +
          '</div>' +
          '<button class="llf-promo-later">Maybe later</button>' +
        '</div>' +
      '</div>';

    function onKey(e) { if (e.key === 'Escape') close(7); }
    function close(days) {
      overlay.classList.remove('llf-promo-visible');
      document.body.style.overflow = '';
      suppress(days);
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { if (overlay.parentNode) overlay.remove(); }, 300);
    }

    overlay.querySelector('.llf-promo-close').addEventListener('click', function () { close(10); });
    overlay.querySelector('.llf-promo-later').addEventListener('click', function () { close(7); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(7); });
    overlay.querySelectorAll('.llf-promo-btn').forEach(function (b) {
      b.addEventListener('click', function () { suppress(60); }); // engaged → suppress longer
    });

    setTimeout(function () {
      document.body.appendChild(overlay);
      try { sessionStorage.setItem(SS, '1'); } catch (e) {}
      document.addEventListener('keydown', onKey);
      requestAnimationFrame(function () {
        overlay.classList.add('llf-promo-visible');
        document.body.style.overflow = 'hidden';
      });
    }, 4000);
  })();



/* ── 8. SITEWIDE SEARCH ──
   The nav is duplicated across every page, so the control is injected here
   rather than hand-added 22 times. Index is fetched lazily on first open. */
(function () {
  var nav = document.querySelector('nav .nav-links');
  if (!nav || document.getElementById('llf-search-overlay')) return;

  var li = document.createElement('li');
  li.className = 'nav-search-li';
  li.innerHTML = '<button class="nav-search-btn" aria-label="Search this site" title="Search">' +
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle>' +
    '<line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg></button>';
  var give = nav.querySelector('.nav-give');
  if (give && give.parentNode) nav.insertBefore(li, give.parentNode); else nav.appendChild(li);

  var ov = document.createElement('div');
  ov.id = 'llf-search-overlay';
  ov.innerHTML =
    '<div class="llf-s-panel" role="dialog" aria-modal="true" aria-label="Search">' +
      '<button class="llf-s-close" aria-label="Close search">&times;</button>' +
      '<input type="search" class="llf-s-input" placeholder="Search essays, pages, resources…" ' +
        'autocomplete="off" spellcheck="false">' +
      '<div class="llf-s-hint">Searches the full text of every essay and page.</div>' +
      '<div class="llf-s-results" aria-live="polite"></div>' +
    '</div>';
  document.body.appendChild(ov);

  var input = ov.querySelector('.llf-s-input'),
      out   = ov.querySelector('.llf-s-results'),
      hint  = ov.querySelector('.llf-s-hint'),
      INDEX = null, loading = null, timer;

  var LABEL = {doctrine:'Doctrine & Faith', liturgy:'Liturgy & Discipline',
    family:'Family, Morals & Education', ecumenism:'Ecumenism & Orthodoxy',
    dialogues:'Dialogues', reviews:'Book Reviews', letters:'Letters & Replies',
    saints:'Saints', marian:'Marian Doctrine', page:'Page', resource:'Resource', essay:'Essay'};

  function load() {
    if (INDEX || loading) return loading;
    loading = fetch('/search-index.json').then(function (r) { return r.json(); })
      .then(function (d) { INDEX = d; return d; })
      .catch(function () { INDEX = []; return []; });
    return loading;
  }
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }
  function snip(text, q) {
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) return esc(text.slice(0, 140)) + '…';
    var a = Math.max(0, i - 55), b = Math.min(text.length, i + q.length + 105);
    if (a > 0) { var sp = text.indexOf(' ', a); if (sp > -1 && sp < i) a = sp + 1; }
    return (a > 0 ? '…' : '') + esc(text.slice(a, i)) + '<mark>' +
      esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length, b)) +
      (b < text.length ? '…' : '');
  }
  function render(q) {
    if (!INDEX) { out.innerHTML = '<p class="llf-s-empty">Loading…</p>'; return; }
    var hits = [];
    for (var i = 0; i < INDEX.length; i++) {
      var d = INDEX[i],
          inT = d.t.toLowerCase().indexOf(q) > -1,
          at  = d.x.toLowerCase().indexOf(q);
      if (!inT && at < 0) continue;
      hits.push({d: d, inT: inT, at: inT ? -1 : at, pg: d.c === 'page' || d.c === 'resource'});
    }
    if (!hits.length) {
      out.innerHTML = '<p class="llf-s-empty">Nothing matched &ldquo;' + esc(q) + '&rdquo;.</p>';
      return;
    }
    hits.sort(function (a, b) {
      return (b.inT - a.inT) || (b.pg - a.pg) || (a.at - b.at);
    });
    out.innerHTML = '<p class="llf-s-count">' + hits.length +
      (hits.length === 1 ? ' result' : ' results') + '</p>' +
      hits.slice(0, 80).map(function (h) {
        return '<a class="llf-s-hit" href="' + h.d.u + '">' +
          '<span class="llf-s-kind">' + esc(LABEL[h.d.c] || h.d.c) + '</span>' +
          '<span class="llf-s-title">' + esc(h.d.t) + '</span>' +
          '<span class="llf-s-snip">' + snip(h.d.x, q) + '</span></a>';
      }).join('') +
      (hits.length > 80 ? '<p class="llf-s-empty">Showing the first 80. Keep typing to narrow.</p>' : '');
  }
  function open() {
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
    load();
    setTimeout(function () { input.focus(); }, 40);
  }
  function close() {
    ov.classList.remove('open');
    document.body.style.overflow = '';
    input.value = ''; out.innerHTML = ''; hint.style.display = '';
  }
  li.querySelector('.nav-search-btn').addEventListener('click', open);
  ov.querySelector('.llf-s-close').addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ov.classList.contains('open')) close();
    else if (e.key === '/' && !ov.classList.contains('open') &&
             !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) &&
             !document.activeElement.isContentEditable) { e.preventDefault(); open(); }
  });
  input.addEventListener('input', function () {
    var q = this.value.trim().toLowerCase();
    clearTimeout(timer);
    hint.style.display = q ? 'none' : '';
    if (!q) { out.innerHTML = ''; return; }
    timer = setTimeout(function () {
      if (INDEX) render(q); else { render(q); load().then(function () { render(q); }); }
    }, 110);
  });
})();

});
