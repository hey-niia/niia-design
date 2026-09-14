import { useEffect, useRef, useState } from "react";

// Mirrors the corner poses from the 08 desktop app (experiments/08/src/renderer/popup/renderer.ts).
const CORNER_POSES = ["sitting", "sleeping", "stretching", "playing"] as const;
type CornerPose = (typeof CORNER_POSES)[number];
type Pose = "walk" | CornerPose;

const WALK_FRAME_COUNT = 4;
const WALK_SPEED_PX_PER_S = 46;
const FRAME_INTERVAL_MS = 140;
const ARRIVE_THRESHOLD_PX = 6;

const HALO_FILTER =
  "drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff) drop-shadow(0 2px 4px rgba(0,0,0,0.2))";
// 08's sprites are pure black-and-white — CSS filters can't add hue to pure
// black/white directly (linear color matrices map 0 to 0), so this inverts
// first, then uses sepia to inject a sliver of warmth that saturate/hue-rotate
// can amplify into a solid gold coat for the second, non-08 cat.
const GOLD_FILTER = "invert(75%) sepia(100%) saturate(1000%) hue-rotate(10deg)";

function randomPose(): CornerPose {
  return CORNER_POSES[Math.floor(Math.random() * CORNER_POSES.length)];
}

function randomPoint(width: number, height: number, size: number, minY: number) {
  const margin = size / 2;
  const clampedMinY = Math.min(minY + margin, height - margin - 1);
  const maxY = Math.max(clampedMinY + 1, height - margin);
  return {
    x: margin + Math.random() * Math.max(1, width - size),
    y: clampedMinY + Math.random() * (maxY - clampedMinY),
  };
}

export default function WanderingCat({
  boundsRef,
  size = 88,
  startDelayMs = 0,
  minY = 0,
  coat = "black",
}: {
  boundsRef: React.RefObject<HTMLElement | null>;
  size?: number;
  startDelayMs?: number;
  /** Keep the cat below this many pixels from the top of the stage, so she doesn't wander over copy pinned there. */
  minY?: number;
  coat?: "black" | "gold";
}) {
  const wrapperRef = useRef<HTMLButtonElement>(null);
  const [pose, setPose] = useState<Pose>("sitting");
  const [walkFrame, setWalkFrame] = useState(0);
  const [mirrored, setMirrored] = useState(false);
  const [ready, setReady] = useState(false);

  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const modeRef = useRef<"walk" | "rest">("rest");
  const restUntilRef = useRef(0);
  const playUntilRef = useRef(0);
  const minYRef = useRef(minY);

  useEffect(() => {
    minYRef.current = minY;
  }, [minY]);

  useEffect(() => {
    const bounds = boundsRef.current;
    if (!bounds) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rect = bounds.getBoundingClientRect();
    const start = randomPoint(rect.width, rect.height, size, minYRef.current);
    posRef.current = start;
    targetRef.current = start;
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translate(${start.x - size / 2}px, ${start.y - size / 2}px)`;
    }
    setReady(true);

    if (reducedMotion) {
      setPose(randomPose());
      return;
    }

    let raf = 0;
    let lastTime = performance.now();
    let frameTimer = 0;
    let startTimer: ReturnType<typeof setTimeout> | null = null;

    const pickNewTarget = () => {
      const r = bounds.getBoundingClientRect();
      targetRef.current = randomPoint(r.width, r.height, size, minYRef.current);
      modeRef.current = "walk";
    };

    const beginRest = () => {
      modeRef.current = "rest";
      setPose(randomPose());
      restUntilRef.current = performance.now() + 2200 + Math.random() * 2800;
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - lastTime);
      lastTime = now;

      if (now < playUntilRef.current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (modeRef.current === "rest") {
        if (now >= restUntilRef.current) pickNewTarget();
        raf = requestAnimationFrame(tick);
        return;
      }

      const pos = posRef.current;
      const target = targetRef.current;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= ARRIVE_THRESHOLD_PX) {
        beginRest();
        raf = requestAnimationFrame(tick);
        return;
      }

      const step = (WALK_SPEED_PX_PER_S * dt) / 1000;
      const nx = pos.x + (dx / dist) * step;
      const ny = pos.y + (dy / dist) * step;
      posRef.current = { x: nx, y: ny };
      setMirrored(dx < 0);

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${nx - size / 2}px, ${ny - size / 2}px)`;
      }

      frameTimer += dt;
      if (frameTimer >= FRAME_INTERVAL_MS) {
        frameTimer = 0;
        setWalkFrame((f) => (f + 1) % WALK_FRAME_COUNT);
        setPose("walk");
      }

      raf = requestAnimationFrame(tick);
    };

    startTimer = setTimeout(() => {
      lastTime = performance.now();
      pickNewTarget();
      raf = requestAnimationFrame(tick);
    }, startDelayMs);

    return () => {
      if (startTimer) clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, startDelayMs]);

  const handlePlay = () => {
    setPose("playing");
    playUntilRef.current = performance.now() + 1300;
  };

  const src = pose === "walk" ? `/cats/08/walk/frame_${walkFrame}.png` : `/cats/08/${pose}.png`;

  return (
    <button
      ref={wrapperRef}
      type="button"
      onClick={handlePlay}
      aria-label={coat === "gold" ? "A friend cat — click to play" : "08 the cat — click to play with her"}
      className="absolute top-0 left-0 cursor-pointer touch-manipulation"
      style={{
        width: size,
        height: size,
        opacity: ready ? 1 : 0,
        transition: "opacity 300ms ease",
        willChange: "transform",
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none h-full w-full object-contain"
        style={{
          imageRendering: "pixelated",
          transform: mirrored ? "scaleX(-1)" : "scaleX(1)",
          filter: coat === "gold" ? `${GOLD_FILTER} ${HALO_FILTER}` : HALO_FILTER,
        }}
      />
    </button>
  );
}
