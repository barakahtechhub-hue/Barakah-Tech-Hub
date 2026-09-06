/* Fondo hero 3D — composición "geometría sagrada" de Barakah Tech Hub en WebGL.
   Esferas, poliedros wireframe, anillos orbitales y eje de partículas,
   con parallax sutil al mouse y rotación casi imperceptible. */
(function () {
  'use strict';

  const host = document.getElementById('cosmos3d');
  if (!host) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const THREE_URL = 'https://unpkg.com/three@0.160.0/build/three.min.js';
  const s = document.createElement('script');
  s.src = THREE_URL;
  s.onload = init;
  s.onerror = () => { host.style.display = 'none'; }; // fallback: queda el SVG
  document.head.appendChild(s);

  function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    /* Paleta */
    const INK = 0x1a2332;
    const dotsMat = (op) => new THREE.PointsMaterial({ color: INK, size: 0.09, transparent: true, opacity: op });
    const ACCENT = 0x40e0d0;
    const DIM = 0x5a6b82;
    const lineMat = (color, opacity) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    const wireMat = (color, opacity) => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });

    const orbit = new THREE.Group();           // anillos orbitales giratorios
    const floaters = [];                        // objetos con flotación individual
    const rings = [];
    const waveGroups = [];
    let mandala = null, well = null;

    function addRing(radius, tiltX, tiltZ, color, opacity, speed) {
      const pts = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const ring = new THREE.Line(geo, lineMat(color, opacity));
      ring.rotation.set(tiltX, 0, tiltZ);
      ring.userData.speed = speed;
      orbit.add(ring); rings.push(ring);
      return ring;
    }

    function addSphere(radius, x, y, z, opts = {}) {
      const grp = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: opts.color || INK, transparent: true, opacity: opts.core ?? 0.9 });
      grp.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 48), mat));
      if (opts.halo) {
        grp.add(new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.06, 32, 32),
          wireMat(opts.haloColor || DIM, 0.14)
        ));
      }
      grp.position.set(x, y, z);
      grp.userData = { baseY: y, phase: Math.random() * Math.PI * 2, amp: opts.amp ?? 0.12, speed: opts.speed ?? 0.5 };
      root.add(grp); floaters.push(grp);
      return grp;
    }

    function addPolyhedron(kind, radius, x, y, z, opts = {}) {
      const geo = kind === 'octa'
        ? new THREE.OctahedronGeometry(radius, 0)
        : new THREE.TetrahedronGeometry(radius, 0);
      const grp = new THREE.Group();
      grp.add(new THREE.Mesh(geo, wireMat(opts.color || INK, opts.opacity ?? 0.5)));
      // vértices como nodos
      const pos = geo.getAttribute('position');
      const seen = new Set(); const dots = [];
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        const k = v.toArray().map(n => n.toFixed(2)).join(',');
        if (!seen.has(k)) { seen.add(k); dots.push(v); }
      }
      const dotGeo = new THREE.BufferGeometry().setFromPoints(dots);
      grp.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: ACCENT, size: 0.09, transparent: true, opacity: 0.8 })));
      grp.position.set(x, y, z);
      grp.rotation.set(opts.rx ?? 0.4, opts.ry ?? 0.4, 0);
      grp.userData = { baseY: y, phase: Math.random() * Math.PI * 2, amp: opts.amp ?? 0.15, speed: opts.speed ?? 0.4, spin: opts.spin ?? 0.15 };
      root.add(grp); floaters.push(grp);
      return grp;
    }

    /* --- Composición "universo matemático" (cámara z=14) --- */

    // Polvo 3D
    const dustN = 400;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      dustPos[i*3]   = (Math.random() - 0.5) * 26;
      dustPos[i*3+1] = (Math.random() - 0.5) * 16;
      dustPos[i*3+2] = (Math.random() - 0.5) * 10 - 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: INK, size: 0.06, transparent: true, opacity: 0.22 }));
    scene.add(dust);

    // Eje central con nodos
    {
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 9, -1), new THREE.Vector3(0, -9, -1)
      ]);
      root.add(new THREE.Line(axisGeo, lineMat(INK, 0.35)));
      const nodePts = [];
      for (let y = -8; y <= 8; y += 0.8) nodePts.push(new THREE.Vector3(0, y, -0.9));
      root.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(nodePts), dotsMat(0.7)));
    }

    // Sistema orbital superior: 9 anillos inclinados alrededor de la esfera
    const topSystem = new THREE.Group();
    topSystem.position.set(0, 5.6, -2);
    root.add(topSystem);
    const topRings = [];
    for (let i = 0; i < 9; i++) {
      topRings.push(addRing(1.4 + i * 0.42, i * 0.14, i * 0.14 * 0.6, INK, 0.22, (i % 2 ? 1 : -1) * (0.03 + i * 0.004)));
    }

    // Esferas matemáticas (meridianos + latitudes + núcleo)
    function mathSphere(radius, x, y, z, amp, speed) {
      const grp = new THREE.Group();
      grp.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 48), wireMat(INK, 0.10)));
      for (let i = -4; i <= 4; i++) {
        const pts = [];
        const factor = Math.cos(i * Math.PI / 8);
        for (let j = 0; j <= 64; j++) {
          const a = (j / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(
            Math.cos(a) * radius * factor,
            Math.sin(a) * radius,
            Math.sin(a) * radius * Math.abs(factor) * 0.15
          ));
        }
        grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(INK, 0.16)));
      }
      for (let i = -3; i <= 3; i++) {
        const yy = i * radius * 0.22;
        const w = Math.sqrt(Math.max(0, radius*radius - yy*yy));
        const pts = [];
        for (let j = 0; j <= 64; j++) {
          const a = (j / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * w, yy, Math.sin(a) * w));
        }
        grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(INK, 0.14)));
      }
      grp.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 0.06, 16, 16), new THREE.MeshBasicMaterial({ color: INK })));
      grp.position.set(x, y, z);
      grp.userData = { baseY: y, phase: Math.random() * 6.28, amp, speed, spin: 0.1 };
      root.add(grp); floaters.push(grp);
      return grp;
    }

    mathSphere(1.0, 0, 5.6, -1.2, 0.08, 0.4);
    mathSphere(0.45, 0, 1.9, -0.5, 0.10, 0.6);
    mathSphere(0.55, 0, -2.4, -0.5, 0.12, 0.5);
    mathSphere(1.1, 0, -3.6, -1, 0.10, 0.35);

    // Poliedros laterales con nodos en vértices
    addPolyhedron('octa', 0.95, -4.6, 2.6, 0.5, { color: INK, opacity: 0.30, spin: 0.18, amp: 0.14, speed: 0.4 });
    addPolyhedron('octa', 0.95,  4.6, 2.6, 0.5, { color: INK, opacity: 0.30, spin: -0.18, amp: 0.14, speed: 0.4 });
    addPolyhedron('ico',  0.85, -4.2, -2.4, 0.4, { color: INK, opacity: 0.30, spin: -0.14, amp: 0.14, speed: 0.4 });
    addPolyhedron('ico',  0.85,  4.2, -2.4, 0.4, { color: INK, opacity: 0.30, spin: 0.14, amp: 0.14, speed: 0.4 });

    // Mandala central (círculos concéntricos + radios + estrella)
    mandala = new THREE.Group();
    mandala.position.set(0, -0.2, -1.5);
    root.add(mandala);
    for (let i = 1; i <= 7; i++) {
      const r = 3.6 * i / 7;
      const pts = [];
      for (let j = 0; j <= 96; j++) {
        const a = (j / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      mandala.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(INK, 0.13)));
    }
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI * 2 / 12;
      mandala.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0),
        new THREE.Vector3(Math.cos(a) * 2.34, Math.sin(a) * 2.34, 0)
      ]), lineMat(INK, 0.2)));
    }
    for (let ring = 1; ring <= 4; ring++) {
      const r = 3.6 * ring / 4;
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      for (let i = 0; i < 6; i++) {
        mandala.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pts[i], pts[(i + 2) % 6]]), lineMat(INK, 0.18)));
      }
    }

    // Ondas laterales sinusoidales con profundidad Z
    function waveField(side) {
      const group = new THREE.Group();
      for (let i = 0; i < 14; i++) {
        const pts = [];
        for (let j = 0; j <= 60; j++) {
          const t = j / 60;
          const amplitude = 1.4 + t * 1.6;
          const wave = Math.sin(t * Math.PI * 3 + i * 0.25) * amplitude;
          pts.push(new THREE.Vector3(side * (0.9 + t * 9), (t - 0.5) * 7, wave * 0.4));
        }
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(INK, 0.09)));
      }
      root.add(group);
      waveGroups.push(group);
      return group;
    }
    waveField(-1);
    waveField(1);

    // Pozo gravitacional 3D (anillos cónicos descendentes + esfera oscura)
    well = new THREE.Group();
    well.position.set(0, -5.8, -1);
    root.add(well);
    for (let i = 0; i < 12; i++) {
      const r = 0.5 + i * 0.5;
      const depth = -i * 0.18;
      const pts = [];
      for (let j = 0; j <= 96; j++) {
        const a = (j / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, depth, Math.sin(a) * r));
      }
      well.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(INK, 0.2)));
    }
    well.add(new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), new THREE.MeshBasicMaterial({ color: INK })));

    /* --- Parallax con el mouse (suavizado exponencial) --- */
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    /* --- Resize --- */
    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // en pantallas estrechas alejamos la cámara para que quepa todo
      camera.position.z = w < 768 ? 19 : 14;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    /* --- Loop --- */
    const clock = new THREE.Clock();
    let visible = true;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

    renderer.setAnimationLoop(() => {
      if (!visible) return;
      const t = clock.getElapsedTime();

      // parallax suavizado
      cur.x += (target.x - cur.x) * 0.03;
      cur.y += (target.y - cur.y) * 0.03;
      camera.position.x = cur.x * 1.6;
      camera.position.y = -cur.y * 1.0;
      camera.lookAt(0, 0, 0);

      // rotación global casi imperceptible
      root.rotation.y = Math.sin(t * 0.05) * 0.08 + cur.x * 0.06;
      root.rotation.x = cur.y * 0.04;

      // anillos en deriva lenta
      rings.forEach(r => { r.rotation.y = t * r.userData.speed; });

      // anillos orbitales superiores girando en direcciones alternadas
      topRings.forEach(r => { r.rotation.y = t * r.userData.speed; });

      // flotación individual
      floaters.forEach(o => {
        const u = o.userData;
        o.position.y = u.baseY + Math.sin(t * u.speed + u.phase) * u.amp;
        if (u.spin) { o.rotation.y += u.spin * 0.016; o.rotation.x += u.spin * 0.006; }
      });

      // mandala respirando
      if (mandala) {
        mandala.rotation.z = t * 0.02;
        mandala.scale.setScalar(1 + Math.sin(t * 0.4) * 0.015);
      }

      // ondas laterales ondulando en el tiempo
      waveGroups.forEach(g => {
        g.children.forEach((line, i) => {
          const p = line.geometry.getAttribute('position');
          for (let j = 0; j < p.count; j++) {
            const tt = j / (p.count - 1);
            p.setZ(j, Math.sin(tt * Math.PI * 3 + i * 0.25 + t * 0.6) * (1.4 + tt * 1.6) * 0.4);
          }
          p.needsUpdate = true;
        });
      });

      // pozo gravitacional girando lentamente
      if (well) well.rotation.y = t * 0.1;

      dust.rotation.y = t * 0.008;

      renderer.render(scene, camera);
    });
  }
})();
