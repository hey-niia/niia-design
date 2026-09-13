import { useEffect, useState } from "react";

const EMAIL = "nia.bieliavtseva@gmail.com";
const MENU_WIDTH = 256;
const MENU_HEIGHT_ESTIMATE = 190;

// A single delegated listener for the whole site: right-clicking any <img>
// anywhere (case study screenshots, work grid thumbnails, art pieces, tool
// icons) shows this instead of the native menu, so nothing has to wire it up
// per-image.
export default function ImageContextMenu() {
  const [menu, setMenu] = useState<{ x: number; y: number; src: string } | null>(null);

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const img = (e.target as HTMLElement | null)?.closest("img");
      if (!(img instanceof HTMLImageElement) || !img.currentSrc) return;
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY, src: img.currentSrc });
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
      className="fixed z-[9999] w-64 rounded-xl border border-white/15 bg-black/80 p-1 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="px-3 py-2 text-xs leading-snug text-white/70 italic">
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
