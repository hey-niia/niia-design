import { useRef, useState, useEffect } from "react";

type Point = { x: number; y: number };

type Brush = {
  id: string;
  label: string;
  width: number;
  opacity: number;
  dotSize: number;
  erase?: boolean;
};

type Stroke = {
  points: Point[];
  width: number;
  opacity: number;
  erase?: boolean;
};

type SendState = "closed" | "open" | "sending" | "sent" | "error";

const PAINT_COLOR = "#000000";
const BACKGROUND_COLOR = "#f07c57";
// Paint is rendered on a coarse pixel grid, like an old game screen: each
// "pixel" is PIXEL_SIZE CSS px, with a PIXEL_GAP-px gap between pixels where
// the background shows through. The bare canvas stays one flat colour.
const PIXEL_SIZE = 5;
const PIXEL_GAP = 1;
const MAX_WORDS_LENGTH = 80;

// Where finished drawings get POSTed as multipart form data
// (fields: `message`, `image`). Set VITE_DRAWING_ENDPOINT to a form service
// that accepts file uploads. Without it the send flow runs in preview mode.
const DRAWING_ENDPOINT = import.meta.env.VITE_DRAWING_ENDPOINT as string | undefined;

// Widths are in CSS px. Strokes keep their full width end to end (no taper).
const BRUSHES: Brush[] = [
  { id: "fine", label: "Fine", width: 5, opacity: 1, dotSize: 8 },
  { id: "pen", label: "Pen", width: 12, opacity: 1, dotSize: 12 },
  { id: "marker", label: "Marker", width: 20, opacity: 1, dotSize: 16 },
  { id: "brush", label: "Brush", width: 30, opacity: 1, dotSize: 20 },
  { id: "highlighter", label: "Highlighter", width: 38, opacity: 0.4, dotSize: 24 },
  { id: "eraser", label: "Eraser", width: 34, opacity: 1, dotSize: 20, erase: true },
];

