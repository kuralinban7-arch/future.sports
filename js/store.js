/* ═══════════════════════════════════════════════════════════
   SNS STORE — shared shell: header, footer, cart drawer, toast
═══════════════════════════════════════════════════════════ */

const ICON = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="m5 12 5 5 9-10"/></svg>',
  arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

/* ─────────────── Cart state ─────────────── */
const CART_KEY = 'sns-cart-v1';
const Cart = {
  items: [],
  load() {
    try { this.items = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { this.items = []; }
    this.items = this.items.filter(i => getProduct(i.id) && canBuy(getProduct(i.id)));
  },
  save() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch {}
    renderCart();
  },
  key(id, variant, size) { return [id, variant ?? '', size].join('|'); },
  add(id, { variant = null, size, qty = 1 } = {}) {
    const p = getProduct(id);
    if (!p || !canBuy(p)) return false;
    if (p.variants && variant == null) variant = 0;   // products with colours always need one
    // quick-add from a card: first length, plus the first bow shape for sticks that have one
    size = size || [sizesOf(p)[0], p.bows ? p.bows[0] : ''].filter(Boolean).join(' · ');
    const key = this.key(id, variant, size);
    const line = this.items.find(i => i.key === key);
    if (line) line.qty = Math.min(line.qty + qty, maxQty(p));
    else this.items.push({ key, id, variant, size, qty });
    this.save();
    return true;
  },
  setQty(key, qty) {
    const line = this.items.find(i => i.key === key);
    if (!line) return;
    if (qty <= 0) this.items = this.items.filter(i => i.key !== key);
    else line.qty = Math.min(qty, maxQty(getProduct(line.id)));
    this.save();
  },
  remove(key) { this.items = this.items.filter(i => i.key !== key); this.save(); },
  clear() { this.items = []; this.save(); },
  count() { return this.items.reduce((n, i) => n + i.qty, 0); },
  // bulk prices count every colour of the same product together (3 orange + 3 white = 6)
  qtyOf(id) { return this.items.filter(i => i.id === id).reduce((n, i) => n + i.qty, 0); },
  unit(line) { return unitPrice(getProduct(line.id), this.qtyOf(line.id)); },
  lineTotal(line) { return this.unit(line) * line.qty; },
  subtotal() { return this.items.reduce((s, i) => s + this.lineTotal(i), 0); },
  shipping() { const s = this.subtotal(); return s === 0 || s >= STORE.freeShippingOver ? 0 : STORE.shippingFee; },
};

/* ─────────────── WhatsApp ─────────────── */
ICON.wa = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>';
ICON.phone = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>';
/* link that opens a WhatsApp chat with the shop, optionally with a pre-written message */
function waLink(text) {
  const n = ((STORE.contact || {}).whatsapp || '').replace(/\D/g, '');
  return n ? `https://wa.me/${n}${text ? '?text=' + encodeURIComponent(text) : ''}` : '';
}

/* ─────────────── Shell ─────────────── */
ICON.search = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>';

