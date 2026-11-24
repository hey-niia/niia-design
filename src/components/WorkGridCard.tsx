import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import { FRAME_RADIUS } from "./ScreenshotFrame";
import { useAutoplayInView } from "../lib/useAutoplayInView";
import FlowAnimation from "./FlowAnimation";
import KanbanDragCover from "./KanbanDragCover";

// The meta line is all-caps (via the parent's `uppercase` class) except "iOS",
// which keeps its brand casing — wrap it in `normal-case` so it survives the
// transform instead of becoming "IOS".
function renderMetaPart(part: string) {
  const iosIndex = part.toLowerCase().indexOf("ios");
  if (iosIndex === -1) return part;
  return (
    <>
      {part.slice(0, iosIndex)}
      <span className="normal-case">iOS</span>
      {part.slice(iosIndex + 3)}
    </>
  );
}

export default function WorkGridCard({
  project,
  titleClassName,
  uniform = false,
}: {
  project: Project;
  /** Override the title's text size — e.g. a smaller size for a denser grid. */
  titleClassName?: string;
  /** Every card's cover in the same 4:3 box, so cards in a row line up (the
   * "More case studies" grid). Covers fill it; the phone shrinks to fit. */
  uniform?: boolean;
}) {
  const { slug, name, category, client, lastUpdated, screenshots, coverVideo, coverAnimation } = project;
  const cover = screenshots[0];
  const videoRef = useAutoplayInView<HTMLVideoElement>();
  // Some projects reuse the category as a stand-in `client` (e.g. Hirement, which
  // has no nameable client) — drop it from the meta line when it just repeats.
  const metaParts = project.cardMeta
    ? [project.cardMeta]
    : [category, client, lastUpdated].filter(
        (part, i, parts) => i === 0 || part.toLowerCase() !== parts[i - 1].toLowerCase(),
      );

  return (
    <Link to={`/work/${slug}`} className="block">
      <div
        className={
          uniform
            ? `relative aspect-[4/3] overflow-hidden ${slug === "ios-app" ? "flex justify-center bg-[#36383b] py-8" : ""}`
            : slug === "ios-app"
              ? "flex justify-center bg-[#36383b] p-10"
              : undefined
        }
      >
        {coverAnimation === "connectiq-kanban" ? (
          <KanbanDragCover label={cover.alt} />
        ) : coverAnimation === "matter-flow" ? (
          uniform ? (
            // As tall as the box allows, at the phone's own shape.
            <div className="h-full" style={{ aspectRatio: "200 / 434" }}>
              <FlowAnimation alt={cover.alt} maxWidth={9999} compact />
            </div>
          ) : (
            // Same width the screen recording had.
            <FlowAnimation alt={cover.alt} maxWidth={200} compact />
          )
        ) : coverVideo ? (
          <video
            ref={videoRef}
            src={coverVideo}
            poster={cover.src}
            aria-label={cover.alt}
            autoPlay
            loop
            muted
            playsInline
            className={FRAME_RADIUS}
            style={{ width: 200, maxWidth: "100%" }}
          />
        ) : (
          <img
            src={cover.src}
            alt={cover.alt}
            className={
              uniform
                ? "absolute inset-0 h-full w-full object-cover"
                : slug === "ios-app"
                  ? "w-4/5"
                  : "w-full"
            }
          />
        )}
      </div>
      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <p className={`t-card-title ${titleClassName ?? "lg:text-[18px]"}`}>{name}</p>
        <p className="t-card-meta shrink-0 font-mono text-xs tracking-widest text-neutral-400 uppercase">
          {metaParts.map((part, i) => (
            <span key={i}>
              {i > 0 && " · "}
              {renderMetaPart(part)}
            </span>
          ))}
        </p>
      </div>
    </Link>
  );
}
