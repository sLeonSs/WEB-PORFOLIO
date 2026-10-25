/* Lắc Đầu – Hồ sơ năng lực | JavaScript thuần */
(function () {
  'use strict';
  var doc = document.documentElement;
  document.body.classList.remove('no-js');
  document.body.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Nav: nền khi cuộn + thanh tiến trình ---------- */
  var nav = $('#nav'), progress = $('#progress'), fab = $('.fab');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('solid', y > 30);
    if (fab) fab.classList.toggle('show', y > window.innerHeight * 0.6);
    var max = doc.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    setActive(y);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---------- Menu mobile ---------- */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') && !e.target.closest('#nav')) setMenu(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

  /* ---------- Link đang xem ---------- */
  var links = $$('.menu > a[href^="#"]:not(.menu-cta), .menu .dd-btn');
  var targets = links.map(function (a) { return $(a.getAttribute('data-spy') || a.getAttribute('href')); });
  function setActive(y) {
    var pos = y + window.innerHeight * 0.35, cur = -1;
    targets.forEach(function (t, i) { if (t && t.offsetTop <= pos) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
  }
  onScroll();

  /* ---------- Hiệu ứng xuất hiện ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) {
      var sib = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
      var idx = sib.indexOf(el);
      el.style.transitionDelay = Math.min(Math.max(idx, 0), 5) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Đếm số ---------- */
  var counters = $$('[data-count]');
  function runCount(el) {
    var end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    var t0 = null, dur = 1200;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Logo khách hàng: đứng yên, rê chuột phóng to kiểu thanh Dock macOS ---------- */
  var track = $('.marquee-track');
  if (track && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var mq = track.parentNode, logos = $$('img', track);
    var MAX = 1.85, RANGE = 160, EASE = 0.22;   // độ phóng lớn nhất, bán kính ảnh hưởng (px), độ mượt
    var cur = logos.map(function () { return 1; }), tgt = cur.slice(), mouseX = null, dockRaf = 0;
    function targets() {
      var tx = track.getBoundingClientRect().left;
      logos.forEach(function (im, i) {
        if (mouseX === null) { tgt[i] = 1; return; }
        var d = Math.abs(mouseX - (tx + im.offsetLeft + im.offsetWidth / 2)) / RANGE;
        tgt[i] = d >= 1 ? 1 : 1 + (MAX - 1) * (Math.cos(d * Math.PI) + 1) / 2;
      });
    }
    function frame() {
      dockRaf = 0;
      targets();
      var moving = false;
      logos.forEach(function (im, i) {
        cur[i] += (tgt[i] - cur[i]) * EASE;
        if (Math.abs(tgt[i] - cur[i]) < 0.002) cur[i] = tgt[i]; else moving = true;
      });
      // logo nở ra đẩy các logo khác sang hai bên, tâm hàng logo giữ cố định
      var extra = logos.map(function (im, i) { return (cur[i] - 1) * im.offsetWidth; });
      var total = extra.reduce(function (a, b) { return a + b; }, 0), acc = 0;
      logos.forEach(function (im, i) {
        var shift = acc + extra[i] / 2 - total / 2;
        acc += extra[i];
        im.style.transform = cur[i] === 1 && Math.abs(shift) < .05 ? '' : 'translate3d(' + shift.toFixed(2) + 'px,0,0) scale(' + cur[i].toFixed(4) + ')';
        im.style.zIndex = cur[i] > 1.01 ? Math.round(cur[i] * 10) : '';
      });
      if (moving || mouseX !== null) dockRaf = requestAnimationFrame(frame);
    }
    function kickDock() { if (!dockRaf) dockRaf = requestAnimationFrame(frame); }
    var phone = window.matchMedia('(max-width:640px)');   // khổ điện thoại: không phóng to (khách yêu cầu), kể cả khi xem giả lập bằng chuột
    mq.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && !phone.matches) { mouseX = e.clientX; kickDock(); } });
    mq.addEventListener('pointerleave', function () { mouseX = null; kickDock(); });
  }

  /* ---------- Menu thả xuống: danh mục sản phẩm ---------- */
  var dd = $('#dd'), ddBtn = dd ? $('.dd-btn', dd) : null;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  function setDd(open) {
    if (!dd) return;
    dd.classList.toggle('open', open);
    ddBtn.setAttribute('aria-expanded', String(open));
  }
  if (dd) {
    var ddTimer = null;
    ddBtn.addEventListener('click', function (e) { e.stopPropagation(); setDd(!dd.classList.contains('open')); });
    dd.addEventListener('mouseenter', function () {
      if (canHover.matches && window.innerWidth > 860) { clearTimeout(ddTimer); setDd(true); }
    });
    dd.addEventListener('mouseleave', function () {
      if (canHover.matches && window.innerWidth > 860) { ddTimer = setTimeout(function () { setDd(false); }, 180); }
    });
    dd.addEventListener('focusout', function (e) {
      if (window.innerWidth > 860 && !dd.contains(e.relatedTarget)) setDd(false);
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('#dd')) setDd(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dd.classList.contains('open')) { setDd(false); ddBtn.focus(); }
    });
    $$('a[data-open]', dd).forEach(function (a) {
      a.addEventListener('click', function (e) {
        var card = document.getElementById(a.getAttribute('data-open'));
        if (!card) return;
        e.preventDefault();
        setDd(false); setMenu(false);
        card.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        setTimeout(function () { openDetail(card); }, reduceMotion ? 50 : 750);
      });
    });
    $$('a.dd-all', dd).forEach(function (a) { a.addEventListener('click', function () { setDd(false); }); });
  }

  /* ---------- Sản phẩm: bấm ảnh để phóng to / thu nhỏ ---------- */
  var pd = $('#pd'), pdPanel = $('.pd-panel', pd), pdFrames = $('.pd-frames', pd);
  var pdBody = $('.pd-body', pd), pdX = $('.pd-x', pd);
  var pdCard = null, pdOrigin = null, pdBusy = false, DUR = reduceMotion ? 0 : 560;

  // Bảng giá: nếu không đủ chỗ hiển thị hết các cột thì tự chuyển sang dạng thẻ
  function fitTables() {
    $$('.tbl', pdBody).forEach(function (t) {
      t.classList.remove('tbl-cards');
      var tb = $('table', t);
      if (tb && tb.scrollWidth > t.clientWidth + 1) t.classList.add('tbl-cards');
      // dạng thẻ 2 cột mà chữ vẫn chật -> chuyển 1 cột
      t.classList.remove('tbl-1col');
      var tight = $$('td', t).some(function (td) { return td.offsetWidth && td.scrollWidth > td.clientWidth + 1; })
        || $$('tbody tr', t).some(function (tr) { return tr.scrollWidth > tr.clientWidth + 1; });
      if (tight) t.classList.add('tbl-1col');
    });
  }
  window.addEventListener('resize', function () { if (!pd.hidden) fitTables(); });

  function flipTo(fromRect) {
    var to = pdPanel.getBoundingClientRect();
    var s = Math.max(Math.min(fromRect.width / to.width, fromRect.height / to.height), 0.08);
    var dx = (fromRect.left + fromRect.width / 2) - (to.left + to.width / 2);
    var dy = (fromRect.top + fromRect.height / 2) - (to.top + to.height / 2);
    return 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')';
  }
  function openDetail(card, originEl) {
    if (pdBusy || !card) return;
    if (!pd.hidden && pdCard === card) return;
    pdBusy = true; pdCard = card; pdOrigin = originEl || null;
    var frag = $('template.pc-detail', card).content.cloneNode(true);
    var imgs = $$('.d-imgs img', frag);
    var auto = !reduceMotion && imgs.length > 1 && $('.d-imgs', frag).hasAttribute('data-auto');
    pdBody.innerHTML = '';
    pdBody.appendChild($('.d-body', frag));
    var h = $('h3', pdBody); if (h) h.id = 'pd-title';
    // thêm khối liên hệ báo giá trực tiếp (Mr. Sơn + QR Zalo) vào cuối khung chi tiết
    var contact = $('#qm .qm-contact');
    if (contact) { var c = contact.cloneNode(true); c.classList.add('pd-contact'); pdBody.appendChild(c); }
    // Mỗi ảnh một khung riêng, xếp từ trên xuống dưới; khung ôm sát ảnh (không viền trắng)
    pdFrames.innerHTML = '';
    imgs.forEach(function (im) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pd-img';
      b.setAttribute('aria-label', 'Bấm để thu nhỏ – ' + (im.alt || ''));
      im.loading = 'eager';   // khung đã mở -> tải ảnh ngay, không lazy
      b.appendChild(im);
      pdFrames.appendChild(b);
    });
    var first = imgs[0], portrait = imgs.length === 1 && (+first.getAttribute('height')) > (+first.getAttribute('width'));
    pdPanel.classList.toggle('pd-portrait', portrait);
    pdPanel.classList.toggle('pd-multi', imgs.length > 1);
    pdPanel.classList.toggle('pd-auto', auto);
    if (auto) {   // nhân đôi dải ảnh để cuộn vòng liền mạch
      $$('.pd-img', pdFrames).forEach(function (b) {
        var c = b.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; pdFrames.appendChild(c);
      });
      startAuto();
    }
    $$('.pc-img, .pc-more', card).forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });

    doc.classList.add('pd-lock');
    pd.hidden = false;
    pdPanel.scrollTop = 0; pdBody.scrollTop = 0; $('.pd-media', pd).scrollTop = 0;
    fitTables();
    var from = (pdOrigin || $('.pc-img', card)).getBoundingClientRect();
    if (!reduceMotion) {
      pdPanel.style.transition = 'none';
      pdPanel.style.transform = flipTo(from);
      pdPanel.style.opacity = '0.4';
      void pdPanel.offsetWidth;
      pdPanel.style.transition = '';
    }
    requestAnimationFrame(function () {
      pd.classList.add('show');
      pdPanel.style.transform = '';
      pdPanel.style.opacity = '';
    });
    setTimeout(function () { pdBusy = false; pdX.focus({ preventScroll: true }); }, DUR);
  }
  function closeDetail(after, swiped) {   // swiped: khung đã được vuốt ra ngoài, không bay về thẻ sản phẩm
    if (pd.hidden || pdBusy) return;
    pdBusy = true;
    var card = pdCard, origin = pdOrigin && !qm.hidden ? pdOrigin : null;
    var from = (origin || $('.pc-img', card)).getBoundingClientRect();
    pd.classList.remove('show');
    if (!reduceMotion && !swiped) {
      pdPanel.style.transform = flipTo(from);
      pdPanel.style.opacity = '0';
    }
    setTimeout(function () {
      pd.hidden = true;
      pdPanel.style.transform = ''; pdPanel.style.opacity = '';
      if (qm.hidden) doc.classList.remove('pd-lock');
      stopAuto();
      pdBody.innerHTML = ''; pdFrames.innerHTML = '';
      $$('.pc-img, .pc-more', card).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      pdBusy = false; pdCard = null; pdOrigin = null;
      if (after) after(); else (origin || $('.pc-img', card)).focus({ preventScroll: true });
    }, DUR);
  }
  /* ảnh chi tiết tự cuộn liên tục (d-imgs có data-auto):
     bấm 1 lần để tạm dừng, bấm lần nữa để chạy tiếp; giữ chuột (hoặc ngón tay) kéo lên/xuống để tua; lăn chuột để tua */
  var pdMedia = $('.pd-media', pd), autoRaf = 0, autoOff = 0, autoPaused = false, autoLast = 0, AUTO_SPEED = 150;   // px/giây
  var drag = null, DRAG_MIN = 6;   // px – kéo quá ngưỡng này mới tính là kéo, không phải bấm
  function autoLoop(t) {
    var first = pdFrames.firstElementChild, half = $$('.pd-img', pdFrames)[$$('.pd-img', pdFrames).length / 2];
    var loopH = half && first ? half.offsetTop - first.offsetTop : 0;
    var dt = autoLast ? Math.min(t - autoLast, 50) / 1000 : 0; autoLast = t;
    if (!autoPaused && !drag) autoOff += AUTO_SPEED * dt;
    if (loopH > 0) { autoOff = ((autoOff % loopH) + loopH) % loopH; pdFrames.style.transform = 'translate3d(0,' + (-autoOff).toFixed(1) + 'px,0)'; }
    autoRaf = requestAnimationFrame(autoLoop);
  }
  function setPaused(v) { autoPaused = v; pdPanel.classList.toggle('pd-paused', v); }
  function startAuto() { cancelAnimationFrame(autoRaf); autoOff = 0; autoLast = 0; drag = null; setPaused(false); autoRaf = requestAnimationFrame(autoLoop); }
  function stopAuto() { cancelAnimationFrame(autoRaf); autoRaf = 0; drag = null; setPaused(false); pdFrames.style.transform = ''; pdPanel.classList.remove('pd-auto', 'pd-dragging'); }
  pdMedia.addEventListener('pointerdown', function (e) {
    if (!autoRaf || e.button > 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, off: autoOff, moved: false };
  });
  pdMedia.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dy = e.clientY - drag.y, dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dy) < DRAG_MIN && Math.abs(dx) < DRAG_MIN) return;
    if (!drag.moved && Math.abs(dx) > Math.abs(dy)) { drag = null; return; }   // kéo ngang: để dành cho vuốt đóng khung
    if (!drag.moved) { drag.moved = true; try { pdMedia.setPointerCapture(e.pointerId); } catch (_) {} pdPanel.classList.add('pd-dragging'); }
    autoOff = drag.off - dy;   // kéo xuống -> ảnh đi xuống theo tay
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var moved = drag.moved; drag = null;
    pdPanel.classList.remove('pd-dragging');
    if (e.type === 'pointerup' && !moved) setPaused(!autoPaused);   // bấm (không kéo) -> dừng / chạy tiếp
  }
  pdMedia.addEventListener('pointerup', endDrag);
  pdMedia.addEventListener('pointercancel', endDrag);
  pdMedia.addEventListener('dragstart', function (e) { if (autoRaf) e.preventDefault(); });
  pdMedia.addEventListener('wheel', function (e) {
    if (!autoRaf) return;
    e.preventDefault(); autoOff += e.deltaY;
  }, { passive: false });

  $$('.pc').forEach(function (card) {
    $$('.pc-img, .pc-more', card).forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', function () { openDetail(card); });
    });
  });
  pdFrames.addEventListener('click', function (e) {
    if (!e.target.closest('.pd-img')) return;
    if (autoRaf) { if (!e.detail) setPaused(!autoPaused); return; }   // dải tự cuộn: bấm = dừng/chạy (Enter/Space cũng vậy)
    closeDetail();   // bấm ảnh lần nữa -> thu nhỏ
  });
  pdX.addEventListener('click', function () { closeDetail(); });
  /* điện thoại + iPad (≤1180px): vuốt sang trái hoặc phải để đóng khung chi tiết sản phẩm.
     Khung chạy theo ngón tay; thả ra quá 90px (hoặc vuốt nhanh) thì trượt hẳn ra ngoài rồi đóng, chưa đủ thì bật lại.
     Kéo dọc vẫn là cuộn trang / tua dải ảnh như cũ. */
  (function () {
    var sx = 0, sy = 0, st = 0, dx = 0, mode = '', eatClick = false;
    pdPanel.addEventListener('pointerdown', function (e) {
      if (!sheetMq || !sheetMq.matches || pdBusy || (e.pointerType === 'mouse' && e.button !== 0)) return;
      sx = e.clientX; sy = e.clientY; st = Date.now(); dx = 0; mode = 'wait';
    });
    pdPanel.addEventListener('pointermove', function (e) {
      if (!mode) return;
      var mx = e.clientX - sx, my = e.clientY - sy;
      if (mode === 'wait') {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
        mode = Math.abs(mx) > Math.abs(my) * 1.2 ? 'swipe' : '';
        if (mode !== 'swipe') return;
        pdPanel.style.transition = 'none';
        try { pdPanel.setPointerCapture(e.pointerId); } catch (_) {}
      }
      dx = mx;
      pdPanel.style.transform = 'translate3d(' + dx + 'px,0,0)';
      pdPanel.style.opacity = String(Math.max(.3, 1 - Math.abs(dx) / pdPanel.offsetWidth));
    });
    function end() {
      if (mode !== 'swipe') { mode = ''; return; }
      mode = ''; eatClick = true; setTimeout(function () { eatClick = false; }, 60);
      var ad = Math.abs(dx), fast = ad > 40 && ad / Math.max(1, Date.now() - st) > 0.6;
      pdPanel.style.transition = 'transform .28s cubic-bezier(.22,1,.36,1), opacity .28s';
      if (ad > 90 || fast) {
        pdPanel.style.transform = 'translate3d(' + (dx < 0 ? '-110%' : '110%') + ',0,0)';
        pdPanel.style.opacity = '0';
        setTimeout(function () { pdPanel.style.transition = ''; closeDetail(null, true); }, 260);
      } else {
        pdPanel.style.transform = ''; pdPanel.style.opacity = '';
        setTimeout(function () { pdPanel.style.transition = ''; }, 300);
      }
    }
    pdPanel.addEventListener('pointerup', end);
    pdPanel.addEventListener('pointercancel', end);
    // vừa vuốt xong thì bỏ qua cú "bấm" đi kèm (để không dừng dải ảnh / thu nhỏ khung)
    pdPanel.addEventListener('click', function (e) { if (eatClick) { e.stopPropagation(); e.preventDefault(); } }, true);
  })();

  /* ---------- Đoạn chữ dài ở mục 01: thu gọn còn 3 dòng, bấm "Xem thêm" để hiện đủ ---------- */
  function fitMore(root) {
    $$('.ab-text', root || document).forEach(function (t) {
      var b = t.nextElementSibling;
      if (!b || t.classList.contains('open')) return;
      var over = t.scrollHeight > t.clientHeight + 2;   // chỉ hiện nút khi chữ dài hơn 3 dòng
      t.classList.toggle('clamped', over);
      b.hidden = !over;
    });
  }
  $$('.ab-toggle').forEach(function (b) {
    var t = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', function () {
      var open = t.classList.toggle('open');
      t.classList.toggle('clamped', !open);
      b.setAttribute('aria-expanded', String(open));
      b.firstChild.textContent = open ? 'Thu gọn' : 'Xem thêm';
    });
  });
  window.addEventListener('load', function () { fitMore(); });
  window.addEventListener('resize', function () { fitMore(); });
  fitMore();

  /* ---------- Trang riêng #gs cho nút tab trên điện thoại + iPad (≤1180px) ----------
     Bấm một nút ở mục 01 hoặc mục 03 thì nội dung của nút đó mở thành một trang riêng đè lên trang chính
     (giống khung chi tiết sản phẩm). Đóng bằng nút ×, phím Esc hoặc vuốt sang trái/phải. */
  var sheetMq = window.matchMedia ? window.matchMedia('(max-width:1180px)') : null;
  var gs = $('#gs'), gsPanel = gs && $('.gs-panel', gs), gsBody = gs && $('.gs-body', gs),
      gsTitle = gs && $('#gs-title', gs), gsKicker = gs && $('.gs-kicker', gs), gsX = gs && $('.gs-x', gs),
      gsBox = null, gsFrom = null, gsTimer = 0;
  function markSheet() {
    $$('.gtabs').forEach(function (box) { box.classList.toggle('gt-sheet', !!(sheetMq && sheetMq.matches)); });
    if (gs && !gs.hidden && !(sheetMq && sheetMq.matches)) closeSheet(true);
  }
  // nội dung của nút thứ k: chữ giới thiệu (mục 01) + khung nội dung; bỏ id, nút "Xem thêm", hiệu ứng hiện dần
  function sheetContent(box, k) {
    var frag = document.createDocumentFragment();
    var intro = $('[data-tab-for="' + (k + 1) + '"]', box);
    var panel = $$('[role="tabpanel"]', box)[k];
    [intro, panel].forEach(function (el) {
      if (!el) return;
      var c = el.cloneNode(true);
      c.hidden = false; c.removeAttribute('id'); c.removeAttribute('role'); c.removeAttribute('aria-labelledby');
      $$('[id]', c).forEach(function (n) { n.removeAttribute('id'); });
      $$('.ab-toggle', c).forEach(function (n) { n.remove(); });
      $$('.ab-text', c).forEach(function (n) { n.classList.remove('clamped'); n.classList.add('open'); });
      $$('.reveal', c).forEach(function (n) { n.classList.remove('reveal'); });
      $$('.seg', c).forEach(function (n) { ['role', 'tabindex', 'aria-haspopup', 'aria-controls'].forEach(function (a) { n.removeAttribute(a); }); });
      frag.appendChild(c);
    });
    return frag;
  }
  function fillSheet(box, k) {
    var btn = $$('[role="tab"]', box)[k];
    var kick = $('.sec-kicker', box.closest('section'));
    gsKicker.textContent = kick ? kick.innerText.replace(/\s+/g, ' ').trim() : '';
    gsTitle.textContent = btn.innerText.replace(/^\s*\d+\s*/, '').replace(/\s+/g, ' ').trim();
    gsBody.innerHTML = '';
    gsBody.appendChild(sheetContent(box, k));
    gsPanel.scrollTop = 0;
    gsBox = box;
    fitTables();
  }
  function openSheet(box, k, from) {
    if (!gs) return;
    clearTimeout(gsTimer);
    fillSheet(box, k);
    gsFrom = from || null;
    doc.classList.add('pd-lock');
    gs.hidden = false;
    gsPanel.style.transform = '';
    void gsPanel.offsetWidth;
    gs.classList.add('show');
    setTimeout(function () { gsX.focus({ preventScroll: true }); }, 50);
  }
  function closeSheet(now) {   // now: true = đóng ngay; 'left' = vuốt sang trái thì trang trượt ra bên trái
    if (!gs || gs.hidden) return;
    gs.classList.remove('show');
    gsPanel.style.transition = '';
    gsPanel.style.transform = now === 'left' ? 'translate3d(-100%,0,0)' : '';
    if (now === 'left' || now === 'right') now = false;
    var done = function () {
      gs.hidden = true; gsBody.innerHTML = ''; gsBox = null; gsPanel.style.transform = '';
      if ($('#pd').hidden && $('#qm').hidden) doc.classList.remove('pd-lock');
      if (gsFrom) gsFrom.focus({ preventScroll: true });
    };
    if (now || reduceMotion) done(); else gsTimer = setTimeout(done, 420);
  }
  if (gs) {
    gsX.addEventListener('click', function () { closeSheet(); });
    $('.gs-backdrop', gs).addEventListener('click', function () { closeSheet(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !gs.hidden) closeSheet(); });
    // nút "Bước tiếp theo" trong trang riêng: chuyển sang bước đó ngay trong trang
    gsBody.addEventListener('click', function (e) {
      var go = e.target.closest('[data-tab-go]');
      if (go && gsBox) { var n = +go.getAttribute('data-tab-go') - 1; $$('[role="tab"]', gsBox)[n].click(); }
    });
    // vuốt sang trái hoặc phải để đóng: trang chạy theo ngón tay, thả ra quá 90px (hoặc vuốt nhanh) thì đóng, chưa đủ thì bật lại
    var sx = 0, sy = 0, st = 0, dx = 0, mode = '';
    gsPanel.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      sx = e.clientX; sy = e.clientY; st = Date.now(); dx = 0; mode = 'wait';
    });
    gsPanel.addEventListener('pointermove', function (e) {
      if (!mode) return;
      var mx = e.clientX - sx, my = e.clientY - sy;
      if (mode === 'wait') {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
        mode = Math.abs(mx) > Math.abs(my) * 1.2 ? 'swipe' : '';
        if (mode !== 'swipe') return;
        gsPanel.style.transition = 'none';
        try { gsPanel.setPointerCapture(e.pointerId); } catch (_) {}
      }
      dx = mx;
      gsPanel.style.transform = 'translate3d(' + dx + 'px,0,0)';
      gs.style.setProperty('--gs-fade', String(Math.max(0, 1 - Math.abs(dx) / gsPanel.offsetWidth)));
    });
    var endSwipe = function () {
      if (mode !== 'swipe') { mode = ''; return; }
      mode = '';
      gsPanel.style.transition = '';
      gs.style.removeProperty('--gs-fade');
      var ad = Math.abs(dx), fast = ad > 40 && ad / Math.max(1, Date.now() - st) > 0.6;
      if (ad > 90 || fast) closeSheet(dx < 0 ? 'left' : 'right'); else gsPanel.style.transform = '';
    };
    gsPanel.addEventListener('pointerup', endSwipe);
    gsPanel.addEventListener('pointercancel', endSwipe);
  }
  if (sheetMq) {
    if (sheetMq.addEventListener) sheetMq.addEventListener('change', markSheet); else sheetMq.addListener(markSheet);
  }

  /* ---------- Nút tab: "Tầm nhìn và định hướng" và "Quy trình làm việc" ----------
     Mỗi nút ghi tiêu đề một mục nhỏ; bấm nút thì hiện nội dung mục đó bên dưới.
     Phím ←/→/Home/End chuyển nút; nút [data-tab-go="n"] trong nội dung nhảy sang mục thứ n. */
  $$('.gtabs').forEach(function (box) {
    var btns = $$('[role="tab"]', box), panels = $$('[role="tabpanel"]', box);
    function select(i, focus) {
      i = (i + btns.length) % btns.length;
      btns.forEach(function (b, k) {
        var on = k === i;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      $$('[data-tab-for]', box).forEach(function (el) { el.hidden = +el.getAttribute('data-tab-for') !== i + 1; });
      fitMore(box);
      if (focus) btns[i].focus();
      btns[i].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
      fitTables();
    }
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () {
        select(k);
        if (sheetMq && sheetMq.matches) openSheet(box, k, b);   // điện thoại + iPad: mở trang riêng đè lên trang
      });
      b.addEventListener('keydown', function (e) {
        var to = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: btns.length - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault(); select(to, true);
      });
    });
    box.addEventListener('click', function (e) {
      var go = e.target.closest('[data-tab-go]');
      if (go) select(+go.getAttribute('data-tab-go') - 1, true);
    });
  });

  markSheet();

  /* ---------- Cửa sổ mini xem từng bước "Định hướng & khách hàng phù hợp" ---------- */
  var sm = $('#sm'), segs = $$('.seg-grid > .seg');
  if (sm && segs.length) {
    var smSlide = $('.sm-slide', sm), smDots = $('.sm-dots', sm), smPrev = $('.sm-prev', sm), smNext = $('.sm-next', sm);
    var smI = 0, smOpener = null, smBusy = false;
    segs.forEach(function (seg, i) {
      var d = document.createElement('button');
      d.type = 'button'; d.setAttribute('role', 'tab'); d.setAttribute('aria-label', 'Bước ' + (i + 1));
      d.addEventListener('click', function () { smGo(i); });
      smDots.appendChild(d);
    });
    function smFill(i) {
      smSlide.innerHTML = segs[i].innerHTML;
      var h = $('h4', smSlide); if (h) h.id = 'sm-title';
      $$('button', smDots).forEach(function (d, k) { d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      smPrev.disabled = i === 0; smNext.disabled = i === segs.length - 1;
    }
    function smGo(i) {
      if (i < 0 || i >= segs.length || i === smI || smBusy) return;
      var dir = i > smI ? 'l' : 'r'; smI = i;
      if (reduceMotion) { smFill(i); return; }
      smBusy = true;
      smSlide.classList.add('out-' + dir);
      setTimeout(function () {
        smFill(i);
        smSlide.classList.remove('out-' + dir);
        smSlide.classList.add(dir === 'l' ? 'out-r' : 'out-l');
        void smSlide.offsetWidth;
        smSlide.classList.remove('out-r', 'out-l');
        smBusy = false;
      }, 200);
    }
    function smOpen(i, opener) {
      smI = i; smOpener = opener; smFill(i);
      sm.hidden = false; doc.classList.add('pd-lock');
      requestAnimationFrame(function () { sm.classList.add('show'); });
      setTimeout(function () { (smNext.disabled ? smPrev : smNext).focus({ preventScroll: true }); }, 50);
    }
    function smClose() {
      if (sm.hidden) return;
      sm.classList.remove('show');
      setTimeout(function () {
        sm.hidden = true;
        if (pd.hidden && qm.hidden) doc.classList.remove('pd-lock');
        if (smOpener) smOpener.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 300);
    }
    segs.forEach(function (seg, i) {
      seg.addEventListener('click', function () { smOpen(i, seg); });
      seg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); smOpen(i, seg); } });
    });
    smPrev.addEventListener('click', function () { smGo(smI - 1); });
    smNext.addEventListener('click', function () { smGo(smI + 1); });
    $$('[data-sm-close]', sm).forEach(function (b) { b.addEventListener('click', smClose); });
    document.addEventListener('keydown', function (e) {
      if (sm.hidden) return;
      if (e.key === 'Escape') smClose();
      else if (e.key === 'ArrowLeft') smGo(smI - 1);
      else if (e.key === 'ArrowRight') smGo(smI + 1);
    });
    // điện thoại: vuốt ngang để chuyển bước
    var smX = null;
    $('.sm-stage', sm).addEventListener('touchstart', function (e) { smX = e.touches[0].clientX; }, { passive: true });
    $('.sm-stage', sm).addEventListener('touchend', function (e) {
      if (smX === null) return;
      var dx = e.changedTouches[0].clientX - smX; smX = null;
      if (Math.abs(dx) > 40) smGo(smI + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  $('.pd-backdrop', pd).addEventListener('click', function () { closeDetail(); });
  pd.addEventListener('click', function (e) { if (e.target === pd) closeDetail(); });
  pdBody.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    var target = $(a.getAttribute('href'));
    closeDetail(function () {
      closeQm(true);
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  document.addEventListener('keydown', function (e) {
    if (pd.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDetail(); }
    if (e.key === 'Tab') {
      var f = $$('button, a[href]', pd).filter(function (el) { return el.offsetParent !== null || el === pdX; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Bảng báo giá ---------- */
  var qm = $('#qm'), qmPanel = $('.qm-panel', qm), qmTrigger = null, qmTimer = null;
  function openQm(trigger) {
    clearTimeout(qmTimer);
    qmTrigger = trigger || null;
    setDd(false); setMenu(false);
    doc.classList.add('pd-lock');
    qm.hidden = false; qmPanel.scrollTop = 0;
    requestAnimationFrame(function () { requestAnimationFrame(function () { qm.classList.add('show'); }); });
    setTimeout(function () { var f = $('.qm-item', qm); if (f) f.focus({ preventScroll: true }); }, reduceMotion ? 0 : 120);
  }
  function closeQm(silent) {
    if (qm.hidden) return;
    qm.classList.remove('show');
    qmTimer = setTimeout(function () {
      qm.hidden = true;
      if (pd.hidden) doc.classList.remove('pd-lock');
      if (!silent && qmTrigger) qmTrigger.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 400);
  }
  $$('[data-open-qm]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openQm(b); });
  });
  $$('.qm-item', qm).forEach(function (b) {
    b.addEventListener('click', function () {
      var card = document.getElementById(b.getAttribute('data-card'));
      if (card) openDetail(card, b);          // mở đúng nội dung như khi bấm ảnh ở mục 02
    });
  });
  $('.qm-x', qm).addEventListener('click', function () { closeQm(); });
  $('.qm-backdrop', qm).addEventListener('click', function () { closeQm(); });
  qm.addEventListener('click', function (e) { if (e.target === qm) closeQm(); });
  document.addEventListener('keydown', function (e) {
    if (qm.hidden || !pd.hidden) return;   // khung chi tiết đang mở thì để nó xử lý trước
    if (e.key === 'Escape') { e.preventDefault(); closeQm(); }
    if (e.key === 'Tab') {
      var f = $$('button, a[href]', qm), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Form đăng ký nhận báo giá (#dang-ky) ----------
     Gửi qua FormSubmit (formsubmit.co/ajax) về Gmail chủ trang, không cần máy chủ riêng.
     Lần gửi đầu tiên FormSubmit gửi thư kích hoạt tới Gmail đó; bấm xác nhận thì các lần sau mới về hộp thư. */
  var reg = $('#reg-form');
  if (reg) {
    var regStatus = $('#reg-status'), regBtn = $('.reg-submit', reg);
    var say = function (msg, ok) { regStatus.textContent = msg; regStatus.className = 'reg-status ' + (ok ? 'ok' : 'err'); };
    reg.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = reg.elements['Họ và tên'], phone = reg.elements['Số điện thoại'], mail = reg.elements.email;
      $$('.reg-field', reg).forEach(function (f) { f.classList.remove('bad'); });
      var digits = phone.value.replace(/[^0-9+]/g, '');
      var bad = null;
      if (!name.value.trim()) bad = [name, 'Vui lòng nhập họ và tên.'];
      else if (!/^(\+?84|0)\d{9,10}$/.test(digits)) bad = [phone, 'Số điện thoại chưa đúng, ví dụ 0886 115 561.'];
      else if (mail.value && !mail.checkValidity()) bad = [mail, 'Email chưa đúng định dạng.'];
      if (bad) { bad[0].closest('.reg-field').classList.add('bad'); bad[0].focus(); say(bad[1], false); return; }
      if (reg.elements._honey.value) return;               // ô bẫy chống spam bị điền: bỏ qua
      var data = {};
      [].forEach.call(reg.elements, function (el) {
        if (!el.name || (el.type === 'radio' && !el.checked)) return;
        data[el.name] = el.value;
      });
      if (location.protocol === 'file:') {   // FormSubmit không nhận form gửi từ file mở trực tiếp trên máy
        say('Trang đang mở dạng file trên máy nên chưa gửi được. Hãy mở qua máy chủ thử (F5 → "Mở qua máy chủ thử") hoặc trên lacdau.com.', false);
        return;
      }
      regBtn.disabled = true; say('Đang gửi…', true);
      fetch('https://formsubmit.co/ajax/hoangson7423@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (String(res.success) !== 'true') throw new Error(res.message || '');
        reg.reset();
        say('Đã gửi! Lắc Đầu sẽ liên hệ lại với bạn sớm nhất.', true);
      }).catch(function (err) {
        var m = (err && err.message) || '';
        if (/activat/i.test(m)) say('Form chưa được kích hoạt: mở Gmail hoangson7423@gmail.com, tìm thư của FormSubmit và bấm "Activate Form", rồi gửi lại.', false);
        else say('Chưa gửi được, vui lòng gọi hoặc nhắn Zalo 088.611.5561.', false);
        if (m && window.console) console.warn('FormSubmit:', m);
      }).then(function () { regBtn.disabled = false; });
    });
  }

  /* ---------- Lọc dự án ---------- */
  var fBtns = $$('.filters button'), items = $$('#gallery .g');
  fBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      if (f !== 'all') { gal.classList.remove('collapsed'); more.parentElement.hidden = true; }
      else { more.parentElement.hidden = false; gal.classList.add('collapsed'); more.setAttribute('aria-expanded','false'); more.textContent = 'Xem thêm dự án'; }
      fBtns.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
      items.forEach(function (it) {
        var show = f === 'all' || it.getAttribute('data-c') === f;
        it.classList.toggle('hide', !show);
        if (show) { it.classList.remove('pop'); void it.offsetWidth; it.classList.add('pop'); }
      });
    });
  });

  var more = $('#more'), gal = $('#gallery');
  if (more) more.addEventListener('click', function () {
    var open = gal.classList.toggle('collapsed') === false;
    more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? 'Thu gọn' : 'Xem thêm dự án';
    if (!open) gal.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  var group = [], gi = 0, lastFocus = null;
  function visible(el) { return el.offsetParent !== null; }
  function show(i) {
    gi = (i + group.length) % group.length;
    var el = group[gi], im = $('img', el);
    lbImg.src = el.getAttribute('data-full');
    lbImg.alt = im ? im.alt : '';
    lbCap.textContent = el.getAttribute('data-cap') || (im ? im.alt : '');
    var multi = group.length > 1;
    $('.lb-prev', lb).hidden = !multi; $('.lb-next', lb).hidden = !multi;
  }
  function openLb(el) {
    var scope = el.closest('#gallery') || el.closest('.panel') || el.parentElement;
    group = $$('.zoomable', scope).filter(visible);
    lastFocus = el;
    show(group.indexOf(el));
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add('show'); });
    document.body.style.overflow = 'hidden';
    $('.lb-x', lb).focus();
  }
  function closeLb() {
    lb.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(function () { lb.hidden = true; lbImg.removeAttribute('src'); }, reduceMotion ? 0 : 250);
    if (lastFocus) lastFocus.focus();
  }
  $$('.zoomable').forEach(function (el) { el.addEventListener('click', function () { openLb(el); }); });
  $('.lb-x', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', function () { show(gi - 1); });
  $('.lb-next', lb).addEventListener('click', function () { show(gi + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight' && group.length > 1) show(gi + 1);
    if (e.key === 'ArrowLeft' && group.length > 1) show(gi - 1);
    if (e.key === 'Tab') { // giữ focus trong lightbox
      var f = $$('button:not([hidden])', lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // vuốt trên điện thoại
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null || group.length < 2) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(gi + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();
