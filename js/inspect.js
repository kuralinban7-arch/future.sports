/* ═══════════════════════════════════════════════════════════
   FUTURE SPORTS — stick inspection (shared)
   mountInspect(el, product)  drag-to-turn 3D stick, numbered hotspots
                              and a spec list that zooms in on each point.
   mountFibre(section, product)  animated carbon gauge, fibre bars and
                                 technology cards.
   Used on the home page (Blade 7) and on every stick's product page.
═══════════════════════════════════════════════════════════ */

/* Where each feature sits along the stick: 0 = top of the grip, 100 = toe */
const SPOT_Y = { PU: 9, PLG: 9, SPU: 9, SCG: 9, ERG: 9, AGR: 9, '3D': 22, LWD: 38, DCT: 56, HCS: 46, PNT: 26, LAM: 90, C100: 54, KEV: 62, GLS: 34, ARM: 62, JPC: 40, TWC: 56, CMH: 90, KCF: 34, STC: 90, PWG: 72, AVS: 22, MTC: 34, FCW: 30, '3KCW': 33, TCW: 38, comp: 46, PRG: 56, ACZ: 66, CEP: 78, STL: 85, KHP: 93, AHP: 93 };
const SPOT_TAG = { PU: 'PU Grip', PLG: 'PLG Grip', SPU: 'Soft Grip', SCG: 'Cushion Grip', '3D': '3D Texture', ERG: 'Grip', AGR: 'Alfa Grip', LWD: 'Light', DCT: 'Dual Core', HCS: 'Composite', PNT: 'Paint', LAM: 'Head', C100: '100% Composite', KEV: 'Kevlar', GLS: 'Glass Fibre', ARM: 'Aramid', JPC: 'Japanese Carbon', TWC: 'Twin Core', CMH: 'Compact Head', KCF: 'KCF', STC: 'Soft Touch', PWG: 'Power Groove', AVS: 'Anti-Vibration', MTC: 'M-Tech' };
const FIBRE = {
  Carbon: { label: 'Carbon fibre', color: 'var(--red)', note: 'Stiffness and power' },
  Glass:  { label: 'Glass fibre',  color: '#d9dadc',    note: 'Feel and flex' },
  Aramid: { label: 'Aramid',       color: '#e3b54a',    note: 'Toughness in the composite' },
  Kevlar: { label: 'Kevlar',       color: '#e3b54a',    note: 'Toughness in the composite' },
};
const pad2 = n => String(n).padStart(2, '0');

function inspectSpecs(p) {
  const list = [];
  if (p.composition) {
    const parts = Object.entries(p.composition).map(([k, v]) => `${v}% ${k.toLowerCase()}`).join(' · ');
    list.push({ t: p.carbon === 100 ? 'Full carbon construction' : 'Carbon fibre construction', d: parts, tag: `${p.carbon}% Carbon`, y: SPOT_Y.comp });
  }
  (p.tech || []).forEach(k => {
    if (TECH[k]) list.push({ t: TECH[k].name, d: TECH[k].desc, tag: SPOT_TAG[k] || k, y: SPOT_Y[k] ?? 50 });
  });
  // sticks sold in more than one bow: the bow is the curve down the lower shaft
  if (p.bows && p.bows.length) list.push({ t: 'Bow shape', d: `Choose ${p.bows.join(' or ')}`, tag: 'Bow', y: 72 });
  return list.sort((a, b) => a.y - b.y);
}

/* Reads a cutout's alpha so hotspots land on the stick itself.
   Returns rigY (0..1) -> rigX (0..1), honouring object-fit: contain. */
