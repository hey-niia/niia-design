import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export default function WorkGridItem({ project, wide = false }: { project: Project; wide?: boolean }) {
  const { slug, category, name, summary, screenshots } = project;
  const cover = screenshots[0];

  return (
    <Link
      to={`/work/${slug}`}
      className={`work-card-link flex flex-col ${wide ? "col-span-2" : "col-span-1"}`}
    >
      <div className={`w-full overflow-hidden ${wide ? "aspect-[2/1]" : "aspect-square"}`}>
        <img src={cover.src} alt={cover.alt} className="h-full w-full object-cover" />
      </div>
      <p className="mt-2 text-base">{category}</p>
      <h4 className="underline">{name}</h4>
      <p className="my-1 text-base italic">{summary}</p>
    </Link>
  );
}
