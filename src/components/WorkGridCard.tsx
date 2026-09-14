import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import { FRAME_RADIUS } from "./ScreenshotFrame";
import { useAutoplayInView } from "../lib/useAutoplayInView";

export default function WorkGridCard({
  project,
  titleClassName,
}: {
  project: Project;
  /** Override the title's text size — e.g. a smaller size for a denser grid. */
  titleClassName?: string;
}) {
  const { slug, name, category, client, lastUpdated, screenshots, coverVideo } = project;
  const cover = screenshots[0];
  const videoRef = useAutoplayInView<HTMLVideoElement>();
  // First tag only (e.g. "iOS app, AI" → "iOS app"). Rendered verbatim, never
  // through a CSS `uppercase` transform — categories are pre-cased in the data
  // (lowercase generic terms, "iOS" kept as-is) so that casing survives on screen.
  const categoryLabel = category.split(",")[0].trim();
  // Some projects reuse the category as a stand-in `client` (e.g. Hirement, which
  // has no nameable client) — drop it from the meta line when it just repeats.
  const metaParts = [categoryLabel, client, lastUpdated].filter(
    (part, i, parts) => i === 0 || part.toLowerCase() !== parts[i - 1].toLowerCase(),
  );

  return (
    <Link to={`/work/${slug}`} className="block">
      <div className={slug === "ios-app" ? "flex justify-center bg-neutral-100 p-10" : undefined}>
        {coverVideo ? (
          <video
            ref={videoRef}
            src={coverVideo}
            poster={cover.src}
            aria-label={cover.alt}
            autoPlay
            loop
            muted
            playsInline
            className={`${FRAME_RADIUS} ring-1 ring-black/10`}
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
        <p className="shrink-0 font-mono text-xs tracking-widest text-neutral-400">
          {metaParts.join(" · ")}
        </p>
      </div>
    </Link>
  );
}