function stickProfile(img, rigAR) {
  if (!img || !img.naturalWidth) return null;
  try {
    const W = 100, H = Math.max(1, Math.round(W * img.naturalHeight / img.naturalWidth));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data;
    const op = (x, y) => d[(y * W + x) * 4 + 3] > 110;
    const cs = [], ws = [];
    for (let y = Math.round(H * 0.2); y < H * 0.55; y++) {
      let a = -1, b = -1;
      for (let x = 0; x < W; x++) if (op(x, y)) { if (a < 0) a = x; b = x; }
      if (a >= 0) { cs.push((a + b) / 2); ws.push(b - a + 1); }
    }
    const med = arr => arr.length ? arr.slice().sort((m, n) => m - n)[arr.length >> 1] : W / 2;
    const cx = med(cs), sw = Math.max(2, med(ws));
    const iar = img.naturalWidth / img.naturalHeight;
    const wf = iar > rigAR ? 1 : iar / rigAR, hf = iar > rigAR ? rigAR / iar : 1;
    const ox = (1 - wf) / 2, oy = (1 - hf) / 2;
    return yr => {
      const yi = Math.min(H - 1, Math.max(0, Math.round(((yr - oy) / hf) * (H - 1))));
      let s = 0, n = 0;
      const x0 = Math.max(0, Math.floor(cx - sw * 1.5)), x1 = Math.min(W - 1, Math.ceil(cx + sw * 1.5));
      for (let x = x0; x <= x1; x++) if (op(x, yi)) { s += x; n++; }
      return ox + (((n ? s / n : cx) + 0.5) / W) * wf;
    };
  } catch (e) { return null; }   // e.g. opened from file:// — fall back to centre
}

const loadImage = src => new Promise(res => {
  const im = new Image();
  im.onload = () => res(im); im.onerror = () => res(null);
  im.src = src;
});

