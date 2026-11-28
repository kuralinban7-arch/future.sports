/* ═══════════════════════════════════════════════════════════
   The shop's database (Supabase project "future-sports").
   The key below is the PUBLISHABLE key: it is meant to be in the site. What it can do is
   limited by the database's own rules (server/supabase/01-schema.sql): customers can only
   read the products on show and send new orders; everything else needs an admin login.
═══════════════════════════════════════════════════════════ */
const DB = {
  url: 'https://nizdyvokeuhjvhuszlbd.supabase.co',
  key: 'sb_publishable_EOAqPDY-jGGaUJ_yqecxOg_VdReZQnw',
  photos: 'product-photos',   // storage bucket for photos uploaded on the admin page
};
DB.on = !!(DB.url && DB.key);

/* one call to the database's REST API; rejects with the database's own message */
DB.rest = (path, { token, method = 'GET', body, prefer, keepalive } = {}) =>
  fetch(`${DB.url}/rest/v1/${path}`, {
    method,
    keepalive,
    headers: {
      apikey: DB.key,
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).then(async r => {
    const text = await r.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!r.ok) throw Object.assign(new Error((data && (data.message || data.msg || data.error_description)) || `Database error ${r.status}`), { status: r.status, info: data });
    return data;
  });

DB.photoUrl = path => `${DB.url}/storage/v1/object/public/${DB.photos}/${path}`;
