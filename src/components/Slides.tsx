import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { FIGMA_SECTION_BG, FIGMA_SECTION_GRID, NADIIA_AREA, NADIIA_SHAPE, NADIIA_SURFACE } from "./nadiia";
import { slideImages, type Slide, type SlideImage } from "../lib/slides";
import { Tag } from "./NadiiaParts";

/**
 * A self-advancing slideshow, one screen at a time, with arrows, dots, and
 * swipe on touch. Two looks:
 *
 * - `nadiia` — screens in white frames on a subtle orange dotted area, each
 *   under a Nadiia name tag (the wireframes).
 * - `figma` — each slide drawn like a Figma section: a small label chip and a
 *   "Ready for dev" status over a flat panel in the app's own placeholder
 *   colour. A slide can hold several related components, laid out in a grid.
 *
 * It holds still whenever someone is looking closely — pointer over it, focus
 * inside it, the tab in the background — and never auto-advances for people
 * who've asked for reduced motion. Using an arrow or dot restarts the timer
 * so the slide they picked doesn't vanish a second later.
 */

interface ZoomCursorHandlers {
  /** `label` replaces the default "Click to zoom". */
  onMouseMove: (e: React.MouseEvent, label?: string) => void;
  onMouseLeave: () => void;
}

const INTERVAL_MS = 5000;
const SWIPE_PX = 40;

const ARROW =
  "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white font-mono text-sm text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07)] ring-1 ring-black/5 transition-colors hover:text-[#d9723f] focus-visible:ring-2 focus-visible:ring-[#d9723f] focus-visible:outline-none";

const CHIP = "rounded-md text-[13px] font-medium text-neutral-800 ring-1 ring-black/10";

/**
 * A scrollable panel that opens scrolled to the middle of its content, so a
 * slide bigger than the panel shows its centre first and every edge is still
 * reachable by scrolling. It keeps re-centring while images load or the panel
 * resizes, and stops for good as soon as the person scrolls it themselves.
 */
