/* ═══════════════════════════════════════════════════════════
   Live products: the shop's database replaces the built-in copy in products.js.
   Pages draw inside onProducts(() => …), which runs once the list is settled:
   • a list this browser fetched in the last 2 minutes is used at once (and refreshed for next time);
   • otherwise the page waits for the database, for up to 3 seconds;
   • checkout.html (data-wait="always") always waits for the database, so totals use today's prices.
   If the database can't be reached, the page uses the last list it saw, or the built-in copy.
═══════════════════════════════════════════════════════════ */
(function () {
  const KEY = 'fs-products-v1', FRESH = 2 * 60e3, WAIT = 3000;
  const alwaysWait = !!(document.currentScript && document.currentScript.dataset.wait === 'always');
  let done = false;
  const waiting = [];
  window.onProducts = fn => { if (done) fn(); else waiting.push(fn); };
  const settle = () => { if (done) return; done = true; waiting.splice(0).forEach(fn => fn()); };

  // database rows → PRODUCTS (only rows on show, in the shop's order)
  const use = rows => {
    if (!Array.isArray(rows)) return false;
    const list = rows.filter(r => r && r.id && r.data && !r.hidden).sort((a, b) => a.sort - b.sort).map(r => ({ ...r.data, id: r.id }));
    if (!list.length) return false;
    PRODUCTS.splice(0, PRODUCTS.length, ...list);
    finishProducts();
    window.PRODUCTS_FROM = 'database';
    return true;
  };

  window.PRODUCTS_FROM = 'built-in';
  if (typeof DB === 'undefined' || !DB.on) { settle(); return; }

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (saved && use(saved.rows) && !alwaysWait && Date.now() - saved.at < FRESH) settle();

  const timer = setTimeout(settle, WAIT);
  DB.rest('products?select=id,sort,hidden,data&hidden=eq.false&order=sort')
    .then(rows => {
      if (!Array.isArray(rows) || !rows.length) return;
      try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), rows })); } catch {}
      if (!done) use(rows);
    })
    .catch(() => {})
    .finally(() => { clearTimeout(timer); settle(); });
})();
