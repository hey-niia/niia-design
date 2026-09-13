import { useEffect, useState } from "react";

const EMAIL = "nia.bieliavtseva@gmail.com";
const MENU_WIDTH = 256;
const MENU_HEIGHT_ESTIMATE = 190;
// Same threshold the case-study lightbox pill uses: below this average
// luminance (0-255) the backdrop is dark and the default light-glass
// styling is legible; above it, flip to a dark chip so the white text
// doesn't wash out against a light page background.
const CONTRAST_LUMA_THRESHOLD = 175;

// Walks up from the right-clicked element to find the nearest ancestor with
// an opaque background color, and returns its luminance. Menus can land on
// anything from a black hero to a pale card, so the theme has to follow
// whatever's actually behind it rather than assuming one backdrop.
function getBackgroundLuma(el: Element | null): number | null {
  let node: Element | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    const match = bg.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/);
    if (match) {
      const [, r, g, b, a] = match;
      if (a === undefined || parseFloat(a) > 0.5) {
        return 0.2126 * parseFloat(r) + 0.7152 * parseFloat(g) + 0.0722 * parseFloat(b);
      }
    }
    node = node.parentElement;
  }
  return null;
}

// A single delegated listener for the whole site: right-clicking any <img>
// anywhere (case study screenshots, work grid thumbnails, art pieces, tool
// icons) shows this instead of the native menu, so nothing has to wire it up
// per-image.
export default function ImageContextMenu() {
  const [menu, setMenu] = useState<{ x: number; y: number; src: string; onLight: boolean } | null>(
    null,
  );

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const img = (e.target as HTMLElement | null)?.closest("img");
      if (!(img instanceof HTMLImageElement) || !img.currentSrc) return;
      e.preventDefault();
      const luma = getBackgroundLuma(img);
      setMenu({
        x: e.clientX,
        y: e.clientY,
        src: img.currentSrc,
        onLight: luma !== null && luma > CONTRAST_LUMA_THRESHOLD,
      });
    };
    window.addEventListener("contextmenu", onContextMenu);
    return () => window.removeEventListener("contextmenu", onContextMenu);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close();
    // Capture phase: some images stopPropagation on click (e.g. the case
    // study lightbox), which would otherwise stop a bubble-phase listener
    // here from ever seeing the click.
    window.addEventListener("click", close, true);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("click", close, true);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menu]);

  if (!menu) return null;

  const left = Math.min(menu.x, window.innerWidth - MENU_WIDTH - 8);
  const top = Math.min(menu.y, window.innerHeight - MENU_HEIGHT_ESTIMATE - 8);

  return (
    <div
      className={`fixed z-[9999] w-64 rounded-xl border p-1 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
        menu.onLight ? "border-black/10 bg-black/70" : "border-white/15 bg-white/10"
      }`}
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="px-3 py-2 text-xs leading-snug text-white/70">
        Glad you like my work! Email me if you want to talk.
      </p>
      <div className="my-1 h-px bg-white/15" />
      <a
        href={menu.src}
        download
        className="block rounded-lg px-3 py-1.5 hover:bg-white/10"
        onClick={() => setMenu(null)}
      >
        Download image
      </a>
      <a
        href={menu.src}
        target="_blank"
        rel="noreferrer"
        className="block rounded-lg px-3 py-1.5 hover:bg-white/10"
        onClick={() => setMenu(null)}
      >
        Open image in new tab
      </a>
      <button
        type="button"
        className="block w-full rounded-lg px-3 py-1.5 text-left hover:bg-white/10"
        onClick={() => {
          navigator.clipboard?.writeText(menu.src);
          setMenu(null);
        }}
      >
        Copy image address
      </button>
      <div className="my-1 h-px bg-white/15" />
      <a
        href={`mailto:${EMAIL}`}
        className="block rounded-lg px-3 py-1.5 hover:bg-white/10"
        onClick={() => setMenu(null)}
      >
        Email Niia
      </a>
    </div>
  );
}
