/* Geometría sagrada intrincada: composición estilo "artefacto de vida inteligente" */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('sacred-geo');
  if (!svg) return;

  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const g = (cls) => { const e = el('g', { class: cls }); svg.appendChild(e); return e; };
  const P = (x, y) => `${x.toFixed(2)} ${y.toFixed(2)}`;
  const poly = (cx, cy, r, n, rot = 0) => Array.from({ length: n }, (_, i) => {
    const a = rot + (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const path = (pts, cls, close = true) => {
    let d = `M ${P(pts[0][0], pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${P(pts[i][0], pts[i][1])}`;
    if (close) d += ' Z';
    return el('path', { d, class: cls });
  };

  /* ---- Núcleo principal: Flor de la Vida + retícula polar ---- */
  const cx = 720, cy = 380, R = 150;
  const bloom = g('sg-bloom');

  // círculos entrelazados (semilla de la vida expandida)
  const seed = g('');
  [0, 1, 2, 3, 4, 5].forEach(i => {
    const a = (i / 6) * Math.PI * 2;
    seed.appendChild(el('circle', { cx: cx + Math.cos(a) * R, cy: cy + Math.sin(a) * R, r: R, class: 'sg-stroke' }));
  });
  seed.appendChild(el('circle', { cx, cy, r: R, class: 'sg-stroke' }));
  bloom.appendChild(seed);

  // anillos concéntricos con marcas tipo "dial"
  const dial = g('');
  [R * 1.5, R * 2.1, R * 2.7].forEach((r, k) => {
    dial.appendChild(el('circle', { cx, cy, r, class: k === 1 ? 'sg-stroke-accent' : 'sg-stroke' }));
    const n = 24 + k * 12;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const len = i % 6 === 0 ? 10 : 4;
      dial.appendChild(el('line', {
        x1: cx + Math.cos(a) * r, y1: cy + Math.sin(a) * r,
        x2: cx + Math.cos(a) * (r + len), y2: cy + Math.sin(a) * (r + len),
        class: 'sg-line'
      }));
    }
  });
  bloom.appendChild(dial);

  // estrellas compuestas: hexagrama + eneagrama rotados (múltiples capas)
  const stars = g('');
  [[6, R * 1.5, 0], [6, R * 1.5, Math.PI / 6], [9, R * 2.1, Math.PI / 9], [12, R * 2.7, 0]].forEach(([n, r, rot], k) => {
    stars.appendChild(path(poly(cx, cy, r, n, rot), k % 2 ? 'sg-stroke-accent' : 'sg-stroke'));
  });
  bloom.appendChild(stars);

  // conexiones internas: todas las cuerdas entre vértices del dodecágono (chorus lineae)
  const chorus = g('');
  const dodec = poly(cx, cy, R * 2.7, 12, 0);
  for (let i = 0; i < 12; i++) for (let j = i + 2; j < 12; j += 3) {
    chorus.appendChild(el('line', {
      x1: dodec[i][0], y1: dodec[i][1],
      x2: dodec[j][0], y2: dodec[j][1],
      class: 'sg-line'
    }));
  }
  bloom.appendChild(chorus);

  // nodos en intersecciones (puntos de energía)
  dodec.forEach(([x, y]) => bloom.appendChild(el('circle', { cx: x, cy: y, r: 3, class: 'sg-node' })));

  /* ---- Núcleo secundario: espiral áurea cuadrada (contrapunto) ---- */
  const b2 = g('sg-bloom sg-bloom-2');
  const cx2 = 1050, cy2 = 560, s = 9;
  const fib = [1, 1, 2, 3, 5, 8, 13];
  let x = cx2, y = cy2, d = `M ${x} ${y}`;
  fib.forEach((f, i) => {
    const w = f * s;
    if (i % 4 === 0) { d += ` a ${w} ${w} 0 0 1 ${w} 0`; x += w; }
    else if (i % 4 === 1) { d += ` a ${w} ${w} 0 0 1 0 ${w}`; y += w; }
    else if (i % 4 === 2) { d += ` a ${w} ${w} 0 0 1 ${-w} 0`; x -= w; }
    else { d += ` a ${w} ${w} 0 0 1 0 ${-w}`; y -= w; }
    b2.appendChild(el('rect', { x: x - (i % 4 === 2 ? w : 0), y: y - (i % 4 === 1 ? w : 0), width: w, height: w, class: 'sg-line', fill: 'none' }));
  });
  b2.appendChild(el('path', { d, class: 'sg-stroke-accent' }));

  // tríada orbital alrededor del núcleo secundario
  poly(cx2, cy2, 140, 3, Math.PI / 2).forEach(([px, py]) => {
    b2.appendChild(el('circle', { cx: px, cy: py, r: 22, class: 'sg-stroke' }));
    b2.appendChild(el('circle', { cx: px, cy: py, r: 5, class: 'sg-node' }));
  });
})();
