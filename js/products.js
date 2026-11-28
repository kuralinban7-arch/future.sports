/* ═══════════════════════════════════════════════════════════
   SNS STORE — PRODUCT CATALOGUE
   Every page reads from this one file.

   • Composition and technology come from each model's spec sheet.
   • `priceConfirmed: false` means the price is a PLACEHOLDER —
     replace it with the real price and set it to true.
   • To add a model: copy a block, give it a unique `id`, and put
     its photos in SNS/prism/<id>/ or SNS/blade/<id>/ (01.jpg, 02.jpg …)
═══════════════════════════════════════════════════════════ */

const STORE = {
  name: 'Future Sports',
  currency: '₹',
  locale: 'en-IN',
  freeShippingOver: 5000,   // PLACEHOLDER — order value for free shipping
  shippingFee: 150,         // PLACEHOLDER — flat shipping below that
  codFee: 50,               // PLACEHOLDER — extra for cash on delivery
  sizes: ['36.5"', '37.5"'],
  // Shown in the footer once filled in (leave '' to hide a line)
  contact: { email: '', phone: '+91 75989 43236', whatsapp: '+91 75989 43236', address: '', hours: '' },
  // GPay / UPI: shown after the customer sends the order on WhatsApp (checkout.html).
  // qr: the square QR shown on the page. qrSave: the full QR card customers save to their gallery (falls back to qr).
  // Both are cut from the shop's GPay QR card and pay futuresportsmmxx@oksbi (FUTURE SPORTS). Change all three together.
  payment: {
    qr: 'brand/gpay-qr.png',
    qrSave: 'brand/gpay-qr-full.jpg',
    upiId: 'futuresportsmmxx@oksbi',
    proofNote: 'After paying, please send the payment screenshot on WhatsApp to confirm your order.',
  },
};

const SERIES = {
  Prism: {
    brand: 'SNS', label: 'Prism',
    title: 'Prism Series',
    tagline: 'Power meets precision',
    blurb: 'Eight carbon levels from 10% to a full 100%, with Advanced Control Zone and Carbon Edge Protection.',
    cover: 'SNS/prism/prism-80/01.jpg',
  },
  Blade: {
    brand: 'SNS', label: 'Blade',
    title: 'Blade Series',
    tagline: 'Speed. Edge. Attack.',
    blurb: 'A sharp all-black range with 3K carbon weave, Kevlar heel protection and a soft-touch lacquer finish.',
    cover: 'SNS/blade/blade-10/01.jpg',
  },
  Alfa: {
    brand: 'Alfa', label: '',
    title: 'Alfa',
    tagline: 'Made in Jalandhar',
    blurb: 'Alfa composite and wooden sticks, from the painted Cyrano to the full-carbon AX-99, each in Low Bow or Mid Bow.',
    cover: 'ALFA/ax-7/03.jpg',
  },
  Fenta: {
    brand: 'Fenta', label: '',
    title: 'Fenta',
    tagline: 'Be a World Player',
    blurb: 'Fenta composite hockey sticks, from the glass-fibre F-60 to the approx. 100% carbon V-10000.',
    cover: 'FENTA/v-50/01.jpg',
  },
  Malik: {
    brand: 'Malik', label: '',
    title: 'Malik',
    tagline: 'Composite hockey sticks',
    blurb: 'Malik composite sticks: the 10% carbon 007, the 20% carbon XS 2 and the 30% carbon XS 3.',
    cover: 'MALIK/xs-compo-03/01.jpg',
  },
  Flash: {
    brand: 'Flash', label: '',
    title: 'Flash',
    tagline: 'Composite hockey sticks',
    blurb: 'Flash composite sticks, from the 10% carbon ZX 1000 to the 100% carbon ZX 11000.',
    cover: 'FLASH/zx-11000/01.jpg',
  },
  Composite: {                                       // common slot for brands with only a few sticks
    brand: 'Composite Stick', label: '',
    title: 'Composite Stick',
    tagline: 'Marex, Vijayanti, Deep, Rysum and STK',
    blurb: 'Composite sticks from Marex, Vijayanti, Deep, Rysum and STK.',
    cover: 'COMPOSITE/rysum-mp-5-hybrid/01.jpg',
  },
};

/* Shop categories. A category with no products shows as "Coming soon".
   To fill one, give a product `category: '<id>'`. `cover` is optional.
   A main slot (`main: true`) has its own slots inside it in `subs`: give a product `sub: '<id>'` as well.
   `byBrand: true` on one of those shows its products brand by brand (from each product's `brand`). */
const CATEGORIES = [
  { id: 'hockey-grips',              name: 'Hockey Grips', cover: 'SNS/grips/sns-grip/01.jpg' },
  { id: 'hockey-gloves',             name: 'Hockey Gloves', cover: 'SNS/gloves/ultralight-green/01.jpg' },
  { id: 'wooden-hockey-sticks',      name: 'Wooden Hockey Sticks' },
  { id: 'composite-hockey-sticks',   name: 'Composite Hockey Sticks', cover: 'SNS/prism/prism-80/01.jpg' },
  { id: 'goal-keeper-kit',           name: 'Hockey Goal Keeper Kit' },
  { id: 'goal-keeper-accessories',   name: 'Hockey Goal Keeper Kit Accessories' },
  { id: 'hockey-accessories',        name: 'Hockey Accessories' },
  { id: 'hockey-shinguards',         name: 'Hockey Shinguards' },
  { id: 'tourbags',                  name: 'Tourbags' },
  { id: 'warmup-shoes',              name: 'Warmup Shoes' },
  { id: 'hockey-shoes',              name: 'Hockey Shoes' },
  { id: 'hockey-stick-bags',         name: 'Hockey Stick Bags' },
  { id: 'hockey-balls',              name: 'Hockey Balls' },
  { id: 'hockey-stockings',          name: 'Hockey Stockings' },
  { id: 'sports-wear',               name: 'Sports Wear', cover: 'WEAR/just-shorts/orange/01.jpg', main: true,
    subs: [{ id: 'shorts', name: 'Shorts' }, { id: 't-shirts', name: 'T-Shirts', byBrand: true }, { id: 'tracks', name: 'Tracks' }] },
];

/* Technology glossary (names exactly as on the spec sheets) */
const TECH = {
  TCW:  { name: 'Tri-Axial Carbon Weave',       desc: 'Extra power in every hit.' },
  FCW:  { name: 'Forged Carbon Weave',          desc: 'Enhanced performance and a premium feel for superior handling.' },
  '3KCW': { name: '3K Carbon Weave',            desc: 'Extra strength through the shaft.' },
  ACZ:  { name: 'Advanced Control Zone',        desc: 'Better ball control.' },
  CEP:  { name: 'Carbon Edge Protection',       desc: 'Stronger reverse-hits.' },
  AHP:  { name: 'Aramid Heel Protection',       desc: 'Longer shape retention.' },
  KHP:  { name: 'Kevlar Heel Protection',       desc: 'Longer shape retention.' },
  '3D': { name: 'Special 3D Texture',           desc: 'Improved right-hand grip.' },
  STL:  { name: 'Soft Touch Lacquer',           desc: 'Improved touch.' },
  PRG:  { name: 'Premium Raised Graphics',      desc: 'Tactile, raised graphic finish.' },
  PU:   { name: 'Cushioned & Perforated PU Grip', desc: 'Absorbs vibration and stays secure.' },
  PLG:  { name: 'PU-Layered PU Grip',           desc: 'Perforated, layered PU grip.' },
  SPU:  { name: 'Soft PU Grip',                 desc: 'Soft, comfortable hold.' },
  SCG:  { name: 'Soft Cushion Grip',            desc: 'Cushioned comfort in the hand.' },
  ERG:  { name: 'Ergonomic Grip',               desc: 'Comfort and control for quick, precise handling.' },
  LWD:  { name: 'Lightweight Design',           desc: 'Agility and speed, with less fatigue through the game.' },
  DCT:  { name: 'Dual Core Performing Technology', desc: 'A dual-core composite construction.' },
  AGR:  { name: 'Alfa Grip',                    desc: 'Alfa’s own grip.' },
  HCS:  { name: 'Hybrid Composite Structure',   desc: 'A 100% composite build.' },
  PNT:  { name: 'Paint Finish',                 desc: 'A painted finish over the stick.' },
  LAM:  { name: 'Laminated Head',               desc: 'A laminated wooden head.' },
  C100: { name: '100% Composite',               desc: 'A full composite build, as printed on the stick.' },
  KEV:  { name: 'Kevlar Reinforcement',         desc: 'Kevlar fibres in the layup for toughness and impact resistance.' },
  TWC:  { name: 'Twin Core',                    desc: 'A twin-core build, as printed on the stick.' },
  CMH:  { name: 'Compact Head',                 desc: 'A compact head shape, as printed on the stick.' },
  JPC:  { name: 'Japanese Carbon',              desc: 'Made with Japanese carbon, as printed on the stick.' },
  KCF:  { name: 'KCF Construction',             desc: 'Kevlar and carbon composite knitting system, as printed on the stick.' },
  STC:  { name: 'Soft Touch Compound',          desc: 'A soft-touch compound on the head, as printed on the stick.' },
  PWG:  { name: 'Power Groove',                 desc: 'A grooved shaft that helps control the ball.' },
  AVS:  { name: 'Anti-Vibration System',        desc: 'Built to reduce vibration through the hands.' },
  MTC:  { name: 'M-Tech Technology',            desc: 'Flash’s M-Tech construction with 4K carbon.' },
  ARM:  { name: 'Aramid Reinforcement',         desc: 'Aramid fibres reinforce the stick, as printed on it.' },
  GLS:  { name: 'Glass Fibre',                  desc: 'Glass fibre in the layup for strength and feel.' },
};

/* Photos live in SNS/prism/<model>/ and SNS/blade/<model>/ */
const imgs = (folder, n, order) =>
  (order || Array.from({ length: n }, (_, i) => i + 1))
    .map(i => `SNS/${folder.split('-')[0]}/${folder}/${String(i).padStart(2, '0')}.jpg`);

/* Front / reverse cutouts of the upright stick, used by the 3D inspection */
const cuts = (folder, ...n) =>
  n.map(i => `SNS/${folder.split('-')[0]}/${folder}/${String(i).padStart(2, '0')}-cut.webp?v=3`);   // bump ?v= when a cutout is redone (v=3: edges cleaned)

const PRODUCTS = [
  /* ─────────────── PRISM SERIES ─────────────── */
  {
    id: 'prism-10', series: 'Prism', name: 'SNS Prism 10', carbon: 10,
    price: 1800, priceConfirmed: true,
    accent: '#3fbf5f',
    composition: { Carbon: 10, Glass: 85, Aramid: 5 },
    tech: ['CEP', 'AHP', 'ACZ', 'SCG'],
    variants: [
      { name: 'Forest Green',   swatch: '#1f7a3a', images: imgs('prism-10-green', 6), views: cuts('prism-10-green', 2, 3) },
      { name: 'Chocolate Brown', swatch: '#5b4636', images: imgs('prism-10-brown', 6), views: cuts('prism-10-brown', 2, 3) },
      { name: 'Phantom Purple', swatch: '#3a3aa8', images: imgs('prism-10-purple', 6), views: cuts('prism-10-purple', 2, 3) },
      { name: 'Ruby Red',       swatch: '#9b1c2e', images: imgs('prism-10-red', 6), views: cuts('prism-10-red', 3) },
    ],
    description: 'The entry point to the Prism range. A forgiving 10% carbon build with Carbon Edge Protection, Aramid Heel Protection and an Advanced Control Zone, available in four colourways.',
  },
  {
    id: 'prism-20', series: 'Prism', name: 'SNS Prism 20', carbon: 20,
    price: 2260, priceConfirmed: true, accent: '#4f8fd9',
    images: imgs('prism-20', 6),
    views: cuts('prism-20', 2, 3),
    composition: { Carbon: 20, Glass: 75, Aramid: 5 },
    tech: ['3D', 'CEP', 'AHP', 'ACZ', 'PU'],
    description: 'A step up in stiffness with 20% carbon, plus a special 3D texture for an improved right-hand grip.',
  },
  {
    id: 'prism-30', series: 'Prism', name: 'SNS Prism 30', carbon: 30,
    price: 2750, priceConfirmed: true, accent: '#2fa7a0',
    images: imgs('prism-30', 5),
    views: cuts('prism-30', 2, 3),
    composition: { Carbon: 30 },   // TODO: no spec sheet supplied — add Glass / Aramid
    tech: ['ACZ'],                 // TODO: confirm full technology list
    description: 'A 30% carbon Prism in a deep teal finish, balancing extra hitting power with a comfortable feel.',
  },
  {
    id: 'prism-40', series: 'Prism', name: 'SNS Prism 40', carbon: 40,
    price: 3300, priceConfirmed: true, accent: '#d9a46b',
    images: imgs('prism-40', 6),
    views: cuts('prism-40', 2, 3),
    composition: { Carbon: 40, Glass: 55, Aramid: 5 },
    tech: ['3D', 'FCW', 'CEP', 'AHP', 'ACZ', 'PU'],
    description: 'Introduces Forged Carbon Weave for enhanced performance on a 40% carbon build.',
  },
  {
    id: 'prism-60', series: 'Prism', name: 'SNS Prism 60', carbon: 60,
    price: 4550, priceConfirmed: true, accent: '#e2c23a',
    images: imgs('prism-60', 7, [2, 1, 3, 4, 5, 6, 7]),
    views: cuts('prism-60', 5, 4),
    composition: { Carbon: 60, Glass: 35, Aramid: 5 },
    tech: ['3D', 'FCW', 'CEP', 'AHP', 'ACZ', 'PU'],
    description: 'Black and gold, 60% carbon and Forged Carbon Weave. Built for confident, powerful play.',
  },
  {
    id: 'prism-80', series: 'Prism', name: 'SNS Prism 80', carbon: 80, badge: 'Bestseller',
    price: 6300, priceConfirmed: true, accent: '#b4e635',
    images: imgs('prism-80', 6),
    views: cuts('prism-80', 2, 3),
    composition: { Carbon: 80, Glass: 15, Aramid: 5 },
    tech: ['3D', 'TCW', 'CEP', 'AHP', 'ACZ', 'PU'],
    specs: { Weight: '530 – 560g', Bow: '24mm Late Bow' },
    description: 'Premium composite stick for players who demand explosive power and refined control. Tri-Axial Carbon Weave delivers extra hitting power while Carbon Edge Protection reinforces reverse-hits.',
  },
  {
    id: 'prism-95', series: 'Prism', name: 'SNS Prism 95', carbon: 95,
    price: 8400, priceConfirmed: true, accent: '#6fb6f2',
    images: imgs('prism-95', 6),
    views: cuts('prism-95', 2, 3),
    composition: { Carbon: 95, Aramid: 5 },
    tech: ['3D', 'TCW', 'CEP', 'ACZ', 'AHP', 'PU'],
    description: '95% carbon with Aramid reinforcement. Near-maximum stiffness with Tri-Axial Carbon Weave for elite power.',
  },
  {
    id: 'prism-100', series: 'Prism', name: 'SNS Prism 100', carbon: 100, badge: 'Flagship',
    price: 11000, priceConfirmed: true, accent: '#ff6a2b',
    images: imgs('prism-100', 6),
    views: cuts('prism-100', 2, 3),
    composition: { Carbon: 100 },
    tech: ['3D', 'TCW', 'CEP', 'ACZ', 'PRG', 'PU'],
    description: 'Full 100% carbon fibre construction. The top of the Prism range, finished with premium raised graphics.',
  },

  /* ─────────────── BLADE SERIES ─────────────── */
  {
    id: 'blade-1', series: 'Blade', name: 'SNS Blade 1', carbon: 10, badge: 'New',
    price: 1700, priceConfirmed: true, accent: '#ff5a2b',
    images: imgs('blade-1', 5),
    views: cuts('blade-1', 2, 3),
    composition: { Carbon: 10, Glass: 85, Aramid: 5 },
    tech: ['FCW', 'TCW', 'CEP', 'AHP', 'ACZ', 'PLG'],
    description: 'The first step into the Blade line: black with fire-orange graphics and Forged Carbon Weave.',
  },
  {
    id: 'blade-2', series: 'Blade', name: 'SNS Blade 2', carbon: 20, badge: 'New',
    price: 2150, priceConfirmed: true, accent: '#d8ff3a',
    images: imgs('blade-2', 5),
    views: cuts('blade-2', 2, 3),
    composition: { Carbon: 20, Glass: 75, Aramid: 5 },
    tech: ['SPU', 'CEP', 'KHP'],
    description: 'A 20% carbon Blade in neon yellow with Kevlar Heel Protection and a soft PU grip.',
  },
  {
    id: 'blade-3', series: 'Blade', name: 'SNS Blade 3', carbon: 30, badge: 'New',
    price: 2700, priceConfirmed: true, accent: '#3a8dff',
    images: imgs('blade-3', 5),
    views: cuts('blade-3', 2, 3),
    composition: { Carbon: 30, Glass: 65, Aramid: 5 },
    tech: ['CEP', 'KHP', 'SPU'],
    description: '30% carbon with electric-blue graphics, Carbon Edge Protection and Kevlar Heel Protection.',
  },
  {
    id: 'blade-5', series: 'Blade', name: 'SNS Blade 5', carbon: 50, badge: 'New',
    price: 3800, priceConfirmed: true, accent: '#9ec8ff',
    images: imgs('blade-5', 5),
    views: cuts('blade-5', 2, 3),
    composition: { Carbon: 50, Glass: 45, Aramid: 5 },
    tech: ['3KCW', 'PU', 'CEP', 'KHP', 'ACZ', 'STL'],
    description: 'The mid-range Blade: 3K Carbon Weave for extra strength and a Soft Touch Lacquer finish.',
  },
  {
    id: 'blade-7', series: 'Blade', name: 'SNS Blade 7', carbon: 70, badge: 'New',
    price: 5500, priceConfirmed: true, accent: '#ff3b3b',
    images: imgs('blade-7', 5),
    views: cuts('blade-7', 2, 3),
    composition: { Carbon: 70, Glass: 25, Aramid: 5 },
    tech: ['3KCW', 'PU', 'CEP', 'KHP', 'ACZ'],
    description: 'A competitive price for a premium stick. 70% carbon, 3K Carbon Weave and Advanced Control Zone.',
  },
  {
    id: 'blade-9', series: 'Blade', name: 'SNS Blade 9', carbon: 90, badge: 'New',
    price: 7300, priceConfirmed: true, accent: '#ff8a3a',
    images: imgs('blade-9', 5),
    views: cuts('blade-9', 2, 3),
    composition: { Carbon: 90, Glass: 5, Aramid: 5 },
    tech: ['3KCW', 'PU', 'CEP', 'KHP', 'ACZ', 'STL'],
    description: '90% carbon for serious power, with 3K Carbon Weave and a Soft Touch Lacquer finish.',
  },
  {
    id: 'blade-10', series: 'Blade', name: 'SNS Blade 10', carbon: 100, badge: 'Flagship',
    price: 9600, priceConfirmed: true, accent: '#e8d9a8',
    images: imgs('blade-10', 5),
    views: cuts('blade-10', 2, 3),
    composition: { Carbon: 100 },
    tech: ['3KCW', 'PU', 'CEP', 'KHP', 'ACZ', 'STL'],
    description: 'The Blade flagship. 100% carbon fibre with every Blade technology on board.',
  },
];

