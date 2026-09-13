import { useEffect, useRef, useState } from "react";

const ACCENT = "#e65f2e";
/** Past this height fraction a note would fall off the bottom, so open it upward. */
const FLIP_ABOVE = 0.72;

export interface Pin {
  /** Position as a percentage of the image box, 0-100. */
  x: number;
  y: number;
  title: string;
  body: string;
}

/**
 * A screenshot with numbered markers pinned to it. The note opens next to its
 * marker rather than in a legend elsewhere on the page — on a full-length phone
 * screen the legend ends up thousands of pixels from the thing it describes,
 * which reads as five unexplained circles.
 *
 * The same notes render as an ordered list underneath, which is what carries
 * the content for screen readers, narrow screens and print.
 */
export default function AnnotatedImage({
  src,
  alt,
  pins,
  maxWidth,
}: {
  src: string;
  alt: string;
  pins: Pin[];
  maxWidth?: number;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Tapping elsewhere should dismiss an open note, the way a popover does.
  useEffect(() => {
    if (open === null) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      <div className="relative mx-auto" style={maxWidth ? { maxWidth } : undefined}>
        <img src={src} alt={alt} className="block w-full" />

        {pins.map((pin, i) => {
          const isOpen = open === i;
          const flipUp = pin.y / 100 > FLIP_ABOVE;
          return (
            <div
              key={i}
              className="absolute"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen((cur) => (cur === i ? null : cur))}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label={`Problem ${i + 1}: ${pin.title}`}
                onClick={() => setOpen(isOpen ? null : i)}
                onFocus={() => setOpen(i)}
                className="flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                style={{ backgroundColor: ACCENT }}
              >
                {i + 1}
              </button>

              {isOpen && (
                <div
                  role="tooltip"
                  // Anchored to the marker's right edge and extending left, so a
                  // marker sitting near the image's right edge doesn't push the
                  // note off-screen.
                  className="pointer-events-none absolute right-0 z-20 w-60 translate-x-4 bg-white p-4 shadow-lg ring-1 ring-black/10"
                  style={flipUp ? { bottom: 20 } : { top: 20 }}
                >
                  <p className="text-sm font-medium">{pin.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{pin.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ol className="mt-6 flex flex-col gap-4">
        {pins.map((pin, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              {i + 1}
            </span>
            <p className="text-sm">
              <span className="font-medium">{pin.title}</span>{" "}
              <span className="text-gray-500">{pin.body}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
