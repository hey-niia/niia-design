import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject, projects, type ContentBlock, type Credit } from "../data/projects";
import AnnotatedImage from "../components/AnnotatedImage";
import BeforeAfter from "../components/BeforeAfter";
import CardCarousel from "../components/CardCarousel";
import ClickThrough from "../components/ClickThrough";
import ConnectIQUserFlow from "../components/ConnectIQUserFlow";
import { Band } from "../components/DarkVisuals";
import Decisions from "../components/Decisions";
import Findings from "../components/Findings";
import FramedImage from "../components/FramedImage";
import Outcomes from "../components/Outcomes";
import Nav from "../components/Nav";
import ResearchQuotes from "../components/ResearchQuotes";
import { FRAME_RADIUS } from "../components/ScreenshotFrame";
import ScrollableImage from "../components/ScrollableImage";
import Silos from "../components/Silos";
import Slides from "../components/Slides";
import { slideImages } from "../lib/slides";
import { NADIIA_LABEL, NADIIA_SHAPE, NADIIA_SURFACE } from "../components/nadiia";
import ToolMap from "../components/ToolMap";
import UserGroups from "../components/UserGroups";
import WiggleText from "../components/WiggleText";
import WorkGridCard from "../components/WorkGridCard";
import { useNiiaChat } from "../context/useNiiaChat";
import { splitIntoColumns } from "../lib/columns";
import { useAutoplayInView } from "../lib/useAutoplayInView";

// Keyed by the exact strings used in `tools` across projects.ts.
const TOOL_ICONS: Record<string, string> = {
  Figma: "/icons/tools/figma.svg",
  Figjam: "/icons/tools/figjam.svg",
  Claude: "/icons/tools/claude.svg",
  Notion: "/icons/tools/notion.svg",
  // Generic analytics glyph, not the Amplitude brand mark — see notes.
  Amplitude: "/icons/tools/amplitude.svg",
};

