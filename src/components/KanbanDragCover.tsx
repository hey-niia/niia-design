import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import HandCursor from "./HandCursor";

/**
 * Home-page cover for ConnectIQ: the partner jobs board, with a hand cursor
 * dragging a job from "To do" into "Unassigned", pausing, then dragging it back.
 * Built from the Figma "animation" section (dashboard C, 40000033:23582): its
 * before, dragging and after frames give every position, slot and drag style.
 * The board is separate layers rather than a video, so the card really
 * travels, slots open and close, and the column counts change.
 *
 * Positions are Figma's, in its 1440×1024 frame; the stage is scaled to fit.
 * It plays while on screen; reduced motion shows the board, still.
 */

const ASSET = "/projects/connectiq/home/";
const W = 1440;
const H = 1024;

const EASE = "cubic-bezier(0.45, 0, 0.2, 1)";
const DRAG_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const SETTLE_EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

const COLUMN_BG = "#f6f7f3";
const SLOT_BG = "rgba(110, 113, 101, 0.05)";
const CARD = { w: 340, h: 122 };
const SLOT_H = 129;
/** Where the moving job sits in each column. */
const SPOT = {
  todo: { x: 632, y: 371 }, // third in "To do"
  unassigned: { x: 256, y: 241 }, // under Robinson in "Unassigned"
};
/** The drag state from the Figma frame: an orange outline and a deep shadow, no tilt. */
const DRAG_SHADOW = "0 17px 27px rgba(0, 0, 0, 0.21)";
const CARD_SHADOW = "0 1px 1px rgba(0, 0, 0, 0.04)";
const LIFT = { x: -4, y: -8 };
/** Where the fingertip holds the card, in the card's own px (on the title, clear of the avatar). */
const GRAB = { x: 214, y: 34 };
const HAND_REST = { x: 780, y: 820 };
const HAND_AWAY = { todo: { x: 900, y: 640 }, unassigned: { x: 540, y: 520 } };
/** Real cursor size on this screen, a touch larger so it reads in a small cover. */
const CURSOR_SCALE = 1.6;

type Where = keyof typeof SPOT;
type Phase = "rest" | "reach" | "press" | "lift" | "drag" | "open" | "drop" | "away" | "pause";
/** [phase, ms, where the card is heading]. The first "rest" plays once; the rest loops. */
const TIMELINE: [Phase, number, Where][] = [
  ["rest", 800, "unassigned"],
  ["reach", 760, "unassigned"],
  ["press", 150, "unassigned"],
  ["lift", 230, "unassigned"],
  ["drag", 480, "unassigned"], // on its way…
  ["open", 600, "unassigned"], // …and a slot opens for it while it is still moving
  ["drop", 340, "unassigned"],
  ["away", 700, "unassigned"],
  ["pause", 1500, "unassigned"],
  ["reach", 760, "todo"],
  ["press", 150, "todo"],
  ["lift", 230, "todo"],
  ["drag", 480, "todo"],
  ["open", 600, "todo"],
  ["drop", 340, "todo"],
  ["away", 700, "todo"],
  ["pause", 1500, "todo"],
];