/* ─────────────── ALFA AX SERIES ───────────────
   Photos and specs from alfahockey.in (details in ALFA/alfa-details.md).
   Photos live in ALFA/<model>/: 01 and 02 are the upright front and back
   (used by the 3D inspection); the angled shot leads the gallery and cards. */
const aimgs = (folder, n, lead = 3) =>
  [lead, ...Array.from({ length: n }, (_, i) => i + 1).filter(i => i !== lead)]
    .map(i => `ALFA/${folder}/${String(i).padStart(2, '0')}.jpg`);
const acuts = folder => ['01', '02'].map(n => `ALFA/${folder}/${n}-cut.webp?v=2`);
const ALFA_SIZES = ['36"', '37"', '38"'];
const ALFA_BOWS = ['Low Bow', 'Mid Bow'];

PRODUCTS.push(
  {
    id: 'ax-1', series: 'Alfa', name: 'Alfa AX-1', carbon: 15, badge: 'New',
    price: 3100, priceConfirmed: true, accent: '#2a9fd8',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-1', 7), views: acuts('ax-1'),
    composition: { Carbon: 15 },   // Alfa only states the carbon %
    tech: ['ERG', 'LWD'],
    description: 'The way into the Alfa AX range: 15% carbon in sky blue, with an ergonomic grip and a lightweight build.',
  },
  {
    id: 'ax-2', series: 'Alfa', name: 'Alfa AX-2', carbon: 25, badge: 'New',
    price: 3550, priceConfirmed: true, accent: '#8a76c8',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-2', 7), views: acuts('ax-2'),
    composition: { Carbon: 25 },
    tech: ['ERG', 'LWD'],
    description: '25% carbon in lavender purple for a step up in power and stiffness, with an ergonomic grip and a lightweight build.',
  },
  {
    id: 'ax-3', series: 'Alfa', name: 'Alfa AX-3', carbon: 30, badge: 'New',
    price: 3950, priceConfirmed: true, accent: '#f26b1d',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-3', 7), views: acuts('ax-3'),
    composition: { Carbon: 30 },
    tech: ['ERG', 'LWD'],
    description: '30% carbon in bright orange for harder hits and better ball control, with an ergonomic grip and a lightweight build.',
  },
  {
    id: 'ax-4', series: 'Alfa', name: 'Alfa AX-4', carbon: 40, badge: 'New',
    price: 5100, priceConfirmed: true, accent: '#d6177a',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-4', 5, 5), views: acuts('ax-4'),
    composition: { Carbon: 40 },
    tech: ['ERG', 'LWD'],
    description: '40% carbon in magenta with a grey grip: more stiffness for stronger hits while keeping a responsive feel.',
  },
  {
    id: 'ax-5', series: 'Alfa', name: 'Alfa AX-5', carbon: 50, badge: 'New',
    price: 5400, priceConfirmed: true, accent: '#2f5fd0',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-5', 7), views: acuts('ax-5'),
    composition: { Carbon: 50, Kevlar: 10, Glass: 40 },
    tech: [],
    description: 'A senior composite stick in royal blue: 50% carbon, 10% Kevlar and 40% glass fibre.',
  },
  {
    id: 'ax-7', series: 'Alfa', name: 'Alfa AX-7', carbon: 75, badge: 'New',
    price: 9000, priceConfirmed: true, accent: '#9aa0a8',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-7', 7), views: acuts('ax-7'),
    composition: { Carbon: 75, Kevlar: 10, Glass: 15 },
    tech: ['DCT', 'AGR'],
    description: 'Alfa’s Dual Core Performing Technology with 75% carbon, 10% Kevlar and 15% glass fibre, finished with the Alfa grip.',
  },
  {
    id: 'ax-9', series: 'Alfa', name: 'Alfa AX-9', carbon: 90, badge: 'New',
    price: 13500, priceConfirmed: true, accent: '#c9ccd1',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-9', 8), views: acuts('ax-9'),
    composition: { Carbon: 90, Kevlar: 5 },   // Alfa doesn't state the remaining 5%
    tech: [],
    description: 'A 90% carbon senior stick with 5% Kevlar, in black with silver graphics.',
  },
  {
    id: 'ax-99', series: 'Alfa', name: 'Alfa AX-99', carbon: 100, badge: 'New',
    price: 16750, priceConfirmed: true, accent: '#d9dce1',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: aimgs('ax-99', 5), views: acuts('ax-99'),
    composition: { Carbon: 100 },
    tech: [],
    description: 'The Alfa flagship: a full 100% carbon senior stick in black.',
  },
);

/* More Alfa sticks. Photos in ALFA/<model>/ (Y-30: one folder per colour),
   01 = the angled shot used on cards; the 3D view uses the upright front/back.
   Y-30 colours other than black have no upright photo, so their angled shots
   were turned upright (01-up / 02-up). */
const apics = (folder, n) => Array.from({ length: n }, (_, i) => `ALFA/${folder}/${String(i + 1).padStart(2, '0')}.jpg`);
const aview = (folder, front, back) => [front, back].map(f => `ALFA/${folder}/${f}-cut.webp?v=2`);
const ALFA_SIZES_ALL = ['36"', '36.5"', '37"', '37.5"', '38"'];

PRODUCTS.push(
  {
    // Alfa lists only sizes, bows and photos for this one (no carbon % or technologies)
    id: 'pro-99', series: 'Alfa', name: 'Alfa Pro 99+', tagline: 'Composite stick', badge: 'Flagship',
    price: 39000, priceConfirmed: true, accent: '#3fb7c6',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    images: apics('pro-99', 6), views: aview('pro-99', '02', '03'),
    tech: [],
    description: 'The top of the Alfa range: a white composite stick with teal graphics, in Low Bow or Mid Bow.',
  },
  {
    id: 'y-30', series: 'Alfa', name: 'Alfa Y-30', carbon: 10, badge: 'New',
    price: 2150, priceConfirmed: true, accent: '#d7e000',
    sizes: ALFA_SIZES, bows: ALFA_BOWS,
    variants: [
      { name: 'Black',  swatch: '#1c1c1c', images: apics('y-30/black', 8),  views: aview('y-30/black', '02', '03') },
      { name: 'Orange', swatch: '#f26b1d', images: apics('y-30/orange', 7), views: aview('y-30/orange', '01-up', '02-up') },
      { name: 'Pink',   swatch: '#ff2f6d', images: apics('y-30/pink', 7),   views: aview('y-30/pink', '01-up', '02-up') },
      { name: 'Yellow', swatch: '#e2d41a', images: apics('y-30/yellow', 7), views: aview('y-30/yellow', '01-up', '02-up') },
      { name: 'Green',  swatch: '#3fd23f', images: apics('y-30/green', 7),  views: aview('y-30/green', '01-up', '02-up') },
    ],
    composition: { Carbon: 10 },
    tech: ['ERG', 'LWD'],
    specs: { 'In the box': 'Stick cover' },
    description: '10% carbon for a blend of power and feel, with an ergonomic grip and a lightweight build. Comes with a stick cover, in five colours.',
  },
  {
    id: 'cyrano', series: 'Alfa', name: 'Alfa Cyrano', tagline: 'Painted composite stick', badge: 'New',
    price: 1650, priceConfirmed: true, accent: '#d4202a',
    sizes: ALFA_SIZES_ALL, bows: ALFA_BOWS,
    images: apics('cyrano', 10), views: aview('cyrano', '02', '03'),
    tech: ['DCT', 'HCS', 'PNT'],
    specs: { Construction: 'Hybrid composite (100% composite)', Finish: 'Painted' },
    description: 'A painted composite stick in black and red, built with Alfa’s Dual Core Performing Technology and a hybrid composite structure.',
  },
  {
    id: 'carbonex', series: 'Alfa', name: 'Alfa Carbonex', tagline: 'Painted composite stick', badge: 'New',
    price: 1750, priceConfirmed: true, accent: '#b8e000',
    sizes: ALFA_SIZES_ALL, bows: ALFA_BOWS,
    images: apics('carbonex', 10), views: aview('carbonex', '02', '03'),
    tech: ['DCT', 'HCS', 'PNT'],
    specs: { Construction: 'Hybrid composite (100% composite)', Finish: 'Paint finish' },
    description: 'A paint-finish composite stick in black with lime-green graphics, built with Alfa’s Dual Core Performing Technology and a hybrid composite structure.',
  },
  {
    id: 'magnum', series: 'Alfa', category: 'wooden-hockey-sticks', name: 'Alfa Magnum', tagline: 'Wooden hockey stick', badge: 'New',
    price: 1750, priceConfirmed: true, accent: '#c9a24a',
    sizes: ALFA_SIZES_ALL, bows: ALFA_BOWS,
    images: apics('magnum', 3), views: aview('magnum', '02', '03'),
    tech: ['LAM', 'PNT'],
    specs: { Construction: 'Wood, laminated head', Finish: 'Paint finish', Level: 'Senior' },
    description: 'A senior wooden hockey stick with a laminated head and a painted black-and-gold finish.',
  },
);

/* ─────────────── FENTA ───────────────
   Photos from the shop, in FENTA/<model>/ (one folder per colour where a model has two).
   They were taken on the floor, so the 3D view uses each stick cut out and turned upright
   (01-up = front, 02-up = back where there is a back photo); 01-cut is the card image.
   Carbon % and materials from fentasports.com (their figures are approximate);
   the V-5000 Gold's 90% carbon / 10% aramid is printed on the stick.
   Prices are fentasports.com's online prices (V-1000 and V-10000 photos are from there too).
   The V-50 and V-5000 Gold aren't listed there:
   their prices are still to come. */
const FENTA_V = '?v=3';   // bump after re-cutting the Fenta photos
const fpics = (folder, n) => Array.from({ length: n }, (_, i) => `FENTA/${folder}/${String(i + 1).padStart(2, '0')}.jpg${i ? '' : FENTA_V}`);
const fview = (folder, back = true) => (back ? ['01', '02'] : ['01']).map(n => `FENTA/${folder}/${n}-up-cut.webp${FENTA_V}`);

