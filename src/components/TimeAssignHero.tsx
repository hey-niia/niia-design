import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import HandCursor from "./HandCursor";

/**
 * Hero for the private ConnectIQ case study, built frame by frame from the
 * storyboard on the Figma kanban frame (dashboard C, 40000045:23236):
 *
 *   1. the board, on a dark ground;
 *   2. the camera moves in on "To do";
 *   3. Central Plaza's time is set (--- → 8:00) and the camera eases back a little;
 *   4. the camera pans right and the job is selected (orange outline);
 *   5. it moves to the top of "In progress", the camera following in close;
 *   6. back out to the whole board, the job now in "In progress".
 *
 * Then the job glides back to "To do" and the loop starts again from that same
 * state, so it never fades or jumps. Board positions are the Figma frame's.
 * Static cards are the home-page cover's layers; the moving job is its card
 * image with live time and type chips on top, so the time can change. It plays
 * while on screen; reduced motion shows the finished board, still.
 */

const ASSET = "/projects/connectiq/home/";
/** The board (x 24…1140 in Figma) with even margins, at the storyboard's 1.618 ratio. */
const W = 1164;
const H = 720;
const STAGE_BG = "#1c1c1c";

const CAMERA_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOVE_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const SETTLE_EASE = "cubic-bezier(0.2, 0.9, 0.25, 1)";
const CAMERA_MS = 700;
const MOVE_MS = 700;

// Design tokens from the Card component.
const COLUMN_BG = "#f6f7f3";
const STROKE = "#ebeee5";
const STROKE_STRONG = "#d9dccf";
const TEXT_2 = "#6e7165";
const ACCENT = "#ff6700";
const SHADOW_XS = "0 1px 0.5px rgba(0, 0, 0, 0.04)";
const DRAG_SHADOW = "0 18px 32px rgba(0, 0, 0, 0.4)";
const FONT = '"Geist", ui-sans-serif, system-ui, sans-serif';
const MONO = '"Geist Mono", ui-monospace, monospace';

/** Columns, in Figma's frame. */
const COL = { unassigned: 24, todo: 400, progress: 776 };
const TOP = 68;
const JOB = { w: 340, h: 130 };
const SPOT = {
  todo: { x: COL.todo + 12, y: 233 }, // second in "To do"
  progress: { x: COL.progress + 12, y: 103 }, // first in "In progress"
};
/** The time chip on the job card image (2× asset, in card px). */
const CHIP = { x: 77, y: 90 };
const GRAB = { x: 170, y: 40 };
const CURSOR_SCALE = 1.5;

const TIMES = ["7:00", "7:30", "8:00", "8:30", "9:00"];
const PICK = 2;
const ROW_H = 28;
const MENU_PAD = 4;

const PHASES = [
  ["overview", 700], // frame 1
  ["zoomIn", 700], // → frame 2
  ["toChip", 380],
  ["pressChip", 90],
  ["menu", 240],
  ["toItem", 320],
  ["hoverItem", 120],
  ["pressItem", 90],
  ["picked", 300],
  ["zoomOut", 650], // → frame 3
  ["pan", 650], // → frame 4
  ["select", 220],
  ["move", MOVE_MS + 80], // → frame 5
  ["drop", 260],
  ["away", 320],
  ["outro", 750], // → frame 6
  ["hold", 1100],
  // The job glides back to "To do" and its time clears, so the loop restarts
  // from the state it is already in: no fade, no jump.
  ["reset", 700],
] as const;
type Phase = (typeof PHASES)[number][0];
const at = (p: Phase) => PHASES.findIndex(([name]) => name === p);

/** Camera: a stage point to centre and a zoom, read off the storyboard frames. */
const CAMERA = {
  overview: { x: W / 2, y: H / 2, z: 1 }, // 1, 6
  todoClose: { x: 567, y: 226, z: 2.04 }, // 2
  todoMid: { x: 591, y: 270, z: 1.34 }, // 3
  pan: { x: 763, y: 264, z: 1.34 }, // 4
  progressClose: { x: 911, y: 199, z: 2.38 }, // 5
};
function cameraTransform({ x, y, z }: { x: number; y: number; z: number }) {
  const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
  const tx = clamp(W / 2 - x * z, W - W * z);
  const ty = clamp(H / 2 - y * z, H - H * z);
  return `translate(${tx}px, ${ty}px) scale(${z})`;
}

