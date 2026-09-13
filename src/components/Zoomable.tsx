import { useEffect, useState } from "react";

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
        onClick={() => setOpen(true)}
        onLoad={(e) => setNaturalWidth(e.currentTarget.naturalWidth)}
        className={`cursor-zoom-in ${className ?? ""}`}
        // `className` typically passes a fill-width utility (e.g. `w-full`),
        // which on a page with no max-width wrapper stretches to the full
        // viewport — past the image's own resolution on a wide screen,
        // which upscales and visibly softens it. This caps it at 1:1.
        style={naturalWidth ? { maxWidth: naturalWidth } : undefined}
      />
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
