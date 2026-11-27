import { useEffect, useRef } from "react";

/**
 * Behind the Matter case study's first animation: the app's ten skill icons,
 * many times over, printed in dots. They sit straight (no tilt) at random
 * spots on a loose grid, clearest at the top and fading out towards the
 * bottom. Each one pops up on its own once the stage comes into view, then
 * every so often gives a small pop of its own (`.skill-dot` in index.css).
 *
 * The shapes are masks cut from final-training-cards.webp and thickened
 * (public/projects/ios-app/skills/mask-*.png); a fine dot grid shows through
 * them, so each icon reads as rows of dots.
 */
const COLS = 9;
const ROWS = 5;

/** Small seeded random, so the scatter is the same on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const ICONS = (() => {
  const rand = seeded(7);
  const out: { icon: number; x: number; y: number; size: number; delay: number; every: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      out.push({
        icon: 1 + Math.floor(rand() * 10),
        x: ((c + 0.2 + rand() * 0.6) / COLS) * 100,
        y: ((r + 0.2 + rand() * 0.6) / ROWS) * 100,
        size: 56 + Math.round(rand() * 40),
        // Pop-ins land one by one over the first ~1.8s, top rows first.
        delay: Math.round(r * 220 + rand() * 700),
        // Then each gives its own small pop every 6–14s.
        every: 6000 + Math.round(rand() * 8000),
      });
    }
  }
  return out;
})();

export default function SkillsBackdrop() {
  const layer = useRef<HTMLDivElement>(null);

  // Start the pop-ins when the stage is actually on screen.
  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-on");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={layer}
      aria-hidden
      className="skills-dots pointer-events-none absolute inset-0 hidden sm:block"
      // Clearest at the top, fading out into the page towards the bottom.
      style={{
        maskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.55) 45%, transparent 92%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.55) 45%, transparent 92%)",
      }}
    >
      {ICONS.map((it, i) => {
        const mask = `url(/projects/ios-app/skills/mask-${it.icon}.png)`;
        return (
          <div
            key={i}
            className="skill-dot absolute"
            style={
              {
                left: `${it.x}%`,
                top: `${it.y}%`,
                width: it.size,
                height: it.size,
                maskImage: mask,
                WebkitMaskImage: mask,
                "--d": `${it.delay}ms`,
                "--every": `${it.every}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