export default function TimeAssignHero({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [i, setI] = useState(0);
  const [chipBox, setChipBox] = useState({ w: 41, h: 24 });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fit = () => setScale(root.getBoundingClientRect().width / W || 0.5);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    const c = chipRef.current;
    if (c) setChipBox({ w: c.offsetWidth, h: c.offsetHeight });
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
    const t = window.setTimeout(() => setI((n) => (n + 1) % PHASES.length), PHASES[i][1]);
    return () => window.clearTimeout(t);
  }, [running, i]);

  // Dev only: ?heroPhase=pan freezes the animation on one phase, for tuning.
  const frozen = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("heroPhase") : null;
  const step = frozen && at(frozen as Phase) >= 0 ? at(frozen as Phase) : reduced ? at("hold") : i;
  const phase = PHASES[step][0];
  const from = (p: Phase) => step >= at(p);
  const between = (a: Phase, b: Phase) => step >= at(a) && step <= at(b);
  const restart = step === 0;
  const resetting = phase === "reset";

  const camera = reduced
    ? CAMERA.overview
    : between("zoomIn", "picked")
      ? CAMERA.todoClose
      : phase === "zoomOut"
        ? CAMERA.todoMid
        : between("pan", "select")
          ? CAMERA.pan
          : between("move", "away")
            ? CAMERA.progressClose
            : CAMERA.overview;

  const menuOpen = between("menu", "pressItem");
  const hovered = between("hoverItem", "pressItem");
  const timeSet = from("picked") && !resetting;
  const time = timeSet ? TIMES[PICK] : "---";
  const chipPressed = between("pressChip", "pressItem");

  const selected = from("select") && !resetting;
  const lifted = phase === "move";
  const moved = from("move") && !resetting;
  const held = ["pressChip", "pressItem", "select", "move"].includes(phase);

  const layout = {
    todoH: moved ? 299 : 437,
    mallY: moved ? 233 : 371,
    progressH: moved ? 437 : 299,
    ip1Y: moved ? 241 : 103,
    ip2Y: moved ? 371 : 233,
  };
  const layoutMove = restart ? "none" : `all ${resetting ? 600 : MOVE_MS}ms ${MOVE_EASE}`;

  const jobAt = moved ? SPOT.progress : SPOT.todo;
  const jobMove = restart
    ? "none"
    : lifted || resetting
      ? `transform ${resetting ? 600 : MOVE_MS}ms ${MOVE_EASE}, box-shadow 200ms ease-out`
      : `transform 260ms ${SETTLE_EASE}, box-shadow 260ms ease-out`;

  // Opens upward: below the chip it would run out of the zoomed-in view.
  const menuH = MENU_PAD * 2 + TIMES.length * ROW_H + 2;
  const menu = { x: CHIP.x, y: CHIP.y - 6 - menuH };
  const chipPoint = { x: SPOT.todo.x + CHIP.x + chipBox.w / 2, y: SPOT.todo.y + CHIP.y + chipBox.h / 2 };
  const itemPoint = {
    x: SPOT.todo.x + menu.x + 60,
    y: SPOT.todo.y + menu.y + MENU_PAD + PICK * ROW_H + ROW_H / 2,
  };
  const hand = between("toChip", "menu")
    ? chipPoint
    : between("toItem", "pressItem")
      ? itemPoint
      : between("picked", "zoomOut")
        ? { x: itemPoint.x + 60, y: itemPoint.y + 40 }
        : between("pan", "drop")
          ? { x: jobAt.x + GRAB.x, y: jobAt.y + GRAB.y }
          : from("away")
            ? { x: SPOT.progress.x + 240, y: SPOT.progress.y + 260 }
            : { x: chipPoint.x + 140, y: chipPoint.y + 160 };
  const handShown = between("toChip", "drop");
  const handMove = restart
    ? "none"
    : phase === "move"
      ? `transform ${MOVE_MS}ms ${MOVE_EASE}`
      : phase === "pan"
        ? `transform ${CAMERA_MS}ms ${CAMERA_EASE}`
        : `transform 340ms ${EASE}`;

  const place = (x: number, y: number, w: number, h: number): CSSProperties => ({
    position: "absolute",
    left: x,
    top: y,
    width: w,
    height: h,
  });
  const column = (x: number, h: number, animate = false): CSSProperties => ({
    ...place(x, TOP, 364, h),
    background: COLUMN_BG,
    borderRadius: 12,
    transition: animate ? layoutMove : undefined,
  });
  const count = (x: number): CSSProperties => ({
    ...place(x, 80, 20, 15),
    font: `500 12px/15px ${FONT}`,
    color: "#919191",
  });
  const tag: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 4,
    height: 24,
    padding: 4,
    background: "#fff",
    border: `1px solid ${STROKE}`,
    borderRadius: 4,
    boxShadow: SHADOW_XS,
    font: `400 12px/1 ${FONT}`,
    color: TEXT_2,
    whiteSpace: "nowrap",
    transition: "background-color 160ms ease, border-color 160ms ease, color 160ms ease",
  };

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={label}
      data-phase={phase}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${W} / ${H}`, height: H * scale, background: STAGE_BG }}
    >
      <div
        className="absolute top-0 left-0"
        style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0" }}
      >
        {/* Camera */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: W,
            height: H,
            transform: cameraTransform(camera),
            transformOrigin: "0 0",
            transition: restart ? "none" : `transform ${phase === "move" ? MOVE_MS : CAMERA_MS}ms ${CAMERA_EASE}`,
            willChange: "transform",
          }}
        >
          {/* Columns */}
          <div style={column(COL.unassigned, 161)} />
          <div style={column(COL.todo, layout.todoH, true)} />
          <div style={column(COL.progress, layout.progressH, true)} />

          <img src={`${ASSET}colhead-unassigned.webp`} alt="" style={place(COL.unassigned + 12, 80, 86, 15)} />
          <span style={count(COL.unassigned + 100)}>2</span>
          <img src={`${ASSET}colhead-todo.webp`} alt="" style={place(COL.todo + 12, 80, 51, 15)} />
          <span style={count(COL.todo + 65)}>3</span>
          <img src={`${ASSET}colhead-inprogress.webp`} alt="" style={place(COL.progress + 12, 80, 99, 15)} />

          {/* Unassigned: Robinson, from the Card component */}
          <div
            className="flex flex-col justify-between"
            style={{
              ...place(COL.unassigned + 12, 103, 340, 114),
              padding: 16,
              background: "#fff",
              border: `1px solid ${STROKE}`,
              borderRadius: 12,
              boxShadow: SHADOW_XS,
            }}
          >
            <div className="flex flex-col" style={{ gap: 2 }}>
              <p style={{ font: `700 15px/16px ${FONT}`, color: "#000", letterSpacing: "-0.01em" }}>
                THA - KFC - CRG - Robinson Samutprakarn
              </p>
              <p style={{ font: `500 12px/15px ${MONO}`, color: TEXT_2, letterSpacing: "0.24px" }}>JOB-0003937</p>
            </div>
            <div className="flex" style={{ gap: 4 }}>
              <div style={tag}>
                <img src={`${ASSET}icons/calendar.svg`} alt="" width={12} height={12} />
                Jul 18
              </div>
              <div style={tag}>
                <img src={`${ASSET}icons/clock.svg`} alt="" width={12} height={12} />
                ---
              </div>
              <div style={tag}>
                <img src={`${ASSET}icons/asterisk.svg`} alt="" width={12} height={12} />
                Un-installation
              </div>
            </div>
          </div>

          {/* To do: Mega Bangna stays, The Mall moves up once the job leaves */}
          <img src={`${ASSET}card-mega-todo.webp`} alt="" style={place(COL.todo + 12, 103, 340, 122)} />
          <img
            src={`${ASSET}card-mall.webp`}
            alt=""
            style={{ ...place(COL.todo + 12, layout.mallY, 340, 122), transition: layoutMove }}
          />

          {/* In progress: both cards make way for the job */}
          <img
            src={`${ASSET}card-mega-ip-1.webp`}
            alt=""
            style={{ ...place(COL.progress + 12, layout.ip1Y, 340, 122), transition: layoutMove }}
          />
          <img
            src={`${ASSET}card-mega-ip-2.webp`}
            alt=""
            style={{ ...place(COL.progress + 12, layout.ip2Y, 340, 122), transition: layoutMove }}
          />

          {/* The job: Central Plaza's card, with live chips over its time and type */}
          <div
            style={{
              ...place(0, 0, JOB.w, JOB.h),
              zIndex: 20,
              borderRadius: 12,
              transform: `translate(${jobAt.x}px, ${jobAt.y}px) scale(${lifted ? 1.02 : 1})`,
              boxShadow: lifted ? DRAG_SHADOW : "none",
              transition: jobMove,
            }}
          >
            <img src={`${ASSET}card-central-plaza.webp`} alt="" className="block h-full w-full" />
            {/* Covers the image's own "---" and "Installation" chips */}
            <div style={{ ...place(CHIP.x - 2, CHIP.y - 3, 136, 30), background: "#fff" }} />
            <div className="flex" style={{ position: "absolute", left: CHIP.x, top: CHIP.y, gap: 4 }}>
              <div
                ref={chipRef}
                style={{
                  ...tag,
                  color: timeSet ? "#000" : TEXT_2,
                  background: chipPressed ? COLUMN_BG : timeSet ? "#fbfbf9" : "#fff",
                  borderColor: chipPressed || timeSet ? STROKE_STRONG : STROKE,
                }}
              >
                <img src={`${ASSET}icons/clock.svg`} alt="" width={12} height={12} />
                {time}
              </div>
              <div style={tag}>
                <img src={`${ASSET}icons/asterisk.svg`} alt="" width={12} height={12} />
                Installation
              </div>
            </div>

            {/* Selected: the orange outline from frames 4–6 */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: 12,
                boxShadow: `inset 0 0 0 1.5px ${ACCENT}`,
                opacity: selected ? 1 : 0,
                transition: "opacity 160ms ease",
              }}
            />

            {/* Time-slot dropdown */}
            <div
              style={{
                position: "absolute",
                left: menu.x,
                top: menu.y,
                width: 120,
                padding: MENU_PAD,
                background: "#fff",
                border: `1px solid ${STROKE}`,
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.06)",
                transformOrigin: "bottom left",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0) scale(1)" : "translateY(4px) scale(0.97)",
                transition: `opacity 140ms ease, transform 180ms ${SETTLE_EASE}`,
                pointerEvents: "none",
              }}
            >
              {TIMES.map((t, n) => (
                <div
                  key={t}
                  className="flex items-center justify-between"
                  style={{
                    height: ROW_H,
                    padding: "0 8px",
                    borderRadius: 4,
                    font: `400 12px/1 ${FONT}`,
                    color: n === PICK && hovered ? "#000" : TEXT_2,
                    background: n === PICK && hovered ? COLUMN_BG : "transparent",
                    transition: "background-color 120ms ease, color 120ms ease",
                  }}
                >
                  {t}
                  {n === PICK && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{ opacity: phase === "pressItem" ? 1 : 0, transition: "opacity 120ms ease" }}
                    >
                      <path d="M2.5 6.2 5 8.5l4.5-5" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cursor: kept real-size while the camera zooms */}
          {!reduced && (
            <div
              className="absolute top-0 left-0 z-30"
              style={{ transform: `translate(${hand.x}px, ${hand.y}px)`, transition: handMove }}
            >
              <div
                style={{
                  transform: `scale(${1 / camera.z})`,
                  transformOrigin: "0 0",
                  opacity: handShown ? 1 : 0,
                  transition: restart
                    ? "none"
                    : `transform ${phase === "move" ? MOVE_MS : CAMERA_MS}ms ${CAMERA_EASE}, opacity 220ms ease`,
                }}
              >
                <HandCursor scale={CURSOR_SCALE} pressed={held} pressMs={90} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
