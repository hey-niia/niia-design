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
    x: -440,
    y: -290,
    w: 600,
    h: 305,
    radius: 10,
  },
  "Taski — first version": {
    image: "/experiments/canvas/taski-v1.jpg",
    x: 450,
    y: -310,
    w: 400,
    h: 361,
    radius: 8,
  },
  Taski: {
    image: "/experiments/canvas/taski.jpg",
    x: -420,
    y: 330,
    w: 480,
    h: 383,
    radius: 6,
  },
  Skim: {
    image: "/experiments/canvas/skim.jpg",
    x: 450,
    y: 320,
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
          centerW={460}
          centerH={240}
          center={
            <div className="flex w-[min(80vw,440px)] flex-col items-center gap-4 text-center">
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
