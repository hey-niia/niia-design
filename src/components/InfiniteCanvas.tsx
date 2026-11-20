import { Link } from "react-router-dom";
import { STUD_BG, STUD_PITCH, STUD_TILE, studTile } from "../lib/studs";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const PINK_BRICK = studTile("#ef7fb2", "#7a2149", true);

// A small smiley of pink 1x1 bricks on the plate, in the canvas's bottom left
// corner (its edges count towards the bounds, so it's the last thing there).
// Cells are stud-grid steps from SMILE_AT (a stud centre: 22k + 11).
const DEFAULT_SMILE_AT = { x: -1045, y: 847 };
const SMILE: [number, number][] = [
  [-1, -1],
  [1, -1],
  [-2, 1],
  [2, 1],
  [-1, 2],
  [0, 2],
  [1, 2],
];

export type CanvasCard = {
  /** Centre of the card in the world, in px (the world's centre is 0,0). */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius of the screenshot's own window, in px at this size. */
  radius: number;
  image: string;
  title: string;
  label: string;
  href: string;
};

type Props = {
  cards: CanvasCard[];
  /** Shown at the centre of the world. */
  center: ReactNode;
  /** Size of the area kept clear around the centre (counts towards the bounds). */
  centerW: number;
  centerH: number;
  /** Where the centre block sits in the world (default 0,0). */
  centerX?: number;
  centerY?: number;
  /** Centre of the pink smiley (a stud centre: 22k + 11). */
  smileAt?: { x: number; y: number };
  /** Dev only: drag the blocks around instead of panning. `id` is the card's
   * title, or "center". */
  /** Where the view starts: centred on the title block (default), or at the
   * canvas's top-left corner, at the given zoom. */
  start?: { corner: "top-left"; zoom: number };
  /** Room kept between the blocks and the screen edge at the canvas's edges,
   * in world px (default 60 on both axes). */
  margin?: { x: number; y: number };
  arrange?: boolean;
  onArrange?: (id: string, dx: number, dy: number) => void;
  onArrangeEnd?: () => void;
};

const DRAG_THRESHOLD = 6;
// Arrange mode: each movable block gets a dashed outline and a move cursor.
const ARRANGE_RING =
  "cursor-move rounded-[28px] outline-2 outline-offset-4 outline-dashed outline-[var(--site-accent)]";
const MAX_ZOOM = 2.5;
// Room around the projects when zoomed all the way out.
const FIT_MARGIN = 60;
// How quickly a fling slows down (per frame at 60fps).
const FRICTION = 0.92;

/**
 * A canvas you can move around: drag, swipe or scroll in any direction, and
 * pinch (or ctrl/⌘ + scroll) to zoom. Each project appears once; you can't zoom
 * out further than seeing all of them, or pan off into empty space. Clicking a
 * card (without dragging) opens it.
 */
