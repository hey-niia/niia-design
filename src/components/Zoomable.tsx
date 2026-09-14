import { useEffect, useState, type MouseEvent } from "react";

export default function Zoomable({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  const [cursorLabel, setCursorLabel] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => {
          setOpen(true);
          setCursorLabel((c) => ({ ...c, visible: false }));
        }}
        onLoad={(e) => setNaturalWidth(e.currentTarget.naturalWidth)}
        onMouseMove={(e: MouseEvent) => setCursorLabel({ x: e.clientX, y: e.clientY, visible: true })}
        onMouseLeave={() => setCursorLabel((c) => ({ ...c, visible: false }))}
        className={`cursor-none ${className ?? ""}`}
        // `className` typically passes a fill-width utility (e.g. `w-full`),
        // which on a page with no max-width wrapper stretches to the full
        // viewport — past the image's own resolution on a wide screen,
        // which upscales and visibly softens it. This caps it at 1:1.
        style={naturalWidth ? { maxWidth: naturalWidth } : undefined}
      />

      <span
        aria-hidden
        className={`pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-[#e65f2e] px-4 py-2 text-sm font-normal text-white transition-[transform,opacity] duration-150 ease-out ${
          cursorLabel.visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        style={{ left: cursorLabel.x, top: cursorLabel.y }}
      >
        <span className="text-base leading-none">+</span>
        Click to zoom
      </span>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-4"
        >
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </>
  );
}
