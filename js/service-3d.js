// Fondo 3D de servicio: poliedros wireframe + esfera, parallax con mouse, animación sutil
(function () {
  var container = document.getElementById('cosmos3d');
  if (!container || !window.THREE) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  var group = new THREE.Group();
  scene.add(group);

  var TURQUESA = 0x40e0d0;
  // Figuras empujadas a los bordes: el centro queda libre para el nombre de la empresa
  var shapes = [
    { geo: new THREE.IcosahedronGeometry(2.4, 0), pos: [-7.5, 3.2, -2], rot: 0.0012 },
    { geo: new THREE.OctahedronGeometry(1.6, 0),  pos: [7.8, -3.2, -1], rot: 0.0018 },
    { geo: new THREE.TetrahedronGeometry(1.2, 0), pos: [3.5, 4.6, -4],  rot: 0.0022 },
    { geo: new THREE.IcosahedronGeometry(1.0, 0), pos: [-4.2, -4.2, 0], rot: 0.0028 },
    { geo: new THREE.DodecahedronGeometry(1.4, 0), pos: [9.5, 3.6, -6], rot: 0.0010 }
  ];
  var meshes = shapes.map(function (s) {
    var mat = new THREE.MeshBasicMaterial({ color: TURQUESA, wireframe: true, transparent: true, opacity: 0.35 });
    var m = new THREE.Mesh(s.geo, mat);
    m.position.set(s.pos[0], s.pos[1], s.pos[2]);
    m.userData.rot = s.rot;
    group.add(m);
    return m;
  });

  // Esfera de puntos, desplazada para no tapar el centro
  var spherePts = new THREE.Points(
    new THREE.SphereGeometry(3.2, 40, 28),
    new THREE.PointsMaterial({ color: TURQUESA, size: 0.05, transparent: true, opacity: 0.4 })
  );
  spherePts.position.set(-8.5, -3.5, -4);
  group.add(spherePts);

  // Glow sutil detrás, lejos del centro
  var glow = new THREE.Mesh(
    new THREE.SphereGeometry(4.5, 32, 24),
    new THREE.MeshBasicMaterial({ color: 0x1a5f66, transparent: true, opacity: 0.08 })
  );
  glow.position.set(8.5, 4, -5);
  group.add(glow);

  var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener('mousemove', function (e) {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function animate(t) {
    requestAnimationFrame(animate);
    cur.x += (target.x - cur.x) * 0.03;
    cur.y += (target.y - cur.y) * 0.03;
    group.rotation.y = cur.x * 0.12;
    group.rotation.x = cur.y * 0.08;
    camera.position.x = cur.x * 0.6;
    camera.position.y = -cur.y * 0.4;
    camera.lookAt(scene.position);

    meshes.forEach(function (m, i) {
      m.rotation.x += m.userData.rot;
      m.rotation.y += m.userData.rot * 0.8;
      m.position.y += Math.sin(t * 0.0004 + i) * 0.0012;
    });
    spherePts.rotation.y += 0.0006;
    spherePts.position.y = -3.5 + Math.sin(t * 0.0004 + 2) * 0.3;
    glow.position.y = 4 + Math.sin(t * 0.0005 + 4) * 0.2;
    glow.scale.setScalar(1 + Math.sin(t * 0.0005) * 0.02);

    renderer.render(scene, camera);
  }
  animate(0);

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