function CenteredScroll({ className, style, children }: { className: string; style: React.CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const center = useCallback(() => {
    const el = ref.current;
    if (!el || touched.current) return;
    el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
    el.scrollTop = Math.max(0, (el.scrollHeight - el.clientHeight) / 2);
  }, []);

  useLayoutEffect(() => {
    center();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(center);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [center]);

  const markTouched = () => {
    touched.current = true;
  };

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onLoadCapture={center}
      onWheel={markTouched}
      onPointerDown={markTouched}
      onTouchStart={markTouched}
      onKeyDown={markTouched}
    >
      {children}
    </div>
  );
}

export default function Slides({
  slides,
  label,
  appearance = "nadiia",
  onImageClick,
  zoomCursor,
}: {
  slides: Slide[];
  /** What the slideshow is, for screen readers. */
  label: string;
  appearance?: "nadiia" | "figma";
  onImageClick?: (src: string) => void;
  zoomCursor?: ZoomCursorHandlers;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on manual navigation so the auto-advance timer starts over.
  const [restart, setRestart] = useState(0);
  const swipeStart = useRef<number | null>(null);
  // The Figma-like canvas: every component on one plane you drag and pinch freely.
  const [explore, setExplore] = useState(false);
  const [view, setView] = useState({ x: 0, y: 0, z: 1 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const panFrom = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  // Live touch points, so two fingers pinch instead of dragging.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchFrom = useRef<number | null>(null);
  const figma = appearance === "figma";
  // Components too big to read in the frame are kept for the canvas only.
  const shown = figma ? slides.filter((slide) => !slide.gridOnly) : slides;
  // The canvas keeps the sections: each slide stays one labelled group.
  const groups = figma ? slides.map((slide) => ({ title: slide.title, images: slideImages(slide) })) : [];
  const count = shown.length;
  // The component that was clicked, and where it sat, so the canvas opens on it.
  const openFrom = useRef<{ src: string; left: number; top: number } | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
      setRestart((n) => n + 1);
    },
    [count],
  );

  useEffect(() => {
    if (paused || explore || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, explore, count, restart]);

  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExplore(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explore]);

  /**
   * Line the clicked component up with the spot it occupied in the slider, so
   * the canvas opens exactly where the eye already was instead of jumping to a
   * corner. Re-run as images load: an image with no height yet would otherwise
   * put everything below it in the wrong place.
   */
  const alignToClicked = useCallback(() => {
    const canvas = canvasRef.current;
    const from = openFrom.current;
    if (!canvas || !from) return;
    const plane = canvas.firstElementChild as HTMLElement | null;
    const target = plane?.querySelector<HTMLImageElement>(`img[src="${from.src}"]`);
    if (!plane || !target) return;
    const planeRect = plane.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    setView((v) => ({
      ...v,
      // Undo the current pan to get the component's place on the plane itself.
      x: from.left - canvasRect.left - (targetRect.left - planeRect.left),
      y: from.top - canvasRect.top - (targetRect.top - planeRect.top),
    }));
  }, []);

  useLayoutEffect(() => {
    if (explore) alignToClicked();
  }, [explore, alignToClicked]);

  // Zoom about a point, so whatever is under the fingers (or cursor) stays put.
  const zoomAt = useCallback((cx: number, cy: number, factor: number) => {
    setView((v) => {
      const z = Math.min(3, Math.max(0.3, v.z * factor));
      const k = z / v.z;
      return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, z };
    });
  }, []);

  // Trackpad pinch arrives as a ctrl-wheel, which has to be taken off the page
  // before the browser zooms the whole document — so it can't be a passive one.
  useEffect(() => {
    const el = canvasRef.current;
    if (!explore || !el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      openFrom.current = null;
      if (e.ctrlKey) zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY / 100));
      else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [explore, zoomAt]);

  // The grid moves and scales with the components, so the canvas never appears to end.
  const startPan = (e: PointerEvent<HTMLDivElement>) => {
    openFrom.current = null;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchFrom.current = Math.hypot(a.x - b.x, a.y - b.y);
      panFrom.current = null;
      return;
    }
    panFrom.current = { x: e.clientX, y: e.clientY, ox: view.x, oy: view.y };
    // Capture keeps the drag alive past the frame's edge; harmless if unavailable.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no active pointer to capture */
    }
  };
  const movePan = (e: PointerEvent<HTMLDivElement>) => {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    if (pointers.current.size === 2 && pinchFrom.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const r = e.currentTarget.getBoundingClientRect();
      zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, dist / pinchFrom.current);
      pinchFrom.current = dist;
      return;
    }
    const from = panFrom.current;
    if (!from) return;
    setView((v) => ({ ...v, x: from.ox + (e.clientX - from.x), y: from.oy + (e.clientY - from.y) }));
  };
  const endPan = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchFrom.current = null;
    panFrom.current = null;
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
  };

  // Mouse drags are left alone so the image can still be clicked to zoom.
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
  };

  const image = (img: SlideImage, eager: boolean, className: string) => (
    <img
      key={img.src}
      src={img.src}
      alt={img.alt}
      loading={eager ? undefined : "lazy"}
      className={`block ${className} ${figma || onImageClick ? "cursor-none" : ""}`}
      onClick={
        figma
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              openFrom.current = { src: img.src, left: rect.left, top: rect.top };
              // The image goes away on this click, so its own mouseleave never fires.
              zoomCursor?.onMouseLeave();
              setView({ x: 0, y: 0, z: 1 });
              setExplore(true);
            }
          : onImageClick
            ? () => onImageClick(img.src)
            : undefined
      }
      onMouseMove={
        zoomCursor && (figma ? (e) => zoomCursor.onMouseMove(e, "Click to explore") : zoomCursor.onMouseMove)
      }
      onMouseLeave={zoomCursor?.onMouseLeave}
    />
  );

  const dots =
    count > 1 ? (
      <div
        className={`flex flex-wrap items-center justify-center gap-2 ${
          figma ? "pointer-events-none absolute inset-x-0 bottom-4 z-10" : "mt-5"
        }`}
      >
        {shown.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${slide.title}`}
            aria-current={i === index}
            className={`pointer-events-auto h-1.5 cursor-pointer rounded-full transition-all ${
              i === index ? "w-5 bg-[#d9723f]" : "w-1.5 bg-[#d9723f]/30 hover:bg-[#d9723f]/60"
            }`}
          />
        ))}
      </div>
    ) : null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={
        figma
          ? "my-10"
          : "my-10 rounded-2xl px-3 py-6 ring-1 ring-[#d9723f]/15 sm:px-6 sm:py-8"
      }
      style={figma ? undefined : NADIIA_AREA.orange}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
    >
      {/* Figma's section label, plus its Dev Mode "Ready for dev" status chip.
          Outside the track, so it holds still while the slides move under it and
          only the section's name changes. */}
      {figma && (
        <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
          <p
            className={`${CHIP} px-2.5 py-1 tracking-wide uppercase`}
            style={{ backgroundColor: FIGMA_SECTION_BG }}
          >
            {explore ? "All components" : (shown[index]?.title ?? "")}
          </p>
          <p
            className={`${CHIP} flex items-center gap-1.5 py-1 pr-2 pl-1`}
            style={{ backgroundColor: FIGMA_SECTION_BG }}
          >
            <span
              aria-hidden
              className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#3f9a5a]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4 3.5 1.5 6 4 8.5M8 3.5 10.5 6 8 8.5M6.8 2.5 5.2 9.5"
                  stroke="#fff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Ready for dev
            <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" className="text-neutral-500">
              <path d="M2.5 4 5 6.5 7.5 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          </p>
        </div>
      )}

      {explore ? (
        <div
          ref={canvasRef}
          role="group"
          aria-label={`${label}: drag to move, pinch to zoom`}
          className="relative h-[520px] w-full cursor-grab touch-none overflow-hidden rounded-[3px] select-none active:cursor-grabbing sm:h-[600px]"
          style={{
            ...FIGMA_SECTION_GRID,
            backgroundSize: `${16 * view.z}px ${16 * view.z}px`,
            backgroundPosition: `${view.x}px ${view.y}px`,
          }}
          onPointerDown={startPan}
          onPointerMove={movePan}
          onPointerUp={endPan}
          onPointerCancel={endPan}
        >
          <div
            className="w-max p-7"
            onLoadCapture={alignToClicked}
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`,
              transformOrigin: "0 0",
            }}
          >
            <div className="flex flex-col gap-11">
              {groups.map((group) => (
                <section key={group.title} className="flex w-max flex-col gap-3">
                  <p
                    className={`${CHIP} w-fit px-2.5 py-1 tracking-wide uppercase`}
                    style={{ backgroundColor: FIGMA_SECTION_BG }}
                  >
                    {group.title}
                  </p>
                  <div className="flex items-start gap-7">
                    {group.images.map((img) => (
                      // White behind every component so transparent ones don't show
                      // the grid through them, except the ones bringing their own card.
                      <div
                        key={img.src}
                        className={`shrink-0 ${
                          img.bare
                            ? ""
                            : "overflow-hidden rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07)]"
                        }`}
                        style={{ width: img.width }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          draggable={false}
                          className="pointer-events-none block h-auto w-full max-w-none"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExplore(false)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`${CHIP} absolute top-3 right-3 z-10 cursor-pointer px-2.5 py-1 text-neutral-600 transition-colors hover:text-[#d9723f]`}
            style={{ backgroundColor: FIGMA_SECTION_BG }}
          >
            Press Esc to exit
          </button>
        </div>
      ) : (
      <div className="relative">
        <div
          className="touch-pan-y overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {shown.map((slide, i) => {
              const current = i === index;
              const imgs = slideImages(slide);
              const columns = slide.columns ?? (imgs.length <= 3 ? imgs.length : 2);
              const rows = Math.ceil(imgs.length / columns);
              return (
                <div
                  key={slide.title}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}: ${slide.title}`}
                  aria-hidden={!current}
                  inert={!current}
                  // Figma slides run edge to edge (as wide as the wireframe box) with the
                  // arrows floating inside; Nadiia slides leave side gutters for them.
                  className={`flex h-[520px] w-full shrink-0 flex-col sm:h-[600px] ${
                    figma
                      ? "items-stretch"
                      : // Centred in the frame: a wireframe narrower or shorter than the
                        // slide would otherwise sit at the top with dead space under it.
                        "items-center justify-center px-12 sm:px-16"
                  }`}
                >
                  {figma ? (
                    <>
                      {imgs.every((img) => img.width) ? (
                        // Real size: components keep their Figma dimensions and simply sit
                        // side by side, wrapping; anything bigger than the panel scrolls.
                        <CenteredScroll
                          className="min-h-0 flex-1 overflow-auto overscroll-contain rounded-[3px]"
                          style={FIGMA_SECTION_GRID}
                        >
                          {/* "safe center": centred when it fits, but a component wider or
                              taller than the panel starts at its edge so all of it can be
                              scrolled to — plain centring would push its start out of reach. */}
                          <div
                            className="flex min-h-full flex-wrap gap-7 p-6"
                            style={{ justifyContent: "safe center", alignItems: "safe center", alignContent: "safe center" }}
                          >
                            {imgs.map((img, k) => (
                              // White behind every component so transparent ones don't show
                              // the grid through them, plus the soft Nadiia shadow underneath.
                              <div
                                key={img.src}
                                className={`shrink-0 ${
                                  img.bare
                                    ? ""
                                    : "overflow-hidden rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07)]"
                                }`}
                                style={{ width: img.width }}
                              >
                                {image(img, i === 0 && k === 0, "h-auto w-full max-w-none")}
                              </div>
                            ))}
                          </div>
                        </CenteredScroll>
                      ) : (
                        <div
                          className="grid min-h-0 flex-1 gap-5 rounded-[3px] p-5 sm:gap-8 sm:p-8"
                          style={{
                            ...FIGMA_SECTION_GRID,
                            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                          }}
                        >
                          {imgs.map((img, k) => (
                            <div key={img.src} className="flex min-h-0 min-w-0 items-center justify-center">
                              {image(img, i === 0 && k === 0, "max-h-full w-auto max-w-full object-contain")}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Tag tone="onOrange" className="mb-4 shrink-0">
                        {slide.title}
                      </Tag>
                      <div
                        className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} min-h-0 overflow-hidden ${
                          slide.scroll ? "w-full max-w-[40rem] flex-1" : "max-w-full"
                        }`}
                      >
                        <div className={slide.scroll ? "h-full overflow-y-auto overscroll-contain" : ""}>
                          {imgs[0] &&
                            image(
                              imgs[0],
                              i === 0,
                              slide.scroll ? "w-full" : "max-h-[460px] w-auto max-w-full sm:max-h-[540px]",
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous"
              className={`${ARROW} ${figma ? "left-3 mt-5" : "left-0"}`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next"
              className={`${ARROW} ${figma ? "right-3 mt-5" : "right-0"}`}
            >
              →
            </button>
          </>
        )}
        {figma && dots}
      </div>
      )}

      {!figma && dots}

    </div>
  );
}
