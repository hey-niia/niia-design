import { useRef, useState, useEffect } from "react";

type Point = { x: number; y: number };

type Brush = {
  id: string;
  label: string;
  maxWidth: number;
  taperLength: number;
  opacity: number;
  dotSize: number;
};

type Stroke = {
  points: Point[];
  maxWidth: number;
  taperLength: number;
  opacity: number;
};

const STROKE_COLOR = "#000000";
const BACKGROUND_COLOR = "#f07c57";
// Widths/taper lengths are in CSS px; scaled by devicePixelRatio at draw time.
// The "Pen" preset matches the ink used on floraghnassia.com's "Now your
// turn" drawing pad — a constant-width trail that tapers to a point over its
// last 100px, so the tip you're actively drawing stays thin while everything
// behind it settles to full weight.
const BRUSHES: Brush[] = [
  { id: "fine", label: "Fine", maxWidth: 3, taperLength: 20, opacity: 1, dotSize: 8 },
  { id: "pen", label: "Pen", maxWidth: 10, taperLength: 100, opacity: 1, dotSize: 12 },
  { id: "marker", label: "Marker", maxWidth: 18, taperLength: 40, opacity: 1, dotSize: 16 },
  { id: "brush", label: "Brush", maxWidth: 26, taperLength: 180, opacity: 1, dotSize: 20 },
  { id: "highlighter", label: "Highlighter", maxWidth: 34, taperLength: 0, opacity: 0.35, dotSize: 24 },
];

function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function widthAtDistanceFromTip(distFromTip: number, taperWindow: number, maxWidth: number) {
  if (taperWindow <= 0 || distFromTip >= taperWindow) return maxWidth;
  const g = 1 - distFromTip / taperWindow;
  return maxWidth * (1 - Math.pow(g, 1.5));
}

// Renders one stroke's points (already in device-pixel canvas coordinates)
// with the tapered tip. Re-running this from scratch on every redraw (rather
// than caching pixels) keeps it resize-safe and gives a still-finished
// stroke the exact same pointed tip it ended with.
function renderTaperedStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  maxWidth: number,
  taperLength: number,
  opacity: number,
) {
  if (points.length < 2) return;

  const segmentLengths: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = distance(points[i], points[i + 1]);
    segmentLengths.push(len);
    total += len;
  }

  const taperWindow = Math.min(taperLength, total);
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = opacity;

  let travelled = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const segLen = segmentLengths[i];
    const distFromTipStart = total - travelled;
    const distFromTipEnd = total - (travelled + segLen);
    const widthStart = widthAtDistanceFromTip(distFromTipStart, taperWindow, maxWidth);
    const widthEnd = widthAtDistanceFromTip(Math.max(distFromTipEnd, 0), taperWindow, maxWidth);

    ctx.lineWidth = (widthStart + widthEnd) / 2;
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    ctx.lineTo(points[i + 1].x, points[i + 1].y);
    ctx.stroke();

    travelled += segLen;
  }

  ctx.globalAlpha = 1;
}

export default function DrawingPad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const dprRef = useRef(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [brush, setBrush] = useState<Brush>(BRUSHES[1]);
  const brushRef = useRef(brush);
  brushRef.current = brush;

  const toPixels = (points: Point[], canvas: HTMLCanvasElement) =>
    points.map((p) => ({ x: p.x * canvas.width, y: p.y * canvas.height }));

  const redrawAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dpr = dprRef.current;
    for (const stroke of strokesRef.current) {
      renderTaperedStroke(
        ctx,
        toPixels(stroke.points, canvas),
        stroke.maxWidth * dpr,
        stroke.taperLength * dpr,
        stroke.opacity,
      );
    }
    if (currentStrokeRef.current) {
      const stroke = currentStrokeRef.current;
      renderTaperedStroke(
        ctx,
        toPixels(stroke.points, canvas),
        stroke.maxWidth * dpr,
        stroke.taperLength * dpr,
        stroke.opacity,
      );
    }
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      redrawAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    canvasRef.current?.setPointerCapture(e.pointerId);
    const activeBrush = brushRef.current;
    currentStrokeRef.current = {
      points: [pointFromEvent(e)],
      maxWidth: activeBrush.maxWidth,
      taperLength: activeBrush.taperLength,
      opacity: activeBrush.opacity,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStrokeRef.current) return;
    currentStrokeRef.current.points.push(pointFromEvent(e));
    redrawAll();
  };

  const handlePointerUp = () => {
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      strokesRef.current.push(currentStrokeRef.current);
    }
    currentStrokeRef.current = null;
  };

  const handleClear = () => {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    redrawAll();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "drawing.png";
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <section id="draw" className="-mx-4 -mb-24 mt-20 bg-[#f07c57] md:mt-32">
      <div ref={containerRef} className="relative h-[550px] w-full select-none md:h-[750px]">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            e.preventDefault();
            handlePointerDown(e);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="h-full w-full touch-none select-none"
        />

        {hasStarted && (
          <div className="pointer-events-none absolute top-4 right-4 flex gap-x-6 md:top-6 md:right-6">
            <button
              type="button"
              onClick={handleClear}
              className="pointer-events-auto font-mono text-xs tracking-widest text-black/60 uppercase transition-colors duration-150 hover:text-black"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="pointer-events-auto font-mono text-xs tracking-widest text-black/60 uppercase transition-colors duration-150 hover:text-black"
            >
              Download
            </button>
          </div>
        )}

        {hasStarted && (
          <div className="pointer-events-none absolute bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-x-3 md:bottom-24 md:gap-x-4">
            {BRUSHES.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-label={b.label}
                aria-pressed={brush.id === b.id}
                onClick={() => setBrush(b)}
                className={`pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-10 md:w-10 ${
                  brush.id === b.id ? "bg-black/15" : "hover:bg-black/10"
                }`}
              >
                <span
                  className="rounded-full bg-black"
                  style={{ width: b.dotSize, height: b.dotSize, opacity: b.opacity }}
                />
              </button>
            ))}
          </div>
        )}

        {!hasStarted && (
          <button
            type="button"
            onClick={() => setHasStarted(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono text-xs tracking-widest text-black/70 uppercase"
          >
            <span>I love to draw and have been doing it all my life.</span>
            <span>My mission is to inspire other people.</span>
            <span>Click to start drawing.</span>
          </button>
        )}
      </div>
    </section>
  );
}
