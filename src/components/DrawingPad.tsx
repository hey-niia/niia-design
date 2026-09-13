import { useRef, useState, useEffect } from "react";

type Point = { x: number; y: number };

const STROKE_COLOR = "#000000";
const BACKGROUND_COLOR = "#f07c57";
// Matches the ink used on floraghnassia.com's "Now your turn" drawing pad —
// a constant-width trail that tapers to a point over its last 100px, so the
// tip you're actively drawing stays thin while everything behind it settles
// to full weight. Both are in CSS px; scaled by devicePixelRatio at draw time.
const MAX_STROKE_WIDTH = 10;
const TAPER_LENGTH = 100;

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
}

export default function DrawingPad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const currentStrokeRef = useRef<Point[] | null>(null);
  const dprRef = useRef(1);
  const [hasStarted, setHasStarted] = useState(false);

  const toPixels = (stroke: Point[], canvas: HTMLCanvasElement) =>
    stroke.map((p) => ({ x: p.x * canvas.width, y: p.y * canvas.height }));

  const redrawAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const maxWidth = MAX_STROKE_WIDTH * dprRef.current;
    const taperLength = TAPER_LENGTH * dprRef.current;

    for (const stroke of strokesRef.current) {
      renderTaperedStroke(ctx, toPixels(stroke, canvas), maxWidth, taperLength);
    }
    if (currentStrokeRef.current) {
      renderTaperedStroke(ctx, toPixels(currentStrokeRef.current, canvas), maxWidth, taperLength);
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
    currentStrokeRef.current = [pointFromEvent(e)];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStrokeRef.current) return;
    currentStrokeRef.current.push(pointFromEvent(e));
    redrawAll();
  };

  const handlePointerUp = () => {
    if (currentStrokeRef.current && currentStrokeRef.current.length > 1) {
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
    <section id="draw" className="-mx-4 -mb-24 mt-20 bg-[#f07c57] px-4 py-16 md:mt-32 md:py-24">
      {hasStarted && (
        <div className="mb-2 flex justify-end gap-x-6">
          <button
            type="button"
            onClick={handleClear}
            className="font-mono text-xs tracking-widest text-black/60 uppercase transition-colors duration-150 hover:text-black"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="font-mono text-xs tracking-widest text-black/60 uppercase transition-colors duration-150 hover:text-black"
          >
            Download
          </button>
        </div>
      )}

      <div ref={containerRef} className="relative h-[420px] w-full md:h-[560px]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="h-full w-full touch-none"
        />

        {!hasStarted && (
          <button
            type="button"
            onClick={() => setHasStarted(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono text-xs tracking-widest text-black/70 uppercase"
          >
            <span>I love to draw and have been doing it all my life.</span>
            <span>I love to inspire other people.</span>
            <span>Click to start drawing.</span>
          </button>
        )}
      </div>
    </section>
  );
}
