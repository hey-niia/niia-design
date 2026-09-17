/**
 * The standard macOS pointing-hand cursor, for animated product walkthroughs.
 *
 * Place it inside a zero-size, absolutely positioned wrapper whose position is
 * the point being clicked or held: the fingertip (the cursor's hotspot) lands
 * exactly on that point, so moving the wrapper moves the hotspot. `scale` sizes
 * it against its native 24×30px, e.g. the ratio of a frame's width to the
 * 1440px screen it depicts, so the cursor stays real-size next to the UI.
 */

/** Native size of the cursor artwork, in px. */
const HAND_CURSOR_SIZE = { w: 24, h: 30 };
/** The hotspot: the tip of the index finger, in the artwork's own px. */
const HAND_CURSOR_TIP = { x: 8, y: 1.5 };

export default function HandCursor({
  scale = 1,
  pressed = false,
  pressMs = 160,
}: {
  scale?: number;
  /** Squeezes slightly toward the fingertip, as a press or a held drag. */
  pressed?: boolean;
  pressMs?: number;
}) {
  const tipX = HAND_CURSOR_TIP.x * scale;
  const tipY = HAND_CURSOR_TIP.y * scale;
  return (
    <svg
      aria-hidden
      width={HAND_CURSOR_SIZE.w * scale}
      height={HAND_CURSOR_SIZE.h * scale}
      viewBox="0 0 24 30"
      className="pointer-events-none absolute drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
      style={{
        left: -tipX,
        top: -tipY,
        transform: `scale(${pressed ? 0.9 : 1})`,
        transformOrigin: `${tipX}px ${tipY}px`,
        transition: `transform ${pressMs}ms ease-out`,
      }}
    >
      <path
        d="M8 1.5c-1 0-1.8.8-1.8 1.8v9.4l-1.4-1.2c-.8-.7-2-.6-2.7.2-.6.8-.5 1.9.2 2.6l4.5 4.6c1.1 1.1 2.6 1.8 4.2 1.8h3.3c3 0 5.4-2.4 5.4-5.4v-4.6c0-.9-.7-1.6-1.6-1.6-.4 0-.8.2-1.1.4v-.5c0-.9-.7-1.6-1.6-1.6-.5 0-.9.2-1.2.5-.2-.7-.9-1.3-1.6-1.3-.4 0-.8.2-1.1.4V3.3c0-1-.8-1.8-1.8-1.8z"
        fill="#fff"
        stroke="#000"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