export default function InfiniteCanvas({
  cards,
  center,
  centerW,
  centerH,
  centerX = 0,
  centerY = 0,
  smileAt: SMILE_AT = DEFAULT_SMILE_AT,
  start,
  margin = { x: FIT_MARGIN, y: FIT_MARGIN },
  arrange = false,
  onArrange,
  onArrangeEnd,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const viewRef = useRef(view);
  viewRef.current = view;

  // The edges of everything on the canvas, in world px.
  const bounds = cards.reduce(
    (b, c) => ({
      minX: Math.min(b.minX, c.x - c.w / 2),
      maxX: Math.max(b.maxX, c.x + c.w / 2),
      minY: Math.min(b.minY, c.y - c.h / 2),
      maxY: Math.max(b.maxY, c.y + c.h / 2),
    }),
    {
      // The smiley sits one stud in from the canvas's bottom left corner
      // (the bounds sit inside it by the margin, minus one stud).
      minX: Math.min(
        centerX - centerW / 2,
        SMILE_AT.x - 2.5 * STUD_PITCH - STUD_PITCH + margin.x,
      ),
      maxX: centerX + centerW / 2,
      minY: centerY - centerH / 2,
      maxY: Math.max(
        centerY + centerH / 2,
        SMILE_AT.y + 2.5 * STUD_PITCH + STUD_PITCH - margin.y,
      ),
    },
  );
  const boundsRef = useRef(bounds);
  const marginRef = useRef(margin);
  marginRef.current = margin;
  boundsRef.current = bounds;

  // Zoomed all the way out, every project fits on screen (never past 100%).
  const minZoom = () => {
    const v = viewRef.current;
    const b = boundsRef.current;
    return Math.min(
      1,
      v.w / (b.maxX - b.minX + marginRef.current.x * 2),
      v.h / (b.maxY - b.minY + marginRef.current.y * 2),
    );
  };

  // Where the world's centre sits relative to the screen's centre, and the zoom.
  // It opens on the title block (as near the screen's middle as the canvas
  // edges allow), or, with `start`, in the top-left corner (the clamp stops a
  // far-off camera at the canvas edges). Phones start zoomed out a little so
  // the title and a project or two show.
  const [cam, setCam] = useState(() => {
    if (start) return { x: 1e6, y: 1e6, z: start.zoom };
    const z = window.innerWidth < 640 ? 0.55 : 1;
    return { x: -centerX * z, y: -centerY * z, z };
  });
  const camRef = useRef(cam);
  const raf = useRef<number | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    t: number;
    moved: number;
  } | null>(null);
  const suppressClick = useRef(false);
  // Arrange mode: the block being moved, and where the pointer last was.
  const moving = useRef<{ id: string; x: number; y: number } | null>(null);
  // Fingers currently on the canvas, for pinch-to-zoom.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; mid: { x: number; y: number } } | null>(
    null,
  );

  // Keep the zoom in range, and the screen inside the canvas: panning stops
  // when a screen edge reaches the canvas edge (plus a small margin), so the
  // far corners land in the screen's corners. When the canvas is smaller
  // than the screen on an axis, it stays centred on that axis.
  const clamp = (c: { x: number; y: number; z: number }) => {
    const b = boundsRef.current;
    const v = viewRef.current;
    const z = Math.min(MAX_ZOOM, Math.max(minZoom(), c.z));
    const m = marginRef.current;
    const axis = (
      cam: number,
      min: number,
      max: number,
      half: number,
      pad: number,
    ) => {
      const lo = min - pad + half / z;
      const hi = max + pad - half / z;
      const centre =
        lo > hi ? (min + max) / 2 : Math.min(hi, Math.max(lo, -cam / z));
      return -centre * z;
    };
    return {
      z,
      x: axis(c.x, b.minX, b.maxX, v.w / 2, m.x),
      y: axis(c.y, b.minY, b.maxY, v.h / 2, m.y),
    };
  };

  const commit = () => {
    if (raf.current == null) {
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        setCam(camRef.current);
      });
    }
  };
  const moveBy = (dx: number, dy: number) => {
    const c = camRef.current;
    camRef.current = clamp({ ...c, x: c.x + dx, y: c.y + dy });
    commit();
  };
  // Zoom by `factor`, keeping the point under (fx, fy) on screen where it is.
  const zoomAt = (fx: number, fy: number, factor: number) => {
    const c = camRef.current;
    const z = Math.min(MAX_ZOOM, Math.max(minZoom(), c.z * factor));
    const r = boxRef.current?.getBoundingClientRect();
    const px = fx - (r?.left ?? 0) - viewRef.current.w / 2;
    const py = fy - (r?.top ?? 0) - viewRef.current.h / 2;
    const k = z / c.z;
    camRef.current = clamp({
      z,
      x: px - (px - c.x) * k,
      y: py - (py - c.y) * k,
    });
    commit();
  };

  useLayoutEffect(() => {
    const measure = () => {
      const el = boxRef.current;
      if (!el) return;
      const v = { w: el.clientWidth, h: el.clientHeight };
      viewRef.current = v;
      setView(v);
      camRef.current = clamp(camRef.current);
      setCam(camRef.current);
    };
    measure();
    // Measure again once the page has settled (mobile browsers can report the
    // size late on first load), and whenever the canvas changes size.
    const late = window.setTimeout(measure, 150);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (boxRef.current) ro.observe(boxRef.current);
    return () => {
      ro.disconnect();
      window.clearTimeout(late);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel and trackpad scroll pan the canvas instead of the page; a pinch zooms.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const k = e.deltaMode === 1 ? 32 : 1;
      // A trackpad pinch arrives as a wheel event with ctrlKey set.
      if (e.ctrlKey || e.metaKey) {
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * k * 0.01));
      } else {
        moveBy(-e.deltaX * k, -e.deltaY * k);
      }
    };
    // Safari reports trackpad pinches as gesture events instead.
    let gestureStart = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gestureStart = camRef.current.z;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const g = e as Event & {
        scale: number;
        clientX: number;
        clientY: number;
      };
      zoomAt(g.clientX, g.clientY, (gestureStart * g.scale) / camRef.current.z);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("gesturestart", onGestureStart);
    el.addEventListener("gesturechange", onGestureChange);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the fling going after a drag, slowing down until it stops.
  const fling = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const step = () => {
      const v = velocity.current;
      if (drag.current || (Math.abs(v.x) < 0.3 && Math.abs(v.y) < 0.3)) return;
      moveBy(v.x, v.y);
      velocity.current = { x: v.x * FRICTION, y: v.y * FRICTION };
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const pinchState = () => {
    const [a, b] = [...pointers.current.values()];
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (arrange) {
      const item = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-item]",
      );
      if (item) {
        moving.current = { id: item.dataset.item!, x: e.clientX, y: e.clientY };
        boxRef.current?.setPointerCapture(e.pointerId);
        suppressClick.current = true;
        return;
      }
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      // Second finger down: switch from dragging to pinching.
      pinch.current = pinchState();
      drag.current = null;
      suppressClick.current = true;
      return;
    }
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
      moved: 0,
    };
    velocity.current = { x: 0, y: 0 };
    suppressClick.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const m = moving.current;
    if (m) {
      const z = camRef.current.z;
      onArrange?.(m.id, (e.clientX - m.x) / z, (e.clientY - m.y) / z);
      m.x = e.clientX;
      m.y = e.clientY;
      return;
    }
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    if (pinch.current && pointers.current.size >= 2) {
      const now = pinchState();
      const before = pinch.current;
      moveBy(now.mid.x - before.mid.x, now.mid.y - before.mid.y);
      if (before.dist > 0) zoomAt(now.mid.x, now.mid.y, now.dist / before.dist);
      pinch.current = now;
      return;
    }
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.moved += Math.abs(dx) + Math.abs(dy);
    if (
      d.moved > DRAG_THRESHOLD &&
      !boxRef.current?.hasPointerCapture(e.pointerId)
    ) {
      boxRef.current?.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const dt = Math.max(1, now - d.t);
    velocity.current = { x: (dx / dt) * 16, y: (dy / dt) * 16 };
    d.x = e.clientX;
    d.y = e.clientY;
    d.t = now;
    moveBy(dx, dy);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (moving.current) {
      moving.current = null;
      onArrangeEnd?.();
      return;
    }
    pointers.current.delete(e.pointerId);
    if (pinch.current) {
      // Lifting a finger ends the pinch; don't treat the rest as a drag or tap.
      if (pointers.current.size < 2) pinch.current = null;
      drag.current = null;
      return;
    }
    const d = drag.current;
    drag.current = null;
    if (d && d.moved > DRAG_THRESHOLD) {
      suppressClick.current = true;
      fling();
    }
  };

  const z = cam.z;
  const originX = view.w / 2 + cam.x;
  const originY = view.h / 2 + cam.y;

  return (
    <div
      ref={boxRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(e) => {
        // A drag that ends on a card shouldn't open it.
        if (suppressClick.current) {
          e.preventDefault();
          e.stopPropagation();
          suppressClick.current = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      className="absolute inset-0 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
      style={{
        // Studded surface (raised round bumps, lit from the top left), drawn
        // as a vector tile so it stays crisp at any zoom and screen density.
        backgroundColor: STUD_BG,
        backgroundImage: STUD_TILE,
        backgroundSize: `${STUD_PITCH * z}px ${STUD_PITCH * z}px`,
        backgroundPosition: `${originX}px ${originY}px`,
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          left: originX + centerX * z,
          top: originY + centerY * z,
          transform: `translate(-50%, -50%) scale(${z})`,
        }}
      >
        <div
          data-item="center"
          className={`pointer-events-auto ${arrange ? ARRANGE_RING : ""}`}
        >
          {center}
        </div>
      </div>

      {SMILE.map(([cx, cy]) => {
        const size = STUD_PITCH * z;
        return (
          <div
            key={`${cx},${cy}`}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: originX + (SMILE_AT.x + cx * STUD_PITCH) * z - size / 2,
              top: originY + (SMILE_AT.y + cy * STUD_PITCH) * z - size / 2,
              width: size,
              height: size,
              backgroundImage: PINK_BRICK,
              backgroundSize: "100% 100%",
              filter: "drop-shadow(0.6px 1px 1px rgba(120,40,75,0.35))",
            }}
          />
        );
      })}

      {cards.map((card) => {
        const w = card.w * z;
        const h = card.h * z;
        return (
          <Link
            key={card.href}
            to={card.href}
            draggable={false}
            data-item={card.title}
            className={`group absolute block ${arrange ? ARRANGE_RING : "transition-transform duration-200 hover:scale-[1.02]"}`}
            style={{
              left: originX + card.x * z - w / 2,
              top: originY + card.y * z - h / 2,
              width: w,
              height: h,
            }}
            aria-label={`${card.title} — ${card.label}`}
          >
            {/* Just the app window, with a soft shadow; no frame or backdrop. */}
            <img
              src={card.image}
              alt=""
              draggable={false}
              className="block h-full w-full object-cover shadow-[0_2px_6px_rgba(60,50,40,0.06),0_18px_44px_rgba(60,50,40,0.14)]"
              style={{ borderRadius: card.radius * z }}
            />
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[var(--site-accent)] px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              {card.title} · {card.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
