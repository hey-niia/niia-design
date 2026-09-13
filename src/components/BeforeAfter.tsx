import { useCallback, useEffect, useRef, useState } from "react";

const ACCENT = "#e65f2e";
/** Treat "within this many px of the end" as scrolled through. */
const END_SLOP = 24;

export interface ZoomCursorHandlers {
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Before/after comparison as a labelled switch rather than a drag handle.
 *
 * A toggle shows each state whole — you compare two complete screens instead
 * of two halves — and it leaves the image clickable, so it can open in the
 * page's lightbox at full size.
 *
 * Each state scrolls inside a fixed-height window and keeps its own scroll
 * position. How far a screen scrolls is part of what the comparison shows, so
 * set `viewportHeight` to fit the shorter state and let the longer one run.
 */
export default function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  maxWidth = 360,
  viewportHeight = 620,
  onImageClick,
  zoomCursor,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Cap the rendered width, in px — phone screenshots need this. */
  maxWidth?: number;
  /** Height of the scroll window, in px. Taller screens scroll inside it. */
  viewportHeight?: number;
  onImageClick?: (src: string) => void;
  zoomCursor?: ZoomCursorHandlers;
}) {
  const [showAfter, setShowAfter] = useState(true);
  // Per-pane, because the two states are rarely the same length.
  const [hasMore, setHasMore] = useState<[boolean, boolean]>([false, false]);
  const boxRef = useRef<HTMLDivElement>(null);

  // Panes are read off the container at call time rather than held in refs, so
  // there's no stale closure to get wrong.
  const measure = useCallback(() => {
    const panes = boxRef.current?.children;
    if (!panes) return;
    const more = [0, 1].map((i) => {
      const el = panes[i] as HTMLElement | undefined;
      if (!el) return false;
      return el.scrollHeight - el.clientHeight - el.scrollTop > END_SLOP;
    });
    setHasMore([more[0], more[1]]);
  }, []);

  // Measured after a frame rather than in the images' onLoad: onLoad fires
  // when an image is decoded, which can be before it has been laid out, so
  // measuring there reports the pane as non-scrolling. Re-runs when the shown
  // state changes, since the two screens are different lengths.
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [measure, showAfter]);

  const states = [
    { src: before, alt: beforeAlt, shown: !showAfter },
    { src: after, alt: afterAlt, shown: showAfter },
  ];

  return (
    <div>
      <div className="bg-neutral-100 px-4 py-8 sm:px-10 sm:py-10">
        <div
          ref={boxRef}
          className="relative mx-auto overflow-hidden rounded-xl ring-1 ring-black/10"
          style={{ maxWidth, height: viewportHeight }}
        >
          {states.map((state) => (
            <div
              key={state.src}
              aria-hidden={!state.shown}
              onScroll={measure}
              className="absolute inset-0 overflow-y-auto overscroll-contain transition-opacity duration-200"
              style={{
                opacity: state.shown ? 1 : 0,
                pointerEvents: state.shown ? "auto" : "none",
              }}
            >
              <img
                src={state.src}
                alt={state.alt}
                onLoad={() => requestAnimationFrame(measure)}
                className={`block w-full ${onImageClick ? "cursor-none" : ""}`}
                onClick={onImageClick ? () => onImageClick(state.src) : undefined}
                onMouseMove={zoomCursor?.onMouseMove}
                onMouseLeave={zoomCursor?.onMouseLeave}
              />
            </div>
          ))}
        </div>

        <p
          aria-hidden={!hasMore[showAfter ? 1 : 0]}
          className={`mx-auto mt-2 text-center font-mono text-[10px] tracking-wider text-gray-400 uppercase transition-opacity ${
            hasMore[showAfter ? 1 : 0] ? "opacity-100" : "opacity-0"
          }`}
          style={{ maxWidth }}
        >
          Scroll to see more ↓
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setShowAfter(false)}
          className={`text-sm font-medium transition-colors ${
            showAfter ? "text-gray-400" : "text-black"
          }`}
        >
          {beforeLabel}
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={showAfter}
          aria-label={`Show ${showAfter ? beforeLabel.toLowerCase() : afterLabel.toLowerCase()}`}
          onClick={() => setShowAfter((v) => !v)}
          className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          style={{
            backgroundColor: showAfter ? ACCENT : "#d4d4d4",
            borderColor: showAfter ? ACCENT : "#d4d4d4",
          }}
        >
          <span
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition-all"
            style={{ left: showAfter ? 22 : 2, boxShadow: "0 2px 6px rgba(16,24,40,0.18)" }}
          />
        </button>

        <button
          type="button"
          onClick={() => setShowAfter(true)}
          className={`text-sm font-medium transition-colors ${
            showAfter ? "text-black" : "text-gray-400"
          }`}
        >
          {afterLabel}
        </button>
      </div>
    </div>
  );
}