PRODUCTS.push(
  {
    id: 'fenta-f-60', series: 'Fenta', name: 'Fenta F-60', tagline: 'Glass fibre with carbon & Kevlar', badge: 'New',
    price: 2575, priceConfirmed: true, accent: '#2fc3a6',
    variants: [
      { name: 'Red',  swatch: '#d23a3a', images: fpics('f-60/red', 4),  views: fview('f-60/red') },
      { name: 'Teal', swatch: '#1fa7b0', images: fpics('f-60/teal', 4), views: fview('f-60/teal') },
    ],
    tech: ['C100', 'GLS', 'KEV'],
    specs: { Construction: 'Glass fibre composite with carbon and Kevlar', Grip: 'Black' },
    description: 'A 100% composite stick of glass fibre reinforced with carbon and Kevlar, with a sea-green body and a black grip, in red or teal.',
  },
  {
    id: 'fenta-f-70', series: 'Fenta', name: 'Fenta F-70', tagline: 'Glass fibre with carbon & Kevlar', badge: 'New',
    price: 2800, priceConfirmed: true, accent: '#3aa6e0',
    variants: [
      { name: 'Red',      swatch: '#c8283e', images: fpics('f-70/red', 2),      views: fview('f-70/red', false) },
      { name: 'Sky Blue', swatch: '#3aa6e0', images: fpics('f-70/sky-blue', 2), views: fview('f-70/sky-blue', false) },
    ],
    tech: ['GLS', 'KEV'],
    specs: { Construction: 'Glass fibre composite with carbon and Kevlar', Grip: 'Black' },
    description: 'A glass-fibre composite stick reinforced with carbon and Kevlar, in red or sky blue, with a black grip.',
  },
  {
    id: 'fenta-v-50', series: 'Fenta', name: 'Fenta V-50', tagline: '100% composite stick', badge: 'New',
    price: null, priceConfirmed: false, accent: '#ff7a1a',
    images: fpics('v-50', 3),
    views: fview('v-50'),
    tech: ['C100'],
    specs: { Construction: '100% composite', 'Made in': 'India' },
    description: 'A 100% composite Fenta stick in black with orange graphics and a white grip.',
  },
  {
    id: 'fenta-v-100', series: 'Fenta', name: 'Fenta V-100', carbon: 10, badge: 'New',
    price: 2910, priceConfirmed: true, accent: '#2f6fd6',
    variants: [
      { name: 'Blue', swatch: '#2f6fd6', images: fpics('v-100/blue', 2), views: fview('v-100/blue', false) },
      { name: 'Navy', swatch: '#26304a', images: fpics('v-100/navy', 2), views: fview('v-100/navy', false) },
    ],
    composition: { Carbon: 10 },
    tech: ['KEV', 'GLS'],
    specs: { 'Model name': 'Scoop', Construction: 'Approx. 10% carbon with Kevlar and glass fibre', Grip: 'Black' },
    description: 'Fenta’s Scoop: approximately 10% carbon blended with Kevlar and glass fibre, in blue or navy with a black grip.',
  },
  {
    id: 'fenta-v-200', series: 'Fenta', name: 'Fenta V-200', carbon: 15, badge: 'New',
    price: 3135, priceConfirmed: true, accent: '#f08a3c',
    images: fpics('v-200', 3),
    views: fview('v-200'),
    composition: { Carbon: 15 },
    tech: ['C100', 'KEV', 'GLS'],
    specs: { 'Model name': 'Chase', Construction: 'Approx. 15% carbon with Kevlar and glass fibre', Colour: 'Blue & orange', Grip: 'White' },
    description: 'Fenta’s Chase: approximately 15% carbon with Kevlar and glass fibre, in blue and orange with a white grip.',
  },
  {
    id: 'fenta-v-500', series: 'Fenta', name: 'Fenta V-500', carbon: 20, badge: 'New',
    price: 3360, priceConfirmed: true, accent: '#2f6fd6',
    variants: [
      { name: 'Blue', swatch: '#2f6fd6', images: fpics('v-500/blue', 3), views: fview('v-500/blue') },
      { name: 'Red',  swatch: '#c8283e', images: fpics('v-500/red', 3),  views: fview('v-500/red') },
    ],
    composition: { Carbon: 20 },
    tech: ['KEV', 'GLS'],
    specs: { 'Model name': 'Agni', Construction: 'Approx. 20% carbon with Kevlar and glass fibre', Grip: 'Black' },
    description: 'Fenta’s Agni: approximately 20% carbon for a balance of power and control, with Kevlar and glass fibre. In blue or red with a black grip.',
  },
  {
    // photos from fentasports.com
    id: 'fenta-v-1000', series: 'Fenta', name: 'Fenta V-1000', carbon: 25, badge: 'New',
    price: 3800, priceConfirmed: true, accent: '#e0322e',
    images: fpics('v-1000', 3),
    views: fview('v-1000'),
    composition: { Carbon: 25 },
    tech: ['KEV', 'GLS'],
    specs: { 'Model name': 'Astro', Construction: 'Approx. 25% carbon with Kevlar and glass fibre', Colour: 'Red & white', Grip: 'Black' },
    description: 'Fenta’s Astro: approximately 25% carbon with Kevlar and glass fibre, in red and white with a black grip.',
  },
  {
    id: 'fenta-v-3000', series: 'Fenta', name: 'Fenta V-3000', carbon: 40, badge: 'New',
    price: 5375, priceConfirmed: true, accent: '#ff3fb4',
    variants: [
      { name: 'Black & Pink',    swatch: '#2a2030', images: fpics('v-3000/black-pink', 4), views: fview('v-3000/black-pink') },
      { name: 'Sky Blue & Pink', swatch: '#7cc4f0', images: fpics('v-3000/sky-pink', 4),   views: fview('v-3000/sky-pink') },
    ],
    composition: { Carbon: 40 },
    tech: ['C100', 'KEV', 'GLS'],
    specs: { 'Model name': 'Shooter', Construction: 'Approx. 40% carbon with Kevlar and glass fibre', Grip: 'Black' },
    description: 'Fenta’s Shooter: approximately 40% carbon with Kevlar and glass fibre, in black or sky blue with pink graphics and a black grip.',
  },
  {
    id: 'fenta-v-5000', series: 'Fenta', name: 'Fenta V-5000', carbon: 50, badge: 'New',
    price: 6500, priceConfirmed: true, accent: '#9ed39a',
    images: fpics('v-5000', 3),
    views: fview('v-5000'),
    composition: { Carbon: 50 },
    tech: ['C100', 'KEV', 'GLS'],
    specs: { 'Model name': 'Black Diamond', Construction: 'Approx. 50% carbon with Kevlar and glass fibre', Grip: 'Black' },
    description: 'Fenta’s Black Diamond: approximately 50% carbon with Kevlar and glass fibre, in mint green and white with a black grip.',
  },
  {
    id: 'fenta-v-7000', series: 'Fenta', name: 'Fenta V-7000', carbon: 75, badge: 'New',
    price: 8510, priceConfirmed: true, accent: '#f08a3c',
    images: fpics('v-7000', 2),
    views: fview('v-7000'),
    composition: { Carbon: 75 },
    tech: ['KEV', 'GLS'],
    specs: { 'Model name': 'Striker', Construction: 'Approx. 75% carbon with Kevlar and glass fibre', Grip: 'Black' },
    description: 'Fenta’s Striker: approximately 75% carbon with Kevlar and glass fibre, in maroon, orange and white with a black grip.',
  },
  {
    id: 'fenta-v-5000-gold', series: 'Fenta', name: 'Fenta V-5000 Gold', carbon: 90, badge: 'New',
    price: null, priceConfirmed: false, accent: '#d9b25a',
    images: fpics('v-5000-gold', 3),
    views: fview('v-5000-gold'),
    composition: { Carbon: 90, Aramid: 10 },
    tech: ['C100'],
    specs: { Construction: 'Full composite: 90% carbon, 10% aramid (as printed on the stick)', Grip: 'Black' },
    description: 'The top of the Fenta range: a full composite stick of 90% carbon and 10% aramid, in black with a black grip.',
  },
  {
    // photos from fentasports.com
    id: 'fenta-v-10000', series: 'Fenta', name: 'Fenta V-10000', carbon: 100, badge: 'Flagship',
    price: 14780, priceConfirmed: true, accent: '#ff6a1a',
    images: fpics('v-10000', 3),
    views: fview('v-10000'),
    composition: { Carbon: 100 },
    tech: ['KEV'],
    specs: { 'Model name': 'Jeeta', Construction: 'Approx. 100% carbon and Kevlar (no glass fibre)', Colour: 'White, black & orange', Grip: 'White' },
    description: 'Fenta’s Jeeta, the top of the range: an approximately 100% carbon and Kevlar build, in white and black with an orange flash and a white grip.',
  },
);

/* ─────────────── HOCKEY GLOVES ───────────────
   Photos in SNS/gloves/<folder>/. `price: null` shows "Price coming soon"
   and keeps the glove out of the cart until a price is set. */
const gimgs = (folder, order = [1, 2, 3, 4]) =>
  order.map(i => `SNS/gloves/${folder}/${String(i).padStart(2, '0')}.jpg`);

PRODUCTS.push(
  {
    id: 'ultralight-glove', category: 'hockey-gloves', name: 'SNS Ultralight Glove',
    tagline: 'Hockey Glove', badge: 'New',
    price: 550, priceConfirmed: true, accent: '#3fbf5f',
    sizes: ['S', 'M', 'L'],
    variants: [
      { name: 'Green',  swatch: '#3fbf5f', images: gimgs('ultralight-green') },
      { name: 'Orange', swatch: '#e8722e', images: gimgs('ultralight-orange') },
      { name: 'Blue',   swatch: '#2f7fe0', images: gimgs('ultralight-blue', [3, 1, 2, 4]) },
    ],
    specs: { Style: 'Fingerless, with wrist strap' },
    description: 'A lightweight fingerless SNS Hockey glove with a splash-pattern back, padded palm and hook-and-loop wrist strap. Available in green, orange and blue.',
  },
  {
    id: 'blade-glove', category: 'hockey-gloves', name: 'SNS Blade Glove',
    tagline: 'Hockey Glove', badge: 'New',
    price: 550, priceConfirmed: true, accent: '#c9c9c9',
    sizes: ['S', 'M', 'L'],
    variants: [
      { name: 'Black', swatch: '#1c1c1c', images: gimgs('blade-black') },
    ],
    specs: { Style: 'Fingerless, with wrist strap' },
    description: 'A sleek black fingerless glove from the SNS Blade line, with silver stripe detailing, a padded palm and a BLADE wrist strap.',
  },
);

/* ─────────────── HOCKEY GRIPS ─────────────── */
PRODUCTS.push(
  {
    id: 'shrink-grip', category: 'hockey-grips', name: 'SNS Shrink Grip',
    tagline: 'Hockey Stick Grip', badge: 'New',
    price: 450, priceConfirmed: true, accent: '#9a9a9a',
    sizes: ['One Size'],
    images: ['01', '02', '03', '04'].map(n => `SNS/grips/sns-grip/${n}.jpg`),
    specs: { Colour: 'Black', Type: 'Shrink grip', Pattern: 'Raised SNS Hockey texture' },
    description: 'A black SNS Hockey shrink grip with a raised textured pattern for a secure, non-slip hold. Slides over your stick handle and shrinks to fit for a fresh, tight grip.',
  },
);

/* ─────────────── HOCKEY BALLS ───────────────
   Photos and details from snshockey.com, in SNS/balls/<ball>/<colour>/.
   Sold per ball; `bulk` gives the lower each-price for 6 or more. */
const bimgs = (folder, n) => Array.from({ length: n }, (_, i) => `SNS/balls/${folder}/${String(i + 1).padStart(2, '0')}.jpg`);
const BALL_COLOURS = { Orange: '#ff5a1f', White: '#f2f2f2', Yellow: '#e6f23a' };
const ballVariants = (ball, counts) => Object.entries(counts).map(([name, n]) =>
  ({ name, swatch: BALL_COLOURS[name], images: bimgs(`${ball}/${name.toLowerCase()}`, n) }));

PRODUCTS.push(
  {
    id: 'elite-pro-ball', category: 'hockey-balls', name: 'SNS Elite Pro Dimple Hockey Ball',
    tagline: 'Match ball · FIH spec', badge: 'New',
    price: 1150, priceConfirmed: true, unit: 'ball', accent: '#e9e9e9',
    inStock: false,                                            // OUT OF STOCK — set to true when it's back
    sizes: ['One Size'],
    variants: ballVariants('elite-pro', { White: 3 }),
    specs: { Quality: 'Match', Surface: 'Dimple', Construction: 'Hollow PVC', Standard: 'Conforms to FIH specifications', Pack: '1 ball' },
    description: 'A match-quality dimple ball made of hollow PVC that conforms to FIH specifications. Sold as a single ball.',
  },
  {
    id: 'match-dimple-balls', category: 'hockey-balls', name: 'SNS Match Dimple Hockey Ball',
    tagline: 'Match ball · sold per ball', badge: 'New',
    price: 180, priceConfirmed: true, unit: 'ball', accent: '#ff5a1f',
    bulk: { min: 6, price: 165 },                              // ₹165 each for 6 or more
    maxQty: 60,
    sizes: ['One Size'],
    variants: ballVariants('match-dimple', { Orange: 3, White: 3, Yellow: 3 }),
    specs: { Quality: 'Match', Surface: 'Dimple', Construction: 'Hollow, made on rotary machines', Pack: 'Sold per ball' },
    description: 'A match-quality hollow ball made on rotary machines. The dimpled surface disperses water for better play on watered turf. Sold per ball, with a lower price when you buy 6 or more.',
  },
  {
    id: 'practice-dimple-balls', category: 'hockey-balls', name: 'SNS Practice Dimple Hockey Ball',
    tagline: 'Training ball · sold per ball', badge: 'New',
    price: 150, priceConfirmed: true, unit: 'ball', accent: '#ff5a1f',
    bulk: { min: 6, price: 140 },                              // ₹140 each for 6 or more
    maxQty: 60,
    sizes: ['One Size'],
    variants: ballVariants('practice-dimple', { Orange: 3, White: 3, Yellow: 3 }),
    specs: { Quality: 'Practice', Surface: 'Dimple', Construction: 'Hollow', Pack: 'Sold per ball' },
    description: 'A durable training ball with a hollow construction for consistent weight and shape. The dimple finish works on dry and water-based pitches. Sold per ball, with a lower price when you buy 6 or more.',
  },
);

/* ─────────────── HOCKEY STICK BAGS ───────────────
   SNS bag: photos, details and price (online MRP) from snshockey.com, in SNS/bags/<bag>/<colour>/.
   Alfa bags: see below. */
const bagimgs = (folder, n) => Array.from({ length: n }, (_, i) => `SNS/bags/${folder}/${String(i + 1).padStart(2, '0')}.jpg`);

PRODUCTS.push(
  {
    id: 'madman-jumbo-bag', category: 'hockey-stick-bags', name: 'SNS Madman Jumbo Hockey Bag',
    tagline: 'Holds 5 sticks', badge: 'New',
    price: 1650, priceConfirmed: true, accent: '#c4f23a',
    sizes: ['One Size'],
    variants: [
      { name: 'Black',        swatch: '#1c1c1c', images: bagimgs('madman-jumbo/black', 3) },
      { name: 'Bottle Green', swatch: '#1f4a35', images: bagimgs('madman-jumbo/bottle-green', 3) },
      { name: 'Grey',         swatch: '#5a5d63', images: bagimgs('madman-jumbo/grey', 3) },
      { name: 'Navy Blue',    swatch: '#1f2f5c', images: bagimgs('madman-jumbo/navy-blue', 3) },
      { name: 'Royal Blue',   swatch: '#2a55b8', images: bagimgs('madman-jumbo/royal-blue', 3) },
      { name: 'Sky Blue',     swatch: '#4aa8e8', images: bagimgs('madman-jumbo/sky-blue', 3) },
    ],
    specs: {
      Capacity: '5 sticks', Material: 'Durable 600D material', Size: '103 × 25 × 21 cm (L × H × W)',
      Features: 'Reflector strip at the base, pocket for shoes or wet clothes, pockets for gear and valuables',
    },
    description: 'A practical jumbo stick bag with room for 5 sticks, protective gear, shoes, clothing and valuables. Made of durable 600D material with a reflector strip at the base and a dedicated pocket for shoes or wet clothes.',
  },
  /* Alfa stick-cum-kit bags: photos, details and prices (online price) from alfahockey.in (ALFA/bags/<model>/). */
  {
    id: 'alfa-cyclone-bag', brand: 'Alfa', category: 'hockey-stick-bags', name: 'Alfa Cyclone Stick & Kit Bag',
    tagline: 'Hockey stick cum kit bag', badge: 'New',
    price: 2300, priceConfirmed: true, accent: '#f29a1f',
    sizes: ['One Size'],
    images: apics('bags/cyclone', 7),
    specs: {
      Colour: 'Black & orange', Size: '35" × 13.5" × 13.5"',
      Pockets: 'Large main compartment, padded stick pocket, deep shoe & accessories pocket, top accessories pocket, side mesh pocket',
      Carry: 'Two padded, adjustable shoulder straps',
    },
    description: 'A hockey stick cum kit bag with a large main compartment, a padded pocket to protect your stick, a deep pocket for shoes and accessories, a top pocket for small items and a side mesh pocket for a bottle. Two padded, adjustable shoulder straps.',
  },
  {
    id: 'alfa-jumbo-bag', brand: 'Alfa', category: 'hockey-stick-bags', name: 'Alfa Jumbo Stick & Kit Bag',
    tagline: 'Holds 2–3 sticks', badge: 'New',
    price: 3500, priceConfirmed: true, accent: '#d9b25a',
    sizes: ['One Size'],
    images: apics('bags/jumbo', 5),
    specs: {
      Colour: 'Black & gold', Capacity: '2–3 sticks', Fabric: 'Water resistant',
      Pockets: 'Separate shoe pocket, valuables pocket, multi-pocket design', Carry: 'Dual padded straps, carabiner clip',
    },
    description: 'A compact, premium stick cum kit bag that carries 2–3 sticks, in water-resistant fabric. A separate shoe pocket, a valuables pocket and plenty of other storage, with dual padded straps and a carabiner clip.',
  },
  {
    id: 'alfa-thunder-bag', brand: 'Alfa', category: 'hockey-stick-bags', name: 'Alfa Thunder Stick & Kit Bag',
    tagline: 'Hockey stick cum kit bag', badge: 'New',
    price: 3700, priceConfirmed: true, accent: '#9aa0a8',
    sizes: ['One Size'],
    images: apics('bags/thunder', 6),
    specs: {
      Colour: 'Black & grey', Size: '40" × 12.5" × 11.5"',
      Pockets: 'Large main compartment, large side panel pocket, deep accessories pocket, padded stick pocket, top accessories pocket, side mesh pocket',
      Carry: 'Two padded, adjustable shoulder straps',
    },
    description: 'The largest of the Alfa stick cum kit bags: a big main compartment and a large side panel pocket, a deep accessories pocket, a padded pocket for your stick, a top pocket and a side mesh pocket for a bottle. Two padded, adjustable shoulder straps.',
  },
);

/* ── MALIK STICKS ── photos and specs from the Amazon.in / Flipkart listings (see MALIK/malik-details.md) */
const mpics = (folder, n = 4) => Array.from({ length: n }, (_, i) => `MALIK/${folder}/0${i + 1}.jpg`);
const mview = folder => ['01', '02'].map(n => `MALIK/${folder}/${n}-up-cut.webp?v=2`);