// 4x4 ordered-dither (Bayer) thresholds: partial coverage — the highlighter,
// soft stroke edges — turns into a checkerboard of whole pixels, the way old
// games faked transparency, instead of grey.
const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function renderStroke(ctx: CanvasRenderingContext2D, points: Point[], width: number, opacity: number) {
  if (points.length === 0) return;
  ctx.strokeStyle = PAINT_COLOR;
  ctx.fillStyle = PAINT_COLOR;
  ctx.globalAlpha = opacity;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, width / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // One path per stroke so overlapping segments don't build up opacity.
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// Snap every low-res pixel to fully painted or fully empty.
function ditherToPixels(ctx: CanvasRenderingContext2D, w: number, h: number) {
  if (w === 0 || h === 0) return;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const coverage = d[i + 3] / 255;
      d[i + 3] = coverage > BAYER_4[(y % 4) * 4 + (x % 4)] ? 255 : 0;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function makeGapTile(cellPx: number, gapPx: number) {
  const tile = document.createElement("canvas");
  tile.width = cellPx;
  tile.height = cellPx;
  const tctx = tile.getContext("2d");
  if (tctx) {
    tctx.fillStyle = "#fff";
    tctx.fillRect(cellPx - gapPx, 0, gapPx, cellPx);
    tctx.fillRect(0, cellPx - gapPx, cellPx, gapPx);
  }
  return tile;
}

export default function DrawingPad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Low-res layer: one canvas pixel per on-screen "game pixel".
  const pixelLayerRef = useRef<HTMLCanvasElement | null>(null);
  // Full-res layer the pixels are scaled up into before the gaps are cut.
  const paintLayerRef = useRef<HTMLCanvasElement | null>(null);
  const gapTileRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const dprRef = useRef(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [brush, setBrush] = useState<Brush>(BRUSHES[1]);
  const brushRef = useRef(brush);
  brushRef.current = brush;

  const [sendState, setSendState] = useState<SendState>("closed");
  const [words, setWords] = useState("");
  // Hidden from people, filled in by spam bots — the mailbox drops those.
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const redrawAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const pixels = pixelLayerRef.current;
    const lctx = pixels?.getContext("2d", { willReadFrequently: true });
    const paint = paintLayerRef.current;
    const pctx = paint?.getContext("2d");
    if (!canvas || !ctx || !pixels || !lctx || !paint || !pctx) return;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Paint every stroke at "game" resolution and snap it to whole pixels.
    lctx.clearRect(0, 0, pixels.width, pixels.height);
    const cssWidth = canvas.width / dprRef.current;
    const cssHeight = canvas.height / dprRef.current;
    const all = currentStrokeRef.current
      ? [...strokesRef.current, currentStrokeRef.current]
      : strokesRef.current;
    for (const stroke of all) {
      const pts = stroke.points.map((p) => ({
        x: (p.x * cssWidth) / PIXEL_SIZE,
        y: (p.y * cssHeight) / PIXEL_SIZE,
      }));
      // The eraser is just a stroke that removes paint instead of adding it.
      lctx.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
      renderStroke(lctx, pts, Math.max(1, stroke.width / PIXEL_SIZE), stroke.opacity);
      lctx.globalCompositeOperation = "source-over";
    }
    ditherToPixels(lctx, pixels.width, pixels.height);

    // 2. Blow the pixels up with no smoothing, then cut the grid gaps.
    const cellPx = PIXEL_SIZE * dprRef.current;
    pctx.globalCompositeOperation = "source-over";
    pctx.clearRect(0, 0, paint.width, paint.height);
    pctx.imageSmoothingEnabled = false;
    pctx.drawImage(pixels, 0, 0, pixels.width * cellPx, pixels.height * cellPx);
    const gaps = gapTileRef.current ? pctx.createPattern(gapTileRef.current, "repeat") : null;
    if (gaps) {
      pctx.globalCompositeOperation = "destination-out";
      pctx.fillStyle = gaps;
      pctx.fillRect(0, 0, paint.width, paint.height);
      pctx.globalCompositeOperation = "source-over";
    }

    ctx.drawImage(paint, 0, 0);
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

      gapTileRef.current = makeGapTile(PIXEL_SIZE * dpr, Math.max(1, Math.round(PIXEL_GAP * dpr)));
      if (!pixelLayerRef.current) pixelLayerRef.current = document.createElement("canvas");
      pixelLayerRef.current.width = Math.ceil(rect.width / PIXEL_SIZE);
      pixelLayerRef.current.height = Math.ceil(rect.height / PIXEL_SIZE);
      if (!paintLayerRef.current) paintLayerRef.current = document.createElement("canvas");
      paintLayerRef.current.width = canvas.width;
      paintLayerRef.current.height = canvas.height;
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
    if (sendState !== "closed") return;
    canvasRef.current?.setPointerCapture(e.pointerId);
    const activeBrush = brushRef.current;
    currentStrokeRef.current = {
      points: [pointFromEvent(e)],
      width: activeBrush.width,
      opacity: activeBrush.opacity,
      erase: activeBrush.erase,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStrokeRef.current) return;
    currentStrokeRef.current.points.push(pointFromEvent(e));
    redrawAll();
  };

  const handlePointerUp = () => {
    if (currentStrokeRef.current) {
      strokesRef.current.push(currentStrokeRef.current);
      setHasStrokes(true);
    }
    currentStrokeRef.current = null;
  };

  const handleClear = () => {
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setHasStrokes(false);
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

  const openSend = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setPreview(canvas.toDataURL("image/png"));
    setSendState("open");
  };

  const closeSend = () => {
    setSendState("closed");
    setPreview(null);
    if (sendState === "sent") {
      setWords("");
      handleClear();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSendState("sending");
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not export drawing");
      if (DRAWING_ENDPOINT) {
        const body = new FormData();
        body.append("message", words.trim());
        body.append("image", blob, "drawing.png");
        body.append("website", honeypotRef.current?.value ?? "");
        const res = await fetch(DRAWING_ENDPOINT, {
          method: "POST",
          body,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Send failed: ${res.status}`);
      } else {
        // Preview mode: no endpoint configured yet, so nothing leaves the page.
        await new Promise((r) => setTimeout(r, 700));
      }
      setSendState("sent");
    } catch {
      setSendState("error");
    }
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
          <div className="pointer-events-none absolute top-4 right-4 flex gap-x-[var(--pad-gap)] md:top-6 md:right-6">
            <button type="button" onClick={handleClear} className="soft-raised pointer-events-auto soft-pill">
              Clear
            </button>
            <button type="button" onClick={handleDownload} className="soft-raised pointer-events-auto soft-pill">
              Download
            </button>
          </div>
        )}

        {hasStarted && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-x-[calc(var(--pad-gap)*1.6)] whitespace-nowrap md:bottom-10">
            <div className="flex items-center gap-x-[var(--pad-gap)]">
              {BRUSHES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={b.label}
                  aria-pressed={brush.id === b.id}
                  onClick={() => setBrush(b)}
                  className="soft-raised pointer-events-auto flex h-[var(--pad-size)] w-[var(--pad-size)] items-center justify-center"
                >
                  {b.erase ? (
                    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinejoin="round">
                      <path d="M4 15.5 13.5 6l5 5-9.5 9.5H6.5L4 18z" />
                      <path d="m9 10.5 5 5" />
                      <path d="M10 20.5h10" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span
                      className="rounded-full bg-black"
                      style={{ width: b.dotSize, height: b.dotSize, opacity: b.opacity }}
                    />
                  )}
                </button>
              ))}
            </div>
            {(DRAWING_ENDPOINT || import.meta.env.DEV) && (
              <button
                type="button"
                onClick={openSend}
                disabled={!hasStrokes}
                className="soft-raised soft-pill pointer-events-auto disabled:pointer-events-none disabled:opacity-40"
              >
                ✉ Send<span className="hidden sm:inline"> to Niia</span>
              </button>
            )}
          </div>
        )}

        {sendState !== "closed" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f07c57]/60 p-4 backdrop-blur-[2px]">
            <form
              onSubmit={handleSend}
              className="soft-raised flex w-full max-w-sm flex-col gap-4 rounded-[28px] p-5"
              aria-label="Send your drawing"
            >
              {sendState === "sent" ? (
                <>
                  <p className="font-mono text-xs tracking-widest text-black/70 uppercase">Sent — thank you ✦</p>
                  <p className="text-sm text-black/70">
                    {DRAWING_ENDPOINT
                      ? "It's on its way to me. I read every one."
                      : "Preview mode: nothing was sent, because no endpoint is set up yet."}
                  </p>
                  <button type="button" onClick={closeSend} className="soft-raised soft-pill self-start">
                    Draw another
                  </button>
                </>
              ) : (
                <>
                  {preview && (
                    <img
                      src={preview}
                      alt="Your drawing"
                      className="soft-inset aspect-[4/3] w-full rounded-2xl object-cover"
                    />
                  )}
                  <input
                    ref={honeypotRef}
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-xs tracking-widest text-black/60 uppercase">
                      A couple of words
                    </span>
                    <input
                      autoFocus
                      value={words}
                      onChange={(e) => setWords(e.target.value)}
                      maxLength={MAX_WORDS_LENGTH}
                      placeholder="hi niia, this is a cat"
                      className="soft-inset rounded-full px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none"
                    />
                  </label>
                  {sendState === "error" && (
                    <p className="text-sm text-black/80">That didn't go through. Try again in a moment?</p>
                  )}
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={closeSend} className="soft-raised soft-pill">
                      Cancel
                    </button>
                    <button type="submit" disabled={sendState === "sending"} className="soft-raised soft-pill">
                      {sendState === "sending" ? "Sending…" : "Send"}
                    </button>
                  </div>
                </>
              )}
            </form>
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
