// Scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
});

// Mobile hamburger nav
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const links = nav.querySelector('.nav-links');
  if (!links) return;

  // Create hamburger button
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

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('mobile-open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
});
