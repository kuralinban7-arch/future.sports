/* Small QR code maker for the UPI payment QR on checkout.html, so the site needs no outside library.
   Byte mode, error correction level M, versions 1–10 (up to 213 bytes of text), per ISO/IEC 18004.
     const q = QR.make('upi://pay?...');   // null if the text is too long
     q.size, q.dark(x, y)                  // modules per side; is the module at column x, row y dark?
     QR.svg(q, border)                     // data: URL of a crisp SVG picture with a white border (default 4 modules) */
(function () {
  'use strict';
  // level M, per version: [error-correction codewords per block, [blocks, data codewords per block], ...]
  const BLOCKS = [null,
    [10, [1, 16]], [16, [1, 28]], [26, [1, 44]], [18, [2, 32]], [24, [2, 43]],
    [16, [4, 27]], [18, [4, 31]], [22, [2, 38], [2, 39]], [22, [3, 36], [2, 37]], [26, [4, 43], [1, 44]]];

  const MASKS = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x, y) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x, y) => x * y % 2 + x * y % 3 === 0,
    (x, y) => (x * y % 2 + x * y % 3) % 2 === 0,
    (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0,
  ];

  // Reed–Solomon over GF(256), polynomial 0x11D
  function mul(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; }
    return z;
  }
  function divisor(degree) {
    const r = new Array(degree).fill(0);
    r[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) { r[j] = mul(r[j], root); if (j + 1 < degree) r[j] ^= r[j + 1]; }
      root = mul(root, 2);
    }
    return r;
  }
  function remainder(data, div) {
    const r = new Array(div.length).fill(0);
    for (const b of data) {
      const f = b ^ r.shift();
      r.push(0);
      div.forEach((c, i) => { r[i] ^= mul(c, f); });
    }
    return r;
  }

  function make(text, forceMask) {
    const bytes = Array.from(new TextEncoder().encode(String(text)));

    // smallest version that fits
    let ver = 1, cap = 0;
    for (; ver <= 10; ver++) {
      cap = BLOCKS[ver].slice(1).reduce((s, [n, d]) => s + n * d, 0);
      if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= cap * 8) break;
    }
    if (ver > 10) return null;

    // data codewords: mode, length, bytes, terminator, padding
    const bits = [];
    const put = (v, len) => { for (let i = len - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
    put(4, 4);
    put(bytes.length, ver < 10 ? 8 : 16);
    bytes.forEach(b => put(b, 8));
    put(0, Math.min(4, cap * 8 - bits.length));
    put(0, (8 - bits.length % 8) % 8);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
    for (let pad = 0xec; data.length < cap; pad ^= 0xec ^ 0x11) data.push(pad);

    // split into blocks, add error correction, interleave
    const [eccLen, ...groups] = BLOCKS[ver], div = divisor(eccLen), blocks = [];
    let k = 0;
    groups.forEach(([n, d]) => {
      for (let i = 0; i < n; i++) { const part = data.slice(k, k += d); blocks.push([part, remainder(part, div)]); }
    });
    const words = [], longest = Math.max(...blocks.map(b => b[0].length));
    for (let i = 0; i < longest; i++) blocks.forEach(b => { if (i < b[0].length) words.push(b[0][i]); });
    for (let i = 0; i < eccLen; i++) blocks.forEach(b => words.push(b[1][i]));

    // function patterns
    const size = ver * 4 + 17;
    const mod = Array.from({ length: size }, () => new Array(size).fill(false));
    const fn = Array.from({ length: size }, () => new Array(size).fill(false));
    const set = (x, y, dark) => { mod[y][x] = dark; fn[y][x] = true; };

    for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }      // timing
    [[3, 3], [size - 4, 3], [3, size - 4]].forEach(([cx, cy]) => {                          // finders + separators
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy));
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4);
      }
    });
    if (ver > 1) {                                                                           // alignment
      const n = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2, pos = [6];
      for (let p = size - 7; pos.length < n; p -= step) pos.splice(1, 0, p);
      pos.forEach((cy, i) => pos.forEach((cx, j) => {
        if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) return;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }));
    }
    const drawFormat = mask => {                                                             // level M = 00
      let rem = mask;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const b = ((mask << 10) | rem) ^ 0x5412, bit = i => ((b >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) set(8, i, bit(i));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
      set(8, size - 8, true);
    };
    drawFormat(0);
    if (ver >= 7) {                                                                          // version info
      let rem = ver;
      for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      const b = (ver << 12) | rem;
      for (let i = 0; i < 18; i++) {
        const dark = ((b >>> i) & 1) === 1, a = size - 11 + i % 3, c = Math.floor(i / 3);
        set(a, c, dark); set(c, a, dark);
      }
    }

    // data, zig-zagging up and down two columns at a time from the bottom right
    let i = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
        const x = right - j, y = ((right + 1) & 2) === 0 ? size - 1 - v : v;
        if (!fn[y][x] && i < words.length * 8) { mod[y][x] = ((words[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; }
      }
    }

    // pick the mask that is easiest to scan
    const flip = m => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) mod[y][x] = !mod[y][x]; };
    const penalty = () => {
      let p = 0, dark = 0;
      const line = get => {
        let s = 0, run = 1;
        for (let k = 1; k <= size; k++) {
          if (k < size && get(k) === get(k - 1)) run++;
          else { if (run >= 5) s += run - 2; run = 1; }
        }
        const light = k => k < 0 || k >= size || !get(k);
        for (let k = 0; k + 7 <= size; k++) {
          if (get(k) && !get(k + 1) && get(k + 2) && get(k + 3) && get(k + 4) && !get(k + 5) && get(k + 6)
            && ((light(k - 1) && light(k - 2) && light(k - 3) && light(k - 4)) || (light(k + 7) && light(k + 8) && light(k + 9) && light(k + 10)))) s += 40;
        }
        return s;
      };
      for (let y = 0; y < size; y++) p += line(x => mod[y][x]);
      for (let x = 0; x < size; x++) p += line(y => mod[y][x]);
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        if (mod[y][x]) dark++;
        if (x < size - 1 && y < size - 1) {
          const c = mod[y][x];
          if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3;
        }
      }
      return p + Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
    };
    let best = forceMask, bestScore = Infinity;
    if (best == null) {
      for (let m = 0; m < 8; m++) {
        flip(m); drawFormat(m);
        const s = penalty();
        if (s < bestScore) { bestScore = s; best = m; }
        flip(m);
      }
    }
    flip(best); drawFormat(best);
    return { size, version: ver, mask: best, dark: (x, y) => mod[y][x] };
  }

  function svg(q, border = 4) {
    const n = q.size + border * 2;
    let d = '';
    for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.dark(x, y)) d += `M${x + border},${y + border}h1v1h-1z`;
    return 'data:image/svg+xml,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`);
  }

  window.QR = { make, svg };
})();
