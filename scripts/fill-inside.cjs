// Fills a component's INTERIOR transparency with Matter's surface primary,
// leaving the transparency around its silhouette alone — so a see-through card
// reads as solid without gaining a rectangle behind it.
const sharp = require("sharp");
const SURFACE = [0x12, 0x15, 0x17];

async function fill(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const outside = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    const i = y * w + x;
    if (outside[i] || data[i * 4 + 3] > 16) return;
    outside[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const i = stack.pop(), x = i % w, y = (i / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
  let filled = 0;
  for (let i = 0; i < w * h; i++) {
    const a = data[i * 4 + 3];
    if (outside[i] || a === 255) continue;
    const f = a / 255;
    for (let c = 0; c < 3; c++) data[i * 4 + c] = Math.round(data[i * 4 + c] * f + SURFACE[c] * (1 - f));
    data[i * 4 + 3] = 255;
    filled++;
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 90 }).toFile(file + ".tmp");
  require("fs").renameSync(file + ".tmp", file);
  return ((100 * filled) / (w * h)).toFixed(1);
}

(async () => {
  for (const n of process.argv.slice(2)) {
    console.log(n, await fill(`public/projects/ios-app/${n}.webp`) + "% of pixels filled");
  }
})();