export default function KanbanDragCover({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [i, setI] = useState(0);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const fit = () => setScale(board.getBoundingClientRect().width / W || 0.4);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setI((n) => (n + 1 === TIMELINE.length ? 1 : n + 1)), TIMELINE[i][1]);
    return () => window.clearTimeout(t);
  }, [running, i]);

  const [phase, , target] = TIMELINE[i];
  const source: Where = target === "unassigned" ? "todo" : "unassigned";
  const landed = phase === "drop" || phase === "away" || phase === "pause";
  const held = phase === "press" || phase === "lift" || phase === "drag" || phase === "open";
  const lifted = phase === "lift" || phase === "drag" || phase === "open";
  const home: Where = phase === "rest" ? "todo" : landed ? target : source;

  // Slots: the gap left behind while the card is held, and the one that opens for it.
  const slotOpen = { [source]: lifted, [target]: phase === "open" } as Record<Where, boolean>;
  const layout = {
    unassignedH: slotOpen.unassigned ? 314 : home === "unassigned" ? 307 : 177,
    todoH: slotOpen.todo ? 574 : home === "todo" ? 567 : 437,
    mallY: slotOpen.todo ? 508 : home === "todo" ? 501 : 371,
  };
  const counts = { unassigned: home === "unassigned" ? 2 : 1, todo: home === "todo" ? 4 : 3 };
  const layoutMove = `all 320ms ${EASE}`;

  const spot = (w: Where, lift = false) => ({ x: SPOT[w].x + (lift ? LIFT.x : 0), y: SPOT[w].y + (lift ? LIFT.y : 0) });
  const cardAt =
    phase === "rest" || phase === "reach" || phase === "press"
      ? spot(home)
      : phase === "lift"
        ? spot(source, true)
        : phase === "drag" || phase === "open"
          ? spot(target, true)
          : spot(target);
  const cardMove =
    phase === "lift"
      ? "transform 220ms ease-out, box-shadow 220ms ease-out"
      : phase === "drag" || phase === "open"
        ? `transform 1080ms ${DRAG_EASE}, box-shadow 220ms ease-out`
        : `transform 280ms ${SETTLE_EASE}, box-shadow 280ms ease-out`;

  const hand =
    phase === "rest"
      ? HAND_REST
      : phase === "away" || phase === "pause"
        ? HAND_AWAY[target]
        : { x: cardAt.x + GRAB.x, y: cardAt.y + GRAB.y };
  const handMove =
    phase === "reach"
      ? `transform 720ms ${EASE}`
      : phase === "lift"
        ? "transform 220ms ease-out"
        : phase === "drag" || phase === "open"
          ? `transform 1080ms ${DRAG_EASE}`
          : phase === "drop"
            ? `transform 280ms ${SETTLE_EASE}`
            : `transform 700ms ease-out`;

  const place = (x: number, y: number, w: number, h: number): CSSProperties => ({
    position: "absolute",
    left: x,
    top: y,
    width: w,
    height: h,
  });
  const column = (x: number, h: number, animate = false): CSSProperties => ({
    ...place(x, 68, 364, h),
    background: COLUMN_BG,
    borderRadius: 12,
    transition: animate ? layoutMove : undefined,
  });
  const slot = (w: Where): CSSProperties => ({
    ...place(SPOT[w].x, SPOT[w].y, CARD.w, SLOT_H),
    background: SLOT_BG,
    borderRadius: 12,
    opacity: slotOpen[w] ? 1 : 0,
    transition: "opacity 220ms ease",
  });
  const count = (x: number): CSSProperties => ({
    ...place(x, 80, 20, 15),
    font: '500 12px/15px "Geist", ui-sans-serif, system-ui, sans-serif',
    color: "#919191",
  });

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={label}
      className="relative w-full overflow-hidden bg-[#565656]"
      style={{ aspectRatio: "3360 / 2528" }}
    >
      <div
        ref={boardRef}
        className="absolute top-1/2 left-[7.2%] w-[85.6%] -translate-y-1/2 overflow-hidden rounded-[6px] shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
        // Height is set outright as well: iOS Safari sizes an absolute box by its content
        // (the 1024px stage) rather than aspect-ratio, which pushed the board out of view.
        style={{ aspectRatio: `${W} / ${H}`, height: H * scale }}
      >
        <div
          className="absolute top-0 left-0"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0", background: COLUMN_BG }}
        >
          {/* App chrome */}
          <img src={`${ASSET}sidebar.webp`} alt="" style={place(0, 0, 220, 1024)} />
          <div
            style={{
              ...place(220, 0, 1220, 1024),
              background: "#fff",
              border: `1px solid ${COLUMN_BG}`,
              boxShadow: "0 4px 25px rgba(0, 0, 0, 0.04)",
            }}
          />
          <img src={`${ASSET}header.webp`} alt="" style={place(220, 12, 1220, 44)} />

          {/* Columns */}
          <div style={column(244, layout.unassignedH, true)} />
          <div style={column(620, layout.todoH, true)} />
          <div style={column(996, 299)} />
          <div style={column(1372, 944)} />

          <img src={`${ASSET}colhead-unassigned.webp`} alt="" style={place(256, 80, 86, 15)} />
          <span style={count(344)}>{counts.unassigned}</span>
          <img src={`${ASSET}colhead-todo.webp`} alt="" style={place(632, 80, 51, 15)} />
          <span style={count(685)}>{counts.todo}</span>
          <img src={`${ASSET}colhead-inprogress.webp`} alt="" style={place(1008, 80, 99, 15)} />
          <img src={`${ASSET}colhead-done.webp`} alt="" style={place(1384, 81, 59, 15)} />

          <div style={slot("unassigned")} />
          <div style={slot("todo")} />

          {/* Cards that stay put, except The Mall, which makes way */}
          <img src={`${ASSET}card-robinson.webp`} alt="" style={place(256, 103, 340, 130)} />
          <img src={`${ASSET}card-mega-todo.webp`} alt="" style={place(632, 103, 340, 122)} />
          <img src={`${ASSET}card-central-plaza.webp`} alt="" style={place(632, 233, 340, 130)} />
          <img
            src={`${ASSET}card-mall.webp`}
            alt=""
            style={{ ...place(632, layout.mallY, 340, 122), transition: layoutMove }}
          />
          <img src={`${ASSET}card-mega-ip-1.webp`} alt="" style={place(1008, 103, 340, 122)} />
          <img src={`${ASSET}card-mega-ip-2.webp`} alt="" style={place(1008, 233, 340, 122)} />

          {/* The job being moved */}
          <div
            style={{
              ...place(0, 0, CARD.w, CARD.h),
              zIndex: 20,
              borderRadius: 12,
              transform: `translate(${cardAt.x}px, ${cardAt.y}px) scale(${lifted ? 1.02 : 1})`,
              boxShadow: lifted ? DRAG_SHADOW : CARD_SHADOW,
              transition: cardMove,
            }}
          >
            <img src={`${ASSET}card-kfc-robinson.webp`} alt="" className="block h-full w-full" />
            <div
              className="absolute inset-0 rounded-[12px]"
              style={{
                boxShadow: "inset 0 0 0 1px #ff6700",
                opacity: lifted ? 1 : 0,
                transition: "opacity 200ms ease",
              }}
            />
          </div>

          {!reduced && (
            <div
              className="absolute top-0 left-0 z-30"
              style={{ transform: `translate(${hand.x}px, ${hand.y}px)`, transition: handMove }}
            >
              <HandCursor scale={CURSOR_SCALE} pressed={held} pressMs={140} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
