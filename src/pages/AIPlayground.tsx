import { useLayoutEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import InfiniteCanvas, { type CanvasCard } from "../components/InfiniteCanvas";
import { experiments } from "../data/experiments";
import playgroundLayout from "../data/playgroundLayout";

const LABEL: Record<string, string> = {
  MacOS: "macOS app",
  "WEB APP": "Web app",
  "BROWSER EXTENSION": "Chrome extension",
};

// Each project once, around the title: just its app window (cropped from the
// cover, without the dark backdrop), sized to the screenshot's shape, with the
// window's own corner radius. Positions live in data/playgroundLayout.ts.
const LAYOUT: Record<
  string,
  { image: string; w: number; h: number; radius: number }
> = {
  Skin: {
    image: "/experiments/skin-cover.webp",
    w: 600,
    h: 305,
    radius: 10,
  },
  "Taski 1.0": {
    image: "/experiments/canvas/taski-v1.jpg",
    w: 400,
    h: 361,
    radius: 8,
  },
  Taski: {
    image: "/experiments/canvas/taski.jpg",
    w: 480,
    h: 383,
    radius: 6,
  },
  Skim: {
    image: "/experiments/canvas/skim.jpg",
    w: 560,
    h: 380,
    radius: 14,
  },
};

type Positions = Record<string, { x: number; y: number }>;

const cardsAt = (pos: Positions): CanvasCard[] =>
  experiments.flatMap((e) => {
    const spot = LAYOUT[e.name];
    const at = pos[e.name];
    return spot && at && e.link
      ? [
          {
            ...spot,
            ...at,
            title: e.name,
            label: LABEL[e.platform] ?? e.platform,
            href: e.link,
          },
        ]
      : [];
  });

export default function AIPlayground() {
  // Dev only: "Arrange" lets you drag the blocks; each drop is saved into
  // data/playgroundLayout.ts by the dev server.
  // Phones keep their own arrangement (same breakpoint as the canvas's
  // starting zoom). Picked once on load.
  const [mode] = useState<"desktop" | "phone">(() =>
    window.innerWidth < 640 ? "phone" : "desktop",
  );
  const [all, setAll] = useState(playgroundLayout);
  const allRef = useRef(all);
  allRef.current = all;
  const pos: Positions = all[mode];
  const cards = cardsAt(pos);

  // Desktop: the pink smiley sits just past the bottom-left corner of the
  // blocks, on the stud grid, wherever they're arranged. Phones keep it
  // where it always was.
  const stud = (v: number) => Math.round((v - 11) / 22) * 22 + 11;
  const c = pos.center ?? { x: 0, y: 0 };
  const smileAt =
    mode === "desktop"
      ? {
          x: stud(Math.min(c.x - 180, ...cards.map((k) => k.x - k.w / 2)) + 88),
          y: stud(Math.max(c.y + 180, ...cards.map((k) => k.y + k.h / 2)) + 88),
        }
      : undefined;
  const [arrange, setArrange] = useState(false);

  // The canvas starts right under the header, so zooming out never tucks a
  // project behind it.
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerH, setHeaderH] = useState(64);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <main>
      <div ref={headerRef} className="relative z-10">
        <Nav />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-0" style={{ top: headerH }}>
        <InfiniteCanvas
          cards={cards}
          smileAt={smileAt}
          // Desktop opens on the top-left corner, a little zoomed out, so the
          // title and Skin show whole with the rest peeking in.
          start={
            mode === "desktop" ? { corner: "top-left", zoom: 0.9 } : undefined
          }
          // Desktop: the title block sits close to the screen's edges, the same
          // gap on the left and on top (its panel is 10px inside its 360px box).
          margin={mode === "desktop" ? { x: 15, y: 15 } : undefined}
          centerW={360}
          centerH={360}
          centerX={pos.center?.x ?? 0}
          centerY={pos.center?.y ?? 0}
          arrange={arrange}
          onArrange={(id, dx, dy) =>
            setAll((a) => {
              const p = a[mode];
              return {
                ...a,
                [mode]: {
                  ...p,
                  [id]: { x: (p[id]?.x ?? 0) + dx, y: (p[id]?.y ?? 0) + dy },
                },
              };
            })
          }
          onArrangeEnd={() => {
            fetch("/__playground-layout", {
              method: "POST",
              body: JSON.stringify(allRef.current),
            });
          }}
          center={
            // A pressed-in, flat panel in the studded surface's colour, so the
            // text sits in a smooth recess instead of on the bumps.
            <div
              className="flex w-[min(84vw,340px)] flex-col items-center justify-center gap-4 rounded-[28px] px-7 py-7 text-center"
              style={{
                backgroundColor: "#e2ddd8",
                boxShadow:
                  "inset 7px 7px 14px rgba(125,108,92,0.28), inset -7px -7px 14px rgba(255,255,255,0.85), inset 0 0 0 1px rgba(125,108,92,0.06)",
              }}
            >
              <h1 className="t-intro text-2xl md:text-3xl">AI Playground</h1>
              <p className="t-page-intro text-sm">
                I've always been a builder, but I needed other people to help me
                out. AI finally empowered me to build products for myself and my
                friends, exactly the way I imagine them. Drag around (or pinch
                to zoom) to see the apps, tools, and experiments that came out
                of it.
              </p>
            </div>
          }
        />
      </div>

      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={() => setArrange((a) => !a)}
          className={`fixed right-4 bottom-4 z-20 rounded-full px-4 py-2 font-mono text-xs tracking-widest uppercase shadow-lg ${arrange ? "bg-[var(--site-accent)] text-white" : "bg-black text-white"}`}
        >
          {arrange ? "Done arranging" : "✥ Arrange"}
        </button>
      )}
    </main>
  );
}
