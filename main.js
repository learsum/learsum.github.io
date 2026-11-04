// Learsum — progressive enhancement only; the page is fully readable without JS.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year in footer
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());

  // Nav background after scrolling
  const nav = document.getElementById('nav');

  // Reveal on scroll, with a small stagger among siblings
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    const group = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('reveal')) : [];
    const i = group.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 4) * 0.08}s`);
  });
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Split statement into words for scroll-linked highlighting
  const statement = document.querySelector('[data-words]');
  const accentWords = new Set(['sprawdzony,']);
  let words = [];
  if (statement) {
    const parts = statement.textContent.split(/(\s+)/);
    statement.textContent = '';
    for (const p of parts) {
      if (/^\s+$/.test(p) || p === '') { statement.append(p); continue; }
      const s = document.createElement('span');
      s.className = 'w' + (accentWords.has(p) ? ' accent' : '');
      s.textContent = p;
      statement.append(s);
    }
    words = [...statement.querySelectorAll('.w')];
  }
  const statementSection = statement ? statement.closest('.statement') : null;
  const hero = document.querySelector('[data-hero]');

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const sy = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', sy > 8);

    if (reduce) return;

    // Hero: gentle scale-down and fade as it scrolls away
    if (hero) {
      const p = Math.min(Math.max(sy / vh, 0), 1);
      hero.style.transform = `translateY(${p * -60}px) scale(${1 - p * 0.08})`;
      hero.style.opacity = String(1 - p * 1.1);
    }

    // Statement: light up words as the sticky section is scrolled through
    if (statementSection && words.length) {
      const r = statementSection.getBoundingClientRect();
      const total = r.height - vh;
      const p = Math.min(Math.max(-r.top / (total * 0.85), 0), 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
