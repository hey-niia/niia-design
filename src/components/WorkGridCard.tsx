import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export default function WorkGridCard({
  project,
  titleClassName,
}: {
  project: Project;
  /** Override the title's text size — e.g. a smaller size for a denser grid. */
  titleClassName?: string;
}) {
  const { slug, title, client, lastUpdated, screenshots } = project;
  const cover = screenshots[0];

  return (
    <Link to={`/work/${slug}`} className="block">
      <div className={slug === "ios-app" ? "flex justify-center bg-neutral-100 p-10" : undefined}>
        <img src={cover.src} alt={cover.alt} className={slug === "ios-app" ? "w-4/5" : "w-full"} />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className={titleClassName}>{title}</p>
        <p className="shrink-0 font-mono text-xs tracking-widest text-neutral-400 uppercase">
          {client} · {lastUpdated}
        </p>
      </div>
    </Link>
  );
}