PRODUCTS.push(
  {
    id: 'malik-007', series: 'Malik', name: 'Malik 007', carbon: 10, badge: 'New',
    price: 2258, priceConfirmed: true, accent: '#4fe04a',
    sizes: ['37"'],
    variants: [
      { name: 'Green', swatch: '#4fe04a', images: mpics('007/green'), views: mview('007/green') },
      { name: 'Blue',  swatch: '#4a90f0', images: mpics('007/blue'),  views: mview('007/blue') },
    ],
    composition: { Carbon: 10, Kevlar: 10, Glass: 80 },
    tech: ['KEV', 'GLS'],
    specs: { Length: '37"', Construction: '10% carbon, 10% Kevlar, 80% glass fibre', Bow: 'Low Bow', Grip: 'PU grip' },
    description: 'A low-bow composite stick with 10% carbon, 10% Kevlar and 80% glass fibre, in black with green or blue graphics.',
  },
  {
    id: 'malik-xs-2', series: 'Malik', name: 'Malik XS 2', carbon: 20, badge: 'New',
    price: 3305, priceConfirmed: true, accent: '#f5cf1a',
    sizes: ['36"', '37"', '38"'],
    images: mpics('xs-compo-02'), views: mview('xs-compo-02'),
    composition: { Carbon: 20, Aramid: 5, Glass: 75 },
    tech: ['DCT', 'GLS'],
    specs: { 'Full model name': 'XS Compo 02', Construction: '20% carbon, 5% aramid, 75% glass fibre', Colour: 'Black & yellow', Grip: 'PU grip' },
    description: 'The Malik XS Compo 02: 20% carbon with 5% aramid and 75% glass fibre, built with Dual Core Technology, in black and yellow.',
  },
  {
    id: 'malik-xs-3', series: 'Malik', name: 'Malik XS 3', carbon: 30, badge: 'New',
    price: 3957, priceConfirmed: true, accent: '#3ee03a',
    sizes: ['36"', '37"', '38"'],
    images: mpics('xs-compo-03'), views: mview('xs-compo-03'),
    composition: { Carbon: 30, Aramid: 5, Glass: 65 },
    tech: ['DCT', 'GLS'],
    specs: { 'Full model name': 'XS Compo 03', Construction: '30% carbon, 5% aramid, 65% glass fibre', Colour: 'Black & green', Grip: 'PU grip' },
    description: 'The Malik XS Compo 03: 30% carbon with 5% aramid and 65% glass fibre, built with Dual Core Technology, in black and green.',
  },
);

/* ── FLASH STICKS ── ZX range, Thunder Gold: photos and prices from flashhockey.in.
   The other models are no longer on that site, so their photos, details and prices come from sportswing.in
   (see FLASH/flash-details.md). */
const fzpics = (folder, n) => Array.from({ length: n }, (_, i) => `FLASH/${folder}/${String(i + 1).padStart(2, '0')}.jpg`);
const fzview = (folder, ...n) => n.map(i => `FLASH/${folder}/${i}-up-cut.webp?v=2`);
const FLASH_SIZES = ['36.5"', '37.5"', '38.5"'];
const FLASH_BOWS = ['Low Bow', 'Extreme Low Bow'];

PRODUCTS.push(
  {
    id: 'flash-zx-1000', series: 'Flash', name: 'Flash ZX 1000', carbon: 10, badge: 'New',
    price: 2500, priceConfirmed: true, accent: '#f0a51c',
    sizes: FLASH_SIZES, bows: FLASH_BOWS,
    images: fzpics('zx-1000', 1), views: fzview('zx-1000', '01'),
    composition: { Carbon: 10 },
    tech: ['JPC', 'TWC', 'CMH'],
    specs: { Range: 'ZX series 2026', Colour: 'Amber', Grip: 'White' },
    description: 'An entry-level Flash stick with 10% carbon, light and easy to handle. Twin Core build with a Compact Head, in amber with a white grip.',
  },
  {
    id: 'flash-zx-3000', series: 'Flash', name: 'Flash ZX 3000', carbon: 30, badge: 'New',
    price: 5800, priceConfirmed: true, accent: '#2f9fd0',
    sizes: FLASH_SIZES, bows: FLASH_BOWS,
    images: fzpics('zx-3000', 1), views: fzview('zx-3000', '01'),
    composition: { Carbon: 30 },
    tech: ['JPC', 'TWC', 'CMH'],
    specs: { Range: 'ZX series 2026', Colour: 'Blue', Grip: 'White' },
    description: 'A light, durable 30% carbon stick made for smooth control. Twin Core build with a Compact Head, in blue with a white grip.',
  },
  {
    id: 'flash-zx-5000', series: 'Flash', name: 'Flash ZX 5000', carbon: 50, badge: 'New',
    price: 7800, priceConfirmed: true, accent: '#a02a8c',
    sizes: FLASH_SIZES, bows: FLASH_BOWS,
    images: fzpics('zx-5000', 1), views: fzview('zx-5000', '01'),
    composition: { Carbon: 50 },
    tech: ['JPC', 'TWC', 'CMH'],
    specs: { Range: 'ZX series 2026', Colour: 'Purple', Grip: 'White' },
    description: 'A 50% carbon stick for practice and matches. Twin Core build with a Compact Head, in purple with a white grip.',
  },
  {
    id: 'flash-zx-7000', series: 'Flash', name: 'Flash ZX 7000', carbon: 70, badge: 'New',
    price: 8000, priceConfirmed: true, accent: '#2f6fd6',
    sizes: FLASH_SIZES, bows: FLASH_BOWS,
    images: fzpics('zx-7000', 1), views: fzview('zx-7000', '01'),
    composition: { Carbon: 70 },
    tech: ['JPC', 'TWC', 'CMH'],
    specs: { Range: 'ZX series 2026', Colour: 'Royal blue', Grip: 'White' },
    description: '70% Japanese carbon with a Twin Core build and a Compact Head, in royal blue with a white grip.',
  },
  {
    id: 'flash-zx-10000', series: 'Flash', name: 'Flash ZX 10000', carbon: 90, badge: 'New',
    price: 12000, priceConfirmed: true, accent: '#e0506a',
    sizes: FLASH_SIZES, bows: FLASH_BOWS,
    images: fzpics('zx-10000', 2), views: fzview('zx-10000', '01', '02'),
    composition: { Carbon: 90 },
    tech: ['JPC', 'TWC', 'CMH'],
    specs: { Range: 'ZX series 2026', Colour: 'Red', Grip: 'White' },
    description: '90% Japanese carbon with a Twin Core build and a Compact Head, in red with a white grip.',
  },
  {
    id: 'flash-zx-11000', series: 'Flash', name: 'Flash ZX 11000', carbon: 100, badge: 'Flagship',
    price: 18000, priceConfirmed: true, accent: '#c9b37a',
    sizes: FLASH_SIZES, bows: FLASH_BOWS,
    images: fzpics('zx-11000', 1), views: fzview('zx-11000', '01'),
    composition: { Carbon: 100 },
    tech: ['JPC', 'TWC', 'CMH'],
    specs: { Range: 'ZX series 2026', Colour: 'Black & gold', Grip: 'White' },
    description: 'The top of the ZX range: 100% Japanese carbon with a Twin Core build and a Compact Head, in black and gold with a white grip.',
  },
  {
    id: 'flash-thunder-gold', series: 'Flash', name: 'Flash Thunder Gold', tagline: 'Carbon fibre stick', badge: 'New',
    price: 14800, priceConfirmed: true, accent: '#d2a94a',
    sizes: FLASH_SIZES, bows: FLASH_BOWS,
    images: fzpics('thunder-gold', 3), views: fzview('thunder-gold', '01', '02'),
    specs: { Construction: 'Carbon fibre', Colour: 'Black & gold', Grip: 'Black' },
    description: 'A carbon fibre stick in black with gold lettering and a black grip, in Low Bow or Extreme Low Bow.',
  },
  {
    id: 'flash-crown', series: 'Flash', name: 'Flash Crown', carbon: 95, badge: 'Flagship',
    price: 17679, priceConfirmed: true, accent: '#c9ccd2',
    sizes: ['37"'],
    images: fzpics('crown', 3), views: fzview('crown', '01'),
    composition: { Carbon: 95, Aramid: 5 },
    tech: ['MTC'],
    specs: { Length: '37"', Colour: 'Black & white', Grip: 'Black' },
    description: 'Flash’s Crown International: 95% carbon and 5% aramid, made with M-Tech technology and 4K carbon, in black and white.',
  },
  {
    id: 'flash-lazer', series: 'Flash', name: 'Flash Lazer', carbon: 80, badge: 'New',
    price: 7079, priceConfirmed: true, accent: '#e0a860',
    sizes: ['37"'],
    images: fzpics('lazer', 2), views: fzview('lazer', '01'),
    composition: { Carbon: 80, Kevlar: 20 },
    tech: ['KCF', 'AVS', 'PWG', 'PU'],
    specs: { Length: '37"', Colour: 'Black & gold', Grip: 'White PU grip', 'In the box': 'Stick cover' },
    description: 'A stiff stick with 80% carbon and 20% Kevlar, an Anti-Vibration System and a Power Groove for ball control. Comes with a stick cover.',
  },
  {
    id: 'flash-thunder', series: 'Flash', name: 'Flash Thunder', carbon: 70, badge: 'New',
    price: 6050, priceConfirmed: true, accent: '#f1e02a',
    sizes: ['36.5"', '37"'],
    images: fzpics('thunder', 2), views: fzview('thunder', '02', '01'),
    composition: { Carbon: 70, Aramid: 10, Glass: 20 },
    tech: ['PWG'],
    specs: { Style: 'Drag flick', Colour: 'Black, white & yellow', Grip: 'PU grip' },
    description: 'A drag-flick stick with 70% carbon, 10% aramid and 20% glass fibre. Very stiff and powerful, with a Power Groove for ball control.',
  },
  {
    id: 'flash-hammer', series: 'Flash', name: 'Flash Hammer', carbon: 50, badge: 'New',
    price: 5059, priceConfirmed: true, accent: '#ff5a2a',
    sizes: ['37"'],
    images: fzpics('hammer', 5), views: fzview('hammer', '01', '02'),
    composition: { Carbon: 50, Kevlar: 10, Glass: 40 },
    tech: ['KEV', 'STC'],
    specs: { Length: '37"', Colour: 'Black & orange', 'In the box': 'Stick cover' },
    description: '50% carbon, 40% glass fibre and 10% Kevlar with a Soft Touch Compound head, in black and orange. Comes with a stick cover.',
  },
  {
    id: 'flash-ninja', series: 'Flash', name: 'Flash Ninja', carbon: 30, badge: 'New',
    price: 3824, priceConfirmed: true, accent: '#7ac21c',
    sizes: ['37"'],
    variants: [
      ['Green', 'green', '#6aa514'], ['Blue', 'blue', '#1f2fb0'], ['Sky Blue', 'sky-blue', '#7fb2dc'], ['Lime', 'lime', '#c8ea1c'],
    ].map(([name, f, swatch]) => ({ name, swatch, images: fzpics(`ninja/${f}`, 3), views: fzview(`ninja/${f}`, '01') })),
    composition: { Carbon: 30, Kevlar: 10, Glass: 60 },
    tech: ['KEV'],
    specs: { Length: '37"', Shape: 'Maxi', Grip: 'PU grip', Finish: 'Spray painted' },
    description: 'A maxi-shape composite stick with 30% carbon, 60% glass fibre and 10% Kevlar, as printed on the stick, in four colours.',
  },
  {
    id: 'flash-rebel', series: 'Flash', name: 'Flash Rebel', carbon: 20, badge: 'New',
    price: 2469, priceConfirmed: true, accent: '#d8d21c',
    sizes: ['37"'],
    images: fzpics('rebel', 2), views: fzview('rebel', '01', '02'),
    composition: { Carbon: 20, Glass: 80 },
    specs: { Length: '37"', Shape: 'Maxi head', Colour: 'Yellow & black', Grip: 'PU grip' },
    description: 'A well-balanced composite stick with a maxi head: 20% carbon and 80% glass fibre, in yellow and black.',
  },
);

/* ── COMPOSITE STICK (common slot) ── the shop's own photos, in COMPOSITE/<model>/. Details are what is printed on
   each stick (Nexo: also its Amazon.in listing). Prices are the ones on the shop's own stickers, where they could be read;
   the rest show `tba: 'Update soon'`. To sell one, set `price`. */
const cpics = folder => ['01', '02'].map(n => `COMPOSITE/${folder}/${n}.jpg?v=2`);   // v=2: price stickers taken off
const cview = folder => ['01', '02'].map(n => `COMPOSITE/${folder}/${n}-up-cut.webp?v=3`);
const cstick = p => ({ series: 'Composite', badge: 'New', price: null, tba: 'Update soon', sizes: ['One Size'],
  ...(p.variants ? {} : { images: cpics(p.folder), views: cview(p.folder) }), ...p });
const ccolour = (folder, name, colour, swatch) => ({ name, swatch, images: [...cpics(`${folder}/${colour}`), ...cpics(folder)], views: cview(`${folder}/${colour}`) });

PRODUCTS.push(
  cstick({
    id: 'marex-z1', brand: 'Marex', folder: 'marex-z1', name: 'Marex Z1', tagline: 'Dual Core composite stick', accent: '#2447d6',
    price: 1800, priceConfirmed: true,   // from the shop's sticker, confirmed by the owner
    sizes: ['37"'], tech: ['DCT'],
    specs: { Length: '37"', Maker: 'Marshall Exports', Colour: 'Black, blue & red', Grip: 'Black' },
    description: 'A Marex composite stick with Dual Core Technology, in black, blue and red with a black grip.',
  }),
  cstick({
    id: 'marex-z3', brand: 'Marex', folder: 'marex-z3', name: 'Marex Z3', tagline: 'Dual Core composite stick', accent: '#f2d21c',
    price: 2700, priceConfirmed: true,   // from the shop's sticker, confirmed by the owner
    sizes: ['37"'], tech: ['DCT'],
    specs: { Length: '37"', Maker: 'Marshall Exports', Colour: 'Grey, blue, green & yellow', Grip: 'Black' },
    description: 'A Marex composite stick with Dual Core Technology, in grey, blue and green with a yellow head and a black grip.',
  }),
  cstick({
    id: 'vijayanti-nexo', brand: 'Vijayanti', folder: 'vijayanti-nexo', name: 'Vijayanti Nexo', carbon: 10, accent: '#d6dc1c',
    price: 2200, priceConfirmed: true,
    sizes: ['37"'],
    composition: { Carbon: 10, Kevlar: 5, Glass: 85 },
    tech: ['KEV', 'GLS'],
    specs: { Length: '37"', Colour: 'Yellow & silver', Grip: 'Black' },
    description: 'A Vijayanti composite stick with 10% carbon, 5% Kevlar and 85% glass fibre, in yellow and silver with a black grip.',
  }),
  cstick({
    id: 'deep-mike', brand: 'Deep', folder: 'deep-mike', name: 'Deep Mike', carbon: 10, accent: '#d2b465',
    price: 1750, priceConfirmed: true,   // from the shop's sticker, confirmed by the owner
    sizes: ['36"'],
    composition: { Carbon: 10, Kevlar: 10, Glass: 80 },
    tech: ['KEV', 'GLS'],
    specs: { Length: '36"', Maker: 'Prince Sports', Colour: 'Black & gold', Grip: 'White' },
    description: 'A Deep composite stick with 10% carbon, 10% Kevlar and 80% glass fibre, in black and gold with a white grip.',
  }),
  cstick({
    id: 'deep-royal', brand: 'Deep', folder: 'deep-royal', name: 'Deep Royal', carbon: 20, accent: '#ff7a2a',
    composition: { Carbon: 20, Kevlar: 10, Glass: 70 },
    tech: ['KEV', 'GLS'],
    specs: { Colour: 'Black & orange', Grip: 'White' },
    description: 'A Deep composite stick with 20% carbon, 10% Kevlar and 70% glass fibre, in black and orange with a white grip.',
  }),
  cstick({
    id: 'deep-blaster', brand: 'Deep', folder: 'deep-blaster', name: 'Deep Blaster', carbon: 30, accent: '#c8f51c',
    composition: { Carbon: 30, Kevlar: 10, Glass: 60 },
    tech: ['KEV', 'GLS'],
    specs: { Maker: 'Prince Sports', Colour: 'Neon yellow & black', Grip: 'White' },
    description: 'A Deep composite stick with 30% carbon, 10% Kevlar and 60% glass fibre, in neon yellow and black with a white grip.',
  }),
  cstick({
    id: 'deep-scoop', brand: 'Deep', folder: 'deep-scoop', name: 'Deep Scoop', carbon: 50, accent: '#5d8a5a',
    sizes: ['37.5"'],
    composition: { Carbon: 50, Kevlar: 10, Glass: 40 },
    tech: ['KEV', 'GLS'],
    specs: { Length: '37.5"', Maker: 'Prince Sports', Colour: 'Green', Grip: 'Black' },
    description: 'A Deep composite stick with 50% carbon, 10% Kevlar and 40% glass fibre, in green with a black grip.',
  }),
  cstick({
    id: 'deep-cobra', brand: 'Deep', folder: 'deep-cobra', name: 'Deep Cobra', carbon: 70, accent: '#b7a06a',
    composition: { Carbon: 70, Kevlar: 10, Glass: 20 },
    tech: ['KEV', 'GLS'],
    specs: { Maker: 'Prince Sports', Colour: 'Brown & gold', Grip: 'Black' },
    description: 'A Deep composite stick with 70% carbon, 10% Kevlar and 20% glass fibre, in brown and gold with a black grip.',
  }),
  cstick({
    id: 'rysum-uzi-30', brand: 'Rysum', name: 'Rysum Uzi 30', carbon: 30, accent: '#ff7a2a',
    price: 3400, priceConfirmed: true,   // from the shop's sticker, confirmed by the owner
    variants: [
      ccolour('rysum-uzi-30', 'Navy', 'navy', '#2a2a8c'),
      ccolour('rysum-uzi-30', 'Sky Blue', 'sky', '#1f8fe0'),
    ],
    composition: { Carbon: 30 },
    tech: ['JPC', 'ARM'],
    specs: { Construction: '30% Japanese carbon with aramid reinforcement', Grip: 'White (navy), black (sky blue)' },
    description: 'A Rysum stick with 30% Japanese carbon and aramid reinforcement, in navy or sky blue with orange lettering.',
  }),
  cstick({
    id: 'rysum-m4-stealth', brand: 'Rysum', folder: 'rysum-m4-stealth', name: 'Rysum M4 Stealth', carbon: 40, accent: '#f0553a',
    composition: { Carbon: 40 },
    tech: ['JPC', 'ARM'],
    specs: { Construction: '40% Japanese carbon with aramid reinforcement', Colour: 'Grey & red', Grip: 'Black' },
    description: 'A Rysum stick with 40% Japanese carbon and aramid reinforcement, in grey with red lettering and a black grip.',
  }),
  cstick({
    id: 'rysum-mp-5-hybrid', brand: 'Rysum', folder: 'rysum-mp-5-hybrid', name: 'Rysum MP 5 Hybrid', carbon: 50, accent: '#ff7a1c',
    composition: { Carbon: 50 },
    tech: ['JPC', 'ARM'],
    specs: { Construction: '50% Japanese carbon with aramid reinforcement', Colour: 'Orange & blue', Grip: 'Black' },
    description: 'A Rysum stick with 50% Japanese carbon and aramid reinforcement, in orange with blue lettering and a black grip.',
  }),
  cstick({
    id: 'stk-boa-2', brand: 'STK', name: 'STK Boa 2', tagline: 'Composite stick', accent: '#3fe02a',
    price: 2750, priceConfirmed: true,   // from the shop's sticker, confirmed by the owner
    variants: [
      ccolour('stk-boa-2', 'Blue', 'blue', '#1f55d6'),
      ccolour('stk-boa-2', 'Green', 'green', '#3fe02a'),
    ],
    specs: { Grip: 'Black' },
    description: 'An STK Boa 2 composite stick in blue & grey or green & black, with a black grip.',
  }),
);

