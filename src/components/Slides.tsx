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
import {
  CANVAS_BUTTON_SHADOW,
  CANVAS_HINT_PILL,
  DARK_MATTER_AREA,
  DARK_MATTER_CHIP,
  DARK_MATTER_SECTION,
  DARK_MATTER_SURFACE,
  DARK_MATTER_SHADOW,
  FIGMA_SECTION_BG,
  FIGMA_SECTION_GRID,
  NADIIA_AREA,
  NADIIA_SHAPE,
  NADIIA_SURFACE,
} from "./nadiia";
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
  "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--nd-button,#fff)] font-mono text-sm text-[var(--nd-button-ink,#404040)] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07)] ring-1 ring-[var(--nd-box-ring,rgba(0,0,0,0.05))] transition-colors hover:text-[#d9723f] focus-visible:ring-2 focus-visible:ring-[#d9723f] focus-visible:outline-none";

const CHIP = "rounded-md text-[13px] font-medium text-neutral-800 ring-1 ring-black/10";

/**
 * A scrollable panel that opens at the top-left of its content, so a slide
 * taller or wider than the panel shows where it starts rather than a slice of
 * its middle, and every edge is still reachable by scrolling. A slide that fits
 * is centred by its own layout. It keeps re-aligning while images load or the
 * panel resizes, and stops for good as soon as the person scrolls it themselves.
 */
