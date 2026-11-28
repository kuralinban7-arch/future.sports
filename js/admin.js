/* ═══════════════════════════════════════════════════════════
   Future Sports admin: orders and products, kept in the shop's database (js/db.js).
   Works on any host (GitHub Pages too). Only logins listed in the database's admins table
   can see orders or change anything; the database itself enforces that.
═══════════════════════════════════════════════════════════ */
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clean = s => String(s ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();   // product text goes into the shop's pages
  const SESSION_KEY = 'fs-admin-v1';
  const STATUS = { new: 'New', paid: 'Paid', shipped: 'Shipped', cancelled: 'Cancelled' };

  let session = null, refreshing = null;
  let orders = [], orderFilter = 'new';
  let rows = [], prodFilter = 'shown';
  let edit = null;   // { row (null = new product), data, dirty }

  function toast(t) { $('toast').textContent = t; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3200); }
  function show(id) { ['loading', 'login', 'app'].forEach(v => { $(v).hidden = v !== id; }); }

  /* ─────────────── log in ─────────────── */
  async function auth(grant, body) {
    const r = await fetch(`${DB.url}/auth/v1/token?grant_type=${grant}`, { method: 'POST', headers: { apikey: DB.key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error_description || j.msg || j.message || 'Could not log in');
    return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in - 60) * 1000, email: j.user && j.user.email };
  }
  function keep(s) { session = s; try { if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(SESSION_KEY); } catch {} }
  async function token() {
    if (!session) throw new Error('Please log in again');
    if (Date.now() > session.expires_at) {
      refreshing = refreshing || auth('refresh_token', { refresh_token: session.refresh_token }).then(keep).finally(() => { refreshing = null; });
      try { await refreshing; } catch (e) { loggedOut(); throw new Error('Please log in again'); }
    }
    return session.access_token;
  }
  const api = async (path, opts = {}) => DB.rest(path, { ...opts, token: await token() });

  async function isAdmin() { const r = await api('admins?select=user_id'); return Array.isArray(r) && r.length > 0; }

  function loggedOut(msg) {
    keep(null);
    show('login');
    $('loginError').textContent = msg || '';
  }

  async function start() {
    if (typeof DB === 'undefined' || !DB.on) {
      show('login');
      $('loginHelp').textContent = 'The shop database is not connected yet (js/db.js).';
      $('loginBtn').disabled = true;
      return;
    }
    try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { session = null; }
    if (session) {
      try { if (await isAdmin()) return openApp(); } catch (e) { /* expired or offline: log in again */ }
      keep(null);
    }
    show('login');
    $('email').focus();
  }

  $('showPw').onclick = () => { const p = $('password'); p.type = p.type === 'password' ? 'text' : 'password'; $('showPw').textContent = p.type === 'password' ? 'Show' : 'Hide'; };
  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('email').value.trim(), password = $('password').value;
    if (!email || !password) { $('loginError').textContent = 'Enter your email and password.'; return; }
    $('loginBtn').disabled = true; $('loginError').textContent = '';
    try {
      keep(await auth('password', { email, password }));
      if (!(await isAdmin())) { loggedOut('This login is not a shop admin.'); return; }
      $('password').value = '';
      openApp();
    } catch (err) {
      keep(null);
      $('loginError').textContent = /invalid/i.test(err.message) ? 'Wrong email or password.' : err.message;
    } finally { $('loginBtn').disabled = false; }
  });
  $('logout').onclick = async () => {
    try { await fetch(`${DB.url}/auth/v1/logout`, { method: 'POST', headers: { apikey: DB.key, Authorization: 'Bearer ' + session.access_token } }); } catch {}
    loggedOut();
  };

  function openApp() {
    show('app');
    $('who').textContent = session.email || 'Admin';
    showTab('orders');
    loadOrders();
    loadProducts();
  }

  /* ─────────────── tabs ─────────────── */
  function showTab(name) {
    if (edit && edit.dirty && !confirm('Leave without saving your changes?')) return;
    edit = null;
    $('tabOrders').setAttribute('aria-selected', name === 'orders');
    $('tabProducts').setAttribute('aria-selected', name !== 'orders');
    $('ordersView').hidden = name !== 'orders';
    $('productsView').hidden = name !== 'products';
    $('editView').hidden = true;
    scrollTo(0, 0);
  }
  $('tabOrders').onclick = () => { showTab('orders'); loadOrders(); };
  $('tabProducts').onclick = () => showTab('products');

  /* ─────────────── orders ─────────────── */
  const when = iso => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  const waNumber = phone => { const d = String(phone).replace(/\D/g, ''); return d.length === 10 ? '91' + d : d; };

  async function loadOrders() {
    try {
      orders = await api('orders?select=*&order=created_at.desc&limit=500');
      drawOrders();
    } catch (e) { $('orderCount').textContent = 'Could not load orders: ' + e.message; }
  }
  $('refreshOrders').onclick = () => loadOrders().then(() => toast('Orders updated'));
  setInterval(() => { if (!document.hidden && session && !$('ordersView').hidden) loadOrders(); }, 60e3);

  function drawOrders() {
    const n = s => orders.filter(o => s === 'all' || o.status === s).length;
    const fresh = n('new');
    $('newCount').hidden = !fresh; $('newCount').textContent = fresh;
    $('orderChips').innerHTML = [...Object.keys(STATUS), 'all'].map(s =>
      `<button data-s="${s}" aria-pressed="${orderFilter === s}">${s === 'all' ? 'All' : STATUS[s]} <small>${n(s)}</small></button>`).join('');
    $('orderChips').querySelectorAll('button').forEach(b => b.onclick = () => { orderFilter = b.dataset.s; drawOrders(); });

    const list = orders.filter(o => orderFilter === 'all' || o.status === orderFilter);
    $('orderCount').textContent = list.length ? `${list.length} order${list.length > 1 ? 's' : ''}` : (orderFilter === 'new' ? 'No new orders.' : 'No orders here.');
    $('orders').innerHTML = list.map(o => `
      <li class="order s-${o.status}" data-no="${esc(o.no)}">
        <div class="o-head"><b>${esc(o.no)}</b><span class="pill ${o.status}">${STATUS[o.status]}</span><time>${when(o.created_at)}</time></div>
        <div class="o-who"><b>${esc(o.name)}</b>
          <a href="tel:${esc(o.phone)}">${esc(o.phone)}</a>
          <a class="wa" target="_blank" rel="noopener" href="https://wa.me/${waNumber(o.phone)}?text=${encodeURIComponent(`Hi ${o.name.split(' ')[0]}, this is Future Sports about your order ${o.no}.`)}">WhatsApp</a></div>
        <div class="o-addr muted">${esc((o.address || []).join(', '))}${o.email ? ` · ${esc(o.email)}` : ''}</div>
        <ul class="o-lines">${(o.lines || []).map(l => `
          <li>${l.img ? `<img src="${esc(l.img)}" alt="" loading="lazy">` : '<span></span>'}<span>${esc(l.name)}<small>${esc([l.meta, 'Qty ' + l.qty].filter(Boolean).join(' · '))}</small></span><b>${money(l.total)}</b></li>`).join('')}</ul>
        <div class="o-total"><span>${o.pay === 'cod' ? 'Cash on delivery' : 'GPay / UPI'}${o.ship ? ` · shipping ${money(o.ship)}` : ''}${o.cod_fee ? ` · COD ${money(o.cod_fee)}` : ''}</span><b>${money(o.total)}</b></div>
        <div class="o-status" role="group" aria-label="Order status">${Object.keys(STATUS).map(s => `<button data-s="${s}" aria-pressed="${o.status === s}">${STATUS[s]}</button>`).join('')}</div>
        <label class="o-note"><span>Your note (e.g. UPI ref. no.)</span><input value="${esc(o.shop_note || '')}" maxlength="500" placeholder="Only you see this"></label>
      </li>`).join('');

    $('orders').querySelectorAll('.order').forEach(li => {
      const o = orders.find(x => x.no === li.dataset.no);
      li.querySelectorAll('.o-status button').forEach(b => b.onclick = () => setOrder(o, { status: b.dataset.s }, `${o.no}: ${STATUS[b.dataset.s]}`));
      const note = li.querySelector('.o-note input');
      note.onchange = () => setOrder(o, { shop_note: note.value.trim() || null }, 'Note saved', true);
    });
  }

  async function setOrder(o, change, msg, quiet) {
    const before = { ...o };
    Object.assign(o, change);
    if (!quiet) drawOrders();
    try { await api(`orders?no=eq.${encodeURIComponent(o.no)}`, { method: 'PATCH', body: change, prefer: 'return=minimal' }); toast(msg); }
    catch (e) { Object.assign(o, before); drawOrders(); toast('Not saved: ' + e.message); }
  }

  /* ─────────────── products ─────────────── */
  const catName = id => (getCategory(id) || { name: id || '—' }).name;
  const firstImage = d => (d.variants && d.variants[0] ? d.variants[0].images : d.images || [])[0] || '';
  const priceText = d => typeof d.price === 'number' ? money(d.price) + (d.unit ? ' / ' + d.unit : '') : (d.tba || 'Update soon');

  $('cat').innerHTML = '<option value="all">All categories</option>' + CATEGORIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  $('fCat').innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  $('q').oninput = drawProducts; $('cat').onchange = drawProducts;

  async function loadProducts() {
    try {
      rows = await api('products?select=id,sort,hidden,data,updated_at&order=sort');
      drawProducts();
    } catch (e) { $('prodCount').textContent = 'Could not load products: ' + e.message; }
  }

  function drawProducts() {
    const q = $('q').value.trim().toLowerCase(), cat = $('cat').value;
    const groups = { shown: r => !r.hidden, out: r => !r.hidden && r.data.inStock === false, soon: r => !r.hidden && typeof r.data.price !== 'number', removed: r => r.hidden };
    const labels = { shown: 'In the shop', out: 'Out of stock', soon: 'No price yet', removed: 'Removed' };
    $('prodChips').innerHTML = Object.keys(groups).map(k => `<button data-k="${k}" aria-pressed="${prodFilter === k}">${labels[k]} <small>${rows.filter(groups[k]).length}</small></button>`).join('');
    $('prodChips').querySelectorAll('button').forEach(b => b.onclick = () => { prodFilter = b.dataset.k; drawProducts(); });

    const list = rows.filter(groups[prodFilter])
      .filter(r => cat === 'all' || (r.data.category || 'composite-hockey-sticks') === cat)
      .filter(r => !q || [r.id, r.data.name, r.data.brand, r.data.tagline, catName(r.data.category)].join(' ').toLowerCase().includes(q));
    $('prodCount').textContent = rows.length ? `${list.length} of ${rows.length} products` : 'No products in the database yet.';
    $('importBox').hidden = rows.length > 0;
    $('products').innerHTML = list.map(r => {
      const d = r.data, out = d.inStock === false;
      return `<li><button data-id="${esc(r.id)}">
        <img class="thumb" src="${esc(firstImage(d))}" alt="" loading="lazy">
        <span class="name">${esc(d.name)}</span>
        <span class="meta">${esc(catName(d.category))} · <b class="${typeof d.price === 'number' ? '' : 'soon'}">${esc(priceText(d))}</b>${out ? ' · <b class="out">Out of stock</b>' : ''}${r.hidden ? ' · <b class="out">Removed</b>' : ''}</span>
      </button></li>`;
    }).join('');
    $('products').querySelectorAll('button').forEach(b => b.onclick = () => openEditor(rows.find(r => r.id === b.dataset.id)));
  }

  /* first setup: copy the built-in catalogue (js/products.js) into the empty database.
     Products already in the database are never overwritten. */
  $('importBtn').onclick = async () => {
    if (!confirm(`Copy the ${PRODUCTS.length} products from the website into the database?`)) return;
    const list = PRODUCTS.map((p, i) => {
      const data = JSON.parse(JSON.stringify(p));
      if (data.bulkSetup) { data.bulk = data.bulkSetup; delete data.bulkSetup; }   // as written in products.js, before the page worked it out
      const id = data.id; delete data.id;
      return { id, sort: (i + 1) * 10, data };
    });
    $('importBtn').disabled = true; $('importBtn').textContent = 'Copying…';
    try {
      await api('products?on_conflict=id', { method: 'POST', body: list, prefer: 'resolution=ignore-duplicates,return=minimal' });
      await loadProducts();
      toast(`${rows.length} products are now in the database`);
    } catch (e) { toast('Not copied: ' + e.message); }
    finally { $('importBtn').disabled = false; $('importBtn').textContent = 'Copy products into the database'; }
  };

  /* ─────────────── one product ─────────────── */
  function openEditor(row) {
    const data = row ? JSON.parse(JSON.stringify(row.data)) : { name: '', price: null, tba: 'Update soon', category: CATEGORIES[0].id, sizes: ['One Size'], badge: 'New', accent: '#ef3a2b', description: '', images: [] };
    edit = { row, data, dirty: false };
    $('productsView').hidden = true; $('ordersView').hidden = true; $('editView').hidden = false;
    $('editTitle').textContent = row ? data.name : 'New product';
    $('removedNote').hidden = !(row && row.hidden);
    $('hideBtn').hidden = !row;
    $('hideBtn').textContent = row && row.hidden ? 'Put back in shop' : 'Remove from shop';
    $('editError').textContent = '';

    $('fName').value = data.name || '';
    $('fPrice').value = typeof data.price === 'number' ? data.price : '';
    $('fStock').checked = data.inStock !== false; stockText();
    $('fCat').value = data.category || 'composite-hockey-sticks'; drawSubs(data.sub);
    $('fSizes').value = (data.sizes || STORE.sizes).join(', ');
    $('fBrand').value = data.brand || '';
    $('fBadge').value = data.badge || '';
    $('fTagline').value = data.tagline || '';
    $('fDesc').value = data.description || '';
    drawPhotos();
    scrollTo(0, 0);
  }
  const stockText = () => { $('fStockText').textContent = $('fStock').checked ? 'In stock' : 'Out of stock'; };
  $('fStock').onchange = stockText;
  function drawSubs(current) {
    const c = getCategory($('fCat').value);
    $('fSubWrap').hidden = !(c && c.subs);
    $('fSub').innerHTML = c && c.subs ? c.subs.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('') : '';
    if (c && c.subs) $('fSub').value = c.subs.some(s => s.id === current) ? current : c.subs[0].id;
  }
  $('fCat').onchange = () => drawSubs();
  $('editForm').addEventListener('input', () => { if (edit) edit.dirty = true; });

  // photos: one set for a plain product, one per colour for a product with colours
  function photoSets() { return edit.data.variants ? edit.data.variants : [edit.data]; }
  function drawPhotos() {
    const d = edit.data, sets = photoSets();
    $('addColour').hidden = !d.variants;
    $('photoSets').innerHTML = sets.map((s, si) => `
      <div class="photo-set" data-si="${si}">
        ${d.variants ? `<div class="colour-row">
          <label class="field"><span>Colour ${si + 1}</span><input class="vName" value="${esc(s.name || '')}" maxlength="60"></label>
          <label class="swatch" title="Colour dot"><input type="color" class="vSwatch" value="${/^#[0-9a-f]{6}$/i.test(s.swatch || '') ? s.swatch : '#888888'}"></label>
          ${sets.length > 1 ? '<button type="button" class="ghost small vRemove">Remove colour</button>' : ''}
        </div>` : ''}
        <ul class="photos">${(s.images || []).map((src, i) => `
          <li><img src="${esc(src)}" alt="" loading="lazy">${i === 0 ? '<em>Main</em>' : ''}
            <div><button type="button" data-a="left" aria-label="Move left" ${i === 0 ? 'disabled' : ''}>◀</button>
            <button type="button" data-a="del" aria-label="Remove photo">✕</button>
            <button type="button" data-a="right" aria-label="Move right" ${i === s.images.length - 1 ? 'disabled' : ''}>▶</button></div></li>`).join('')}
          <li class="add"><button type="button" class="addPhotos">+ Add photos</button></li>
        </ul>
      </div>`).join('');

    $('photoSets').querySelectorAll('.photo-set').forEach(box => {
      const s = sets[+box.dataset.si];
      box.querySelectorAll('.photos li:not(.add)').forEach((li, i) => li.querySelectorAll('button').forEach(b => b.onclick = () => {
        const imgs = s.images;
        if (b.dataset.a === 'del') { if (imgs.length === 1 && !confirm('Remove the only photo?')) return; imgs.splice(i, 1); }
        if (b.dataset.a === 'left' && i > 0) [imgs[i - 1], imgs[i]] = [imgs[i], imgs[i - 1]];
        if (b.dataset.a === 'right' && i < imgs.length - 1) [imgs[i + 1], imgs[i]] = [imgs[i], imgs[i + 1]];
        edit.dirty = true; drawPhotos();
      }));
      box.querySelector('.addPhotos').onclick = () => pickPhotos(s);
      const name = box.querySelector('.vName'); if (name) name.oninput = () => { s.name = clean(name.value); };
      const sw = box.querySelector('.vSwatch'); if (sw) sw.oninput = () => { s.swatch = sw.value; edit.dirty = true; };
      const rm = box.querySelector('.vRemove'); if (rm) rm.onclick = () => {
        if (!confirm(`Remove the colour "${s.name || 'this colour'}" and its photos?`)) return;
        edit.data.variants.splice(+box.dataset.si, 1); edit.dirty = true; drawPhotos();
      };
    });
  }
  $('addColour').onclick = () => { edit.data.variants.push({ name: 'New colour', swatch: '#888888', images: [] }); edit.dirty = true; drawPhotos(); };

  let pickTarget = null;
  function pickPhotos(set) { pickTarget = set; $('filePick').value = ''; $('filePick').click(); }
  $('filePick').onchange = async () => {
    const files = [...$('filePick').files], set = pickTarget;
    if (!files.length || !set) return;
    const folder = (edit.row && edit.row.id) || slug($('fName').value) || 'new';
    set.images = set.images || [];
    for (let i = 0; i < files.length; i++) {
      toast(`Uploading photo ${i + 1} of ${files.length}…`);
      try { set.images.push(await upload(await shrink(files[i]), folder)); edit.dirty = true; drawPhotos(); }
      catch (e) { toast('Photo not uploaded: ' + e.message); return; }
    }
    toast(files.length > 1 ? `${files.length} photos added. Tap Save to keep them.` : 'Photo added. Tap Save to keep it.');
  };

  // a phone photo becomes a JPEG at most 1600 px wide or tall (about 150–400 KB)
  async function shrink(file) {
    let img;
    try { img = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { img = await new Promise((ok, bad) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => bad(new Error('This file is not a photo the browser can read')); im.src = URL.createObjectURL(file); }); }
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    return new Promise((ok, bad) => c.toBlob(b => b ? ok(b) : bad(new Error('Could not prepare the photo')), 'image/jpeg', 0.85));
  }
  async function upload(blob, folder) {
    const path = `${folder}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}.jpg`;
    const r = await fetch(`${DB.url}/storage/v1/object/${DB.photos}/${path}`, {
      method: 'POST',
      headers: { apikey: DB.key, Authorization: 'Bearer ' + await token(), 'Content-Type': 'image/jpeg', 'cache-control': 'max-age=31536000' },
      body: blob,
    });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || j.error || `upload failed (${r.status})`); }
    return DB.photoUrl(path);
  }

  const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

  // the form → the product as the shop's pages use it (fields the form doesn't show are kept as they were)
  function collect() {
    const d = edit.data, name = clean($('fName').value);
    if (!name) throw new Error('Enter a name.');
    const priceRaw = $('fPrice').value.trim();
    const price = priceRaw === '' ? null : Number(priceRaw);
    if (price !== null && !(Number.isInteger(price) && price >= 0 && price <= 1000000)) throw new Error('Price must be a whole number of rupees, or empty.');
    const sizes = $('fSizes').value.split(',').map(clean).filter(Boolean);
    const out = { ...d, name, price };
    if (price === null) { out.tba = d.tba || 'Update soon'; delete out.priceConfirmed; }
    else out.priceConfirmed = true;
    if ($('fStock').checked) delete out.inStock; else out.inStock = false;
    out.category = $('fCat').value;
    const c = getCategory(out.category);
    if (c && c.subs) out.sub = $('fSub').value; else delete out.sub;
    // sticks without their own sizes use the shop's standard lengths: keep it that way unless the list was changed
    if (!d.sizes && sizes.join(', ') === STORE.sizes.join(', ')) delete out.sizes; else out.sizes = sizes.length ? sizes : ['One Size'];
    for (const [key, id] of [['brand', 'fBrand'], ['badge', 'fBadge'], ['tagline', 'fTagline']]) {
      const v = clean($(id).value);
      if (v) out[key] = v; else if (key !== 'brand' || d.brand !== '') delete out[key];
    }
    out.description = String($('fDesc').value).replace(/[<>]/g, '').trim();
    const sets = out.variants || [out];
    if (sets.some(s => !(s.images || []).length)) throw new Error(out.variants ? 'Every colour needs at least one photo.' : 'Add at least one photo.');
    if (out.variants) out.variants.forEach((v, i) => { v.name = clean(v.name) || `Colour ${i + 1}`; });
    return out;
  }

  $('editForm').addEventListener('submit', async e => {
    e.preventDefault();
    $('editError').textContent = '';
    let data;
    try { data = collect(); } catch (err) { $('editError').textContent = err.message; return; }
    $('saveBtn').disabled = true;
    try {
      if (edit.row) {
        const [saved] = await api(`products?id=eq.${encodeURIComponent(edit.row.id)}`, { method: 'PATCH', body: { data }, prefer: 'return=representation' });
        Object.assign(edit.row, saved);
      } else {
        let id = slug(data.name) || 'product', n = 2;
        while (rows.some(r => r.id === id)) id = `${slug(data.name)}-${n++}`;
        const sort = rows.reduce((m, r) => Math.max(m, r.sort), 0) + 10;
        const [saved] = await api('products', { method: 'POST', body: { id, sort, data }, prefer: 'return=representation' });
        rows.push(saved);
      }
      toast(`Saved. The shop shows it within 2 minutes.`);
      edit.dirty = false;
      backToList();
    } catch (err) { $('editError').textContent = 'Not saved: ' + err.message; }
    finally { $('saveBtn').disabled = false; }
  });

  $('hideBtn').onclick = async () => {
    const row = edit.row, hide = !row.hidden;
    if (hide && !confirm(`Remove "${row.data.name}" from the shop? You can put it back later.`)) return;
    try {
      await api(`products?id=eq.${encodeURIComponent(row.id)}`, { method: 'PATCH', body: { hidden: hide }, prefer: 'return=minimal' });
      row.hidden = hide;
      toast(hide ? 'Removed from the shop' : 'Back in the shop');
      edit.dirty = false;
      backToList();
    } catch (err) { $('editError').textContent = 'Not saved: ' + err.message; }
  };

  function backToList() {
    if (edit && edit.dirty && !confirm('Leave without saving your changes?')) return;
    edit = null;
    $('editView').hidden = true; $('productsView').hidden = false;
    drawProducts();
  }
  $('back').onclick = backToList;
  $('cancelEdit').onclick = backToList;
  $('addProduct').onclick = () => openEditor(null);
  addEventListener('beforeunload', e => { if (edit && edit.dirty) { e.preventDefault(); e.returnValue = ''; } });

  start();
})();
