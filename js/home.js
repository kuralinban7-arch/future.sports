/* ═══════════════════════════════════════════════════════════
   FUTURE SPORTS — home page sections
═══════════════════════════════════════════════════════════ */
renderShell('home');

const HERO = getProduct('blade-7');
const $ = id => document.getElementById(id);

/* ── Ticker ── */
(() => {
  const words = ['Advanced Control Zone', '70% Carbon Fibre', '25% Glass Fibre', '5% Aramid', '3K Carbon Weave', 'Kevlar Heel Protection', 'Carbon Edge Protection'];
  const run = words.map(w => `<span>${w}</span><i></i>`).join('');
  $('ticker').innerHTML = run + run;
})();

/* ── Inspect every detail (shared with every stick page) ── */
mountInspect($('inspectHome'), HERO);

/* ── Selected for performance ── */
(() => {
  const ids = ['blade-7', 'prism-80', 'ax-7', 'ultralight-glove', 'shrink-grip'];
  $('featureBento').innerHTML = ids.map((id, i) => {
    const p = getProduct(id), cat = getCategory(p.category);
    return `
      <a href="product.html?id=${p.id}" class="feat ${i === 0 ? 'feat-big' : ''} reveal">
        <span class="feat-label">${p.series ? seriesTitle(p) : cat.name}</span>
        <span class="feat-go">↗</span>
        <div class="feat-img">${cutImg(p)}</div>
        <div class="feat-info">
          <h3>${p.name.replace('SNS ', '')}</h3>
          <span class="feat-sub">${p.carbon ? p.carbon + '% carbon' : p.tagline || ''}</span>
          <span class="feat-price">${priceLabel(p)}</span>
        </div>
      </a>`;
  }).join('');
})();

/* ── Built from the fibre up ── */
mountFibre($('technology'), HERO);

/* ── Player levels ── */
(() => {
  const LEVELS = [
    { id: 'beginner', name: 'Beginner', bars: 1, range: [10, 30],
      text: 'Learning the fundamentals, first teams, building skills and getting comfortable on the ball.',
      pts: ['A forgiving, easy-to-control feel', 'Durable for regular practice', 'Lower carbon for more touch'] },
    { id: 'intermediate', name: 'Intermediate', bars: 2, range: [40, 60],
      text: 'Playing regularly and building consistency across passing, receiving and hitting.',
      pts: ['A balance of power and control', 'Forged carbon weave layups', 'Kit that keeps up with more sessions'] },
    { id: 'advanced', name: 'Advanced', bars: 3, range: [70, 80],
      text: 'Competing at a high tempo, where speed of skill and striking power start to decide games.',
      pts: ['Stiffer sticks for more power', '3K and tri-axial carbon weaves', 'Reinforced edges and heel'] },
    { id: 'professional', name: 'Professional', bars: 4, range: [90, 100],
      text: 'Performing at the top level, with equipment chosen to match personal preference.',
      pts: ['Maximum stiffness and power', 'Layups up to a full 100% carbon', 'Elite feel for set pieces'] },
  ];
  $('levelCards').innerHTML = LEVELS.map((l, i) => {
    const n = PRODUCTS.filter(p => p.carbon >= l.range[0] && p.carbon <= l.range[1]).length;
    return `
      <a href="shop.html?cat=composite-hockey-sticks&level=${l.id}" class="level ${i === 1 ? 'active' : ''} reveal">
        <div class="level-top"><b>${String(i + 1).padStart(2, '0')}</b><span class="bars">${[1, 2, 3, 4].map(k => `<i class="${k <= l.bars ? 'on' : ''}" style="height:${4 + k * 4}px"></i>`).join('')}</span></div>
        <h3>${l.name}</h3>
        <p>${l.text}</p>
        <ul>${l.pts.map(t => `<li>${t}</li>`).join('')}</ul>
        <div class="level-foot"><span>${l.range[0]}–${l.range[1]}% carbon · ${n} sticks</span><span class="go">→</span></div>
      </a>`;
  }).join('');
  const cards = [...document.querySelectorAll('.level')];
  cards.forEach(c => c.addEventListener('mouseenter', () => cards.forEach(x => x.classList.toggle('active', x === c))));
})();

/* ── Category bento ── */
(() => {
  const live = CATEGORIES.filter(c => categoryCount(c.id));
  const soon = CATEGORIES.filter(c => !c.main && !categoryCount(c.id));
  const big = live.find(c => c.id === 'composite-hockey-sticks');
  const mains = CATEGORIES.filter(c => c.main);                       // main slots show their own slots inside the tile
  const order = [big, ...mains, ...live.filter(c => c !== big && !c.main)];
  const coverOf = c => {
    const p = PRODUCTS.find(x => x.category === c.id && (c.id !== 'composite-hockey-sticks' || x.id === 'prism-80'));
    return p ? cutImg(p) : '';
  };
  $('catBento').innerHTML = `
    <div class="cat-live">
      ${order.map((c, i) => {
        const n = categoryCount(c.id);
        if (c.main) return `<div class="cbox cbox-main reveal">
          <a href="shop.html?cat=${c.id}" class="cbox-cover" aria-label="${c.name}"></a>
          <span class="cbox-n">${n} product${n === 1 ? '' : 's'}</span><span class="cbox-go">↗</span>
          <div class="cbox-img">${coverOf(c)}</div>
          <div class="cbox-info"><h3>${c.name}</h3><div class="cbox-subs">${c.subs.map(s => `<a href="shop.html?cat=${c.id}&sub=${s.id}">${s.name}<small>${subCount(c.id, s.id) || 'Soon'}</small></a>`).join('')}</div></div>
        </div>`;
        return `<a href="shop.html?cat=${c.id}" class="cbox ${i === 0 ? 'cbox-big' : ''} reveal">
          <span class="cbox-n">${n} product${n === 1 ? '' : 's'}</span><span class="cbox-go">↗</span>
          <div class="cbox-img">${coverOf(c)}</div>
          <div class="cbox-info"><h3>${c.name}</h3>${i === 0 ? '<p>SNS Prism, SNS Blade, Alfa, Fenta, Malik, Flash, Marex, Vijayanti, Deep, Rysum and STK composite sticks for every position on the pitch.</p>' : ''}</div>
        </a>`;
      }).join('')}
    </div>
    <div class="cat-soon-head"><span class="kicker"><i></i>Coming soon</span></div>
    <div class="cat-soon-grid">
      ${soon.map(c => `<a href="shop.html?cat=${c.id}" class="csoon reveal"><b>${String(CATEGORIES.indexOf(c) + 1).padStart(2, '0')}</b><span>${c.name}</span><em>Soon</em></a>`).join('')}
    </div>`;
})();

initReveal();
initScramble();