function CenteredScroll({ className, style, children }: { className: string; style: React.CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const center = useCallback(() => {
    const el = ref.current;
    if (!el || touched.current) return;
    el.scrollLeft = 0;
    el.scrollTop = 0;
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
  field = "orange",
  stickyTitle = false,
  onImageClick,
  zoomCursor,
  look = "light",
  canvasRows = [],
}: {
  slides: Slide[];
  /** What the slideshow is, for screen readers. */
  label: string;
  appearance?: "nadiia" | "figma";
  /** Nadiia look: the field behind the frames — orange, or the neutral grey
   *  the interview cards use (which a dark page repaints for itself). */
  field?: "orange" | "neutral";
  /** Nadiia look: one tag above the track (the slider's own label) that stays
   *  put as slides change, instead of a tag per slide that moves with them. */
  stickyTitle?: boolean;
  /**
   * Figma look only. `light`: Figma's pale section grid, a white card and soft
   * shadow behind each component. `darkMatter`: the dark dotted panel, no card,
   * just a small shadow following each component — for a dark product's UI.
   */
  look?: "light" | "darkMatter";
  /** Explore canvas: sections placed side by side as one row, by title. The row sits where its first section would. */
  canvasRows?: string[][];
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
  // Real size on the canvas, but on a phone that is a lot of scrolling: start at 75% there.
  // Phones show components at 75% of real size, in the slider and on the canvas alike.
  const exploreZoom = () => (window.matchMedia("(max-width: 39.99rem)").matches ? 0.75 : 1);
  // Below desktop width (tablets, phones) or on any screen without hover, nobody clicks:
  // "Click to explore" gives way to a "Tap to explore" button. Checked at the moment of
  // each mouse move as well as on resize, so a narrowed desktop window gets it right.
  const tapQuery = "(max-width: 63.99rem), (hover: none)";
  const [touch, setTouch] = useState(false);
  // The pinch hint on the canvas: shown while exploring on a touch screen,
  // and dismissed for good the first time two fingers actually zoom.
  const [pinchHint, setPinchHint] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(tapQuery);
    const sync = () => setTouch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const [view, setView] = useState({ x: 0, y: 0, z: 1 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const panFrom = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  // Live touch points, so two fingers pinch instead of dragging.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchFrom = useRef<number | null>(null);
  const figma = appearance === "figma";
  const dark = figma && look === "darkMatter";
  const panelStyle = dark ? DARK_MATTER_AREA : FIGMA_SECTION_GRID;
  // Components too big to read in the frame are kept for the canvas only.
  const shown = figma ? slides.filter((slide) => !slide.gridOnly) : slides;
  // The canvas keeps the sections: each slide stays one labelled group.
  const groups = figma ? slides.map((slide) => ({ title: slide.title, images: slideImages(slide) })) : [];
  // Canvas rows: every section on its own line, except the ones named together in
  // `canvasRows`, which share a line in the order given, placed where the first one was.
  const canvasLines = (() => {
    const byTitle = new Map(groups.map((g) => [g.title, g]));
    const rowOf = new Map<string, string[]>();
    for (const row of canvasRows) for (const title of row) rowOf.set(title, row);
    const lines: (typeof groups)[] = [];
    const placed = new Set<string>();
    for (const group of groups) {
      if (placed.has(group.title)) continue;
      const row = rowOf.get(group.title);
      if (row && row[0] !== group.title && byTitle.has(row[0])) continue;
      const line = (row ?? [group.title]).map((t) => byTitle.get(t)).filter((g): g is (typeof groups)[number] => !!g);
      line.forEach((g) => placed.add(g.title));
      lines.push(line);
    }
    return lines;
  })();
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
      setPinchHint(false);
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
      className={`block ${className} ${figma ? (touch ? "" : "lg:cursor-none") : onImageClick ? "cursor-none" : ""}`}
      onClick={
        figma
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              openFrom.current = { src: img.src, left: rect.left, top: rect.top };
              // The image goes away on this click, so its own mouseleave never fires.
              zoomCursor?.onMouseLeave();
              setView({ x: 0, y: 0, z: exploreZoom() });
              setExplore(true);
            }
          : onImageClick
            ? () => onImageClick(img.src)
            : undefined
      }
      onMouseMove={
        zoomCursor &&
        (figma
          ? (e) =>
              window.matchMedia(tapQuery).matches
                ? zoomCursor.onMouseLeave()
                : zoomCursor.onMouseMove(e, "Click to explore")
          : zoomCursor.onMouseMove)
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

  const fieldClass = `rounded-2xl px-3 py-6 ring-1 sm:px-6 sm:py-8 ${
    field === "neutral" ? "ring-[var(--nd-box-ring,rgba(0,0,0,0.05))]" : "ring-[#d9723f]/15"
  }`;
  // The neutral field has its own grey and dots, so a dark page can match it to
  // the explore canvas while cards elsewhere stay flat.
  const fieldStyle =
    field === "neutral"
      ? {
          backgroundColor: "var(--nd-slider, #f4f4f3)",
          backgroundImage:
            "radial-gradient(circle, var(--nd-slider-dot, rgba(0,0,0,0.09)) 1px, transparent 1.2px)",
          backgroundSize: "14px 14px",
        }
      : NADIIA_AREA.orange;
  // With a sticky label the field becomes an inner box, so the label can sit
  // above it on the page — the same arrangement as the Figma slider's header.
  const boxed = !figma && stickyTitle;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={figma || boxed ? "my-10" : `my-10 ${fieldClass}`}
      style={figma || boxed ? undefined : fieldStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
    >
      {boxed && (
        // The Dark Matter chip, exactly as the Figma slider's section label.
        <p
          className={`mb-2 w-fit ${
            field === "neutral"
              ? `${DARK_MATTER_CHIP} px-2.5 py-1 tracking-wide uppercase`
              : `${CHIP} px-2.5 py-1 tracking-wide uppercase`
          }`}
        >
          {label}
        </p>
      )}
      <div className={boxed ? fieldClass : "contents"} style={boxed ? fieldStyle : undefined}>

      {/* Figma's section label, plus its Dev Mode "Ready for dev" status chip.
          Outside the track, so it holds still while the slides move under it and
          only the section's name changes. */}
      {figma && (
        <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
          <p
            className={`${dark ? DARK_MATTER_CHIP : CHIP} px-2.5 py-1 tracking-wide uppercase`}
            style={dark ? undefined : { backgroundColor: FIGMA_SECTION_BG }}
          >
            {explore ? "All components" : (shown[index]?.title ?? "")}
          </p>
          <p
            className={`${dark ? DARK_MATTER_CHIP : CHIP} flex items-center gap-1.5 py-1 pr-2 pl-1`}
            style={dark ? undefined : { backgroundColor: FIGMA_SECTION_BG }}
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
            ...panelStyle,
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
              {canvasLines.map((line) => (
                <div key={line.map((g) => g.title).join("|")} className="flex items-start gap-16">
                  {line.map((group) => (
                    <section key={group.title} className="flex w-max flex-col gap-3">
                      <p
                        className={`${dark ? DARK_MATTER_CHIP : CHIP} w-fit px-2.5 py-1 tracking-wide uppercase`}
                        style={dark ? undefined : { backgroundColor: FIGMA_SECTION_BG }}
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
                                : dark
                                ? img.backed
                                  ? DARK_MATTER_SECTION
                                  : ""
                                : "overflow-hidden rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07)]"
                            }`}
                            style={{
                          width: img.width,
                          filter: dark && !img.bare && !img.backed ? DARK_MATTER_SHADOW : undefined,
                          backgroundColor: dark && img.backed ? DARK_MATTER_SURFACE : undefined,
                        }}
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
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExplore(false)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`${
              dark ? DARK_MATTER_CHIP : `${CHIP} text-neutral-600`
            } ${CANVAS_BUTTON_SHADOW} absolute top-3 right-3 z-10 cursor-pointer px-2.5 py-1 transition-colors hover:text-[#d9723f]`}
            style={dark ? undefined : { backgroundColor: FIGMA_SECTION_BG }}
          >
            <span className={touch ? "" : "lg:hidden"}>Tap to exit</span>
            <span className={touch ? "hidden" : "max-lg:hidden"}>Press Esc to exit</span>
          </button>

          {/* The same hint as a long screenshot's "Scroll to see more", for the
              gesture this view relies on. Phones and touch screens only. */}
          <div
            aria-hidden
            className={`${touch ? "" : "lg:hidden"} pointer-events-none absolute inset-x-0 bottom-3 flex justify-center transition-opacity duration-300 ${
              pinchHint ? "opacity-100" : "opacity-0"
            }`}
          >
            <span
              className={`${CANVAS_HINT_PILL} ${CANVAS_BUTTON_SHADOW}`}
            >
              Pinch to zoom
              {/* The conventional pinch glyph (Material's "pinch"): a hand with
                  two fingers out, and arrows showing the pinch either way. */}
              <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10V9a1.5 1.5 0 0 1 3 0v1.5m0-.5a1.5 1.5 0 0 1 3 0V15a5 5 0 0 1-5 5h-1.6a4 4 0 0 1-2.9-1.24l-3.2-3.36a1.5 1.5 0 0 1 2.1-2.14L9 14.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      ) : (
      <div className="relative">
        {figma && (
          <button
            type="button"
            onClick={() => {
              zoomCursor?.onMouseLeave();
              setView({ x: 0, y: 0, z: exploreZoom() });
              setExplore(true);
            }}
            className={`${
              dark ? DARK_MATTER_CHIP : `${CHIP} text-neutral-600`
            } ${CANVAS_BUTTON_SHADOW} ${touch ? "" : "lg:hidden"} absolute top-3 right-3 z-20 cursor-pointer px-2.5 py-1 transition-colors hover:text-[#d9723f]`}
            style={dark ? undefined : { backgroundColor: FIGMA_SECTION_BG }}
          >
            Tap to explore
          </button>
        )}
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
                          style={panelStyle}
                        >
                          {/* "safe center": centred when it fits, but a component wider or
                              taller than the panel starts at its edge so all of it can be
                              scrolled to — plain centring would push its start out of reach. */}
                          <div
                            className="flex min-h-full flex-wrap gap-4 p-4 [--ds-scale:0.75] sm:gap-7 sm:p-6 sm:[--ds-scale:1]"
                            style={{ justifyContent: "safe center", alignItems: "safe center", alignContent: "safe center" }}
                          >
                            {imgs.map((img, k) => (
                              // White behind every component so transparent ones don't show
                              // the grid through them, plus the soft Nadiia shadow underneath.
                              // Real size, times --ds-scale: 75% on phones (as on the explore
                              // canvas there), 100% from tablet width up.
                              <div
                                key={img.src}
                                className={`shrink-0 ${
                                  img.bare
                                    ? ""
                                    : dark
                                    ? img.backed
                                      ? DARK_MATTER_SECTION
                                      : ""
                                    : "overflow-hidden rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07)]"
                                }`}
                                style={{
                          width: `calc(${img.width}px * var(--ds-scale, 1))`,
                          filter: dark && !img.bare && !img.backed ? DARK_MATTER_SHADOW : undefined,
                          backgroundColor: dark && img.backed ? DARK_MATTER_SURFACE : undefined,
                        }}
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
                            ...panelStyle,
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
                      {!stickyTitle && (
                        <Tag tone="onOrange" className="mb-4 shrink-0">
                          {slide.title}
                        </Tag>
                      )}
                      {imgs.length > 1 ? (
                        // Several screens on one slide: each keeps its shape and
                        // shrinks to the slide's height, so a set reads side by side.
                        <div className="flex min-h-0 w-full flex-1 items-center justify-center gap-3 sm:gap-5">
                          {imgs.map((img, k) => (
                            // Each screen is a column of the row and keeps its own shape:
                            // the image fills the column's width, the frame takes its height.
                            <div
                              key={img.src}
                              className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} min-w-0 flex-1 overflow-hidden`}
                            >
                              {image(img, i === 0 && k === 0, "block h-auto w-full")}
                            </div>
                          ))}
                        </div>
                      ) : (
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
                      )}
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
    </div>
  );
}
