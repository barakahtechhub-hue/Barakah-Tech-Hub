/* Barakah Tech Hub — Interacciones ligeras */
(function () {
  'use strict';

  // Nav con fondo al hacer scroll
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('.nav-links a').forEach((link) =>
      link.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  // Animaciones de entrada (fade-in sutil)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: '0px 0px -20px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Red de seguridad: si algo no se reveló (p. ej. capturas de página completa
  // u observers poco fiables), lo mostramos tras cargar.
  const revealAll = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      el.classList.add('visible');
      observer.unobserve(el);
    });
  };
  // Fallback rápido: no dependemos del evento load (CDN lento puede retrasarlo mucho)
  setTimeout(revealAll, 2500);
  window.addEventListener('load', () => setTimeout(revealAll, 500));

  // Favicon de respaldo si el logo aún no existe
  const probe = new Image();
  probe.onerror = () => {
    const icon = document.querySelector('link[rel="icon"]');
    if (icon) {
      icon.href = "data:image/svg+xml," + encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230F1A2E'/><text x='50' y='68' font-size='52' text-anchor='middle' fill='%23fff' font-family='Arial' font-weight='bold'>B</text></svg>"
      );
    }
  };
  probe.src = 'img/logo.png';

  // Año de copyright siempre vigente
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Insights: tarjetas de artículos generadas desde datos
  const POSTS_DATA = [
    {
      tag: 'IA',
      date: '2025-11-14',
      title: 'Cómo orquestamos cascadas de IA resilientes',
      excerpt: 'El patrón de ingeniería que permite a nuestros sistemas degradarse con elegancia cuando un modelo falla.',
      url: null // publica el artículo y pon aquí su URL
    },
    {
      tag: 'Producto',
      date: '2025-09-02',
      title: 'El futuro de las agendas automatizadas',
      excerpt: 'De la gestión manual de citas a sistemas que negocian, priorizan y confirman solos.',
      url: null // publica el artículo y pon aquí su URL
    }
  ];

  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid) {
    const fmt = new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric' });
    POSTS_DATA.forEach((post, i) => {
      const card = document.createElement('a');
      card.className = 'post reveal' + (i > 0 ? ' delay-' + i : '');
      if (post.url) {
        card.href = post.url;
      } else {
        card.href = '#insights';
        card.setAttribute('aria-disabled', 'true');
        card.title = 'Próximamente';
      }
      const meta = document.createElement('div');
      meta.className = 'post-meta';
      const tag = document.createElement('span');
      tag.className = 'post-tag';
      tag.textContent = post.tag;
      const date = document.createElement('span');
      date.className = 'post-date';
      date.textContent = fmt.format(new Date(post.date + 'T00:00:00'));
      meta.append(tag, date);
      const h3 = document.createElement('h3');
      h3.textContent = post.title;
      const p = document.createElement('p');
      p.textContent = post.excerpt;
      const link = document.createElement('span');
      link.className = 'post-link';
      link.textContent = post.url ? 'Leer artículo →' : 'Próximamente →';
      card.append(meta, h3, p, link);
      blogGrid.appendChild(card);
      observer.observe(card);
    });
  }
})();