/* ── BAGS ── the shop's own photos, in BAGS/<model>/ (made by tools/bagcut.py). Price: `tba` until the shopkeeper sets `price`. */
const bagpics = (folder, n) => Array.from({ length: n }, (_, i) => `BAGS/${folder}/0${i + 1}.jpg`);
const shopbag = p => ({ category: 'hockey-stick-bags', badge: 'New', price: null, tba: 'Update soon', sizes: ['One Size'], ...p });

PRODUCTS.push(
  shopbag({
    id: 'flash-medium-bag', brand: 'Flash', name: 'Flash Medium Stick Bag', tagline: 'Holds 4–5 sticks', accent: '#e8323f',
    price: 2200, priceConfirmed: true,                         // online price, flashhockey.in
    images: bagpics('flash-medium', 2),
    specs: { Colour: 'Red & black', Capacity: '4–5 sticks', Material: '600D waterproof matty fabric', Carry: 'Two shoulder straps' },
    description: 'A medium stick bag for 4–5 sticks with separate compartments for shoes, clothes, bottles and accessories, in 600D waterproof matty fabric. Red and black.',
  }),
  shopbag({
    id: 'just-hockey-stick-bag', brand: 'Just', name: 'Just Hockey Stick Bag', tagline: 'Stick & kit bag · four colours', accent: '#e0303a',
    variants: [
      { name: 'Red', swatch: '#e0303a', images: bagpics('just-hockey/red', 3) },
      { name: 'Red & Black', swatch: '#7a1f26', images: bagpics('just-hockey/red-black', 2) },
      { name: 'Black', swatch: '#1c1c1c', images: bagpics('just-hockey/black', 2) },
      { name: 'Red & Navy', swatch: '#27467d', images: bagpics('just-hockey/red-navy', 2) },
    ],
    specs: { Pockets: 'Two front zip pockets, side mesh pocket, black base', Carry: 'Two shoulder straps and grab handles' },
    description: 'A Just Hockey stick bag with two front zip pockets, a side mesh pocket and shoulder straps, in four colours.',
  }),
  shopbag({
    id: 'rysum-stick-bag', brand: 'Rysum', name: 'Rysum Stick Bag', tagline: 'Stick & kit bag · two colours', accent: '#ff7a2a',
    variants: [
      { name: 'Red & Navy', swatch: '#b5323a', images: bagpics('rysum-stick-bag/red', 2) },
      { name: 'Orange & Blue', swatch: '#ff7a2a', images: bagpics('rysum-stick-bag/orange', 2) },
    ],
    specs: { Pockets: 'Front zip pocket and zipped end compartment' },
    description: 'A Rysum stick bag with a front zip pocket and a zipped end compartment, in red & navy or orange & blue.',
  }),
  shopbag({
    id: 'deep-target-goalie-bag', brand: 'Deep', category: 'goal-keeper-accessories', name: 'Deep Target Goalie Bag', tagline: 'Wheeled goalkeeper kit bag', accent: '#ff7a1c',
    images: bagpics('deep-target', 3),
    specs: { Model: 'Target', Colour: 'Orange & black', Wheels: '2 wheels', Pockets: 'End zip pocket' },
    description: 'A large Deep goalkeeper kit bag on two wheels with a carry strap and an end zip pocket, in orange and black.',
  }),
  shopbag({
    id: 'deep-rocket-goalie-bag', brand: 'Deep', category: 'goal-keeper-accessories', name: 'Deep Rocket Goalie Bag', tagline: 'Wheeled goalkeeper kit bag with back straps', accent: '#e0b53a',
    images: bagpics('deep-rocket', 3),
    specs: { Model: 'Rocket', Colour: 'Black & gold', Wheels: '3 wheels', Carry: 'Padded back straps, waist strap and top handle', Pockets: 'End zip pocket' },
    description: 'A large Deep goalkeeper kit bag on three wheels that can also be carried on the back, with a waist strap and an end zip pocket, in black and gold.',
  }),
  shopbag({
    id: 'just-game-backpack', brand: 'Just', category: 'tourbags', name: 'Just Game Backpack', tagline: 'Backpack · two colours', accent: '#f5c21c',
    variants: [
      { name: 'Blue & Black', swatch: '#1f8fe8', images: bagpics('just-game-backpack/blue', 2) },
      { name: 'Yellow & Black', swatch: '#f5c21c', images: bagpics('just-game-backpack/yellow', 2) },
    ],
    specs: { Pockets: 'Large front pocket, zipped side pockets and mesh bottle pockets' },
    description: 'A Just backpack with a large front pocket, zipped side pockets and mesh bottle pockets, in blue or yellow with black.',
  }),
);

/* ── SHIN GUARDS, GRIPS, BAGS ── the shop's photos in GEAR/<model>/ (tools/gearcut.py), see GEAR/gear-details.md.
   Online price where the same product was found; the rest `tba: 'Update soon'` until a price is set. */
const gearpics = (folder, n) => Array.from({ length: n }, (_, i) => `GEAR/${folder}/0${i + 1}.jpg`);
const soon = { badge: 'New', price: null, tba: 'Update soon', sizes: ['One Size'] };
const shin = p => ({ ...soon, category: 'hockey-shinguards', sizes: ['S', 'M', 'L'], ...p });

PRODUCTS.push(
  shin({
    id: 'flash-anatomic-plus-shin', brand: 'Flash', name: 'Flash Anatomic Plus Shin Guard', tagline: 'Moulded shin guard', accent: '#e9edf0',
    price: 275, priceConfirmed: true,
    images: gearpics('shin-flash', 2),
    specs: { Model: 'Anatomic Plus', Colour: 'White & black', Shell: 'Moulded shell with air holes', Padding: 'Foam', Pack: '1 pair' },
    description: 'A shin guard shaped to the leg, with a hard moulded shell, air holes and foam padding. White with a black lining, in S, M and L.',
  }),
  shin({
    id: 'deep-shin-guard', brand: 'Deep', name: 'Deep Shin Guard', tagline: 'Moulded shin guard', accent: '#dfe3e2',
    images: gearpics('shin-deep', 2),
    specs: { Colour: 'White & grey', Shell: 'Moulded shell with air holes', Padding: 'Foam', Pack: '1 pair' },
    description: 'A Deep shin guard with a moulded white shell, air holes and grey foam padding, in S, M and L.',
  }),
  shin({
    id: 'blue-shin-guard', brand: '', name: 'Blue Shin Guard', tagline: 'Moulded shin guard', accent: '#2443e0',
    images: gearpics('shin-blue', 2),
    specs: { Colour: 'Blue & black', Shell: 'Moulded shell with air holes', Padding: 'Foam', Pack: '1 pair' },
    description: 'A moulded shin guard with air holes and black foam padding, in blue. Sizes S, M and L.',
  }),
  shin({
    id: 'mesh-shin-guard', brand: '', name: 'Mesh Shin Guard', tagline: 'Mesh cover · two straps', accent: '#c6f51c',
    images: gearpics('shin-mesh', 2),
    specs: { Colour: 'Black & neon', Cover: 'Mesh', Straps: 'Two wrap-around straps', Pack: '1 pair' },
    description: 'A mesh-covered shin guard with two wrap-around straps and neon edging, in black. Sizes S, M and L.',
  }),
  {
    ...soon, id: 'alfa-chamois-grip', brand: 'Alfa', category: 'hockey-grips', name: 'Alfa Chamois Grip', tagline: 'Waterproof · boxed', accent: '#ff2fb0',
    price: 500, priceConfirmed: true,                          // alfahockey.in: 2 for 1,000, 3 for 1,500, 5 for 2,500
    variants: [['Pink', 'pink', '#ff1fd0'], ['Green', 'green', '#8fe05a'], ['Yellow', 'yellow', '#f5e11c'], ['Orange', 'orange', '#ff8a4a'], ['Black', 'black', '#1c1c1c']]
      .map(([name, f, swatch]) => ({ name, swatch, images: gearpics(`alfa-chamois/${f}`, 1) })),
    specs: { Material: 'Chamois, waterproof', Pack: '1 grip, boxed' },
    description: 'A waterproof chamois grip with a soft, non-slip feel and good moisture control. One grip in an Alfa box, in five colours.',
  },
  {
    ...soon, id: 'alfa-grip-loose', brand: 'Alfa', category: 'hockey-grips', name: 'Alfa Grip (without box)', tagline: 'Wrapped in clear film', accent: '#ff5a3a',
    variants: [['Orange', 'orange', '#f0442a'], ['Blue', 'blue', '#2a7fb8'], ['Red', 'red', '#d8324a'], ['Black', 'black', '#2a2823']]
      .map(([name, f, swatch]) => ({ name, swatch, images: gearpics(`alfa-loose/${f}`, 2) })),
    specs: { Pack: '1 grip in clear film' },
    description: 'An Alfa hockey grip with the raised Alfa name, wrapped in clear film, in four colours.',
  },
  {
    ...soon, id: 'rakshak-chamois-grip', brand: 'Rakshak', category: 'hockey-grips', name: 'Rakshak Chamois Grip', tagline: 'Chamois hockey grip', accent: '#f0dc2a',
    variants: [['Yellow', 'yellow', '#f0dc2a'], ['Red', 'red', '#b3243c']].map(([name, f, swatch]) => ({ name, swatch, images: gearpics(`rakshak-chamois/${f}`, 1) })),
    specs: { Material: 'Chamois', Maker: 'R.K. Sports', Pack: '1 grip' },
    description: 'A Rakshak chamois hockey grip, one per pack, in yellow or red.',
  },
  {
    ...soon, id: 'rakshak-waterproof-grip', brand: 'Rakshak', category: 'hockey-grips', name: 'Rakshak Waterproof Grip', tagline: 'Waterproof hockey grip', accent: '#d9d5cc',
    images: gearpics('rakshak-waterproof', 1),
    specs: { Type: 'Waterproof grip', Colour: 'Off-white', Maker: 'R.K. Sports', Pack: '1 grip' },
    description: 'A Rakshak waterproof hockey grip in off-white, one per pack.',
  },
  {
    ...soon, id: 'rakshak-rogue-jumbo-bag', brand: 'Rakshak', category: 'hockey-stick-bags', name: 'Rakshak Rogue Jumbo Bag', tagline: 'Holds 5 sticks', accent: '#f2c21c',
    price: 3699, priceConfirmed: true,
    images: gearpics('rakshak-rogue', 4),
    specs: { Model: 'Rogue Jumbo', Colour: 'Black & yellow', Capacity: '5 sticks', Pockets: 'Large clothing compartment, deep front pocket, accessory pocket, shoe pocket', Carry: 'Padded shoulder straps' },
    description: 'A jumbo bag for 5 sticks with a large clothing compartment, a deep front pocket, an accessory pocket and a shoe pocket, on padded shoulder straps. Items in the photos are not included.',
  },
  {
    ...soon, id: 'hindon-stick-bag', brand: 'Hindon', category: 'hockey-stick-bags', name: 'Hindon Stick Bag', tagline: 'Stick & kit bag', accent: '#d9b25a',
    images: gearpics('hindon-bag', 2),
    specs: { Colour: 'Black & gold', Pockets: 'Two front zip pockets and a side mesh pocket' },
    description: 'A Hindon stick and kit bag in black with gold print, with two front zip pockets and a side mesh pocket.',
  },
  {
    ...soon, id: 'deep-gost-stick-bag', brand: 'Deep', category: 'hockey-stick-bags', name: 'Deep Gost Stick Bag', tagline: 'Stick & kit bag', accent: '#2487a8',
    images: gearpics('deep-gost', 3),
    specs: { Model: 'Gost', Colour: 'Teal & white', Pockets: 'Large front zip pocket, round top pocket and side mesh pocket', Carry: 'Shoulder straps and a side handle' },
    description: 'A Deep stick and kit bag in teal with a large front pocket, a round top pocket, a side mesh pocket and shoulder straps.',
  },
  {
    ...soon, id: 'just-duffle-bag', brand: 'Just', category: 'tourbags', name: 'Just Duffle Bag', tagline: 'Duffle bag', accent: '#1f9be8',
    images: gearpics('just-duffle', 2),
    specs: { Colour: 'Blue & black', Pockets: 'Main zip compartment and end zip pockets', Carry: 'Two hand straps' },
    description: 'A Just duffle bag in blue with black straps, a main zip compartment and end zip pockets.',
  },
);

/* ── MOUTH GUARD, GLOVES, BOXED GRIPS, STOCKINGS ── the shop's photos in KIT/<model>/ (tools/kitcut.py), see KIT/kit-details.md.
   Price: `tba` until one is set here or on the admin page. */
const kitpics = (folder, n = 1) => Array.from({ length: n }, (_, i) => `KIT/${folder}/0${i + 1}.jpg`);
const kitcolours = (folder, n, list) => list.map(([name, f, swatch]) => ({ name, swatch, images: kitpics(`${folder}/${f}`, n) }));