function renderShell(active) {
  const inCollection = ['shop', 'cat', ...Object.keys(SERIES).map(k => k.toLowerCase())].includes(active);
  const catList = CATEGORIES.filter(c => !c.main).map(c => {
    const n = categoryCount(c.id);
    return `<a href="shop.html?cat=${c.id}"><span>${c.name}</span>${n ? `<small>${n}</small>` : '<small data-soon>Soon</small>'}</a>`;
  }).join('');
  const soonNote = n => n ? `<small>${n}</small>` : '<small data-soon>Soon</small>';
  const mainSlots = CATEGORIES.filter(c => c.main).map(c => ({ name: c.name, links:
    `<a href="shop.html?cat=${c.id}"><span>All ${c.name}</span>${soonNote(categoryCount(c.id))}</a>` +
    c.subs.map(s => `<a href="shop.html?cat=${c.id}&sub=${s.id}"><span>${s.name}</span>${soonNote(subCount(c.id, s.id))}</a>`).join('') }));
  const stickLinks = `
    <a href="shop.html?cat=composite-hockey-sticks"><span>All composite sticks</span><small>${categoryCount('composite-hockey-sticks')}</small></a>
    ${Object.keys(SERIES).map(k => `<a href="shop.html?series=${k}"><span>${SERIES[k].label ? seriesName(k) + ' series' : seriesName(k)}</span><small>${PRODUCTS.filter(p => p.series === k).length}</small></a>`).join('')}
    <a href="shop.html"><span>Shop all equipment</span><small>${PRODUCTS.length}</small></a>`;
  const home = active === 'home' ? '' : 'index.html';

  document.getElementById('header').outerHTML = `
    <header class="site-header">
      <div class="container nav">
        <a href="index.html" class="logo" aria-label="Future Sports home">
          <img src="brand/logo.png" alt="" class="logo-mark" width="40" height="40">
          <span class="logo-text"><b>FUTURE</b><i>SPORTS</i></span>
        </a>
        <ul class="nav-links">
          <li class="has-menu">
            <a href="shop.html" class="${inCollection ? 'active' : ''}" aria-haspopup="true">Collection <span class="caret">▾</span></a>
            <div class="mega"><div class="mega-inner">
              <div class="mega-col"><h6>Hockey sticks</h6>${stickLinks}</div>
              <div class="mega-col wide">${mainSlots.map(m => `<h6>${m.name}</h6><div class="mega-grid mega-main">${m.links}</div>`).join('')}<h6>Categories</h6><div class="mega-grid">${catList}</div></div>
            </div></div>
          </li>
          <li><a href="${home}#technology" class="${active === 'tech' ? 'active' : ''}">Technology</a></li>
          <li><a href="${home}#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div class="nav-actions">
          <button class="icon-btn" id="searchBtn" aria-label="Search">${ICON.search}</button>
          <button class="icon-btn" id="cartBtn" aria-label="Open cart">${ICON.bag}<span class="cart-count" id="cartCount">0</span></button>
          <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menu">${ICON.menu}</button>
        </div>
      </div>
      <form class="search-bar" id="searchBar" action="shop.html" role="search">
        <div class="container">${ICON.search}<input name="q" id="searchInput" placeholder="Search sticks, gloves, grips…" autocomplete="off" aria-label="Search products"><button type="button" id="searchClose" aria-label="Close search">${ICON.close}</button></div>
      </form>
      <nav class="mobile-nav" id="mobileNav">
        <details class="m-cats" open><summary>Hockey sticks</summary><div class="m-cat-list">${stickLinks}</div></details>
        ${mainSlots.map(m => `<details class="m-cats"><summary>${m.name}</summary><div class="m-cat-list">${m.links}</div></details>`).join('')}
        <details class="m-cats"><summary>Categories</summary><div class="m-cat-list">${catList}</div></details>
        <a href="${home}#technology">Technology</a>
        <a href="${home}#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>`;

  const C = STORE.contact || {};
  const contactRows = [
    C.email && `<li>${ICON.mail || ''}<a href="mailto:${C.email}">${C.email}</a></li>`,
    C.phone && `<li>${ICON.phone}<a href="tel:${C.phone.replace(/\s/g, '')}">${C.phone}</a></li>`,
    C.whatsapp && `<li>${ICON.wa}<a href="${waLink('Hi Future Sports, I have a question.')}" target="_blank" rel="noopener">Chat on WhatsApp</a></li>`,
    C.address && `<li>${C.address}</li>`,
    C.hours && `<li>${C.hours}</li>`,
  ].filter(Boolean);

  document.getElementById('footer').outerHTML = `
    <footer class="site-footer" id="contact">
      <div class="container">
        <div class="foot-top">
          <div class="foot-brand">
            <a href="index.html" class="logo"><img src="brand/logo.png" alt="" class="logo-mark" width="40" height="40"><span class="logo-text"><b>FUTURE</b><i>SPORTS</i></span></a>
            <p class="about">Professional hockey equipment, selected and presented with the care the game deserves. Built for the game. Engineered for the future.</p>
            <ul class="contact-list">${contactRows.length ? contactRows.join('') : '<li class="muted">Contact details coming soon.</li>'}</ul>
            <form class="newsletter" onsubmit="event.preventDefault(); this.reset(); toast('Thanks! You are on the list.');">
              <input type="email" required placeholder="Email for new arrivals" aria-label="Email address">
              <button>Join</button>
            </form>
          </div>
          <div>
            <h5>Collection</h5>
            <ul class="foot-cats">
              <li><a href="shop.html">All equipment</a></li>
              ${CATEGORIES.map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="${home}#about">About us</a></li>
              <li><a href="${home}#technology">Technology</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li><a href="#" onclick="openCart();return false;">Your cart</a></li>
              <li><a href="checkout.html">Checkout</a></li>
              <li><span class="muted">Free shipping over ${money(STORE.freeShippingOver)}</span></li>
              <li><span class="muted">Cash on delivery available</span></li>
            </ul>
          </div>
        </div>
        <div class="foot-word" aria-hidden="true">FUTURE SPORTS</div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Future Sports. All rights reserved.</span>
          <span>Product names, logos and brands shown are the property of their respective owners.</span>
        </div>
      </div>
    </footer>`;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay" id="overlay"></div>
    <aside class="drawer" id="drawer" aria-label="Shopping cart">
      <div class="drawer-head"><h3>Your Cart</h3><button class="icon-btn" id="closeCart" aria-label="Close cart">${ICON.close}</button></div>
      <div class="drawer-body" id="drawerBody"></div>
      <div class="drawer-foot" id="drawerFoot"></div>
    </aside>
    <div class="toast" id="toast"></div>
    ${waLink() ? `<a class="wa-fab" href="${waLink('Hi Future Sports, I have a question.')}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${ICON.wa}<span>Chat with us</span></a>` : ''}`);

  const $id = id => document.getElementById(id);
  $id('cartBtn').onclick = openCart;
  $id('closeCart').onclick = closeCart;
  $id('overlay').onclick = closeCart;
  $id('menuBtn').onclick = () => $id('mobileNav').classList.toggle('open');
  $id('searchBtn').onclick = () => { $id('searchBar').classList.toggle('open'); setTimeout(() => $id('searchInput').focus(), 50); };
  $id('searchClose').onclick = () => $id('searchBar').classList.remove('open');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); $id('searchBar').classList.remove('open'); } });
  // header turns solid once the page scrolls
  const hdr = document.querySelector('.site-header');
  const onScroll = () => hdr.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  Cart.load();
  renderCart();
  initReveal();
  initScramble();
}

/* cut-out product image (transparent background), falling back to the photo */
const CUT_EDGES = 'e=2';   // bump when the cut-outs are redone (e=2: edges cleaned with tools/defringe.py, 26 Nov 2026)
function cutImg(p, cls = '') {
  const orig = productImages(p)[0];
  if (p.photoCard || /^https?:/.test(orig)) return `<img src="${orig}" alt="${p.name}" class="${cls} nocut" loading="lazy">`;      // no cut-out exists: the card shows the photo
  const cut = orig.replace(/\.jpg(\?.*)?$/, (m, q) => `-cut.webp${q ? q + '&' : '?'}${CUT_EDGES}`);
  return `<img src="${cut}" alt="${p.name}" class="${cls}" loading="lazy" onerror="this.onerror=null;this.src='${orig}';this.classList.add('nocut')">`;
}

/* headline "decode" effect: letters scramble, then settle left to right */
let scrambleObserver;
function initScramble() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%&*';
  const run = el => {
    const nodes = [];
    const walk = n => n.childNodes.forEach(c => c.nodeType === 3 ? (c.textContent.trim() && nodes.push(c)) : walk(c));
    walk(el);
    nodes.forEach(node => {
      const final = node.textContent, t0 = performance.now(), dur = 500 + final.length * 22;
      const tick = t => {
        const k = Math.min(1, (t - t0) / dur), settled = Math.floor(k * final.length);
        node.textContent = final.split('').map((ch, i) => i < settled || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
        if (k < 1) requestAnimationFrame(tick); else node.textContent = final;
      };
      requestAnimationFrame(tick);
    });
  };
  scrambleObserver = scrambleObserver || new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { scrambleObserver.unobserve(e.target); run(e.target); }
  }), { threshold: 0.3 });
  document.querySelectorAll('[data-scramble]:not([data-scrambled])').forEach(el => { el.dataset.scrambled = '1'; scrambleObserver.observe(el); });
}

function openCart() { document.getElementById('drawer').classList.add('open'); document.getElementById('overlay').classList.add('open'); document.body.classList.add('lock'); }
function closeCart() { document.getElementById('drawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); document.body.classList.remove('lock'); }

function cartLineHTML(line, compact) {
  const p = getProduct(line.id);
  const img = productImages(p, line.variant ?? 0)[0];
  const meta = [p.variants ? (p.variants[line.variant ?? 0] || p.variants[0]).name : '', line.size === 'One Size' ? '' : line.size, compact ? 'Qty ' + line.qty : ''].filter(Boolean).join(' · ');
  const bulk = p.bulk && Cart.unit(line) !== p.price;
  return `
    <div class="cart-line">
      <a href="product.html?id=${p.id}" class="thumb"><img src="${img}" alt="${p.name}"></a>
      <div>
        <h4>${p.name}</h4>
        <div class="meta">${meta}</div>
        ${compact ? '' : `<div class="qty">
          <button onclick="Cart.setQty('${line.key}', ${line.qty - 1})" aria-label="Decrease">−</button>
          <span>${line.qty}</span>
          <button onclick="Cart.setQty('${line.key}', ${line.qty + 1})" aria-label="Increase">+</button>
        </div>`}
      </div>
      <div class="right">
        <span class="price">${money(Cart.lineTotal(line))}</span>
        ${bulk ? `<small class="each">${money(Cart.unit(line))} each</small>` : ''}
        ${compact ? '' : `<button class="remove" onclick="Cart.remove('${line.key}')">Remove</button>`}
      </div>
    </div>`;
}

function renderCart() {
  const count = Cart.count();
  const badge = document.getElementById('cartCount');
  if (badge) {
    const prev = +badge.textContent;
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
    if (count > prev) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
  }
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body) return;

  if (!Cart.items.length) {
    body.innerHTML = `<div class="cart-empty">${ICON.bag}<p>Your cart is empty.</p><a href="shop.html" class="btn">Shop Sticks</a></div>`;
    foot.innerHTML = '';
  } else {
    body.innerHTML = Cart.items.map(l => cartLineHTML(l)).join('');
    const sub = Cart.subtotal();
    const left = STORE.freeShippingOver - sub;
    const pct = Math.min(100, (sub / STORE.freeShippingOver) * 100);
    foot.innerHTML = `
      <div class="ship-meter">${left > 0 ? `Add <b style="color:var(--text-primary)">${money(left)}</b> more for free shipping` : 'You have unlocked <b style="color:var(--accent)">free shipping</b>'}
        <div class="bar"><i style="width:${pct}%"></i></div></div>
      <div class="line-total"><span>Subtotal</span><span class="price">${money(sub)}</span></div>
      <a href="checkout.html" class="btn btn-accent btn-block">Checkout</a>
      <button class="link-arrow" style="justify-content:center" onclick="closeCart()">Continue shopping</button>`;
  }
  document.dispatchEvent(new CustomEvent('cart:change'));
}

/* ─────────────── Toast ─────────────── */
let toastTimer;
function toast(msg, withCart) {
  const t = document.getElementById('toast');
  t.innerHTML = `<span>${msg}</span>${withCart ? '<button onclick="openCart()">View cart</button>' : ''}`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

function quickAdd(id) {
  const p = getProduct(id);
  const sz = sizesOf(p);
  if (Cart.add(id, { variant: p.variants ? 0 : null })) toast(`${p.name}${sz.length > 1 ? ` (${sz[0]})` : ''} added to cart`, true);
}

/* ─────────────── Product card ─────────────── */
const COMP_CLASS = { Carbon: 'c-carbon', Glass: 'c-glass', Aramid: 'c-aramid', Kevlar: 'c-aramid' };
function compBar(comp) {
  const parts = Object.entries(comp);
  const total = parts.reduce((s, [, v]) => s + v, 0);
  const bars = parts.map(([k, v]) => `<i class="${COMP_CLASS[k] || 'c-other'}" style="width:${v}%"></i>`).join('');
  const rest = total < 100 ? `<i class="c-other" style="width:${100 - total}%;opacity:.25"></i>` : '';
  return `<div class="comp-bar">${bars}${rest}</div>
    <div class="comp-legend">${parts.map(([k, v]) => `${v}% ${k}`).join(' · ')}</div>`;
}

function productCard(p) {
  const swatches = p.variants
    ? `<div class="swatches">${p.variants.map(v => `<span title="${v.name}" style="background:${v.swatch}"></span>`).join('')}</div>` : '';
  return `
    <article class="product-card reveal" style="--p-accent:${p.accent}">
      <a href="product.html?id=${p.id}" class="media">
        ${!inStock(p) ? '<span class="badge soldout">Out of stock</span>' : p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        ${p.carbon ? `<span class="carbon-chip">${p.carbon}<small>%</small></span>` : ''}
        ${cutImg(p)}
      </a>
      <div class="info">
        <span class="series-label">${p.series ? seriesTitle(p) : slotLabel(p)}</span>
        <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
        <span class="tag">${p.carbon ? p.carbon + '% Carbon' : p.tagline || ''}</span>
        ${p.composition ? compBar(p.composition) : sizesOf(p).length > 1 ? `<div class="size-legend">Sizes ${sizesOf(p).join(' · ')}</div>` : ''}
        ${p.bulk ? `<div class="size-legend">${bulkNote(p)}</div>` : ''}
        ${swatches}
        <div class="row">
          <span class="price ${hasPrice(p) ? '' : 'tba'}">${priceLabel(p)}</span>
          ${canBuy(p) ? `<button class="quick-add" onclick="quickAdd('${p.id}')">Add to cart</button>` : `<a class="quick-add" href="product.html?id=${p.id}">View</a>`}
        </div>
      </div>
    </article>`;
}

/* ─────────────── Category tile ─────────────── */
function catTile(c) {
  const n = categoryCount(c.id);
  return `
    <a href="shop.html?cat=${c.id}" class="cat-tile reveal ${c.cover ? 'has-cover' : ''} ${n ? '' : 'is-empty'}">
      ${c.cover ? `<div class="cat-cover"><img src="${c.cover}" alt="${c.name}" loading="lazy"></div>` : ''}
      <div class="cat-body">
        <span class="cat-icon">${ICON.bag}</span>
        <h3>${c.name}</h3>
        ${n ? `<span class="cat-count">${n} product${n === 1 ? "" : "s"} ${ICON.arrow}</span>` : '<span class="cat-soon">Coming soon</span>'}
      </div>
    </a>`;
}

/* ─────────────── Reveal on scroll ─────────────── */
let revealObserver;
function initReveal() {
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); return; }
  revealObserver = revealObserver || new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}

function qs(name) { return new URLSearchParams(location.search).get(name); }
