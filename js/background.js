/* Fondo generativo: malla geodésica + órbitas concéntricas (SVG matemático) */
(function () {
  'use strict';

  const W = 1440, H = 900;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.classList.add('bg-gen');

  const el = (name, attrs) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };

  // Capa 1: retícula isométrica de puntos (precisión matemática)
  const dots = el('g', { class: 'bg-dots' });
  const SPACING = 46;
  for (let y = 0; y <= H; y += SPACING) {
    for (let x = 0; x <= W; x += SPACING) {
      const off = (y / SPACING) % 2 === 0 ? 0 : SPACING / 2;
      dots.appendChild(el('circle', { cx: x + off, cy: y, r: 1.1, class: 'bg-dot' }));
    }
  }
  svg.appendChild(dots);

  // Capa 2: malla geodésica con curvas de Bézier (profundidad orgánico-matemática)
  const mesh = el('g', { class: 'bg-mesh' });
  const CX = W * 0.78, CY = H * 0.3, R0 = 60, LAYERS = 7, SIDES = 12;
  for (let layer = 1; layer <= LAYERS; layer++) {
    const r = R0 * layer * 1.35;
    const pts = [];
    for (let i = 0; i < SIDES; i++) {
      const a = (i / SIDES) * Math.PI * 2 + layer * 0.16; // rotación incremental por capa
      pts.push([CX + Math.cos(a) * r, CY + Math.sin(a) * r * 0.72]); // elipse (perspectiva)
    }
    // polígono cerrado con curvas suaves
    let d = '';
    for (let i = 0; i < SIDES; i++) {
      const p0 = pts[i], p1 = pts[(i + 1) % SIDES];
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      const nx = (my - p0[1]) * 0.28, ny = (p0[0] - mx) * 0.28; // normal para curvar
      if (i === 0) d += `M ${mx} ${my}`;
      d += ` Q ${p1[0] + nx} ${p1[1] + ny} ${(p1[0] + pts[(i + 2) % SIDES][0]) / 2} ${(p1[1] + pts[(i + 2) % SIDES][1]) / 2}`;
    }
    d += ' Z';
    mesh.appendChild(el('path', { d, class: 'bg-path', style: `--i:${layer}` }));
    // nodos en vértices
    pts.forEach(([x, y], i) => {
      if ((i + layer) % 3 === 0) mesh.appendChild(el('circle', { cx: x, cy: y, r: 2.4, class: 'bg-node', style: `--i:${layer + i}` }));
    });
  }
  // líneas radiales hacia el centro (estructura)
  for (let i = 0; i < SIDES; i++) {
    const a = (i / SIDES) * Math.PI * 2;
    mesh.appendChild(el('line', {
      x1: CX, y1: CY,
      x2: CX + Math.cos(a) * R0 * LAYERS * 1.35,
      y2: CY + Math.sin(a) * R0 * LAYERS * 1.35 * 0.72,
      class: 'bg-ray', style: `--i:${i}`
    }));
  }
  svg.appendChild(mesh);

  // Capa 3: segundo núcleo asimétrico (contrapunto visual)
  const mesh2 = el('g', { class: 'bg-mesh bg-mesh-alt' });
  const CX2 = W * 0.12, CY2 = H * 0.85;
  for (let layer = 1; layer <= 4; layer++) {
    const r = R0 * layer * 1.5;
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - layer * 0.22;
      pts.push([CX2 + Math.cos(a) * r, CY2 + Math.sin(a) * r * 0.68]);
    }
    const poly = el('polygon', { points: pts.map(p => p.join(',')).join(' '), class: 'bg-path-thin', style: `--i:${layer}` });
    mesh2.appendChild(poly);
  }
  svg.appendChild(mesh2);

  // Insertar como fondo fijo
  const bg = document.createElement('div');
  bg.className = 'bg-canvas';
  bg.setAttribute('aria-hidden', 'true');
  bg.appendChild(svg);
  document.body.prepend(bg);

  // Parallax sutil con el mouse (profundidad)
  if (matchMedia('(pointer:fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('mousemove', (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 18;
      ty = (e.clientY / innerHeight - 0.5) * 12;
    }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.04; cy += (ty - cy) * 0.04;
      mesh.setAttribute('transform', `translate(${cx} ${cy})`);
      mesh2.setAttribute('transform', `translate(${-cx * 0.6} ${-cy * 0.6})`);
      requestAnimationFrame(loop);
    })();
  }
})();
