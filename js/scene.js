/* ============================================================
   BelajarSeru! 3D — scene.js
   Scene Three.js: maskot Pipo (burung hantu low-poly), pulau
   melayang, 4 tema dunia. Interaktif: drag untuk memutar.
   Fallback aman jika WebGL tidak tersedia.
   ============================================================ */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});

  /* ---------- util ---------- */
  const hasThree = () => typeof window.THREE !== 'undefined';
  const rnd = (a, b) => a + Math.random() * (b - a);

  function makeRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    return renderer;
  }

  /* ---------- bahan dasar ---------- */
  const M = {
    ink: () => new THREE.MeshLambertMaterial({ color: 0x2a2140 }),
    flat: (c) => new THREE.MeshLambertMaterial({ color: c }),
    flatD: (c) => new THREE.MeshLambertMaterial({ color: c }),
  };

  /* ---------- MASKOT: Pipo si Burung Hantu ---------- */
  function makeOwl(bodyColor = 0xffc53d, bellyColor = 0xfff3d0) {
    const g = new THREE.Group();
    const mat = M.flat(bodyColor), belly = M.flat(bellyColor), ink = M.ink();
    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), mat);
    body.scale.set(1, 1.18, 0.92); g.add(body);
    const tummy = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 14), belly);
    tummy.position.set(0, -0.22, 0.55); tummy.scale.set(1, 1.15, 0.55); g.add(tummy);
    // sayap
    [-1, 1].forEach((s) => {
      const wing = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 12), mat);
      wing.position.set(0.92 * s, -0.05, 0.1); wing.scale.set(0.42, 0.95, 0.7);
      wing.rotation.z = 0.28 * s; wing.name = 'wing'; g.add(wing);
    });
    // mata
    [-1, 1].forEach((s) => {
      const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14), M.flat(0xffffff));
      eyeW.position.set(0.36 * s, 0.42, 0.74); g.add(eyeW);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), ink);
      pupil.position.set(0.36 * s, 0.44, 0.99); pupil.name = 'pupil'; g.add(pupil);
      const spark = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), M.flat(0xffffff));
      spark.position.set(0.36 * s + 0.06, 0.5, 1.1); g.add(spark);
    });
    // paruh + jambul + kaki
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.34, 4), M.flat(0xff8c42));
    beak.position.set(0, 0.22, 1.02); beak.rotation.x = Math.PI / 2; g.add(beak);
    [-1, 1].forEach((s) => {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.36, 6), mat);
      tuft.position.set(0.3 * s, 1.18, 0.15); tuft.rotation.z = -0.5 * s; g.add(tuft);
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), M.flat(0xff8c42));
      foot.position.set(0.34 * s, -1.12, 0.25); foot.scale.set(1, 0.5, 1.3); g.add(foot);
    });
    return g;
  }

  /* ---------- properti dekorasi ---------- */
  function makeTree(trunkC, leafC, s = 1) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * s, 0.13 * s, 0.6 * s, 7), M.flat(trunkC));
    trunk.position.y = 0.3 * s; g.add(trunk);
    const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.5 * s, 0.9 * s, 8), M.flat(leafC));
    c1.position.y = 0.95 * s; g.add(c1);
    const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.36 * s, 0.7 * s, 8), M.flat(leafC));
    c2.position.y = 1.4 * s; g.add(c2);
    return g;
  }
  function makeCloud(s = 1) {
    const g = new THREE.Group(); const m = M.flat(0xffffff);
    [[0, 0, 0, 0.5], [0.45, 0.08, 0.1, 0.36], [-0.42, 0.05, -0.05, 0.32], [0.1, 0.3, 0, 0.34]].forEach((p) => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(p[3] * s, 12, 10), m);
      b.position.set(p[0] * s, p[1] * s, p[2] * s); g.add(b);
    });
    return g;
  }
  function makeStar() {
    const geo = new THREE.OctahedronGeometry(0.16);
    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffe066 }));
  }
  function makeLetterBox(color) {
    const g = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), M.flat(color));
    box.rotation.set(rnd(0, 1), rnd(0, 1), 0); g.add(box);
    const e = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.66, 0.66, 0.66)),
      new THREE.LineBasicMaterial({ color: 0x2a2140 })
    );
    e.rotation.copy(box.rotation); g.add(e);
    return g;
  }
  function makeMolecule(colorA, colorB) {
    const g = new THREE.Group();
    const a = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), M.flat(colorA)); a.position.set(-0.28, 0, 0);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), M.flat(colorB)); b.position.set(0.28, 0, 0);
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), M.flat(0xffffff)); c.position.set(0, 0.42, 0.1);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.56, 8), M.ink());
    const stick2 = stick.clone(); stick2.rotation.z = 1.1; stick2.position.set(0.05, 0.2, 0.05);
    g.add(a, b, c, stick, stick2); return g;
  }
  function makeRocket() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.9, 12), M.flat(0xffffff));
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 12), M.flat(0xff6b5e)); nose.position.y = 0.65;
    const fin1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 4), M.flat(0xff6b5e));
    fin1.position.set(0.24, -0.4, 0); fin1.rotation.z = -Math.PI / 2;
    const fin2 = fin1.clone(); fin2.position.x = -0.24; fin2.rotation.z = Math.PI / 2;
    const win = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), M.flat(0x38a9f5)); win.position.set(0, 0.12, 0.2);
    g.add(body, nose, fin1, fin2, win); return g;
  }

  /* ---------- dasar scene ---------- */
  function baseScene(bgTop, bgBottom) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgTop);
    scene.fog = new THREE.Fog(bgBottom, 14, 34);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const sun = new THREE.DirectionalLight(0xfff2d8, 0.95);
    sun.position.set(4, 8, 6); scene.add(sun);
    const fill = new THREE.DirectionalLight(0xd6ebff, 0.4);
    fill.position.set(-5, 3, -4); scene.add(fill);
    return scene;
  }

  function addIsland(scene, y = -1.6, r = 4) {
    const isl = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.94, 0.55, 10), M.flat(0x7ed957));
    const under = new THREE.Mesh(new THREE.ConeGeometry(r * 0.94, r * 1.15, 10), M.flat(0x9a6b41));
    under.position.y = -0.85; under.rotation.x = Math.PI;
    isl.add(top, under); isl.position.y = y; scene.add(isl);
    return isl;
  }

  /* ---------- kontrol drag ---------- */
  function attachDrag(canvas, state) {
    let dragging = false, lastX = 0, lastY = 0, vel = 0;
    const down = (x, y) => { dragging = true; lastX = x; lastY = y; };
    const move = (x, y) => {
      if (!dragging) return;
      const dx = x - lastX, dy = y - lastY; lastX = x; lastY = y;
      state.rotY += dx * 0.006; vel = dx * 0.006;
      state.rotX = Math.max(-0.5, Math.min(0.7, state.rotX + dy * 0.003));
    };
    const up = () => { dragging = false; };
    canvas.addEventListener('pointerdown', (e) => { down(e.clientX, e.clientY); canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    state.inertia = () => { if (!dragging && Math.abs(vel) > 0.0004) { state.rotY += vel; vel *= 0.94; } };
  }

  /* ---------- MANAGER ---------- */
  const scenes = [];
  function register(canvas, renderer, scene, camera, animateFn) {
    const st = { rotX: 0.12, rotY: -0.5, t: 0, alive: true, dragging: false };
    attachDrag(canvas, st);
    const entry = { st, renderer, scene, camera, animateFn, canvas };
    scenes.push(entry);
    function resize() {
      if (!st.alive) return;
      const w = canvas.clientWidth || 300, h = canvas.clientHeight || 200;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    entry.cleanup = () => { st.alive = false; ro.disconnect(); window.removeEventListener('resize', resize); };
    return entry;
  }

  function tick() {
    for (let i = scenes.length - 1; i >= 0; i--) {
      const s = scenes[i];
      if (!s.st.alive) { s.cleanup(); s.renderer.dispose(); scenes.splice(i, 1); continue; }
      if (document.hidden) continue;
      s.st.t += 0.016;
      if (s.st.inertia) s.st.inertia();
      s.animateFn(s.st, s);
      s.renderer.render(s.scene, s.camera);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ============================================================
     SCENE HERO (beranda): pulau + Pipo + 4 balon dunia
     ============================================================ */
  BS.buildHeroScene = function (canvas) {
    if (!hasThree() || !canvas) return false;
    try {
      const scene = baseScene(0x8ed8ff, 0xdff8e8);
      const camera = new THREE.PerspectiveCamera(46, 1.6, 0.1, 100);
      camera.position.set(0, 1.4, 11);
      const island = addIsland(scene, -2.1, 4.2);
      // pohon & bunga di pulau
      [[-2.6, -0.8], [2.4, -1.4], [0.4, -3.2]].forEach((p) => {
        const t = makeTree(0x9a6b41, 0x2ec77e, rnd(0.9, 1.3));
        t.position.set(p[0], -1.8, p[1]); island.add(t);
      });
      // Pipo di atas pulau
      const owl = makeOwl(0xffc53d, 0xfff3d0);
      owl.scale.setScalar(0.85); owl.position.set(0, -0.7, 0.6); island.add(owl);
      // 4 balon dunia (ring + isi)
      const worldDefs = [
        { c: 0xff8fab, y: 2.6, x: -3.6, obj: () => makeLetterBox(0xff8fab) },
        { c: 0x2ec77e, y: 3.1, x: -1.2, obj: () => makeTree(0x9a6b41, 0x2ec77e, 0.8) },
        { c: 0x38a9f5, y: 2.9, x: 1.4, obj: () => makeMolecule(0x38a9f5, 0x7fe3c3) },
        { c: 0x9b5cf6, y: 3.3, x: 3.6, obj: () => makeRocket() },
      ];
      const balloons = [];
      worldDefs.forEach((d) => {
        const grp = new THREE.Group();
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.1, 10, 26), M.flat(d.c));
        const inner = d.obj(); inner.position.z = 0.15;
        grp.add(ring, inner); grp.position.set(d.x, d.y, 0);
        scene.add(grp); balloons.push(grp);
      });
      // awan + bintang
      const clouds = [], stars = [];
      for (let i = 0; i < 4; i++) {
        const c = makeCloud(rnd(0.9, 1.6));
        c.position.set(rnd(-6, 6), rnd(1.5, 4), rnd(-6, -2));
        scene.add(c); clouds.push(c);
      }
      for (let i = 0; i < 14; i++) {
        const st = makeStar(); st.position.set(rnd(-8, 8), rnd(0, 5), rnd(-5, -1));
        scene.add(st); stars.push(st);
      }
      const entry = register(canvas, makeRenderer(canvas), scene, camera, (st, s) => {
        st.rotY += 0.0012;
        s.camera.position.x = Math.sin(st.rotY) * 11;
        s.camera.position.z = Math.cos(st.rotY) * 11;
        s.camera.position.y = 1.4 + st.rotX * 3;
        s.camera.lookAt(0, 0.4, 0);
        owl.position.y = -0.7 + Math.sin(st.t * 2) * 0.1;
        owl.rotation.y = Math.sin(st.t * 0.8) * 0.3;
        balloons.forEach((b, i) => { b.position.y += Math.sin(st.t * 1.6 + i * 1.7) * 0.0035; b.rotation.y += 0.004; });
        clouds.forEach((c, i) => { c.position.x += 0.0022 + i * 0.0006; if (c.position.x > 8) c.position.x = -8; });
        stars.forEach((st2, i) => { st2.rotation.y += 0.02; st2.position.y += Math.sin(st.t * 2 + i) * 0.002; });
      });
      return true;
    } catch (e) { console.warn('hero scene fail', e); return false; }
  };

  /* ============================================================
     SCENE DUNIA: tema per jenjang
     ============================================================ */
  const THEMES = {
    tk: { bg: 0xffe3ee, fog: 0xfff0f5 },
    sd: { bg: 0xcdf3dd, fog: 0xeafbf2 },
    smp: { bg: 0xcfeaff, fog: 0xe8f5ff },
    sma: { bg: 0x241d47, fog: 0x241d47 },
  };

  BS.buildWorldScene = function (canvas, world) {
    if (!hasThree() || !canvas) return false;
    const theme = THEMES[world] || THEMES.sd;
    try {
      const scene = baseScene(theme.bg, theme.fog);
      if (world === 'sma') { scene.background = new THREE.Color(0x241d47); scene.fog = new THREE.Fog(0x241d47, 12, 30); }
      const camera = new THREE.PerspectiveCamera(48, 1.8, 0.1, 100);
      camera.position.set(0, 0.8, 9.5);
      const props = [];
      const isSpace = world === 'sma';

      if (world === 'tk') {
        // balon warna + balok huruf + Pipo kecil
        const colors = [0xff6b5e, 0x38a9f5, 0x2ec77e, 0xffc53d, 0xff8fab, 0x9b5cf6];
        for (let i = 0; i < 6; i++) {
          const grp = new THREE.Group();
          const bal = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 14), M.flat(colors[i]));
          bal.scale.y = 1.2;
          const str = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.1, 6), M.ink());
          str.position.y = -0.85;
          grp.add(bal, str); grp.position.set(rnd(-4.5, 4.5), rnd(-0.5, 2.4), rnd(-2, 1));
          scene.add(grp); props.push(grp);
        }
        for (let i = 0; i < 4; i++) { const b = makeLetterBox(colors[i]); b.position.set(rnd(-4, 4), rnd(-2, 0.5), rnd(-1, 1.5)); scene.add(b); props.push(b); }
        const owl = makeOwl(0xff8fab); owl.scale.setScalar(0.6); owl.position.set(0, 0.2, 2.5); scene.add(owl); props.push(owl);
      } else if (world === 'sd') {
        // hutan: pulau + pohon + koin emas
        addIsland(scene, -2.4, 4);
        for (let i = 0; i < 5; i++) { const t = makeTree(0x9a6b41, 0x2ec77e, rnd(0.8, 1.2)); t.position.set(rnd(-3.5, 3.5), -2.1, rnd(-3, 1)); scene.add(t); }
        for (let i = 0; i < 7; i++) {
          const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 18), M.flat(0xffc53d));
          coin.rotation.x = Math.PI / 2; coin.position.set(rnd(-4.5, 4.5), rnd(-1, 2.6), rnd(-2, 1.5));
          scene.add(coin); props.push(coin);
        }
        const owl = makeOwl(0x2ec77e); owl.scale.setScalar(0.6); owl.position.set(1.8, 0.2, 2.5); scene.add(owl); props.push(owl);
      } else if (world === 'smp') {
        // lab samudra: molekul + gelombang + bola labu
        for (let i = 0; i < 5; i++) { const m = makeMolecule(0x38a9f5, 0xff6b5e); m.position.set(rnd(-4.5, 4.5), rnd(-1, 2.5), rnd(-2, 1)); m.scale.setScalar(rnd(0.8, 1.3)); scene.add(m); props.push(m); }
        const flask = new THREE.Group();
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 14), new THREE.MeshLambertMaterial({ color: 0x7fe3c3, transparent: true, opacity: 0.85 }));
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 10), new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
        neck.position.y = 0.65; flask.add(bulb, neck); flask.position.set(3.4, -0.4, 2);
        scene.add(flask); props.push(flask);
        for (let i = 0; i < 3; i++) {
          const wave = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.09, 8, 60), M.flat(0x38a9f5));
          wave.rotation.x = Math.PI / 2.15; wave.position.y = -2 + i * 0.45; scene.add(wave); props.push(wave);
        }
        const owl = makeOwl(0x38a9f5); owl.scale.setScalar(0.6); owl.position.set(-3.4, 0.2, 2.5); scene.add(owl); props.push(owl);
      } else {
        // angkasa: bintang, planet, roket, Pipo astronot
        for (let i = 0; i < 60; i++) {
          const st = new THREE.Mesh(new THREE.SphereGeometry(rnd(0.02, 0.055), 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
          st.position.set(rnd(-9, 9), rnd(-4, 5), rnd(-9, 2)); scene.add(st); props.push(st);
        }
        const planet = new THREE.Group();
        const ball = new THREE.Mesh(new THREE.SphereGeometry(1.15, 26, 20), M.flat(0x9b5cf6));
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.12, 10, 40), M.flat(0xffc53d));
        ring.rotation.x = Math.PI / 2.4;
        planet.add(ball, ring); planet.position.set(-3.6, 0.8, -2);
        scene.add(planet); props.push(planet);
        const moon = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), M.flat(0xd8d3ec));
        moon.position.set(4.4, 2.2, -3); scene.add(moon); props.push(moon);
        const rocket = makeRocket(); rocket.scale.setScalar(1.4); rocket.position.set(3.4, -0.4, 1.5); rocket.rotation.z = 0.3;
        scene.add(rocket); props.push(rocket);
        const owl = makeOwl(0xb98cff, 0xf1e9ff); owl.scale.setScalar(0.62); owl.position.set(-1.2, -0.6, 2.6); scene.add(owl); props.push(owl);
      }

      const entry = register(canvas, makeRenderer(canvas), scene, camera, (st, s) => {
        st.rotY += 0.0016;
        s.camera.position.x = Math.sin(st.rotY) * 9.5;
        s.camera.position.z = Math.cos(st.rotY) * 9.5;
        s.camera.position.y = 0.8 + st.rotX * 2.5;
        s.camera.lookAt(0, 0, 0);
        props.forEach((p, i) => {
          p.rotation.y += 0.006 + (i % 3) * 0.002;
          p.position.y += Math.sin(st.t * 1.5 + i * 2.1) * 0.0022;
        });
      });
      return true;
    } catch (e) { console.warn('world scene fail', e); return false; }
  };

  /* ---------- doodle latar DOM ---------- */
  BS.initDoodles = function () {
    const wrap = document.getElementById('bg-doodles');
    if (!wrap || wrap.childElementCount) return;
    const set = ['✏️', '📚', '✖️', '🧮', '🎨', '🔤', '🚀', '🪐', '🔢', '🔬', '⭐', '🎈', '🧩', '💡', '🎵', '📎'];
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('span');
      el.className = 'doodle'; el.textContent = set[i % set.length];
      el.style.left = rnd(2, 94) + '%'; el.style.top = rnd(4, 92) + '%';
      el.style.animationDelay = rnd(0, 6) + 's';
      el.style.animationDuration = rnd(6, 11) + 's';
      el.style.fontSize = rnd(18, 34) + 'px';
      wrap.appendChild(el);
    }
  };
})();
