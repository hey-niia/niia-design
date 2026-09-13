import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject, projects, type ContentBlock, type Credit } from "../data/projects";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";
import WorkGridCard from "../components/WorkGridCard";

// Keyed by the exact strings used in `tools` across projects.ts.
const TOOL_ICONS: Record<string, string> = {
  Figma: "/icons/tools/figma.svg",
  Figjam: "/icons/tools/figjam.svg",
  Claude: "/icons/tools/claude.svg",
  Notion: "/icons/tools/notion.svg",
};

function ToolList({ tools }: { tools: string[] }) {
  return (
    <p className="flex flex-wrap items-center gap-x-6 gap-y-2 italic">
      {tools.map((tool) => (
        <span key={tool} className="inline-flex items-center gap-2">
          {TOOL_ICONS[tool] && (
            <img src={TOOL_ICONS[tool]} alt="" aria-hidden className="h-3.5 w-3.5" />
          )}
          {tool}
        </span>
      ))}
    </p>
  );
}

// Placeholder initials, not real photos — see the `Credit` type for why.
function CreditAvatars({ credits }: { credits: Credit[] }) {
  return (
    <div className="mt-2 flex -space-x-2">
      {credits.map((credit, i) => (
        <div key={i} className="group relative">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white ${
              credit.highlight ? "bg-[#e65f2e]" : "bg-black"
            }`}
          >
            {credit.initials}
          </div>
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            {credit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.5;
// Reserved space around the image so it never touches the viewport edges or
// the floating zoom controls at the bottom.
const LIGHTBOX_PADDING = 32;
const LIGHTBOX_CONTROLS_SPACE = 96;

function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const { src, alt } = images[index];
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // A fresh image needs its own measurements and starts back at fit-to-screen.
  useEffect(() => {
    setZoom(ZOOM_MIN);
    setNatural(null);
  }, [index]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNavigate, index, images.length]);

  // Scale the image to its real box size (not a CSS transform) so the
  // overflow-auto container actually gets scrollable content once zoomed —
  // a transform only repaints, it never grows the scrollable area.
  //
  // Fit is by width only, capped so we never upscale past the real
  // resolution (which would just pixelate it). A tall screenshot — a
  // full-page capture, say — stays readable at full width and scrolls
  // vertically instead of shrinking to fit its whole height on screen.
  const fitScale = natural ? Math.min(1, (viewport.w - LIGHTBOX_PADDING * 2) / natural.w) : 1;
  const scale = fitScale * zoom;
  const availableHeight = viewport.h - LIGHTBOX_PADDING * 2 - LIGHTBOX_CONTROLS_SPACE;
  const overflows = natural ? natural.h * scale > availableHeight : false;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/90" onClick={onClose}>
      <div
        className={`flex min-h-full p-8 ${overflows ? "items-start justify-start" : "items-center justify-center"}`}
        style={{ paddingBottom: LIGHTBOX_CONTROLS_SPACE }}
      >
        <img
          src={src}
          alt={alt}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }}
          onClick={(e) => e.stopPropagation()}
          style={
            natural
              ? { width: natural.w * scale, height: natural.h * scale, maxWidth: "none" }
              : { maxWidth: "100%", maxHeight: "70vh" }
          }
        />
      </div>

      <div
        className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1.5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
          disabled={zoom <= ZOOM_MIN}
          className="rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/10 disabled:opacity-30"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
          disabled={zoom >= ZOOM_MAX}
          className="rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/10 disabled:opacity-30"
          aria-label="Zoom in"
        >
          +
        </button>
        {images.length > 1 && (
          <>
            <span aria-hidden className="mx-1 h-4 w-px bg-white/15" />
            <span className="w-14 text-center text-sm tabular-nums text-white/70">
              {index + 1} / {images.length}
            </span>
          </>
        )}
        <span aria-hidden className="mx-1 h-4 w-px bg-white/15" />
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
        >
          Close
        </button>
      </div>
    </div>
  );
}

interface ZoomCursorHandlers {
  onMouseMove: (e: MouseEvent) => void;
  onMouseLeave: () => void;
}

function Block({
  block,
  onImageClick,
  zoomCursor,
}: {
  block: ContentBlock;
  onImageClick: (src: string) => void;
  zoomCursor: ZoomCursorHandlers;
}) {
  switch (block.type) {
    case "paragraph":
      return <p className="my-4">{block.text}</p>;
    case "heading":
      return <h3 className="mt-8 mb-2">{block.text}</h3>;
    case "section":
      return (
        <h2 id={block.id} className="mt-16 mb-4 scroll-mt-8 text-2xl font-medium">
          {block.title}
        </h2>
      );
    case "list":
      return (
        <ul className="my-4 list-inside list-disc space-y-2">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "numbered-list":
      return (
        <div className="my-8 flex flex-col gap-6">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-start gap-6">
              <p className="w-12 shrink-0 font-mono text-4xl leading-none text-neutral-200">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="pt-1">{item}</p>
            </div>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="my-6 border-l-2 pl-4 italic">
          <p>“{block.text}”</p>
          <footer className="mt-2 text-sm not-italic">— {block.attribution}</footer>
        </blockquote>
      );
    case "stat-row":
      return (
        <div className="my-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {block.stats.map((stat, i) => (
            <div key={i}>
              <p className="text-5xl font-medium tracking-tight">{stat.value}</p>
              <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      );
    case "callouts":
      return (
        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {block.items.map((item, i) => (
            <div key={i} className="bg-neutral-100 p-6">
              <p className="mb-3 font-mono text-xs text-neutral-400">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-medium">{item.title}</p>
              {item.description && (
                <p className="mt-2 text-sm text-neutral-500">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    case "image":
      return (
        <div className="my-4">
          <img
            src={block.src}
            alt={block.alt}
            className="w-full cursor-none"
            onClick={() => onImageClick(block.src)}
            onMouseMove={zoomCursor.onMouseMove}
            onMouseLeave={zoomCursor.onMouseLeave}
          />
          {block.caption && (
            <p className="mt-2 text-sm italic text-neutral-500">{block.caption}</p>
          )}
        </div>
      );
    case "gallery":
      return (
        <div className="my-4 flex flex-col gap-6 sm:flex-row">
          {block.images.map((img) => (
            <div key={img.src} className="sm:flex-1">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full cursor-none"
                onClick={() => onImageClick(img.src)}
                onMouseMove={zoomCursor.onMouseMove}
                onMouseLeave={zoomCursor.onMouseLeave}
              />
              {img.caption && (
                <p className="mt-2 text-sm italic text-neutral-500">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      );
  }
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState("overview");

  // Every image/gallery block's images, in document order, so the lightbox
  // can step through them regardless of which block a screenshot came from.
  const images = useMemo(() => {
    const list: { src: string; alt: string }[] = [];
    for (const block of project?.content ?? []) {
      if (block.type === "image") list.push({ src: block.src, alt: block.alt });
      else if (block.type === "gallery") {
        for (const img of block.images) list.push({ src: img.src, alt: img.alt });
      }
    }
    return list;
  }, [project]);
  const [cursorLabel, setCursorLabel] = useState({ x: 0, y: 0, visible: false });

  const zoomCursor: ZoomCursorHandlers = {
    onMouseMove: (e) => setCursorLabel({ x: e.clientX, y: e.clientY, visible: true }),
    onMouseLeave: () => setCursorLabel((c) => ({ ...c, visible: false })),
  };

  const moreProjects = useMemo(
    () => projects.filter((p) => p.slug !== slug).slice(0, 2),
    [slug],
  );

  const toc = useMemo(() => {
    const items = [{ id: "overview", title: "Overview" }];
    for (const block of project?.content ?? []) {
      if (block.type === "section") items.push({ id: block.id, title: block.title });
    }
    return items;
  }, [project]);

  useEffect(() => {
    if (toc.length <= 1) return;
    const elements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // "Last heading scrolled past a fixed offset" — simpler and more robust
    // than an IntersectionObserver band, which a fast or programmatic scroll
    // can jump straight over without ever firing inside it.
    const OFFSET = 120;
    let ticking = false;
    const update = () => {
      ticking = false;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - OFFSET <= 0) current = el.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  if (!project) {
    return (
      <main className="pb-24">
        <Nav />
        <p>
          Project not found.{" "}
          <Link to="/" className="underline">
            <WiggleText>Back to work</WiggleText>
          </Link>
        </p>
      </main>
    );
  }

  const hasToc = toc.length > 1;

  return (
    <main className="pb-24">
      <Nav />
      <div className="mx-auto max-w-4xl">
        <header className="border-b pb-8">
          <p className="my-2">{project.client}</p>
          <h1 className="mt-2 mb-2 text-3xl font-medium lg:text-5xl">{project.title}</h1>
          {project.summary && <p className="mt-2 max-w-2xl italic">{project.summary}</p>}
        </header>

        <section id="overview" className="scroll-mt-8 border-b py-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p>Role</p>
              <p className="italic">{project.role}</p>
            </div>
            {project.team && (
              <div>
                <p>Team</p>
                <p className="italic">{project.team}</p>
                {project.credits && project.credits.length > 0 && (
                  <CreditAvatars credits={project.credits} />
                )}
              </div>
            )}
            <div>
              <p>Timeline</p>
              <p className="italic">{project.duration}</p>
            </div>
            <div>
              <p>Tools</p>
              <ToolList tools={project.tools} />
            </div>
          </div>

          {project.impact && project.impact.length > 0 && (
            <div className="mt-10">
              <p className="mb-4 text-sm tracking-wide text-neutral-500 uppercase">
                Impact overview
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {project.impact.map((stat) => (
                  <div key={stat.metric} className="bg-neutral-100 p-6">
                    <p className="mb-2 font-medium">{stat.metric}</p>
                    <p className="text-sm">
                      {stat.description} <strong>{stat.result}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="relative">
          {/* Sits in the page margin, outside the reading column, so the column
              itself never has to shrink to make room for it. Needs real estate
              beyond max-w-4xl on both sides, hence the wide custom breakpoint. */}
          {hasToc && (
            <aside className="hidden min-[1360px]:absolute min-[1360px]:inset-y-0 min-[1360px]:right-full min-[1360px]:mr-12 min-[1360px]:block min-[1360px]:w-32">
              <nav className="min-[1360px]:sticky min-[1360px]:top-24 min-[1360px]:pt-8">
                <ul className="flex flex-col gap-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`text-sm ${
                          activeId === item.id ? "font-medium text-black" : "text-neutral-400"
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          <section className="py-8">
            {project.content.map((block, i) => (
              <Block
                key={i}
                block={block}
                onImageClick={(src) => setLightboxIndex(images.findIndex((img) => img.src === src))}
                zoomCursor={zoomCursor}
              />
            ))}
          </section>
        </div>

        {moreProjects.length > 0 && (
          <section className="border-t py-8">
            <p className="mb-6 text-sm tracking-wide text-neutral-500 uppercase">
              More case studies
            </p>
            <div className="columns-1 gap-8 sm:columns-2">
              {moreProjects.map((p) => (
                <WorkGridCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        )}

        <footer className="border-t py-8">
          <p>
            Last updated: {project.lastUpdated} —{" "}
            <a href="mailto:nia.bieliavtseva@gmail.com" className="underline">
              <WiggleText>Let's design it!</WiggleText>
            </a>
          </p>
        </footer>
      </div>

      <span
        aria-hidden
        className={`pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-[#e65f2e] px-4 py-2 text-sm font-medium text-white transition-[transform,opacity] duration-150 ease-out ${
          cursorLabel.visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        style={{ left: cursorLabel.x, top: cursorLabel.y }}
      >
        <span className="text-base leading-none">+</span>
        Click to zoom
      </span>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