PRODUCTS.push(
  {
    ...soon, id: 'mouth-guard', brand: '', category: 'hockey-accessories', name: 'Mouth Guard', tagline: 'Five colours', accent: '#c9f01c',
    variants: kitcolours('mouth-guard', 2, [['Yellow', 'yellow', '#c9f01c'], ['Red', 'red', '#c8141a'], ['Blue', 'blue', '#16207a'], ['Green', 'green', '#3fd01f'], ['Black', 'black', '#1a1a1a']]),
    specs: { Pack: '1 mouth guard, sealed' },
    description: 'A mouth guard in a sealed pack, in yellow, red, blue, green or black.',
  },
  {
    ...soon, price: 550, priceConfirmed: true, id: 'rysum-gold-glove', brand: 'Rysum', category: 'hockey-gloves', name: 'Rysum Gold Glove', tagline: 'Left hand', accent: '#e6c35a',
    sizes: ['L'], images: kitpics('rysum-gold-glove', 2),
    specs: { Range: 'Gold', Hand: 'Left', Size: 'L', Colour: 'Black & gold', Style: 'Fingerless, with wrist strap' },
    description: 'A padded fingerless Rysum glove for the left hand, with a honeycomb grip on the fingers and a wrist strap, in black with gold print.',
  },
  {
    ...soon, id: 'deep-glove', brand: 'Deep', category: 'hockey-gloves', name: 'Deep Hockey Glove', tagline: 'Open palm', accent: '#e8762a',
    sizes: ['S'], images: kitpics('deep-glove', 2),
    specs: { Size: 'S', Colour: 'Black & white with tricolour print', Style: 'Fingerless, open palm, with wrist strap' },
    description: 'A padded fingerless Deep glove with an open palm, a honeycomb grip on the fingers and a wrist strap, in black and white with a tricolour print.',
  },
  {
    ...soon, id: 'alfa-skinfit-pro-glove', brand: 'Alfa', category: 'hockey-gloves', name: 'Alfa SkinFit Pro Glove', tagline: 'Protective glove', accent: '#2c55d6',
    sizes: ['M'], images: kitpics('alfa-skinfit-glove', 2),
    specs: { Model: 'SkinFit Pro', Size: 'M', Colour: 'Blue', Style: 'Fingerless, with wrist strap' },
    description: 'An Alfa SkinFit Pro protective glove with a padded back and an elastic wrist strap, in blue.',
  },
  {
    ...soon, id: 'm-glove', brand: '', category: 'hockey-gloves', name: 'M Logo Hockey Glove', tagline: 'Padded glove', accent: '#f0442a',
    sizes: ['M'], images: kitpics('m-glove', 2),
    specs: { Size: 'M', Colour: 'Black & red', Style: 'Fingerless, with wrist strap', 'Made in': 'India' },
    description: 'A padded fingerless glove with a protected thumb and an elastic wrist strap, in black with red between the fingers.',
  },
  {
    ...soon, id: 'sns-stick-grip', category: 'hockey-grips', name: 'SNS Stick Grip', tagline: 'Boxed · six colours', accent: '#e0205a',
    variants: kitcolours('sns-stick-grip', 1, [['Pink', 'pink', '#d81f52'], ['Navy', 'navy', '#14305c'], ['Purple', 'purple', '#8a2aa8'], ['Yellow', 'yellow', '#f0c060'], ['White', 'white', '#e8ece6'], ['Lime', 'lime', '#b8e04a']]),
    specs: { Pack: '1 grip, boxed' },
    description: 'An SNS Hockey stick grip with a raised SNS pattern, boxed, in six colours.',
  },
  {
    ...soon, id: 'deep-stick-grip', brand: 'Deep', category: 'hockey-grips', name: 'Deep Stick Grip', tagline: 'Boxed · five colours', accent: '#f04fc0',
    variants: kitcolours('deep-stick-grip', 1, [['Mustard', 'mustard', '#e0921f'], ['Green', 'green', '#3aa03a'], ['Maroon', 'maroon', '#7a3340'], ['Navy', 'navy', '#26304f'], ['Pink', 'pink', '#e54fc4']]),
    specs: { Pack: '1 grip, boxed' },
    description: 'A Deep hockey stick grip, boxed, in mustard, green, maroon, navy or pink.',
  },
  {
    ...soon, id: 'as-nylon-stockings', brand: 'AS International', category: 'hockey-stockings', name: 'AS International Nylon Stockings', tagline: 'Nylon · six colours', accent: '#f2c31c',
    variants: kitcolours('as-stockings', 1, [['White', 'white', '#f2f2f4'], ['Yellow', 'yellow', '#f5c62a'], ['Green', 'green', '#2f6b45'], ['Red', 'red', '#b3123a'], ['Navy', 'navy', '#1a1f36'], ['Charcoal', 'charcoal', '#4a4f58']]),
    specs: { Material: 'Nylon', Maker: 'AS International' },
    description: 'Nylon hockey stockings by AS International with a ribbed cuff, in six colours.',
  },
  {
    ...soon, id: 'rysum-stockings', brand: 'Rysum', category: 'hockey-stockings', name: 'Rysum Performance Stockings', tagline: 'Eight colours', accent: '#3fb8f0',
    variants: kitcolours('rysum-stockings', 1, [['Blue', 'blue', '#2f93d6'], ['Yellow', 'yellow', '#f0c52a'], ['Red', 'red', '#c01f3a'], ['Navy', 'navy', '#232a4a'], ['Green', 'green', '#5cc83f'], ['Orange', 'orange', '#ff5f4f'], ['Black', 'black', '#2a2a26'], ['White', 'white', '#f2f2f4']]),
    specs: { Range: 'Performance Socks / Stockings' },
    description: 'Rysum Performance hockey stockings with a ribbed band, in eight colours.',
  },
  {
    ...soon, id: 'just-stockings', brand: 'Just', category: 'hockey-stockings', name: 'Just Stockings', tagline: 'Ten colours', accent: '#ff6a3a',
    variants: kitcolours('just-stockings', 1, [['Orange', 'orange', '#ff6a3f'], ['Gold', 'gold', '#e8a52a'], ['Yellow', 'yellow', '#f2c51f'], ['Turquoise', 'turquoise', '#23a9bd'], ['Sky Blue', 'sky', '#5a94d8'], ['Royal Blue', 'royal', '#3a36b0'], ['Navy', 'navy', '#223a6a'], ['Red', 'red', '#c0203a'], ['White', 'white', '#eef0f0'], ['Charcoal', 'charcoal', '#4a5056']]),
    specs: { Maker: 'Just Sports' },
    description: 'Just hockey stockings in ten colours.',
  },
);

/* ── SPORTS WEAR, STOCKINGS, GLOVES, GOALKEEPER STRAPS, SHIN GUARDS ── pictures in WEAR/<model>/ (tools/wearcut.py), see WEAR/wear-details.md.
   Online price where the same product was found; the rest `tba: 'Update soon'` until a price is set. */
const wearpics = (folder, n = 2) => Array.from({ length: n }, (_, i) => `WEAR/${folder}/0${i + 1}.jpg?v=5`);
const wearcolours = (folder, list, n = 2) => list.map(([name, f, swatch, k = n]) => ({ name, swatch, images: wearpics(`${folder}/${f}`, k) }));

