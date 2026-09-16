import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FRAME_RADIUS, ScrollHint } from "./ScreenshotFrame";

const ACCENT = "#e65f2e";
/** Past this height fraction a note would fall off the bottom, so open it upward. */
const FLIP_ABOVE = 0.72;
// Matches the note's `w-60`.
const NOTE_WIDTH = 240;
// Matches the marker-to-note gap the original absolute layout used
// (`right-0 translate-x-4` horizontally, `top-20`/`bottom-20` vertically).
const NOTE_GAP = 16;
const NOTE_V_GAP = 20;
const VIEWPORT_PADDING = 12;
// Below this average luminance (0-255) behind the note, it's a dark backdrop
// and a light glass chip stands out; above it, flip to a dark chip so the
// note doesn't wash out against a light part of the image.
const CONTRAST_LUMA_THRESHOLD = 175;

export interface Pin {
  /** Position as a percentage of the image box, 0-100. */
  x: number;
  y: number;
  title: string;
  body: string;
}

export interface ZoomCursorHandlers {
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
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
  viewportHeight,
  onImageClick,
  zoomCursor,
  showList = true,
  onLoad,
}: {
  src: string;
  alt: string;
  pins: Pin[];
  /** The notes repeated as a list underneath. Off when something else frames the image. */
  showList?: boolean;
  onLoad?: () => void;
  maxWidth?: number;
  /** Height of the scroll window, in px. Omit to render the image full height. */
  viewportHeight?: number;
  onImageClick?: (src: string) => void;
  zoomCursor?: ZoomCursorHandlers;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  // The note renders in a portal (see below), so it needs its own
  // viewport-relative position instead of the CSS it used when it was an
  // absolutely-positioned child of the marker.
  const [notePos, setNotePos] = useState<{
    left: number;
    flipUp: boolean;
    anchorY: number;
  } | null>(null);
  const [noteOnLight, setNoteOnLight] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const measure = () => {
    const el = scrollRef.current;
    if (!el) return;
    setHasMore(el.scrollHeight - el.clientHeight - el.scrollTop > 24);
  };

  // Tapping elsewhere should dismiss an open note, the way a popover does.
  useEffect(() => {
    if (open === null) return;
    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !noteRef.current?.contains(target)
      )
        setOpen(null);
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

  // Measured after a frame: the image's height isn't laid out yet at onLoad.
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The note is portaled to <body> and positioned `fixed` from the marker's
  // real screen position — rendering it as a child of the (possibly
  // scrolling) image box clipped it, since a vertical `overflow-y-auto`
  // container also clips horizontal overflow per spec, and the note
  // deliberately hangs off the marker's edge.
  const updateNotePosition = useCallback(() => {
    if (open === null) return;
    const markerEl = markerRefs.current[open];
    if (!markerEl) return;
    const rect = markerEl.getBoundingClientRect();
    const anchorY = rect.top + rect.height / 2;
    let left = rect.right + NOTE_GAP - NOTE_WIDTH;
    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - NOTE_WIDTH - VIEWPORT_PADDING),
    );
    setNotePos({ left, flipUp: pins[open].y / 100 > FLIP_ABOVE, anchorY });
  }, [open, pins]);

  useEffect(() => {
    updateNotePosition();
  }, [updateNotePosition]);

  useEffect(() => {
    if (open === null) return;
    // Capture phase: catches scrolling in any ancestor (the page, or the
    // screenshot's own scroll window), not just window-level scroll, since
    // scroll events don't bubble.
    window.addEventListener("scroll", updateNotePosition, true);
    window.addEventListener("resize", updateNotePosition);
    return () => {
      window.removeEventListener("scroll", updateNotePosition, true);
      window.removeEventListener("resize", updateNotePosition);
    };
  }, [open, updateNotePosition]);

  // The note floats over whatever part of the screenshot sits behind it,
  // which can be light or dark — sample the pixels directly underneath it
  // and flip the note's own theme to match, the same trick the lightbox's
  // zoom pill uses.
  const sampleContrast = useCallback(() => {
    const imgEl = imgRef.current;
    const noteEl = noteRef.current;
    if (!imgEl || !noteEl || !imgEl.naturalWidth) return;
    const imgRect = imgEl.getBoundingClientRect();
    const noteRect = noteEl.getBoundingClientRect();
    const x0 = Math.max(imgRect.left, noteRect.left);
    const x1 = Math.min(imgRect.right, noteRect.right);
    const y0 = Math.max(imgRect.top, noteRect.top);
    const y1 = Math.min(imgRect.bottom, noteRect.bottom);
    if (x1 <= x0 || y1 <= y0) return;
    const scaleX = imgEl.naturalWidth / imgRect.width;
    const scaleY = imgEl.naturalHeight / imgRect.height;
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      ctx.drawImage(
        imgEl,
        (x0 - imgRect.left) * scaleX,
        (y0 - imgRect.top) * scaleY,
        (x1 - x0) * scaleX,
        (y1 - y0) * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      }
      setNoteOnLight(total / (data.length / 4) > CONTRAST_LUMA_THRESHOLD);
    } catch {
      // Same-origin project screenshots shouldn't taint the canvas, but if
      // something ever does, just keep the last known theme.
    }
  }, []);

  // Sampled a frame after the note's real position lands, so its own
  // getBoundingClientRect() is accurate — it fades in over the same frames,
  // so a stale theme for one tick isn't visible.
  useEffect(() => {
    if (!notePos) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(sampleContrast),
    );
    return () => cancelAnimationFrame(raf);
  }, [notePos, sampleContrast]);

  const openPin = open !== null ? pins[open] : null;

  return (
    <div ref={rootRef}>
      <div
        className={`relative mx-auto overflow-hidden ${FRAME_RADIUS} ${
          viewportHeight ? "ring-1 ring-black/10" : ""
        }`}
        style={{ maxWidth }}
      >
        <div
          ref={scrollRef}
          onScroll={measure}
          className={viewportHeight ? "overflow-y-auto overscroll-contain" : ""}
          style={{ height: viewportHeight }}
        >
          <div className="relative">
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              onLoad={onLoad}
              className={`block w-full ${onImageClick ? "cursor-none" : ""}`}
              onClick={onImageClick ? () => onImageClick(src) : undefined}
              onMouseMove={zoomCursor?.onMouseMove}
              onMouseLeave={zoomCursor?.onMouseLeave}
            />

            {pins.map((pin, i) => (
              <div
                key={i}
                ref={(el) => {
                  markerRefs.current[i] = el;
                }}
                className="absolute"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={() => setOpen((cur) => (cur === i ? null : cur))}
              >
                <button
                  type="button"
                  aria-expanded={open === i}
                  aria-label={`Problem ${i + 1}: ${pin.title}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  onFocus={() => setOpen(i)}
                  className="flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </button>
              </div>
            ))}
          </div>
        </div>
        {viewportHeight && <ScrollHint show={hasMore} />}
      </div>

      {openPin &&
        notePos &&
        createPortal(
          <div
            ref={noteRef}
            role="tooltip"
            // Glassy chip, same family as the image context menu and
            // lightbox zoom pill — and same contrast flip: a dark chip
            // reads as clearly on a light screenshot as a light chip does
            // on a dark one, whereas one fixed color washes out on half
            // the screenshots on the site.
            className={`niia-tooltip-in pointer-events-none fixed z-[70] w-60 rounded-xl border p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
              noteOnLight
                ? "border-black/10 bg-black/70 text-white"
                : "border-white/15 bg-white/90 text-black"
            }`}
            style={{
              left: notePos.left,
              ...(notePos.flipUp
                ? { bottom: window.innerHeight - notePos.anchorY + NOTE_V_GAP }
                : { top: notePos.anchorY + NOTE_V_GAP }),
            }}
          >
            <p className="text-sm font-medium">{openPin.title}</p>
            <p
              className={`mt-1 text-sm ${noteOnLight ? "text-white/70" : "text-black/60"}`}
            >
              {openPin.body}
            </p>
          </div>,
          document.body,
        )}

      {showList && (
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
      )}
    </div>
  );
}
