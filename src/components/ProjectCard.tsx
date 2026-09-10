import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export default function ProjectCard({ slug, category, name, title, summary, cardImage }: Project) {
  return (
    <div className="relative flex flex-col items-start border p-4">
      <p className="text-base">{category}</p>
      <Link to={`/work/${slug}`} className="my-2 w-full border">
        <img src={cardImage} alt={`${title} screenshot`} className="w-full" />
      </Link>
      <Link to={`/work/${slug}`} className="underline">
        <h4 className="flex">{name}</h4>
      </Link>
      <p className="my-2 text-base italic">{summary}</p>
    </div>
  );
}
