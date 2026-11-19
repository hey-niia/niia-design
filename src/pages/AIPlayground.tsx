import { useLayoutEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import InfiniteCanvas, { type CanvasCard } from "../components/InfiniteCanvas";
import { experiments } from "../data/experiments";

const LABEL: Record<string, string> = {
  MacOS: "macOS app",
  "WEB APP": "Web app",
  "BROWSER EXTENSION": "Chrome extension",
};

// Each project once, around the title: just its app window (cropped from the
// cover, without the dark backdrop), sized to the screenshot's shape, with the
// window's own corner radius. Positions are the card's centre, in px.
const LAYOUT: Record<
  string,
  { image: string; x: number; y: number; w: number; h: number; radius: number }
> = {
  Skin: {
    image: "/experiments/skin-cover.webp",
    x: -480,
    y: -330,
    w: 600,
    h: 305,
    radius: 10,
  },
  "Taski — first version": {
    image: "/experiments/canvas/taski-v1.jpg",
    x: 490,
    y: -350,
    w: 400,
    h: 361,
    radius: 8,
  },
  Taski: {
    image: "/experiments/canvas/taski.jpg",
    x: -460,
    y: 370,
    w: 480,
    h: 383,
    radius: 6,
  },
  Skim: {
    image: "/experiments/canvas/skim.jpg",
    x: 490,
    y: 360,
    w: 560,
    h: 380,
    radius: 14,
  },
};

const cards: CanvasCard[] = experiments.flatMap((e) => {
  const spot = LAYOUT[e.name];
  return spot && e.link
    ? [
        {
          ...spot,
          title: e.name,
          label: LABEL[e.platform] ?? e.platform,
          href: e.link,
        },
      ]
    : [];
});

export default function AIPlayground() {
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
          centerW={360}
          centerH={360}
          center={
            // A pressed-in, flat panel in the studded surface's colour, so the
            // text sits in a smooth recess instead of on the bumps.
            <div
              className="flex aspect-square w-[min(84vw,340px)] flex-col items-center justify-center gap-4 rounded-[28px] px-7 py-8 text-center"
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
    </main>
  );
}
