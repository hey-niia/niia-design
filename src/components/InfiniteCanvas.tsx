import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Background texture: one stud per tile. A soft dark crescent under the
// bottom right edge, a faint light rim on the top left, the cap in the
// surface colour.
const STUD_BG = "#e2ddd8";
const STUD_PITCH = 22;
const STUD_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">` +
    `<defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0.45"/></filter></defs>` +
    `<circle cx="11.7" cy="12.1" r="7.2" fill="#2e2924" fill-opacity="0.55" filter="url(#b)"/>` +
    `<circle cx="10.6" cy="10.6" r="7.2" fill="#ffffff" fill-opacity="0.7" filter="url(#b)"/>` +
    `<circle cx="11" cy="11" r="7.2" fill="${STUD_BG}"/>` +
    `<circle cx="11" cy="11" r="7.05" fill="none" stroke="#000" stroke-opacity="0.07" stroke-width="0.3"/>` +
    `</svg>`,
)}")`;
import { Link } from "react-router-dom";

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
};

const DRAG_THRESHOLD = 6;
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
      minX: -centerW / 2,
      maxX: centerW / 2,
      minY: -centerH / 2,
      maxY: centerH / 2,
    },
  );
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  // Zoomed all the way out, every project fits on screen (never past 100%).
  const minZoom = () => {
    const v = viewRef.current;
    const b = boundsRef.current;
    return Math.min(
      1,
      v.w / (b.maxX - b.minX + FIT_MARGIN * 2),
      v.h / (b.maxY - b.minY + FIT_MARGIN * 2),
    );
  };

  // Where the world's centre sits relative to the screen's centre, and the zoom.
  // Phones start zoomed out a little so the title and a project or two show.
  const [cam, setCam] = useState(() => ({
    x: 0,
    y: 0,
    z: window.innerWidth < 640 ? 0.55 : 1,
  }));
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
  // Fingers currently on the canvas, for pinch-to-zoom.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; mid: { x: number; y: number } } | null>(
    null,
  );

  // Keep the zoom in range, and the middle of the screen over the projects.
  const clamp = (c: { x: number; y: number; z: number }) => {
    const b = boundsRef.current;
    const z = Math.min(MAX_ZOOM, Math.max(minZoom(), c.z));
    return {
      z,
      x: Math.min(-b.minX * z, Math.max(-b.maxX * z, c.x)),
      y: Math.min(-b.minY * z, Math.max(-b.maxY * z, c.y)),
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
          left: originX,
          top: originY,
          transform: `translate(-50%, -50%) scale(${z})`,
        }}
      >
        <div className="pointer-events-auto">{center}</div>
      </div>

      {cards.map((card) => {
        const w = card.w * z;
        const h = card.h * z;
        return (
          <Link
            key={card.href}
            to={card.href}
            draggable={false}
            className="group absolute block transition-transform duration-200 hover:scale-[1.02]"
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
