/* ═══════════════════════════════════════════════════════════
   FUTURE SPORTS — animated background
   A drifting tech grid, gold & blue particles that link up
   (and reach toward the cursor), and a slow scanning line.
   Pauses when the tab is hidden; static for reduced-motion.
═══════════════════════════════════════════════════════════ */
(() => {
  const GOLD = '239,59,45', BLUE = '200,205,215';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const c = document.createElement('canvas');
  c.id = 'fx';
  c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  const ctx = c.getContext('2d');

  let W = 0, H = 0, pts = [], nodes = [], raf = 0;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(85, (W * H) / 17000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.3 + 0.5,
      col: Math.random() < 0.28 ? GOLD : BLUE,
      ph: Math.random() * Math.PI * 2,
    }));
    // a few grid intersections that pulse like HUD markers
    nodes = Array.from({ length: Math.round(n / 6) }, () => ({ gx: Math.floor(Math.random() * 40), gy: Math.floor(Math.random() * 40), ph: Math.random() * 6.28 }));
  }

  const GRID = 72;
  function drawGrid(t) {
    const oy = ((t * 0.008) + scrollY * 0.12) % GRID;
    const ox = (mouse.x > 0 ? (mouse.x / W - 0.5) * -14 : 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${BLUE},0.045)`;
    ctx.beginPath();
    for (let x = (ox % GRID) - GRID; x < W + GRID; x += GRID) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = -oy; y < H + GRID; y += GRID) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke();

    // pulsing "+" markers on some intersections
    for (const n of nodes) {
      const x = (ox % GRID) - GRID + n.gx * GRID, y = -oy + n.gy * GRID;
      if (x < 0 || x > W || y < 0 || y > H) continue;
      const a = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(t * 0.0018 + n.ph));
      ctx.strokeStyle = `rgba(${BLUE},${a})`;
      ctx.beginPath(); ctx.moveTo(x - 5, y + 0.5); ctx.lineTo(x + 5, y + 0.5); ctx.moveTo(x + 0.5, y - 5); ctx.lineTo(x + 0.5, y + 5); ctx.stroke();
    }
  }

  function drawParticles(t, move) {
    const LINK = 135, LINK2 = LINK * LINK;
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;

    for (const p of pts) {
      if (move) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
      }
    }
    // links between nearby particles
    ctx.lineWidth = 0.6;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < LINK2) {
          ctx.strokeStyle = `rgba(${a.col},${(1 - d2 / LINK2) * 0.16})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      // reach toward the cursor
      const mx = a.x - mouse.x, my = a.y - mouse.y, m2 = mx * mx + my * my;
      if (m2 < 180 * 180) {
        ctx.strokeStyle = `rgba(${GOLD},${(1 - m2 / (180 * 180)) * 0.35})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    // particles with a soft twinkle
    for (const p of pts) {
      const tw = 0.45 + 0.4 * Math.sin(t * 0.002 + p.ph);
      ctx.fillStyle = `rgba(${p.col},${tw})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawScan(t) {
    const period = 9000, y = ((t % period) / period) * (H + 240) - 120;
    const g = ctx.createLinearGradient(0, y - 110, 0, y + 2);
    g.addColorStop(0, `rgba(${BLUE},0)`);
    g.addColorStop(1, `rgba(${BLUE},0.05)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 110, W, 112);
    ctx.fillStyle = `rgba(${BLUE},0.22)`;
    ctx.fillRect(0, y, W, 1);
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    drawGrid(t);
    drawScan(t);
    drawParticles(t, true);
    raf = requestAnimationFrame(frame);
  }

  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', e => { mouse.tx = e.clientX; mouse.ty = e.clientY; if (mouse.x < -999) { mouse.x = e.clientX; mouse.y = e.clientY; } }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.tx = mouse.ty = -9999; });

  if (reduce) {
    ctx.clearRect(0, 0, W, H); drawGrid(0); drawParticles(0, false);
    addEventListener('resize', () => { drawGrid(0); drawParticles(0, false); });
    return;
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(frame);
  });
  raf = requestAnimationFrame(frame);
})();