PRODUCTS.push(
  {
    ...soon, id: 'just-sports-shorts', brand: 'Just', category: 'sports-wear', sub: 'shorts', name: 'Just Sports Shorts', tagline: 'Six colours', accent: '#ff5a1f',
    sizes: ['M', 'L', 'XL'],
    variants: wearcolours('just-shorts', [['Orange', 'orange', '#f9541a'], ['Maroon', 'maroon', '#7a1c34'], ['Green', 'green', '#4d6b20'], ['Navy', 'navy', '#22303c'], ['Dark Grey', 'dark-grey', '#565d5f'], ['Light Grey', 'light-grey', '#bcc4c1']]),
    specs: { Waist: 'Elastic', Pockets: 'Two side pockets', Logo: 'Embroidered Just logo', Cut: 'Angled side panels' },
    description: 'Just sports shorts with an elastic waist, side pockets, angled side panels and an embroidered logo, in six colours.',
  },
  {
    ...soon, id: 'just-panel-shorts', brand: 'Just', category: 'sports-wear', sub: 'shorts', name: 'Just Panel Shorts', tagline: 'Khaki · dark stitching', accent: '#c9b79f',
    sizes: ['M', 'L', 'XL'], images: wearpics('just-shorts-khaki'),
    specs: { Colour: 'Khaki', Waist: 'Elastic', Pockets: 'Two side pockets', Logo: 'Embroidered Just logo', Cut: 'Straight and angled side panels, dark stitching' },
    description: 'Just sports shorts in khaki with an elastic waist, side pockets, side panels in dark stitching and an embroidered logo.',
  },
  {
    ...soon, id: 'just-slit-shorts', brand: 'Just', category: 'sports-wear', sub: 'shorts', name: 'Just Side-Slit Shorts', tagline: 'Navy · side slits', accent: '#4a5f8a',
    sizes: ['M', 'L', 'XL'], images: wearpics('just-shorts-slit'),
    specs: { Colour: 'Navy', Waist: 'Elastic', Pockets: 'Two side pockets', Logo: 'Printed Just logo', Cut: 'Side panels with a slit at the hem' },
    description: 'Just sports shorts in navy with an elastic waist, side pockets, a slit at each side of the hem and a printed logo.',
  },
  {
    ...soon, id: 'technosport-or60', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport OR60 T-Shirt', tagline: 'Double Cool · eight colours', accent: '#1fa3a3',
    price: 399, priceConfirmed: true,                          // the owner's choice, 25 Nov 2026 (catalogue MRP is 469)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Teal', 'teal', '#1f9a9c'], ['Royal Blue', 'royal-blue', '#2f86e0'], ['Chili Flakes', 'chili-flakes', '#c9705a'], ['Khaki', 'khaki', '#b8ab92'], ['Ash', 'ash', '#9aa3a6'], ['Navy', 'navy', '#22405a', 1], ['Smokey Olive', 'smokey-olive', '#5b5a4c'], ['Black', 'black', '#23292a']]
      .map(([name, f, swatch, n = 2]) => ({ name, swatch, images: wearpics(`technosport-or60/${f}`, n) })),
    specs: { Model: 'OR60', Fabric: 'Double Cool', Protection: 'Techno Guard anti-microbial', Neck: 'Crew neck', Sleeves: 'Half sleeve', Pattern: 'Marble print' },
    description: 'A TechnoSport crew-neck T-shirt in Double Cool fabric with Techno Guard anti-microbial protection and an all-over marble print, in eight colours. Sizes M to 2XL.',
  },
  {
    ...soon, photoCard: true, price: 455, priceConfirmed: true, id: 'technosport-or747', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport OR747 T-Shirt', tagline: 'Techno Cool+ · six colours', accent: '#8fd8e6',
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['White', 'white', '#d9dcea'], ['Sky Blue', 'sky-blue', '#6fcfe2'], ['Mint Green', 'mint-green', '#57b884'], ['Yellow', 'yellow', '#dfe994'], ['Lilac', 'lilac', '#9a83b5'], ['Vintage Indigo', 'vintage-indigo', '#20283a']]
      .map(([name, f, swatch]) => ({ name, swatch, images: wearpics(`technosport-or747/${f}`) })),
    specs: { Model: 'OR747', Fabric: 'Techno Cool+', Neck: 'Crew neck', Sleeves: 'Half sleeve', Pattern: 'All-over print' },
    description: 'A lightweight TechnoSport crew-neck T-shirt in Techno Cool+ fabric with an all-over print, in six colours. Sizes M to 2XL.',
  },
  {
    ...soon, price: 579, priceConfirmed: true, id: 'technosport-p926', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport P926 T-Shirt', tagline: 'Techno Dry · six colours', accent: '#6a4fc0',
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Purple', 'purple', '#5a3fa0'], ['Royal Blue', 'royal-blue', '#1058e0'], ['Navy', 'navy', '#25275f'], ['Red', 'red', '#b00a22'], ['Gulf Coast', 'gulf-coast', '#0f5a4c'], ['Off White', 'off-white', '#dcdccb']]
      .map(([name, f, swatch]) => ({ name, swatch, images: wearpics(`technosport-p926/${f}`) })),
    specs: { Model: 'P926', Fabric: 'Techno Dry', Neck: 'Crew neck', Sleeves: 'Half sleeve', Print: 'Techno chest print and club badge' },
    description: 'A TechnoSport crew-neck T-shirt in Techno Dry fabric with a Techno print across the chest and a club badge, in six colours. Sizes M to 2XL.',
  },
  {
    ...soon, id: 'technosport-or39', tall: true, brand: 'TechnoSport', category: 'sports-wear', sub: 'tracks', name: 'TechnoSport OR39 Track Pants', tagline: 'TS Flexi · eight colours', accent: '#7ba4c4',
    price: 740, priceConfirmed: true,                          // technosport.in (MRP 779); there trekking green is 664 and iron grey 712
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Blue Stone', 'blue-stone', '#557a96', 5], ['Khaki', 'khaki', '#b3a58a', 5], ['Black', 'black', '#1d1e1f', 5], ['Light Grey', 'light-grey', '#a3a0a6', 5], ['Iron Grey', 'iron-grey', '#67686b', 5], ['Woodland Grey', 'woodland-grey', '#4a4a4e', 5], ['Navy', 'navy', '#1b2a3d', 5], ['Trekking Green', 'trekking-green', '#41604f', 5]]
      .map(([name, f, swatch, n]) => ({ name, swatch, images: wearpics(`technosport-or39/${f}`, n) })),
    specs: { Model: 'OR39', Fabric: 'TS Flexi', Feel: 'Breathable, moisture-wicking', Fit: 'Regular', Waist: 'Elastic with drawstring', Pockets: 'Side pockets and back pocket', Design: 'Angled seams, TechnoSport print on the thigh', 'Good for': 'Gym, running, dance, cycling, badminton', Origin: 'India' },
    description: 'TechnoSport regular-fit track pants in breathable, moisture-wicking TS Flexi fabric with angled seams, in eight colours. Sizes M to 2XL.',
  },
  {
    ...soon, id: 'technosport-or85', tall: true, brand: 'TechnoSport', category: 'sports-wear', sub: 'tracks', name: 'TechnoSport OR85 Track Pants', tagline: '4-way stretch · seven colours', accent: '#3f757c',
    price: 560, priceConfirmed: true,                          // technosport.in (MRP 589)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Gulf Coast', 'gulf-coast', '#17404a', 5], ['Iron Gray', 'iron-gray', '#8b908e', 5], ['Black', 'black', '#151617', 4], ['Carbon Grey', 'carbon-grey', '#2e3747', 3], ['Woodland Gray', 'woodland-gray', '#403f44', 3], ['Black Olive', 'black-olive', '#423d38', 5], ['Khaki', 'khaki', '#b09c84', 5]]
      .map(([name, f, swatch, n]) => ({ name, swatch, images: wearpics(`technosport-or85/${f}`, n) })),
    specs: { Model: 'OR85', Fabric: '4 Way Crispy', Stretch: '4-way', Feel: 'Soft, smooth, anti-static', Protection: 'UPF50+ sun protection, Techno Guard anti-microbial, odour-free finish', Fit: 'Regular', Waist: 'Elastic', Pockets: 'Side pockets', Design: 'Solid colour, small logo at the pocket', 'Good for': 'Gym, casual wear, dance, outdoors, travel, cricket', Origin: 'India' },
    description: 'TechnoSport regular-fit track pants in 4-way stretch fabric with an elastic waist, in seven colours. Sizes M to 2XL.',
  },
  {
    ...soon, id: 'technosport-or779', tall: true, brand: 'TechnoSport', category: 'sports-wear', sub: 'tracks', name: 'TechnoSport OR779 Track Pants', tagline: 'Techno Lite · seven colours', accent: '#c9b08a',
    price: 629, priceConfirmed: true,                          // technosport.in, sold there as P779 (MRP 699)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Khaki', 'khaki', '#a08f76', 5], ['Gulf Coast', 'gulf-coast', '#2a5a5b', 4], ['Black', 'black', '#151617', 5], ['Navy', 'navy', '#1b2734', 5], ['Vintage Indigo', 'vintage-indigo', '#525c70', 4], ['Woodland Gray', 'woodland-gray', '#454845', 4], ['Black Olive', 'black-olive', '#35322a', 3]]
      .map(([name, f, swatch, n]) => ({ name, swatch, images: wearpics(`technosport-or779/${f}`, n) })),
    specs: { Model: 'OR779', Fabric: 'Techno Lite', Feel: 'Light, soft, smooth, anti-static', Protection: 'UPF50+ sun protection, Techno Guard anti-microbial, odour-free finish', Fit: 'Regular', Waist: 'Elastic with drawstring', Pockets: 'Side pockets', 'Good for': 'Running and training', Origin: 'India' },
    description: 'Lightweight TechnoSport regular-fit track pants in Techno Lite fabric with an elastic drawstring waist and side pockets, in seven colours. Sizes M to 2XL.',
  },
  {
    ...soon, id: 'technosport-or734', tall: true, brand: 'TechnoSport', category: 'sports-wear', sub: 'tracks', name: 'TechnoSport OR734 Joggers', tagline: '4-way stretch · seven colours', accent: '#b4b4b8',
    price: 584, priceConfirmed: true,                          // technosport.in, sold there as P734 (MRP 649)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Light Grey', 'light-grey', '#9c9c9e', 5], ['Black', 'black', '#17171a', 5], ['Navy', 'navy', '#232f47', 5], ['Carbon Grey', 'carbon-grey', '#353a46', 3], ['Woodland Gray', 'woodland-gray', '#3b3d3a', 3], ['Gulf Coast', 'gulf-coast', '#1c4a50', 5], ['Khaki', 'khaki', '#8d886a', 1]]
      .map(([name, f, swatch, n]) => ({ name, swatch, images: wearpics(`technosport-or734/${f}`, n) })),
    specs: { Model: 'OR734', Fabric: '4 Way Crispy', Stretch: '4-way', Feel: 'Soft, smooth, anti-static', Protection: 'UPF50+ sun protection, Techno Guard anti-microbial', Fit: 'Regular, elastic cuffs', Waist: 'Elastic with drawstring', Pockets: 'Side pockets', 'Good for': 'Gym, running, yoga, dance, cycling, cricket, travel', Origin: 'India' },
    description: 'Lightweight TechnoSport joggers in 4-way stretch woven fabric with an elastic drawstring waist and elastic cuffs, in seven colours. Sizes M to 2XL.',
  },
  {
    ...soon, id: 'technosport-or229', tall: true, brand: 'TechnoSport', category: 'sports-wear', sub: 'tracks', name: 'TechnoSport OR229 Track Pants', tagline: 'TS Flexi · five colours', accent: '#8f6a5b',
    price: 656, priceConfirmed: true,                          // technosport.in black and navy (MRP 729, as in the catalogue); gulf coast, khaki and chocolate are 629 there
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Chocolate', 'chocolate', '#553c34', 5], ['Khaki', 'khaki', '#aaa07f', 5], ['Black', 'black', '#131415', 5], ['Navy', 'navy', '#1e2836', 5], ['Gulf Coast', 'gulf-coast', '#1f3a3d', 3]]
      .map(([name, f, swatch, n]) => ({ name, swatch, images: wearpics(`technosport-or229/${f}`, n) })),
    specs: { Model: 'OR229', Fabric: 'TS Flexi', Feel: 'Breathable, stretchy, moisture-wicking', Fit: 'Regular', Waist: 'Elastic', Pockets: 'Side pockets', Design: 'Solid colour, logo at the hip', 'Good for': 'Casual wear, golf, outdoors, travel', Origin: 'India' },
    description: 'TechnoSport regular-fit track pants in breathable, stretchy, moisture-wicking TS Flexi fabric with an elastic waist, in five colours. Sizes M to 2XL.',
  },
  {
    ...soon, id: 'technosport-or99', tall: true, brand: 'TechnoSport', category: 'sports-wear', sub: 'tracks', name: 'TechnoSport OR99 Cargo Track Pants', tagline: 'TS Flexi cargo · seven colours', accent: '#3a5680',
    price: 693, priceConfirmed: true,                          // technosport.in (MRP 729, as in the catalogue); black, navy, light grey, woodland gray and gulf coast are 664 there (MRP 699)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Navy', 'navy', '#1c2638', 5], ['Black', 'black', '#151617', 5], ['Khaki', 'khaki', '#b5a78c', 5], ['Light Grey', 'light-grey', '#a4a6aa', 4], ['Black Olive', 'black-olive', '#3f403b', 5], ['Woodland Gray', 'woodland-gray', '#4a4c4e', 5], ['Gulf Coast', 'gulf-coast', '#1f4a4a', 5]]
      .map(([name, f, swatch, n]) => ({ name, swatch, images: wearpics(`technosport-or99/${f}`, n) })),
    specs: { Model: 'OR99', Fabric: 'TS Flexi', Stretch: '4-way', Feel: 'Light, breathable, moisture-wicking', Protection: 'UPF50+ sun protection, Techno Guard anti-microbial, anti-static, odour-free finish', Fit: 'Straight', Waist: 'Elastic with drawstring', Pockets: 'Side pockets and a flap cargo pocket on each leg', Design: 'TechnoSport print on the cargo flap', 'Good for': 'Casual outings, travel, all-day wear' },
    description: 'TechnoSport straight-fit cargo track pants in light, 4-way stretch TS Flexi fabric with an elastic drawstring waist and a flap cargo pocket on each leg, in seven colours. Sizes M to 2XL.',
  },
  {
    ...soon, photoCard: true, tall: true, id: 'technosport-p973', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport P973 Half-Zip Polo', tagline: 'CloudFlex · six colours', accent: '#22867c',
    price: 503, priceConfirmed: true,                          // technosport.in (MRP 559, as in the catalogue)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Teal', 'teal', '#22867c'], ['Midnight Blue', 'midnight-blue', '#b4c8de'], ['Black', 'black', '#1a1a1b'], ['Yellow', 'yellow', '#eeeec4'], ['Navy', 'navy-blue', '#1d2a44'], ['Smokey Olive', 'smokey-olive', '#7b8070']]
      .map(([name, f, swatch]) => ({ name, swatch, images: wearpics(`technosport-p973/${f}`, 5) })),
    specs: { Model: 'P973', Fabric: 'CloudFlex (cotton feel, polyester performance)', Stretch: 'Stretches every way, no spandex', Feel: 'Light and textured, keeps its shape, creases drop out', Neck: 'Polo collar with half zip', Sleeves: 'Half sleeve', Fit: 'Regular', Pattern: 'Solid, tonal chest logo', 'Good for': 'Casual wear, lounging, weekends', Origin: 'India' },
    description: 'A TechnoSport half-zip polo in CloudFlex fabric: light and stretchy, keeps its shape and sheds creases, in six colours. Sizes M to 2XL.',
  },
  {
    ...soon, photoCard: true, tall: true, id: 'technosport-p977', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport P977 T-Shirt', tagline: 'Feather-Lite · six colours', accent: '#7fd3e6',
    price: 377, priceConfirmed: true,                          // technosport.in (MRP 419, as in the catalogue)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Sky Blue', 'sky-blue', '#86d4e6'], ['Mint Green', 'mint-green', '#bfeedd'], ['Yellow', 'yellow', '#f1efb6'], ['White', 'white', '#f2f2f0'], ['Black', 'black', '#1a1a1b'], ['Chilli Flakes', 'chilli-flakes', '#c8705c']]
      .map(([name, f, swatch]) => ({ name, swatch, images: wearpics(`technosport-p977/${f}`, 5) })),
    specs: { Model: 'P977', Fabric: 'Feather-Lite', Stretch: '4-way', Feel: 'Ultra-light, breathable, quick-dry', Protection: 'UPF50+ sun protection, Techno Guard anti-microbial', Neck: 'Crew neck', Sleeves: 'Half sleeve', Fit: 'Slim', Pattern: 'Solid, small chest logo', 'Good for': 'Running, gym, everyday wear' },
    description: 'An ultra-light TechnoSport crew-neck T-shirt in quick-dry, 4-way stretch Feather-Lite fabric with UPF50+ sun protection, in six colours. Sizes M to 2XL.',
  },
  {
    ...soon, photoCard: true, tall: true, id: 'technosport-p981', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport P981 Printed T-Shirt', tagline: 'Feather-Lite · six colours', accent: '#b3262e',
    price: 359, priceConfirmed: true,                          // technosport.in (MRP 399, as in the catalogue)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Red', 'red', '#b3262e'], ['Sky Blue', 'sky-blue', '#8ccfe6'], ['Mint Green', 'mint-green', '#bfeedd'], ['Light Grey', 'light-grey', '#9a9ea3'], ['Black', 'black', '#161617'], ['Yellow', 'yellow', '#eff0c0']]
      .map(([name, f, swatch]) => ({ name, swatch, images: wearpics(`technosport-p981/${f}`, 5) })),
    specs: { Model: 'P981', Fabric: 'Feather-Lite', Stretch: '4-way', Feel: 'Ultra-light, breathable, quick-dry', Protection: 'UPF50+ sun protection, Techno Guard anti-microbial', Neck: 'Crew neck', Sleeves: 'Half sleeve', Fit: 'Slim', Print: 'Chest graphic: Strategy (red, yellow), Boundless (sky blue, light grey), Target (mint green, black)', 'Good for': 'Running, gym, everyday wear' },
    description: 'An ultra-light TechnoSport crew-neck T-shirt in quick-dry, 4-way stretch Feather-Lite fabric with a printed chest graphic and UPF50+ sun protection, in six colours. Sizes M to 2XL.',
  },
  {
    ...soon, photoCard: true, tall: true, id: 'technosport-or804', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport OR804 Polo', tagline: 'MATPIQ · eight colours', accent: '#d8d8d4',
    price: 539, priceConfirmed: true,                          // catalogue MRP, kept by the owner on 26 Nov 2026 (not sold on technosport.in or anywhere else online)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['White', 'white', '#f1f1ef', 3], ['Teal', 'teal', '#14897a', 3], ['Midnight Blue', 'midnight-blue', '#a9c3dc', 5], ['Light Grey', 'light-grey', '#8f9497', 3], ['Black', 'black', '#1a1a1b', 3], ['Chocolate', 'chocolate', '#4e3a2e', 3], ['Lilac', 'lilac', '#d9cfe6', 3], ['Yellow', 'yellow', '#f1efc2', 3]]
      .map(([name, f, swatch, n]) => ({ name, swatch, images: wearpics(`technosport-or804/${f}`, n) })),
    specs: { Model: 'OR804', Fabric: 'MATPIQ', Feel: 'Stays cooler and drier, wicks sweat', Neck: 'Polo collar with button placket', Sleeves: 'Half sleeve, ribbed cuffs', Design: 'Tone-on-tone stripe knit, TechnoSport ESTD 2007 chest print and logo' },
    description: 'A TechnoSport button polo in MATPIQ performance fabric that keeps you cooler and drier, with a stripe knit and a TechnoSport chest print, in eight colours. Sizes M to 2XL.',
  },
  {
    ...soon, photoCard: true, tall: true, id: 'technosport-or820', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport OR820 Printed Polo', tagline: 'MATPIQ · six colours', accent: '#0f6b58',
    price: 699, priceConfirmed: true,                          // catalogue MRP, kept by the owner on 26 Nov 2026 (not sold on technosport.in or anywhere else online)
    sizes: ['M', 'L', 'XL', '2XL'],
    variants: [['Teal', 'teal', '#0f6b58', 2], ['Royal Blue', 'royal-blue', '#1d55b0'], ['Midnight Blue', 'midnight-blue', '#a7a9b5'], ['Shadow Lime', 'shadow-lime', '#c6dc5a'], ['Light Grey', 'light-grey', '#6f7275'], ['Chilli Flakes', 'chilli-flakes', '#b65440']]
      .map(([name, f, swatch, n = 1]) => ({ name, swatch, images: wearpics(`technosport-or820/${f}`, n) })),
    specs: { Model: 'OR820', Fabric: 'MATPIQ', Neck: 'Polo collar with button placket', Sleeves: 'Half sleeve', Pattern: 'All-over sports print (rackets and shuttles)' },
    description: 'A TechnoSport button polo in MATPIQ performance fabric with an all-over racket-sports print, in six colours. Sizes M to 2XL.',
  },
  {
    ...soon, photoCard: true, tall: true, id: 'technosport-or884', brand: 'TechnoSport', category: 'sports-wear', sub: 't-shirts', name: 'TechnoSport OR884 T-Shirt', tagline: 'Techno Cool+ · six colours', accent: '#6b3f38',
    price: 369, priceConfirmed: true,                          // catalogue MRP, kept by the owner on 26 Nov 2026 (not sold on technosport.in or anywhere else online)
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    variants: [['Black', 'black', '#161617'], ['Grape Vine', 'grape-vine', '#4a4650'], ['Ox Blood Red', 'ox-blood-red', '#6b3f38'], ['Navy', 'navy', '#1b2238'], ['Oyster Grey', 'oyster-grey', '#c4bfa9'], ['White', 'white', '#f0f0f0']]
      .map(([name, f, swatch]) => ({ name, swatch, images: wearpics(`technosport-or884/${f}`, 1) })),
    specs: { Model: 'OR884', Fabric: 'Techno Cool+', Feel: 'Double layer, super soft, quick-dry, very breathable', Protection: 'Sun protection, Techno Guard anti-microbial', Neck: 'Crew neck', Sleeves: 'Half sleeve, raglan', Design: 'Sleeve print and piping, small chest badge' },
    description: 'A breathable, sweat-resistant TechnoSport crew-neck T-shirt in double-layer Techno Cool+ fabric with raglan sleeves, in six colours. Sizes S to 2XL.',
  },
  {
    ...soon, id: 'zoza-polo', brand: 'Zoza', category: 'sports-wear', sub: 't-shirts', name: 'Zoza Polo T-Shirt', tagline: 'Quick-dry polo · eight colours', accent: '#1a93a8',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],                      // M, L and 3XL seen on the tags in the photos
    variants: wearcolours('zoza-polo', [['Grey Melange', 'grey', '#5d6170'], ['Yellow', 'yellow', '#f3dc7a', 5], ['Teal', 'teal', '#0f4f5e'], ['Olive', 'olive', '#3f4428'], ['Royal Blue', 'royal-blue', '#1d4aa8'], ['Rust Red', 'rust-red', '#9e2a1f'], ['Navy', 'navy', '#1a2030'], ['Turquoise', 'turquoise', '#1a93a8']], 1),
    specs: { Fabric: 'Lightweight, breathable, quick-dry knit', Feel: 'Durable, wrinkle resistant', Neck: 'Polo collar, three-button placket', Sleeves: 'Half sleeve', Logo: 'Embroidered ZOZA logo', Origin: 'India' },
    description: 'A Zoza polo T-shirt in light, breathable, quick-dry fabric with an embroidered ZOZA logo, in eight colours. The yellow one has teal tipping on the collar and sleeves.',
  },
  {
    ...soon, price: 199, priceConfirmed: true, id: 'deep-blaster-stockings', brand: 'Deep', category: 'hockey-stockings', name: 'Deep Blaster Stockings', tagline: 'Four colours', accent: '#f9b21a',
    variants: wearcolours('deep-blaster', [['Gold Yellow', 'gold', '#f7ac1a'], ['Royal Blue', 'blue', '#1f4d94', 2], ['Maroon', 'maroon', '#8a1a22'], ['White', 'white', '#f2f2ee']], 1),
    specs: { Model: 'Blaster', Design: 'Striped panel and Deep name', Fit: 'Ribbed cuff, ribbed ankle and foot' },
    description: 'Deep Blaster hockey stockings with a ribbed cuff and a striped panel, in gold yellow, royal blue, maroon or white.',
  },
  {
    ...soon, price: 149, priceConfirmed: true, id: 'deep-blaster-regular-stockings', brand: 'Deep', category: 'hockey-stockings', name: 'Deep Blaster Regular Stockings', tagline: 'Red', accent: '#ff4a2a',
    images: wearpics('deep-blaster-regular'),
    specs: { Model: 'Blaster Regular', Colour: 'Red', Fit: 'Ribbed cuff, ribbed ankle and foot' },
    description: 'Deep Blaster Regular hockey stockings in red with a ribbed cuff and the Deep name in white.',
  },
  {
    ...soon, id: 'just-hockey-glove', brand: 'Just', category: 'hockey-gloves', name: 'Just Hockey Glove', tagline: 'Padded back · two colours', accent: '#ff2a1f',
    variants: wearcolours('just-glove', [['Red', 'red', '#e8200f'], ['Blue', 'blue', '#24408f']]),
    specs: { Style: 'Fingerless, with elastic wrist strap', Padding: 'Back of the hand, fingers and thumb' },
    description: 'A fingerless Just glove with padding on the back of the hand, fingers and thumb, and an elastic wrist strap, in red or blue.',
  },
  {
    ...soon, id: 'flash-protective-glove', brand: 'Flash', category: 'hockey-gloves', name: 'Flash Protective Glove', tagline: 'Full thumb · padded back', accent: '#ff7a2a',
    price: 400, priceConfirmed: true,                          // flashhockey.in: XS Glove (x5-glove)
    sizes: ['L'], images: wearpics('flash-glove'),
    specs: { Model: 'XS Glove', Size: 'L', Colour: 'Black & orange', Style: 'Fingerless, with wrist strap', Grip: 'Honeycomb grip between the fingers' },
    description: 'A padded fingerless Flash glove with a covered thumb, honeycomb grip between the fingers and a wide wrist strap, in black and orange.',
  },
  shin({
    id: 'sns-blade-shin', name: 'SNS Blade Shin Guard', tagline: 'Detachable foam · ankle cover', accent: '#9aa3ab',
    price: 980, priceConfirmed: true,                          // snshockey.com
    images: wearpics('shin-sns-blade', 4),
    specs: { Model: 'Blade', Colour: 'Black', Shell: 'Super-strong shell with ventilation holes', Padding: 'Double-thickness EVA foam, detachable and washable', Origin: 'India', Pack: '1 pair' },
    description: 'A shin guard with a super-strong ventilated shell and double-thickness EVA foam that comes off for washing. Black, in S, M and L.',
  }),
  shin({
    id: 'rakshak-s1-shin', brand: 'Rakshak', name: 'Rakshak S1 Shin Guard', tagline: 'Player quality · ankle cover', accent: '#e9edf0',
    price: 899, priceConfirmed: true,                          // Amazon.in B0CCVYFM96
    images: wearpics('shin-rakshak'),
    specs: { Model: 'S1', Colour: 'White & black', Shell: 'Anatomic shell with air slots', Build: 'Lightweight, with ankle cover', Pack: '1 pair' },
    description: 'A lightweight Rakshak shin and ankle guard shaped to the leg, with a hard white shell and black padding. Sizes S, M and L.',
  }),
  {
    ...soon, id: 'gk-strap-set-1', brand: '', category: 'goal-keeper-accessories', name: 'Goalkeeper Strap Set 1', tagline: '12 pieces', accent: '#d9dde0',
    images: wearpics('gk-strap-set-1'),
    specs: { Pack: '12 pieces, as pictured', Includes: '4 long buckle straps, 2 clip straps, 2 slider straps, 4 plastic strips', Colour: 'Black' },
    description: 'A set of spare straps for a goalkeeper kit: four long buckle straps, two clip straps, two slider straps and four plastic strips.',
  },
  {
    ...soon, id: 'gk-strap-set-2', brand: '', category: 'goal-keeper-accessories', name: 'Goalkeeper Strap Set 2', tagline: 'Long and short straps', accent: '#d9dde0',
    images: wearpics('gk-strap-set-2'),
    specs: { Pack: 'As pictured', Includes: 'Long and short buckle straps, clip straps, riveted straps, 4 plastic strips', Colour: 'Black' },
    description: 'A set of spare straps for a goalkeeper kit with long and short buckle straps, clip straps, riveted straps and four plastic strips.',
  },
  {
    ...soon, id: 'gk-grey-straps', brand: '', category: 'goal-keeper-accessories', name: 'Goalkeeper Buckle Straps', tagline: 'Set of 4 · grey', accent: '#9aa5a0',
    images: wearpics('gk-grey-straps'),
    specs: { Pack: '4 straps', Colour: 'Grey', Buckle: 'Metal', Adjust: 'Punched holes' },
    description: 'Four grey straps with metal buckles and punched holes, for a goalkeeper kit.',
  },
);

