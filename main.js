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
      });

      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          links.classList.remove('mobile-open');
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
    const toggle = dropdown.querySelector('a');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function(e) {
      const isMobile = window.innerWidth <= 900;
      if (!isMobile) return; // desktop: hover handles it
      e.preventDefault();
      const isOpen = menu.classList.toggle('mobile-dd-open');
      toggle.classList.toggle('dd-open', isOpen);
      menu.style.cssText = isOpen
        ? 'display:block !important; position:static; background:rgba(255,255,255,0.05); padding:0.25rem 0 0.25rem 1rem; margin-bottom:0.5rem;'
        : '';
    });
  });


});
