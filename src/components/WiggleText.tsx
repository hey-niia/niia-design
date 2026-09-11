import type { CSSProperties } from "react";

/**
 * Splits text into per-letter spans so a parent `a:hover` can bend the word
 * into a gentle upward arc (see .wiggle-letter in index.css) instead of just
 * rotating the whole link as one rigid block.
 */
export default function WiggleText({ children }: { children: string }) {
  const chars = children.split("");
  const mid = (chars.length - 1) / 2;
  const maxDist = mid || 1;

  return (
    <>
      {chars.map((char, i) => {
        if (char === " ") return " ";
        const dist = Math.abs(i - mid);
        const lift = -7 * (1 - dist / maxDist);
        const rotate = ((mid - i) / maxDist) * 6;
        const style = {
          "--lift": `${lift.toFixed(2)}px`,
          "--rotate": `${rotate.toFixed(2)}deg`,
          "--delay": `${(dist / maxDist) * 60}ms`,
        } as CSSProperties;
        return (
          <span className="wiggle-letter" style={style} key={i}>
            {char}
          </span>
        );
      })}
    </>
  );
}
