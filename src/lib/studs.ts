// Background texture: one stud per tile. A soft dark crescent under the
// bottom right edge, a faint light rim on the top left, the cap in the
// surface colour. Drawn as a vector tile so it stays crisp at any zoom.
export const STUD_BG = "#e2ddd8";
export const STUD_PITCH = 22;
export const studTile = (cap: string, shade: string, brick = false) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">` +
      `<defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0.45"/></filter></defs>` +
      // A 1x1 brick: its square top in the same colour, with soft edges.
      (brick
        ? `<rect x="0.4" y="0.4" width="21.2" height="21.2" rx="1.6" fill="${cap}"/>` +
          `<rect x="0.6" y="0.6" width="20.8" height="20.8" rx="1.5" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.6"/>`
        : "") +
      `<circle cx="11.7" cy="12.1" r="7.2" fill="${shade}" fill-opacity="0.55" filter="url(#b)"/>` +
      `<circle cx="10.6" cy="10.6" r="7.2" fill="#ffffff" fill-opacity="0.7" filter="url(#b)"/>` +
      `<circle cx="11" cy="11" r="7.2" fill="${cap}"/>` +
      `<circle cx="11" cy="11" r="7.05" fill="none" stroke="#000" stroke-opacity="0.07" stroke-width="0.3"/>` +
      `</svg>`,
  )}")`;
export const STUD_TILE = studTile(STUD_BG, "#2e2924");