function mountInspect(root, p, variant = 0) {
  const SPECS = inspectSpecs(p);
  root.innerHTML = `
    <div class="stage">
      <div class="stage-glow"></div>
      <div class="face-toggle" role="group" aria-label="Stick face">
        <button type="button" class="active" data-face="front" aria-pressed="true">Front</button>
        <button type="button" data-face="back" aria-pressed="false">Reverse</button>
      </div>
      <span class="stage-hint">Drag to turn</span>
      <div class="stick-rig">
        <div class="stick-3d">
          <img class="face front" alt="" draggable="false">
          <img class="face back" alt="" draggable="false">
        </div>
        <div class="hotspots">
          ${SPECS.map((s, i) => `<button type="button" class="hot" data-i="${i}" style="top:${s.y}%;--d:${i * 110}ms" aria-label="${s.t}"><span>${i + 1}</span></button>`).join('')}
        </div>
      </div>
    </div>
    <ol class="spec-list">
      ${SPECS.map((s, i) => `
        <li data-i="${i}" tabindex="0">
          <b>${pad2(i + 1)}</b>
          <div><strong>${s.t}</strong><span>${s.d}</span></div>
          <em>${s.tag}</em>
        </li>`).join('')}
    </ol>`;

  const q = s => root.querySelector(s);
  const stage = q('.stage'), rig = q('.stick-rig'), stick = q('.stick-3d');
  const front = q('.face.front'), back = q('.face.back');
  const toggle = [...root.querySelectorAll('.face-toggle button')];
  const items = [...root.querySelectorAll('.spec-list li')], hots = [...root.querySelectorAll('.hot')];
  const prof = { front: null, back: null };
  let angle = 0, start = null, startAngle = 0, turnT = 0, active = -1;

  const isBack = () => { const a = ((angle % 360) + 360) % 360; return a > 90 && a < 270; };
  const xAt = (i) => { const f = isBack() ? prof.back : prof.front; return f ? f(SPECS[i].y / 100) * 100 : 50; };
  function placeHots() {
    hots.forEach((h, i) => { h.style.left = xAt(i) + '%'; });
    if (active >= 0) rig.style.setProperty('--zoom-x', xAt(active) + '%');
  }
  function apply() {
    stick.style.transform = `rotateY(${angle}deg)`;
    const b = isBack();
    toggle.forEach(t => { const on = (t.dataset.face === 'back') === b; t.classList.toggle('active', on); t.setAttribute('aria-pressed', on); });
  }
  // hotspots hide while the stick is turning, then settle onto the new face
  function turning(ms) {
    rig.classList.add('turning'); clearTimeout(turnT);
    turnT = setTimeout(() => { rig.classList.remove('turning'); placeHots(); }, ms);
  }

  const setActive = i => {
    active = i;
    items.forEach((el, k) => el.classList.toggle('active', k === i));
    hots.forEach((el, k) => el.classList.toggle('active', k === i));
    rig.style.setProperty('--zoom-y', SPECS[i].y + '%');
    rig.style.setProperty('--zoom-x', xAt(i) + '%');
    rig.classList.add('zoomed');
  };
  const clear = () => {
    active = -1;
    items.concat(hots).forEach(el => el.classList.remove('active'));
    rig.classList.remove('zoomed');
  };
  items.forEach((el, i) => { el.onmouseenter = el.onfocus = el.onclick = () => setActive(i); });
  hots.forEach((el, i) => el.onclick = e => { e.stopPropagation(); setActive(i); });
  q('.spec-list').onmouseleave = clear;

  // drag to turn
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    start = e.clientX; startAngle = angle;
    stick.classList.add('dragging'); rig.classList.add('turning'); clearTimeout(turnT);
    stage.setPointerCapture(e.pointerId); clear();
  });
  stage.addEventListener('pointermove', e => { if (start === null) return; angle = startAngle + (e.clientX - start) * 0.6; apply(); });
  const end = () => {
    if (start === null) return;
    start = null; stick.classList.remove('dragging');
    angle = Math.round(angle / 180) * 180; apply(); turning(800);   // settle on a face
  };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  toggle.forEach(b => b.onclick = () => {
    if ((b.dataset.face === 'back') !== isBack()) { clear(); angle += 180; apply(); turning(800); }
  });

  // load the faces for a colour; a single photo turns but has no "Reverse"
  function load(v, spin) {
    const views = inspectViews(p, v) || [productImages(p, v)[0]];
    const f = views[0], b = views[1] || views[0];
    q('.face-toggle').hidden = views.length < 2;
    front.src = f; back.src = b;
    front.alt = `${p.name} front`; back.alt = views.length > 1 ? `${p.name} reverse` : '';
    Promise.all([loadImage(f), loadImage(b)]).then(([fi, bi]) => {
      if (fi) rig.style.aspectRatio = `${fi.naturalWidth} / ${fi.naturalHeight}`;
      const ar = fi ? fi.naturalWidth / fi.naturalHeight : 0.15;
      prof.front = stickProfile(fi, ar); prof.back = stickProfile(bi, ar);
      placeHots();
    });
    if (spin) { clear(); angle = Math.round(angle / 360) * 360 + 360; apply(); turning(900); }
  }
  load(variant, false);

  // entrance: the stick fades in with a full turn, then the hotspots pop in one by one
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready = () => { stage.classList.add('lit', 'ready'); setTimeout(() => stage.classList.add('settled'), 200 + hots.length * 110 + 500); };
  if (reduce || !('IntersectionObserver' in window)) ready();
  else {
    const io = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return;
      io.disconnect();
      stage.classList.add('lit');
      stick.classList.add('intro');
      requestAnimationFrame(() => { angle = 360; apply(); turning(1700); });
      setTimeout(() => { stick.classList.remove('intro'); ready(); }, 1700);
    }, { threshold: 0.3 });
    io.observe(stage);
  }

  return { setVariant: v => load(v, !reduce) };
}