function ToolList({ tools }: { tools: string[] }) {
  return (
    <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
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
  // `group-hover` alone never fires on touch, so the label was unreachable on
  // mobile — tapping an avatar now toggles it too, closing on an outside tap.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setActiveIndex(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="mt-2 flex -space-x-2">
      {credits.map((credit, i) => (
        <div key={i} className="group relative">
          <button
            type="button"
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white ${
              credit.highlight ? "bg-[#e65f2e]" : "bg-black"
            }`}
          >
            {credit.initials}
          </button>
          <span
            className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white transition-opacity group-hover:opacity-100 ${
              activeIndex === i ? "opacity-100" : "opacity-0"
            }`}
          >
            {credit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// A step multiplies/divides the current scale rather than adding a fixed
// amount, so it feels similarly sized whether the image is showing at 8% or
// 80%.
const ZOOM_STEP_FACTOR = 1.25;
// Reserved space around the image so it never touches the viewport edges or
// the floating zoom controls at the bottom.
const LIGHTBOX_PADDING = 32;
const LIGHTBOX_CONTROLS_SPACE = 96;
// Below this average luminance (0-255) behind the pill, it's a dark backdrop
// and the default light-glass styling is legible; above it, flip to a dark
// chip so the white text doesn't wash out against a light part of the image.
const CONTRAST_LUMA_THRESHOLD = 175;
const EMAIL = "nia.bieliavtseva@gmail.com";

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
  // Absolute scale, not a multiplier — 1 means the image's real pixel size.
  // Null means "use the default" (native size), so it re-derives correctly
  // as soon as `natural` and `viewport` are known, without needing an effect
  // to go set it.
  const [userScale, setUserScale] = useState<number | null>(null);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [pillOnLight, setPillOnLight] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const sampleRaf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // A fresh image needs its own measurements and starts back at native size.
  useEffect(() => {
    setUserScale(null);
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
  const availableWidth = viewport.w - LIGHTBOX_PADDING * 2;
  const availableHeight = viewport.h - LIGHTBOX_PADDING * 2 - LIGHTBOX_CONTROLS_SPACE;
  // Default view: the image's true native size. Upscaling past that just
  // pixelates it, so that's also the ceiling — there's nowhere to zoom in
  // to, only out.
  const maxScale = 1;
  // The smallest useful scale: the whole image visible at once, no
  // scrolling — for a screenshot too big or too tall to fit the viewport at
  // native size, zooming out this far is what lets you see all of it in one
  // glance.
  const minScale = natural
    ? Math.min(1, availableWidth / natural.w, availableHeight / natural.h)
    : 1;
  const canZoom = maxScale > minScale + 0.001;
  // Native size is the right opening view for a phone screenshot, but for
  // something far larger than the viewport in either dimension — a workshop
  // canvas, say, or a tall mobile screenshot on a short window — it drops you
  // into a corner with no context. Those open fit-to-screen instead, and you
  // zoom in.
  const defaultScale =
    natural && (natural.w > availableWidth * 1.6 || natural.h > availableHeight * 1.6)
      ? minScale
      : maxScale;
  const scale = Math.min(maxScale, Math.max(minScale, userScale ?? defaultScale));
  const overflowsHorizontally = natural ? natural.w * scale > availableWidth + 0.5 : false;
  const overflowsVertically = natural ? natural.h * scale > availableHeight + 0.5 : false;

  // The pill floats over whatever part of the (possibly scrolled, possibly
  // zoomed) screenshot sits behind it, which can be light or dark — sample
  // the pixels directly underneath it and flip the pill's own theme to match.
  const sampleContrast = useCallback(() => {
    const imgEl = imgRef.current;
    const pillEl = pillRef.current;
    if (!imgEl || !pillEl || scale <= 0) return;
    const imgRect = imgEl.getBoundingClientRect();
    const pillRect = pillEl.getBoundingClientRect();
    const x0 = Math.max(imgRect.left, pillRect.left);
    const x1 = Math.min(imgRect.right, pillRect.right);
    const y0 = Math.max(imgRect.top, pillRect.top);
    const y1 = Math.min(imgRect.bottom, pillRect.bottom);
    if (x1 <= x0 || y1 <= y0) {
      setPillOnLight(false);
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      ctx.drawImage(
        imgEl,
        (x0 - imgRect.left) / scale,
        (y0 - imgRect.top) / scale,
        (x1 - x0) / scale,
        (y1 - y0) / scale,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      }
      setPillOnLight(total / (data.length / 4) > CONTRAST_LUMA_THRESHOLD);
    } catch {
      // Same-origin project screenshots shouldn't taint the canvas, but if
      // something ever does, just keep the last known theme.
    }
  }, [scale]);

  useEffect(() => {
    sampleContrast();
  }, [sampleContrast, natural]);

  const onBackdropScroll = () => {
    if (sampleRaf.current) cancelAnimationFrame(sampleRaf.current);
    sampleRaf.current = requestAnimationFrame(sampleContrast);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-auto bg-black/90"
        onClick={onClose}
        onScroll={onBackdropScroll}
      >
        <div
          className={`flex min-h-full p-8 ${overflowsVertically ? "items-start" : "items-center"} ${
            overflowsHorizontally ? "justify-start" : "justify-center"
          }`}
          style={{ paddingBottom: LIGHTBOX_CONTROLS_SPACE }}
        >
          <img
            ref={imgRef}
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
      </div>

      {/* A sibling of the scrolling backdrop above, not a child of it — some
          WebKit versions treat a `fixed` element nested inside a `fixed` +
          `overflow-auto` ancestor as if it scrolled with the content, which
          would carry these controls off-screen on a tall image. */}
      <div
        ref={pillRef}
        className={`fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors ${
          pillOnLight ? "border-black/10 bg-black/70 text-white" : "border-white/15 bg-white/10 text-white"
        }`}
      >
        {canZoom && (
          <>
            <button
              type="button"
              onClick={() => setUserScale(Math.max(minScale, scale / ZOOM_STEP_FACTOR))}
              disabled={scale <= minScale + 0.001}
              className="rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/10 disabled:opacity-30"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="w-12 text-center text-sm tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setUserScale(Math.min(maxScale, scale * ZOOM_STEP_FACTOR))}
              disabled={scale >= maxScale - 0.001}
              className="rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/10 disabled:opacity-30"
              aria-label="Zoom in"
            >
              +
            </button>
          </>
        )}
        {images.length > 1 && (
          <>
            <span aria-hidden className="mx-1 h-4 w-px bg-white/15" />
            <span className="w-14 text-center text-sm tabular-nums text-white/70">
              {index + 1} / {images.length}
            </span>
          </>
        )}
        {(canZoom || images.length > 1) && (
          <span aria-hidden className="mx-1 h-4 w-px bg-white/15" />
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
        >
          Close
        </button>
      </div>
    </>
  );
}

interface ZoomCursorHandlers {
  /** `label` replaces "Click to zoom", e.g. on a screenshot with markers. */
  onMouseMove: (e: MouseEvent, label?: string) => void;
  onMouseLeave: () => void;
}

// Renders `backticked` spans as inline code. Token names read as noise in
// running prose otherwise — Color.level2 looks like a typo, not an identifier.
function withCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      <code
        key={i}
        className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-700"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

// Blocks that sit on the full-bleed band when a project has `darkVisuals`.
const VISUAL_TYPES = new Set<ContentBlock["type"]>([
  "image",
  "video",
  "annotated-image",
  "card-carousel",
  "before-after",
  "gallery",
]);

// A plain image opts out of the band and sits on the white page instead.
function isVisual(block: ContentBlock) {
  return VISUAL_TYPES.has(block.type) && !(block.type === "image" && block.plain);
}

// Consecutive visuals share one band, so two screenshots in a row aren't
// split by a strip of white. Sections are numbered along the way.
function groupVisuals(content: ContentBlock[]) {
  const groups: { block: ContentBlock; index: number; sectionNumber?: number }[][] = [];
  let section = 0;
  content.forEach((block, index) => {
    const entry = { block, index, sectionNumber: block.type === "section" ? ++section : undefined };
    const last = groups[groups.length - 1];
    if (last && isVisual(last[0].block) === isVisual(block)) {
      last.push(entry);
    } else {
      groups.push([entry]);
    }
  });
  return groups;
}

function Block({
  block,
  onImageClick,
  zoomCursor,
  dark = false,
  sectionNumber,
}: {
  block: ContentBlock;
  onImageClick: (src: string) => void;
  zoomCursor: ZoomCursorHandlers;
  /** Rendering inside a dark full-bleed band, which supplies the spacing and background. */
  dark?: boolean;
  /** Shown as an orange "01/" label above the section title. */
  sectionNumber?: number;
}) {
  const videoRef = useAutoplayInView<HTMLVideoElement>();

  switch (block.type) {
    case "paragraph":
      return (
        <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">{withCode(block.text)}</p>
      );
    case "heading":
      return (
        <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">{block.text}</h3>
      );
    case "section":
      return (
        <h2 id={block.id} className="mt-16 mb-4 scroll-mt-8 text-3xl font-medium">
          {sectionNumber !== undefined && (
            <span className="mb-3 block font-mono text-xs tracking-widest text-[#e65f2e]">
              {String(sectionNumber).padStart(2, "0")}/
            </span>
          )}
          {block.title}
        </h2>
      );
    case "list":
      return (
        // list-outside so wrapped lines align with the first line's text
        // instead of sliding back under the bullet.
        <ul className="my-4 max-w-[46rem] list-outside list-disc space-y-2 pl-5 text-[1.125rem] leading-[1.8]">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {withCode(item)}
            </li>
          ))}
        </ul>
      );
    case "chips":
      return (
        <ul className="my-8 grid max-w-[46rem] grid-cols-1 gap-4 sm:grid-cols-3">
          {block.items.map((item) => (
            <li
              key={item}
              className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} ${NADIIA_LABEL} flex min-h-20 items-center justify-center px-5 py-4 text-center`}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "numbered-list":
      return (
        <div className="my-8 flex max-w-[46rem] flex-col gap-6">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-start gap-6">
              <p className="w-12 shrink-0 font-mono text-4xl leading-none text-neutral-200">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="pt-1 text-[1.125rem] leading-[1.8]">{item}</p>
            </div>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="my-6 max-w-[46rem] border-l-2 pl-4 italic">
          <p className="text-[1.125rem] leading-[1.8]">“{block.text}”</p>
          <footer className="mt-2 text-sm not-italic">— {block.attribution}</footer>
        </blockquote>
      );
    case "stat-row":
      return (
        <div className="my-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {block.stats.map((stat, i) => (
            <div key={i}>
              <p className="text-5xl font-medium tracking-tight">{stat.value}</p>
              <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      );
    case "callouts":
      return (
        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {block.items.map((item, i) => (
            <div key={i} className="bg-neutral-100 p-6">
              <p className="mb-3 font-mono text-xs text-gray-400">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-medium">{item.title}</p>
              {item.description && (
                <p className="mt-2 text-sm text-gray-400">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    case "image":
      if (block.plain) {
        return (
          <div className="my-10">
            <FramedImage
              src={block.src}
              alt={block.alt}
              onImageClick={onImageClick}
              zoomCursor={zoomCursor}
            />
            {block.caption && <p className="mt-3 text-sm italic text-gray-400">{block.caption}</p>}
          </div>
        );
      }
      return (
        // `panel` puts the image on the same neutral field the before/after
        // toggles use. Screenshots with no background of their own float on
        // white and read as a different kind of asset from the ones that do.
        <div
          className={
            dark
              ? ""
              : block.panel
              ? `my-8 px-4 py-8 sm:px-10 sm:py-10 ${
                  block.panel === "dark" ? "bg-neutral-900" : "bg-neutral-100"
                }`
              : "my-4"
          }
        >
          <ScrollableImage
            src={block.src}
            alt={block.alt}
            maxWidth={block.maxWidth}
            viewportHeight={block.viewportHeight}
            onImageClick={onImageClick}
            zoomCursor={zoomCursor}
          />
          {block.caption && (
            <p
              className={`mt-2 text-sm italic ${
                block.panel === "dark" ? "text-gray-400" : "text-gray-400"
              }${block.panel ? " mx-auto max-w-[46rem]" : ""}`}
            >
              {block.caption}
            </p>
          )}
        </div>
      );
    case "video":
      return (
        <div className="my-4">
          <video
            ref={videoRef}
            src={block.src}
            poster={block.poster}
            aria-label={block.alt}
            autoPlay
            loop
            muted
            playsInline
            className={`block w-full ${FRAME_RADIUS} ring-1 ring-black/10`}
            style={{ maxWidth: block.maxWidth ?? 380, margin: "0 auto" }}
          />
          {block.caption && <p className="mt-2 text-sm italic text-gray-400">{block.caption}</p>}
        </div>
      );
    case "annotated-image":
      return (
        <div className={dark ? "" : "my-8 bg-neutral-100 px-4 py-8 sm:px-10 sm:py-10"}>
          <AnnotatedImage
            src={block.src}
            alt={block.alt}
            pins={block.pins}
            maxWidth={block.maxWidth}
            viewportHeight={block.viewportHeight}
            onImageClick={onImageClick}
            zoomCursor={zoomCursor}
          />
          {block.caption && (
            <p className="mt-4 text-sm italic text-gray-400">{block.caption}</p>
          )}
        </div>
      );
    case "card-carousel":
      return (
        <div className="my-8">
          <CardCarousel images={block.images} alt={block.alt} height={block.height} />
          {block.caption && (
            <p className="mt-2 text-sm italic text-gray-400">{block.caption}</p>
          )}
        </div>
      );
    case "research-quotes":
      return <ResearchQuotes items={block.items} />;
    case "before-after":
      return (
        <div className={dark ? "" : "my-8"}>
          <BeforeAfter
            before={block.before}
            after={block.after}
            beforeAlt={block.beforeAlt}
            afterAlt={block.afterAlt}
            beforeLabel={block.beforeLabel}
            afterLabel={block.afterLabel}
            maxWidth={block.maxWidth}
            viewportHeight={block.viewportHeight}
            caption={block.caption}
            dark={block.dark ?? dark}
            onImageClick={onImageClick}
            zoomCursor={zoomCursor}
          />
        </div>
      );
    case "cards":
      return <Outcomes items={block.items} />;
    case "tool-map":
      return <ToolMap items={block.items} />;
    case "user-groups":
      return <UserGroups groups={block.groups} />;
    case "silos":
      return <Silos from={block.from} to={block.to} />;
    case "click-through":
      return (
        <div className="my-10">
          <ClickThrough steps={block.steps} label={block.label} />
        </div>
      );
    case "slides":
      return (
        <Slides
          slides={block.slides}
          label={block.label}
          appearance={block.appearance}
          look={block.look}
          canvasRows={block.canvasRows}
          onImageClick={onImageClick}
          zoomCursor={zoomCursor}
        />
      );
    case "diagram":
      return <ConnectIQUserFlow />;
    case "decisions":
      return <Decisions items={block.items} />;
    case "findings":
      return <Findings tested={block.tested} findings={block.findings} />;
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
                <p className="mt-2 text-sm italic text-gray-400">{img.caption}</p>
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
  const { openWelcome } = useNiiaChat();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState("overview");

  // Every image/gallery block's images, in document order, so the lightbox
  // can step through them regardless of which block a screenshot came from.
  const images = useMemo(() => {
    const list: { src: string; alt: string }[] = [];
    if (project?.hero) list.push(project.hero);
    if (project?.featured) {
      list.push({ src: project.featured.before, alt: project.featured.beforeAlt });
      list.push({ src: project.featured.after, alt: project.featured.afterAlt });
    }
    for (const block of project?.content ?? []) {
      if (block.type === "image") list.push({ src: block.src, alt: block.alt });
      else if (block.type === "annotated-image") {
        list.push({ src: block.src, alt: block.alt });
      } else if (block.type === "before-after") {
        // Both states, so the lightbox opens whichever one the toggle is showing.
        list.push({ src: block.before, alt: block.beforeAlt });
        list.push({ src: block.after, alt: block.afterAlt });
      } else if (block.type === "gallery") {
        for (const img of block.images) list.push({ src: img.src, alt: img.alt });
      } else if (block.type === "slides") {
        for (const slide of block.slides) list.push(...slideImages(slide));
      }
    }
    return list;
  }, [project]);
  const [cursorLabel, setCursorLabel] = useState({
    x: 0,
    y: 0,
    visible: false,
    text: undefined as string | undefined,
  });

  const zoomCursor: ZoomCursorHandlers = {
    onMouseMove: (e, text) => setCursorLabel({ x: e.clientX, y: e.clientY, visible: true, text }),
    onMouseLeave: () => setCursorLabel((c) => ({ ...c, visible: false })),
  };

  const moreProjects = useMemo(() => {
    const currentIndex = projects.findIndex((p) => p.slug === slug);
    if (currentIndex === -1) return projects.slice(0, 2);
    // Walk the list starting right after the current project and wrap around,
    // instead of always taking the first two — otherwise a project near the
    // end of the array (e.g. the last one) never gets surfaced here.
    return [1, 2].map((offset) => projects[(currentIndex + offset) % projects.length]);
  }, [slug]);

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
  const openImage = (src: string) =>
    setLightboxIndex(images.findIndex((img) => img.src === src));
  const featuredToggle = project.featured && (
    <BeforeAfter {...project.featured} onImageClick={openImage} zoomCursor={zoomCursor} />
  );

  return (
    // `clip`, not `hidden`: full-bleed bands are 100vw, which includes the
    // scrollbar, and `hidden` would break the TOC's sticky positioning.
    <main className={project.darkVisuals ? "overflow-x-clip" : undefined}>
      <Nav />
      <div className="mx-auto max-w-4xl pt-6 md:pt-24">
        <div className="relative">
          {/* Sits further out in the page margin, outside the reading column, so
              the column itself never has to shrink to make room for it. Spans
              the full header-to-content height (not just the content section)
              so it starts at the top of the page, opposite the content start.
              Needs real estate beyond max-w-4xl on both sides, hence the wide
              custom breakpoint. */}
          {hasToc && (
            <aside className="hidden min-[1360px]:absolute min-[1360px]:inset-y-0 min-[1360px]:right-full min-[1360px]:mr-20 min-[1360px]:block min-[1360px]:w-32">
              <div className="min-[1360px]:sticky min-[1360px]:top-24">
                <Link
                  to="/"
                  className="mb-6 block text-sm text-gray-400 hover:text-[#e65f2e]"
                >
                  <WiggleText>← Back</WiggleText>
                </Link>
                <nav>
                  <ul className="flex flex-col gap-3">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`text-sm hover:text-[#e65f2e] ${
                            activeId === item.id ? "font-medium text-black" : "text-gray-400"
                          }`}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}

          <header className="border-b border-gray-200 pb-8">
            <p className="mb-4 font-mono text-xs tracking-widest text-gray-400 uppercase">
              {project.hideClientInHeader
                ? project.name
                : `${project.name} · ${project.client}`}
            </p>
            <h1 className="mb-4 text-3xl font-medium lg:text-5xl">{project.title}</h1>
            {project.summary && <p className="mt-4 max-w-2xl">{project.summary}</p>}
          </header>

          <section id="overview" className="scroll-mt-8 border-b border-gray-200 py-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="mb-1 font-mono text-xs tracking-widest text-gray-400 uppercase">
                  Role
                </p>
                <p className="text-sm">{project.role}</p>
              </div>
              {project.team && (
                <div>
                  <p className="mb-1 font-mono text-xs tracking-widest text-gray-400 uppercase">
                    Team
                  </p>
                  <p className="text-sm">{project.team}</p>
                  {project.credits && project.credits.length > 0 && (
                    <CreditAvatars credits={project.credits} />
                  )}
                </div>
              )}
              <div>
                <p className="mb-1 font-mono text-xs tracking-widest text-gray-400 uppercase">
                  Timeline
                </p>
                <p className="text-sm">{project.duration}</p>
              </div>
              <div>
                <p className="mb-1 font-mono text-xs tracking-widest text-gray-400 uppercase">
                  Tools
                </p>
                <ToolList tools={project.tools} />
              </div>
            </div>

            {project.impact && project.impact.length > 0 && (
              // Same treatment as the `callouts` block, so the two card rows
              // on a page read as one family. Body stays near-legible size
              // rather than the callouts' 14px — this is the block recruiters
              // read first.
              <div className="mt-12">
                <p className="mb-4 text-sm tracking-wide text-gray-400 uppercase">Impact</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {project.impact.map((stat) => (
                    <div key={stat.metric} className="bg-neutral-100 p-6">
                      <p className="font-medium">{stat.metric}</p>
                      <p className="mt-2 text-[1.0625rem] leading-relaxed text-gray-500">
                        {stat.description}{" "}
                        <strong className="font-medium text-black">{stat.result}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* After the overview, so its rule stays right under Role / Team / Timeline. */}
          {project.hero && (
            <div className="pt-8">
              <img
                src={project.hero.src}
                alt={project.hero.alt}
                className={`block w-full cursor-none ${FRAME_RADIUS} shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/10`}
                onClick={() => openImage(project.hero!.src)}
                onMouseMove={zoomCursor.onMouseMove}
                onMouseLeave={zoomCursor.onMouseLeave}
              />
            </div>
          )}

          {featuredToggle && <div className="pt-8">{featuredToggle}</div>}

          <section className="py-8">
            {project.darkVisuals
              ? groupVisuals(project.content).map((group) => {
                  const blocks = group.map(({ block, index, sectionNumber }) => (
                    <Block
                      key={index}
                      block={block}
                      dark
                      sectionNumber={sectionNumber}
                      onImageClick={openImage}
                      zoomCursor={zoomCursor}
                    />
                  ));
                  return isVisual(group[0].block) ? (
                    <Band key={group[0].index}>{blocks}</Band>
                  ) : (
                    <Fragment key={group[0].index}>{blocks}</Fragment>
                  );
                })
              : project.content.map((block, i) => (
                  <Block key={i} block={block} onImageClick={openImage} zoomCursor={zoomCursor} />
                ))}
          </section>
        </div>

        <footer className="border-t border-gray-200 py-16">
          <div className="flex items-center justify-center gap-8">
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5">
              <span aria-hidden>✉</span>
              <WiggleText>Email</WiggleText>
            </a>
            <button
              type="button"
              onClick={openWelcome}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <span aria-hidden>✦</span>
              <WiggleText>Talk to Niia AI</WiggleText>
            </button>
          </div>
        </footer>

        {moreProjects.length > 0 && (
          <section className="py-16">
            <p className="mb-6 text-sm tracking-wide text-gray-400 uppercase">
              More case studies
            </p>
            <div className="flex flex-col gap-8 sm:flex-row">
              {splitIntoColumns(moreProjects).map((column, i) => (
                <div key={i} className="flex flex-1 flex-col gap-8">
                  {column.map((p) => (
                    <WorkGridCard key={p.slug} project={p} titleClassName="text-sm" />
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <span
        aria-hidden
        className={`pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-[#e65f2e] px-4 py-2 text-sm font-normal text-white transition-[transform,opacity] duration-150 ease-out ${
          cursorLabel.visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        style={{ left: cursorLabel.x, top: cursorLabel.y }}
      >
        {cursorLabel.text ?? (
          <>
            <span className="text-base leading-none">+</span>
            Click to zoom
          </>
        )}
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
