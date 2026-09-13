import { useCallback, useRef, useState } from "react";

const ACCENT = "#e65f2e";
const KEY_STEP = 2;
const KEY_STEP_LARGE = 10;

/**
 * Drag-to-reveal comparison between two screenshots of the same surface.
 *
 * Left of the divider is `before`, right is `after`. The two images MUST share
 * an aspect ratio — `before` renders normally and sets the box height, `after`
 * is absolutely positioned on top and clipped, so a mismatch silently crops the
 * after state instead of erroring.
 */
export default function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  maxWidth,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Cap the rendered width, in px — phone screenshots need this or they tower. */
  maxWidth?: number;
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const { left, width } = frame.getBoundingClientRect();
    if (width === 0) return;
    const pct = ((clientX - left) / width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  // Pointer capture keeps the drag alive when the cursor leaves the frame,
  // so a fast swipe past the edge doesn't drop the handle mid-gesture. It also
  // suppresses the click-to-focus the handle would otherwise get, so focus has
  // to be moved by hand — without this, arrow keys do nothing after a drag.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // The mousedown that follows would otherwise blur the handle again, since
    // its ancestor isn't focusable — preventDefault keeps the focus we set.
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    handleRef.current?.focus();
    setDragging(true);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    let next: number | null = null;
    if (e.key === "ArrowLeft") next = position - step;
    else if (e.key === "ArrowRight") next = position + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    setPosition(Math.min(100, Math.max(0, next)));
  };

  return (
    <div className="mx-auto" style={maxWidth ? { maxWidth } : undefined}>
      {/* Labels sit outside the frame: these are dark app screenshots with their
          own status bars, so anything overlaid on the top edge both fights for
          contrast and reads as part of the UI being shown. */}
      <div className="mb-2 flex justify-between font-mono text-[10px] tracking-wider text-gray-400 uppercase">
        <span className={`transition-opacity ${position < 12 ? "opacity-30" : "opacity-100"}`}>
          {beforeLabel}
        </span>
        <span className={`transition-opacity ${position > 88 ? "opacity-30" : "opacity-100"}`}>
          {afterLabel}
        </span>
      </div>

      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative touch-none select-none overflow-hidden"
      >
        <img src={before} alt={beforeAlt} className="block w-full" draggable={false} />

        <img
          src={after}
          alt={afterAlt}
          draggable={false}
          className="absolute inset-0 block h-full w-full"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        />

        {/* The handle owns the slider semantics; the frame around it is just a
            bigger hit target for pointers. */}
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label={`Reveal ${afterLabel.toLowerCase()} — drag or use arrow keys`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% ${beforeLabel.toLowerCase()}`}
          onKeyDown={onKeyDown}
          className="group absolute inset-y-0 z-10 w-px cursor-ew-resize bg-white/80 focus:outline-none"
          style={{ left: `${position}%` }}
        >
          <div
            className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-transform group-focus-visible:ring-2 group-focus-visible:ring-[#e65f2e] group-focus-visible:ring-offset-2"
            style={{ transform: `translate(-50%, -50%) scale(${dragging ? 1.1 : 1})` }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6.5 4 3 8l3.5 4M9.5 4 13 8l-3.5 4"
                stroke={ACCENT}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
