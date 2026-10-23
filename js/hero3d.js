/* =========================================================
   ẢNH BÌA 3D – lót chuột + bàn phím (Three.js)
   Script thường (không phải module) để chạy được cả khi mở file trực tiếp (file://):
   Three.js nạp bằng import() động qua importmap trong index.html,
   ảnh 4 mặt nằm trong js/hero3d-textures.js (window.LD_TEX).
   ========================================================= */
(async function () {
const THREE = await import('three');
const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
const { TEX_PAD_FRONT, TEX_PAD_BACK, TEX_KB_TOP, TEX_KB_BOTTOM } = window.LD_TEX || {};
if (!TEX_PAD_FRONT) return;
/* Ảnh bìa 3D: lót chuột vải 90x40cm (trên) + bàn phím cơ 108 phím (dưới), dựng đứng, tự xoay.
   Rê chuột vào vật thể nào thì vật thể đó quay về góc trưng bày và hiện chú thích của nó.
   Các mặt dùng ảnh thật của sản phẩm (đã nắn phối cảnh, làm sạch), phần khối dựng bằng code. */


const art = document.querySelector('.hero-art');
const cv = art && art.querySelector('.h3d-canvas');
// chỉ khởi động khi khung ảnh bìa đang hiển thị (trên điện thoại khung này bị ẩn)
if (art && cv && window.WebGLRenderingContext) {
  const shown = () => getComputedStyle(art).display !== 'none';
  if (shown()) start();
  else { const onR = () => { if (shown()) { window.removeEventListener('resize', onR); start(); } }; window.addEventListener('resize', onR); }
}

function start() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return; }   // không có WebGL -> giữ ảnh ghép cũ
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.7;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
  camera.position.set(0, 0.95, 2.9);
  camera.lookAt(0, 0.43, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(0.25, 2.8, 1.0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -0.8, right: 0.8, top: 0.8, bottom: -0.8, near: 0.5, far: 5 });
  key.shadow.radius = 8;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9ff0cb, 0.9);
  rim.position.set(-1.2, 0.6, -1.4);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.22 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- đế trưng bày tròn hai tầng, viền đèn xanh ---------- */
  const PED_H = 0.048;
  const pedMat = new THREE.MeshStandardMaterial({ color: 0xa9b8b0, roughness: .45, metalness: .05 });
  const pedTopMat = new THREE.MeshStandardMaterial({ color: 0xcfd9d4, roughness: .5, metalness: 0 });
  const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.58, 0.026, 96), pedMat);
  pedBase.position.y = 0.013;
  const pedTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.515, PED_H - 0.026, 96), pedTopMat);
  pedTop.position.y = 0.026 + (PED_H - 0.026) / 2;
  const pedGlow = new THREE.Mesh(new THREE.TorusGeometry(0.538, 0.0032, 8, 160), new THREE.MeshBasicMaterial({ color: 0x12b277 }));
  pedGlow.rotation.x = -Math.PI / 2;
  pedGlow.position.y = 0.0262;
  [pedBase, pedTop].forEach(m => { m.castShadow = true; m.receiveShadow = true; });
  scene.add(pedBase, pedTop, pedGlow);

  const loader = new THREE.TextureLoader();
  const load = src => new Promise(res => loader.load(src, t => {
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); res(t);
  }, undefined, () => res(null)));

  function roundedRect(L, W, r) {
    const s = new THREE.Shape(), a = L / 2, b = W / 2;
    s.moveTo(-a + r, -b); s.lineTo(a - r, -b); s.quadraticCurveTo(a, -b, a, -b + r);
    s.lineTo(a, b - r); s.quadraticCurveTo(a, b, a - r, b); s.lineTo(-a + r, b);
    s.quadraticCurveTo(-a, b, -a, b - r); s.lineTo(-a, -b + r); s.quadraticCurveTo(-a, -b, -a + r, -b);
    return s;
  }
  // mặt phẳng bo góc, UV trải đúng khổ thật; back=true: mặt sau (nhìn khi đã quay 180°)
  function face(L, W, r, z, back) {
    const g = new THREE.ShapeGeometry(roundedRect(L, W, r), 12), p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const u = (p.getX(i) + L / 2) / L, v = (p.getY(i) + W / 2) / W;
      uv.setXY(i, back ? 1 - u : u, v);
    }
    if (back) g.rotateY(Math.PI);
    g.translate(0, 0, z);
    return g;
  }

  /* ================= LÓT CHUỘT 90x40cm ================= */
  const L = 0.9, W = 0.4, T = 0.012, CR = 0.022;
  function stitch(n, m) {   // viền chỉ: ống chạy quanh chu vi, bọc kín mép
    const a = L / 2 - CR, b = W / 2 - CR, q = Math.PI / 2, segs = [];
    const line = (x1, y1, x2, y2, nx, ny) => segs.push({ len: Math.hypot(x2 - x1, y2 - y1), at: t => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, nx, ny] });
    const arc = (cx, cy, a0) => segs.push({ len: CR * q, at: t => { const an = a0 + q * t, c = Math.cos(an), s = Math.sin(an); return [cx + CR * c, cy + CR * s, c, s]; } });
    line(-a, -W / 2, a, -W / 2, 0, -1); arc(a, -b, -q); line(L / 2, -b, L / 2, b, 1, 0); arc(a, b, 0);
    line(a, W / 2, -a, W / 2, 0, 1); arc(-a, b, q); line(-L / 2, b, -L / 2, -b, -1, 0); arc(-a, -b, 2 * q);
    const total = segs.reduce((s, g) => s + g.len, 0), loops = Math.round(total / 0.0035);
    const pos = [], uv = [], idx = [];
    for (let i = 0; i < n; i++) {
      let d = total * i / n, si = 0;
      while (d > segs[si].len) { d -= segs[si].len; si++; }
      const [x, y, nx, ny] = segs[si].at(d / segs[si].len);
      for (let j = 0; j < m; j++) {
        const ph = j / m * Math.PI * 2, c = Math.cos(ph) * 0.0032, z = Math.sin(ph) * T * 0.56;
        pos.push(x + nx * c, y + ny * c, z); uv.push(i / n * loops, j / m);
      }
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const i2 = (i + 1) % n, j2 = (j + 1) % m;
      idx.push(i * m + j, i2 * m + j, i * m + j2, i2 * m + j, i2 * m + j2, i * m + j2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return g;
  }
  function stitchTex() {   // mũi chỉ xiên, chỉ đen trên nền xám đậm
    const c = document.createElement('canvas'); c.width = 64; c.height = 32;
    const g = c.getContext('2d');
    g.fillStyle = '#121212'; g.fillRect(0, 0, 64, 32);
    g.strokeStyle = '#4a4a4a'; g.lineWidth = 20; g.lineCap = 'round';
    g.beginPath(); g.moveTo(12, -6); g.lineTo(52, 38); g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  const padFront = new THREE.MeshStandardMaterial({ roughness: .78, metalness: 0 });
  const padBack = new THREE.MeshStandardMaterial({ roughness: .92, metalness: 0 });
  const pad = new THREE.Group();
  [[face(L, W, CR, T / 2, false), padFront], [face(L, W, CR, -T / 2, true), padBack],
   [stitch(1100, 10), new THREE.MeshStandardMaterial({ map: stitchTex(), roughness: .7, metalness: 0 })]]
    .forEach(([g, m]) => { const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; pad.add(mesh); });

  /* ================= BÀN PHÍM 108 PHÍM (44 x 13,2cm, vỏ dày 24mm) =================
     Toạ độ cục bộ khi dựng đứng: X = chiều dài, Y = chiều sâu (+Y = cạnh sau, hàng F),
     Z = độ dày (+Z = mặt phím). Ảnh mặt phím 2048x616 phủ cả mặt trên của vỏ. */
  const KL = 0.44, KW = 0.132, KT = 0.024, KR = 0.006;
  const kbTopMat = new THREE.MeshStandardMaterial({ roughness: .55, metalness: 0 });
  const kbBotMat = new THREE.MeshStandardMaterial({ roughness: .8, metalness: 0 });
  const caseMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: .6, metalness: 0 });
  const capSide = new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: .7, metalness: 0 });
  const kb = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(KL, KW, KR), { depth: KT - 0.002, bevelEnabled: true, bevelSize: 0.001, bevelThickness: 0.001, bevelSegments: 2, curveSegments: 6 }), caseMat);
  body.geometry.translate(0, 0, -KT / 2 + 0.001);
  kb.add(body);
  kb.add(new THREE.Mesh(face(KL, KW, KR, KT / 2 + 0.0004, false), kbTopMat));
  kb.add(new THREE.Mesh(face(KL, KW, KR, -KT / 2 - 0.0004, true), kbBotMat));
  // các hàng keycap dáng Cherry: (v0, v1) = khoảng chiều sâu trên ảnh (0 = cạnh trước), h = độ cao keycap (m)
  const ROWS = [
    { v0: .832, v1: .968, h: .0094 },   // hàng F
    { v0: .640, v1: .790, h: .0094 },   // hàng số
    { v0: .492, v1: .636, h: .0079 },   // Q
    { v0: .346, v1: .490, h: .0076 },   // A (hàng chuẩn, thấp nhất)
    { v0: .200, v1: .344, h: .0086 },   // Z
    { v0: .052, v1: .196, h: .0090 },   // hàng dưới cùng
  ];
  const UX0 = .012, UX1 = .99;   // vùng phím theo chiều dài ảnh
  ROWS.forEach(r => {
    const w = (UX1 - UX0) * KL, d = (r.v1 - r.v0) * KW;
    const g = new THREE.BoxGeometry(w, d, r.h);
    // mặt trên của hàng phím lấy đúng lát ảnh tương ứng
    const uv = g.attributes.uv;
    for (let i = 16; i < 20; i++) {   // nhóm mặt +Z của BoxGeometry
      uv.setXY(i, UX0 + uv.getX(i) * (UX1 - UX0), r.v0 + uv.getY(i) * (r.v1 - r.v0));
    }
    const mats = [capSide, capSide, capSide, capSide, kbTopMat, capSide];
    const m = new THREE.Mesh(g, mats);
    m.position.set((UX0 + UX1 - 1) / 2 * KL, ((r.v0 + r.v1) / 2 - .5) * KW, KT / 2 + r.h / 2);
    kb.add(m);
  });
  kb.traverse(o => { if (o.isMesh) o.castShadow = true; });

  /* ---------- bố cục: bàn phím đứng trên đế tròn, lót chuột ở phía trên ---------- */
  const KS = 1.75;   // phóng bàn phím cho cân với tấm lót
  kb.scale.setScalar(KS);
  kb.position.y = PED_H + KW / 2 * KS + 0.003;      // bàn phím đứng trên đế
  pad.position.y = PED_H + KW * KS + 0.17 + W / 2;  // lót chuột cách bàn phím một khoảng
  scene.add(kb, pad);

  /* ---------- chú thích: điểm neo trên vật thể (toạ độ cục bộ) ---------- */
  const anchors = {
    speed: [pad, new THREE.Vector3(-0.12, 0.06, T / 2)],                     // mặt vải speed
    stitch: [pad, new THREE.Vector3(0.16, W / 2, T * 0.3)],                  // viền chỉ cạnh trên
    rubber: [pad, new THREE.Vector3(L / 2, -W * 0.18, -T * 0.25)],           // đế cao su ở mép
    size: [pad, new THREE.Vector3(-L / 2, -W * 0.05, T / 2)],                   // cạnh trái: kích thước tuỳ chỉnh
    profile: [kb, new THREE.Vector3(KL * .49, (.124 - .5) * KW, KT / 2 + .006)],    // sườn keycap hàng dưới, đầu phải
    pbt: [kb, new THREE.Vector3(-KL * .38, (.564 - .5) * KW, KT / 2 + .0079)],       // mặt keycap phím Q
    keys: [kb, new THREE.Vector3(-KL * .05, (.715 - .5) * KW, KT / 2 + .0094)],      // giữa hàng phím số
    box: [kb, new THREE.Vector3(KL * .25, (.900 - .5) * KW, KT / 2 + .0094)],        // hàng phím F
  };
  const callouts = Object.entries(anchors).map(([k, [obj, p]]) => ({
    k, obj, p, el: art.querySelector(`.h3d-co[data-k="${k}"]`), line: art.querySelector(`.h3d-lines [data-k="${k}"]`)
  }));
  const overlay = art.querySelector('.h3d-callouts');
  const v = new THREE.Vector3();
  function placeCallouts() {
    if (!overlay || !active) return;
    const r = overlay.getBoundingClientRect();
    callouts.forEach(c => {
      if (c.obj !== active.obj || !c.el || !c.line) return;
      v.copy(c.p); c.obj.localToWorld(v); v.project(camera);
      const ax = (v.x + 1) / 2 * r.width, ay = (1 - v.y) / 2 * r.height;
      const b = c.el.getBoundingClientRect();
      const bx = b.left - r.left, by = b.top - r.top;
      // đầu dây xuất phát từ cạnh hộp gần điểm neo nhất
      const sx = Math.max(bx, Math.min(ax, bx + b.width));
      const sy = ay < by ? by : ay > by + b.height ? by + b.height : by + b.height / 2;
      c.line.setAttribute('x1', sx.toFixed(1)); c.line.setAttribute('y1', sy.toFixed(1));
      c.line.setAttribute('x2', ax.toFixed(1)); c.line.setAttribute('y2', ay.toFixed(1));
    });
  }

  /* ---------- xoay: mỗi vật thể tự quay; rê chuột vào vật thể -> quay về góc trưng bày ---------- */
  const items = [
    { id: 'pad', obj: pad, show: -0.55, ang: reduce ? -0.55 : 0.35, speed: 0.5, fade: 1 },
    { id: 'kb', obj: kb, show: -0.42, ang: reduce ? -0.42 : 2.2, speed: 0.5, fade: 1 },
  ];
  // khi xem chú thích của một sản phẩm, sản phẩm còn lại mờ đi để các ô chú thích không bị rối
  items.forEach(it => {
    it.mats = [];
    it.obj.traverse(o => { if (o.isMesh) [].concat(o.material).forEach(m => { if (!it.mats.includes(m)) { m.transparent = true; it.mats.push(m); } }); });
  });
  function applyFade(it) { it.mats.forEach(m => { m.opacity = it.fade; m.depthWrite = it.fade > .99; }); }
  let active = null, settled = false;
  function setActive(it) {
    if (active === it) return;
    active = it; settled = false;
    art.dataset.info = '';
    if (reduce) {
      items.forEach(o => { o.fade = it && it !== o ? .18 : 1; applyFade(o); });
      if (it) { settled = true; art.dataset.info = it.id; }
      draw();
    }
    kick();
  }
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(e) {
    const r = cv.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects([pad, kb], true)[0];
    if (!hit) return null;
    return items.find(it => { let o = hit.object; while (o) { if (o === it.obj) return true; o = o.parent; } return false; });
  }
  art.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { const it = pick(e); if (it) setActive(it); } });
  art.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') setActive(null); });
  let lastType = 'mouse';
  art.addEventListener('pointerdown', e => { lastType = e.pointerType; });
  art.addEventListener('click', e => {   // màn hình cảm ứng: chạm vào vật thể để bật/tắt chú thích
    if (lastType === 'mouse') return;
    const it = pick(e); setActive(it && it !== active ? it : null);
  });
  art.addEventListener('focusin', () => setActive(items[0]));
  art.addEventListener('focusout', () => setActive(null));

  function resize() {
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(() => { resize(); draw(); }).observe(cv);

  const clock = new THREE.Clock();
  let visible = true, raf = 0;
  function step(dt) {
    if (reduce) return;
    items.forEach(it => {
      const f = active && active !== it ? .18 : 1;
      it.fade += (f - it.fade) * Math.min(1, dt * 14); applyFade(it);
      if (it === active) {
        // quay theo đường ngắn nhất về góc trưng bày
        let d = it.show - it.ang; d = Math.atan2(Math.sin(d), Math.cos(d));
        it.ang += d * Math.min(1, dt * 11);   // quay về góc trưng bày nhanh
        if (Math.abs(d) < 0.06 && !settled) { settled = true; art.dataset.info = it.id; }
      } else it.ang += dt * it.speed;   // ~12,5 giây một vòng
    });
  }
  function draw() {
    items.forEach(it => { it.obj.rotation.y = it.ang; });
    renderer.render(scene, camera);
    placeCallouts();
  }
  function loop() {
    raf = 0;
    if (!visible || document.hidden) return;
    step(Math.min(clock.getDelta(), 0.05));
    draw();
    if (!reduce) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) { clock.getDelta(); raf = requestAnimationFrame(loop); } }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(cv);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });

  Promise.all([TEX_PAD_FRONT, TEX_PAD_BACK, TEX_KB_TOP, TEX_KB_BOTTOM].map(load)).then(([pf, pb, kt, kbt]) => {
    if (!pf || !pb || !kt || !kbt) return;   // ảnh lỗi -> giữ ảnh ghép cũ
    padFront.map = pf; padBack.map = pb; kbTopMat.map = kt; kbBotMat.map = kbt;
    [padFront, padBack, kbTopMat, kbBotMat].forEach(m => { m.needsUpdate = true; });
    resize(); draw();
    art.classList.add('is-3d');   // ẩn ảnh ghép dự phòng khi 3D đã chạy
    kick();
  });
}
})();
