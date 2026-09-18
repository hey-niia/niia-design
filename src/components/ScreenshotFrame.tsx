/**
 * Shared chrome for every screenshot on a case study, so the scroll windows,
 * the annotated image and the plain images all agree on corner radius and on
 * what "there's more below" looks like.
 */

import { CANVAS_HINT_PILL } from "./nadiia";

/** One radius for every screenshot frame. Mixing them reads as a mistake. */
export const FRAME_RADIUS = "rounded-2xl";

/**
 * Sits over the bottom edge of a scrolling frame. A pill rather than bare
 * text — this is the only affordance telling someone the screenshot moves, so
 * it has to survive being laid over a dark screenshot.
 */
export function ScrollHint({ show }: { show: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pt-14 pb-3 transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
      }}
    >
      <span className={`${CANVAS_HINT_PILL} shadow-sm`}>Scroll to see more ↓</span>
    </div>
  );
}
