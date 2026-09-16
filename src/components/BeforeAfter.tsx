import { useCallback, useEffect, useRef, useState } from "react";
import AnnotatedImage, { type Pin } from "./AnnotatedImage";
import { FRAME_RADIUS, ScrollHint } from "./ScreenshotFrame";

const ACCENT = "#e65f2e";
/** Treat "within this many px of the end" as scrolled through. */
const END_SLOP = 24;

export interface ZoomCursorHandlers {
  onMouseMove: (e: React.MouseEvent, label?: string) => void;
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
  caption,
  onImageClick,
  zoomCursor,
  dark = false,
  plain = false,
  beforePins,
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
  /** Rendered inside the panel, under the toggle. */
  caption?: string;
  onImageClick?: (src: string) => void;
  zoomCursor?: ZoomCursorHandlers;
  /** Dark grey panel, as in the PDF case study. */
  dark?: boolean;
  /** No panel: the frame sits on the page itself with a soft shadow. */
  plain?: boolean;
  /** Numbered markers on the "before" screen, with notes on hover. */
  beforePins?: Pin[];
}) {
  const [showAfter, setShowAfter] = useState(true);
  // Per-pane, because the two states are rarely the same length.
  const [hasMore, setHasMore] = useState<[boolean, boolean]>([false, false]);
  const boxRef = useRef<HTMLDivElement>(null);
  // Height ÷ width of each image. The frame takes the shorter image's shape,
  // capped at `viewportHeight`, so a narrow screen doesn't leave an empty band
  // under a screenshot that's shorter than the window.
  const [ratios, setRatios] = useState<[number, number]>([Infinity, Infinity]);

  // Read off the DOM rather than only in onLoad: a cached image can finish
  // loading before React attaches the handler, so onLoad never fires.
  const readRatios = useCallback(() => {
    const imgs = boxRef.current?.querySelectorAll("img");
    if (!imgs) return;
    const next = [0, 1].map((i) => {
      const img = imgs[i];
      return img?.naturalWidth ? img.naturalHeight / img.naturalWidth : Infinity;
    });
    setRatios([next[0], next[1]]);
  }, []);

  useEffect(readRatios, [readRatios]);

  const shortestRatio = Math.min(...ratios);
  const frameStyle: React.CSSProperties = Number.isFinite(shortestRatio)
    ? { maxWidth, aspectRatio: 1 / shortestRatio, maxHeight: viewportHeight }
    : { maxWidth, height: viewportHeight };

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
  }, [measure, showAfter, shortestRatio]);

  const states = [
    { src: before, alt: beforeAlt, shown: !showAfter },
    { src: after, alt: afterAlt, shown: showAfter },
  ];

  return (
    <div>
      <div
        className={
          plain
            ? ""
            : `px-4 py-8 sm:px-10 sm:py-10 ${dark ? "bg-[#292929]" : "bg-neutral-100"}`
        }
      >
        <div
          ref={boxRef}
          className={`relative mx-auto overflow-hidden ring-1 ${dark ? "ring-white/10" : "ring-black/10"} ${
            plain ? "shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)]" : ""
          } ${FRAME_RADIUS}`}
          style={frameStyle}
        >
          {states.map((state, i) => (
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
              {i === 0 && beforePins ? (
                <AnnotatedImage
                  src={state.src}
                  alt={state.alt}
                  pins={beforePins}
                  showList={false}
                  onLoad={() => {
                    readRatios();
                    requestAnimationFrame(measure);
                  }}
                  onImageClick={onImageClick}
                  zoomCursor={
                    zoomCursor && {
                      onMouseMove: (e) => zoomCursor.onMouseMove(e, "Hover the markers"),
                      onMouseLeave: zoomCursor.onMouseLeave,
                    }
                  }
                />
              ) : (
                <img
                  src={state.src}
                  alt={state.alt}
                  onLoad={() => {
                    readRatios();
                    requestAnimationFrame(measure);
                  }}
                  className={`block w-full ${onImageClick ? "cursor-none" : ""}`}
                  onClick={onImageClick ? () => onImageClick(state.src) : undefined}
                  onMouseMove={zoomCursor?.onMouseMove}
                  onMouseLeave={zoomCursor?.onMouseLeave}
                />
              )}
            </div>
          ))}

          <ScrollHint show={hasMore[showAfter ? 1 : 0]} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowAfter(false)}
            className={`text-sm font-medium transition-colors ${
              showAfter ? "text-gray-400" : dark ? "text-white" : "text-black"
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
              backgroundColor: showAfter ? ACCENT : dark ? "#525252" : "#d4d4d4",
              borderColor: showAfter ? ACCENT : dark ? "#525252" : "#d4d4d4",
            }}
          >
            <span
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition-all"
              style={{
                left: showAfter ? 22 : 2,
                boxShadow: "0 2px 6px rgba(16,24,40,0.18)",
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowAfter(true)}
            className={`text-sm font-medium transition-colors ${
              showAfter ? (dark ? "text-white" : "text-black") : "text-gray-400"
            }`}
          >
            {afterLabel}
          </button>
        </div>

        {caption && (
          <p className={`mx-auto mt-5 max-w-[30rem] text-center text-sm italic ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