/* Flash balls and grip — photos and prices from flashhockey.in; balls are sold in packs of 6, grips in packs of 3 */
const fball = (id, name, n, price, accent, tagline, specs, description) => ({
  id: `flash-${id}-ball`, brand: 'Flash', category: 'hockey-balls', name: `Flash ${name} Hockey Ball`, tagline, badge: 'New',
  price, priceConfirmed: true, unit: 'pack of 6', accent, sizes: ['One Size'], images: fzpics(`balls/${id}`, n),
  specs: { ...specs, Surface: 'Dimple', Pack: '6 balls' }, description,
});

PRODUCTS.push(
  fball('crown', 'Crown Dimple', 2, 3300, '#e9e9e9', 'Pack of 6', { Colour: 'White' },
    'A solid, durable dimple ball with a consistent rebound for training and matches. Pack of 6 white balls.'),
  fball('field-king', 'Field King Dimple', 3, 1380, '#d8f21c', 'Pack of 6', { Colours: 'Yellow & white, as pictured' },
    'A solid dimple ball for training and competitive matches on turf. Pack of 6 in yellow and white, as pictured.'),
  fball('classic', 'Classic Dimple', 2, 1140, '#e9e9e9', 'Pack of 6', { Colour: 'White', Core: 'Solid' },
    'A solid-core dimple ball with a sturdy build, for practice, club matches and coaching. Pack of 6 white balls.'),
  fball('international', 'International Match Dimple', 1, 960, '#ff4a2a', 'Pack of 6', { Colours: 'White, orange & yellow, as pictured' },
    'A durable dimple ball with a consistent bounce for training, practice and matches. Pack of 6 in mixed colours, as pictured.'),
  fball('hollow', 'Hollow Dimple', 2, 468, '#e9e9e9', 'Practice ball · pack of 6', { Colour: 'White', Core: 'Hollow' },
    'A lighter, hollow-core dimple ball for practice, schools and skill drills. Pack of 6 white balls.'),
  fball('club', 'Club Dimple', 6, 444, '#ff3b6a', 'Training ball · pack of 6', { Colours: 'Mixed, as pictured' },
    'A durable dimple ball for training sessions, practice and club matches. Pack of 6 in mixed colours, as pictured.'),
  {
    id: 'flash-grip', brand: 'Flash', category: 'hockey-grips', name: 'Flash Hockey Grip',
    tagline: 'Grip tape · pack of 3', badge: 'New',
    price: 580, priceConfirmed: true, unit: 'pack of 3', accent: '#e0303a',
    sizes: ['One Size'],
    images: ['04', '01', '02', '03', '05', '06', '07', '08', '09', '10'].map(n => `FLASH/grip/${n}.jpg`),
    specs: { Pack: '3 grips', Colours: 'Red, blue, sky blue, yellow or purple; the colour depends on what is available' },
    description: 'A sweat-absorbing grip tape that cuts hand slip and wraps easily around the handle. Pack of 3; the colour sent depends on what is available.',
  },
);

/* ── HOCKEY SHOES ── sizes 5 to 11, all out of stock.
   When a shoe is back: set its price and remove `inStock: false`. */
const SHOE_SIZES = ['5', '6', '7', '8', '9', '10', '11'];
const simgs = (dir, n = 1) => Array.from({ length: n }, (_, i) => `SHOES/${dir}/0${i + 1}.jpg`);
const shoe = p => ({ category: 'hockey-shoes', price: null, inStock: false, sizes: SHOE_SIZES, ...p });

PRODUCTS.push(
  shoe({
    id: 'flash-prime-shoes', brand: 'Flash', name: 'Flash Prime Hockey Shoes',
    tagline: 'Navy & neon hockey shoes', accent: '#c8f031', images: simgs('flash-prime', 2),
    price: 950, priceConfirmed: true,
    specs: { Model: 'Prime', Colour: 'Navy & neon', Sizes: '5 to 11' },
    description: 'Flash Prime hockey shoes in navy and neon with a studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'alfa-professional-shoes', brand: 'Alfa', name: 'Alfa Professional Hockey Shoes',
    tagline: 'Blue & yellow hockey shoes', accent: '#2f7fe0', images: simgs('alfa-professional', 2),
    specs: { Model: 'Professional', Code: 'SCH-9060', Colour: 'Blue & yellow', Sizes: '5 to 11' },
    description: 'Alfa Professional hockey shoes in blue and yellow with a studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'tyka-shoes', brand: 'Tyka', name: 'Tyka Hockey Shoes',
    tagline: 'Two colours, studded sole', accent: '#e6e010',
    variants: [
      { name: 'White & Yellow', swatch: '#e6e010', images: simgs('tyka/yellow') },
      { name: 'Red & White', swatch: '#c81f2b', images: simgs('tyka/red') },
    ],
    specs: { Colours: 'White & yellow, red & white', Sizes: '5 to 11' },
    description: 'Tyka hockey shoes with a studded sole, in white & yellow or red & white. Sizes 5 to 11.',
  }),
  {
    id: 'tyka-step-shoes', brand: 'Tyka', category: 'warmup-shoes', badge: 'New', name: 'Tyka Step Running Shoes', tagline: 'Athletic running shoe · three colours', accent: '#d8232a',
    price: 1169, priceConfirmed: true,                         // mirusports.com (MRP 1,299), same for every colour
    sizes: ['5', '6', '7', '8', '9', '10', '11', '12'],          // sizes listed on mirusports.com
    variants: [
      { name: 'Red', swatch: '#d8232a', images: simgs('tyka-step/red', 4) },
      { name: 'Grey', swatch: '#7b7f84', images: simgs('tyka-step/grey', 5) },
      { name: 'Navy', swatch: '#1f2a4a', images: simgs('tyka-step/navy', 4) },             // the owner's "black": mirusports.com has no black
    ],
    specs: { Upper: 'Breathable 320 GSM mesh with 0.6 mm fusible Winseal overlays', Midsole: '60D anti-UV foam', Sole: 'Rubber and EVA', Heel: 'TPU moulded stiffener', Build: 'Strobel construction, moulded sock liner', Closure: 'Lace-up', 'Good for': 'Running, workouts, everyday wear' },
    description: 'Tyka Step athletic running shoes with a breathable mesh upper, anti-UV foam cushioning and a rubber and EVA sole for grip, in red, grey or navy. Sizes 5 to 12.',
  },
  shoe({
    id: 'vijayanti-shoes', brand: 'Vijayanti', name: 'Vijayanti Hockey Shoes',
    tagline: 'Green & blue hockey shoes', accent: '#7dec3c', images: simgs('vijayanti'),
    specs: { Colour: 'Green & blue', Sizes: '5 to 11' },
    description: 'Vijayanti hockey shoes in green and blue with a studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'fenta-java-shoes', brand: 'Fenta', name: 'Fenta Java Hockey Shoes',
    tagline: 'Blue & neon hockey shoes', accent: '#d7f20c', images: simgs('fenta-java'),
    specs: { Model: 'Java', Colour: 'Blue & neon yellow', Sole: 'Black, studded', Sizes: '5 to 11' },
    description: 'Fenta Java hockey shoes in blue and neon yellow with a black studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'hind-dutch-shoes', brand: 'Hind', name: 'Hind Dutch Hockey Shoes',
    tagline: 'Teal & yellow hockey shoes', accent: '#2c8ea6', images: simgs('hind-dutch'),
    specs: { Model: 'Dutch', Colour: 'Teal & yellow', Sole: 'Light blue, studded', Sizes: '5 to 11' },
    description: 'Hind Dutch hockey shoes in teal and yellow with a light blue studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'hind-black-shoes', brand: 'Hind', name: 'Hind Hockey Shoes', tba: 'Update soon',
    tagline: 'Black, blue & orange hockey shoes', accent: '#ff8a1c', images: simgs('hind-black', 2),
    specs: { Colour: 'Black, blue & orange', Sole: 'Light blue, studded', Sizes: '5 to 11' },
    description: 'Hind hockey shoes in black, blue and orange with a light blue studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'fenta-astro-shoes', brand: 'Fenta', name: 'Fenta Astro Hockey Shoes',
    tagline: 'Black & white hockey shoes', accent: '#d8dade', images: simgs('fenta-astro'),
    specs: { Model: 'Astro', Colour: 'Black & white', Sizes: '5 to 11' },
    description: 'Fenta Astro hockey shoes in black and white with a studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'deer-royal-shoes', brand: 'Deer', name: 'Deer Royal Hockey Shoes',
    tagline: 'Teal & yellow hockey shoes', accent: '#19a7a5', images: simgs('deer-royal'),
    specs: { Model: 'Royal', Colour: 'Teal & yellow', Sole: 'Blue, studded', Sizes: '5 to 11' },
    description: 'Deer Royal hockey shoes in teal and yellow with a blue studded sole. Sizes 5 to 11.',
  }),
  shoe({
    id: 'marex-shoes', brand: 'Marex', name: 'Marex Hockey Shoes',
    tagline: 'Two colours, studded sole', accent: '#1fc07a',
    variants: [
      { name: 'Green', swatch: '#1fc07a', images: simgs('marex/green') },
      { name: 'Blue & Orange', swatch: '#24479a', images: simgs('marex/blue') },
    ],
    specs: { Colours: 'Green & yellow, blue & orange', Sizes: '5 to 11' },
    description: 'Marex hockey shoes with a studded sole, in green & yellow or blue & orange. Sizes 5 to 11.',
  }),
);

/* Sticks without a category are composite sticks (the Alfa Magnum is wooden) */
PRODUCTS.forEach(p => { p.category = p.category || 'composite-hockey-sticks'; });

/* ── prices and stock saved on the admin page (/admin, server/app.py) replace the ones written above ── */
PRODUCTS.forEach(p => {
  if (p.bulk) p.bulkSetup = p.bulk;
  const all = window.FS_PRICES, s = all && Object.prototype.hasOwnProperty.call(all, p.id) ? all[p.id] : null;
  if (s) {
    if ('price' in s) { p.price = typeof s.price === 'number' ? s.price : null; if (p.price === null) p.tba = 'Update soon'; else p.priceConfirmed = true; }
    if (typeof s.inStock === 'boolean') p.inStock = s.inStock;
    if (p.bulk && typeof s.bulk === 'number') p.bulk = p.bulkSetup = { ...p.bulk, price: s.bulk };
  }
  if (p.bulk && !(typeof p.price === 'number' && p.bulk.price < p.price)) delete p.bulk;      // a bulk price must be a discount
});

/* ── helpers ── */
function getProduct(id) { return PRODUCTS.find(p => p.id === id); }
function getCategory(id) { return CATEGORIES.find(c => c.id === id); }
function categoryCount(id) { return PRODUCTS.filter(p => p.category === id).length; }
/* slots inside a main slot */
function getSub(catId, id) { const c = getCategory(catId); return c && c.subs ? c.subs.find(s => s.id === id) : undefined; }
function subCount(catId, id) { return PRODUCTS.filter(p => p.category === catId && p.sub === id).length; }
function subBrands(catId, id) { return [...new Set(PRODUCTS.filter(p => p.category === catId && p.sub === id).map(p => p.brand || 'Other'))].sort(); }
function slotLabel(p) { const s = getSub(p.category, p.sub); return getCategory(p.category).name + (s ? ' · ' + s.name : ''); }
function productImages(p, v = 0) { return p.variants ? p.variants[v].images : p.images; }
function inspectViews(p, v = 0) { return (p.variants ? p.variants[v].views : p.views) || null; }
function sizesOf(p) { return p.sizes || STORE.sizes; }
function seriesTitle(p) { return p.series && SERIES[p.series] ? SERIES[p.series].title : ''; }
function seriesName(key) { const s = SERIES[key]; return s ? `${s.brand} ${s.label}`.trim() : key; }
function hasPrice(p) { return typeof p.price === 'number'; }
function priceLabel(p) { return hasPrice(p) ? money(p.price) + (p.unit ? ` / ${p.unit}` : '') : p.tba || 'Price coming soon'; }   // `tba` = other wording, e.g. 'Update soon'
/* `inStock: false` keeps the price on show but stops it being bought */
function inStock(p) { return p.inStock !== false; }
function canBuy(p) { return hasPrice(p) && inStock(p); }
/* quantity pricing, e.g. bulk: { min: 6, price: 165 } = ₹165 each once 6 or more are ordered */
function unitPrice(p, qty = 1) { return p.bulk && qty >= p.bulk.min ? p.bulk.price : p.price; }
function bulkNote(p) { return p.bulk ? `${money(p.bulk.price)} each for ${p.bulk.min} or more` : ''; }
function maxQty(p) { return p.maxQty || 10; }
function money(n) { return STORE.currency + Math.round(n).toLocaleString(STORE.locale); }
