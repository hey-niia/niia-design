import type { ReactNode } from "react";
import { NADIIA_TAG } from "./nadiia";

/** Small pieces every Nadiia diagram shares, so tags and arrows match everywhere. See `nadiia.ts`. */

export function Tag({
  tone = "white",
  className = "",
  children,
}: {
  tone?: keyof typeof NADIIA_TAG;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={`inline-block rounded-md px-2 py-1 font-mono text-[10px] tracking-widest uppercase ring-1 ${NADIIA_TAG[tone]} ${className}`}
    >
      {children}
    </p>
  );
}

/** A hairline with a small arrowhead. `length` in px; a right arrow fills its container by default. */
export function Arrow({
  direction,
  length,
  className = "",
}: {
  direction: "down" | "right";
  length?: number;
  className?: string;
}) {
  if (direction === "down") {
    return (
      <div
        aria-hidden
        className={`relative mx-auto w-px shrink-0 bg-[var(--nd-line,#d4d4d4)] ${className}`}
        style={{ height: length ?? 28 }}
      >
        <span className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[3.5px] border-t-[5px] border-x-transparent border-t-[var(--nd-line-head,#a3a3a3)]" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`relative h-px bg-[var(--nd-line,#d4d4d4)] ${className}`}
      style={{ width: length ?? "100%" }}
    >
      <span className="absolute top-1/2 right-0 h-0 w-0 -translate-y-1/2 border-y-[3.5px] border-l-[5px] border-y-transparent border-l-[var(--nd-line-head,#a3a3a3)]" />
    </div>
  );
}
