import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import { FRAME_RADIUS } from "./ScreenshotFrame";
import { useAutoplayInView } from "../lib/useAutoplayInView";
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
}: {
  project: Project;
  /** Override the title's text size — e.g. a smaller size for a denser grid. */
  titleClassName?: string;
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
      <div className={slug === "ios-app" ? "flex justify-center bg-[#36383b] p-10" : undefined}>
        {coverAnimation === "connectiq-kanban" ? (
          <KanbanDragCover label={cover.alt} />
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
            className={slug === "ios-app" ? "w-4/5" : "w-full"}
          />
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <p className={titleClassName}>{name}</p>
        <p className="shrink-0 font-mono text-xs tracking-widest text-neutral-400 uppercase">
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