/* ── Built from the fibre up: gauge, bars, technology cards ── */
const TECH_ICONS = {
  '3KCW': '<path d="M4 4h16v16H4z"/><path d="M4 9h16M4 14h16M9 4v16M14 4v16"/>',
  FCW: '<path d="M3 7l6-4 6 3 6-2v14l-6 3-6-3-6 2z"/><path d="M9 3v15M15 6v15"/>',
  TCW: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>',
  PU: '<path d="M7 3h10v18H7z"/><path d="M7 7h10M7 11h10M7 15h10"/>',
  CEP: '<path d="M3 15l9-9 9 9"/><path d="M3 19l9-9 9 9"/>',
  KHP: '<path d="M12 3v11a4 4 0 0 1-8 0"/><path d="M12 14a4 4 0 0 0 4 4h4"/>',
  ACZ: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>',
  '3D': '<circle cx="6" cy="6" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><circle cx="12" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/>',
  STL: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
  PRG: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
};
TECH_ICONS.AHP = TECH_ICONS.KHP;
TECH_ICONS.PLG = TECH_ICONS.SPU = TECH_ICONS.SCG = TECH_ICONS.ERG = TECH_ICONS.AGR = TECH_ICONS.PU;
TECH_ICONS.LWD = '<path d="M20 4C11 4 5 10 4 20"/><path d="M4 20l9-9M9 8h7M7 13h6"/>';
TECH_ICONS.HCS = TECH_ICONS.C100 = TECH_ICONS.PRG;
TECH_ICONS.KEV = TECH_ICONS.TCW;
TECH_ICONS.GLS = TECH_ICONS['3KCW'];
TECH_ICONS.PNT = '<path d="M14 4l6 6-8 8H6v-6z"/><path d="M4 20h6"/>';
TECH_ICONS.LAM = '<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>';
TECH_ICONS.DCT = '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M12 3v18"/>';

function fibreLead(p) {
  const comp = p.composition || { Carbon: p.carbon };
  const names = Object.keys(comp).map(k => k.toLowerCase());
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
  if (p.carbon === 100) return `Performance starts with what a stick is made of. The ${p.name} is a full 100% carbon fibre layup, built for maximum stiffness and power.`;
  if (names.length > 1) return `Performance starts with what a stick is made of. The ${p.name} combines ${list} fibre in a single layup, with ${p.carbon}% carbon setting its stiffness and power.`;
  return `Performance starts with what a stick is made of. The ${p.name} is built with ${p.carbon}% carbon fibre.`;
}

function mountFibre(sec, p) {
  const comp = p.composition || { Carbon: p.carbon };
  const bars = sec.querySelector('.fibre-bars');
  if (bars) bars.innerHTML = Object.entries(comp).map(([k, v]) => {
    const f = FIBRE[k] || { label: k, color: '#888', note: '' };
    return `
      <div class="fbar"><div class="fbar-top"><span><i style="background:${f.color}"></i>${f.label}</span><b>${v}%</b></div>
      <div class="fbar-track"><i style="--w:${v}%;background:${f.color}"></i></div><small>${v > 50 ? 'Most of the layup · ' : ''}${f.note}</small></div>`;
  }).join('');

  const fill = sec.querySelector('.g-fill'), num = sec.querySelector('.gauge strong'), gauge = sec.querySelector('.gauge');
  if (fill && gauge) {
    const C = 2 * Math.PI * 52, target = comp.Carbon || 0;
    fill.style.strokeDasharray = C; fill.style.strokeDashoffset = C;
    const run = () => {
      sec.classList.add('in-view');
      const t0 = performance.now();
      const step = t => {
        const k = Math.min(1, (t - t0) / 1400), ease = 1 - Math.pow(1 - k, 3);
        fill.style.strokeDashoffset = C * (1 - (target / 100) * ease);
        num.textContent = Math.round(target * ease) + '%';
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) run();
    else {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); run(); } }, { threshold: 0.4 });
      io.observe(gauge);
    }
  }

  const cards = sec.querySelector('.tech-cards');
  if (cards) {
    const tech = (p.tech || []).filter(k => TECH[k]);
    const n = tech.length;
    cards.hidden = !n;
    cards.style.setProperty('--cols', n <= 5 ? n : 3);
    cards.style.setProperty('--cols-md', n <= 3 ? n : n === 4 ? 2 : 3);
    cards.innerHTML = tech.map((k, i) => `
      <div class="tcard reveal">
        <div class="tcard-top"><svg viewBox="0 0 24 24">${TECH_ICONS[k] || TECH_ICONS.ACZ}</svg><b>${pad2(i + 1)}</b></div>
        <strong>${k}</strong>
        <span>${TECH[k].name}</span>
        <p>${TECH[k].desc}</p>
      </div>`).join('');
  }
}
