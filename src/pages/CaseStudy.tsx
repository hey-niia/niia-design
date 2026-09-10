import { Link, useParams } from "react-router-dom";
import { getProject, type ContentBlock } from "../data/projects";

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="my-4">{block.text}</p>;
    case "heading":
      return <h3 className="mt-8 mb-2">{block.text}</h3>;
    case "image":
      return (
        <div className="my-4 border">
          <img src={block.src} alt={block.alt} className="w-full" />
        </div>
      );
    case "gallery":
      return (
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {block.images.map((img) => (
            <div key={img.src} className="border">
              <img src={img.src} alt={img.alt} className="w-full" />
            </div>
          ))}
        </div>
      );
  }
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <main className="mx-auto max-w-4xl py-16">
        <p>
          Project not found. <Link to="/" className="underline">Back to work</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl py-16">
      <header className="border-b pb-8">
        <Link to="/" className="underline">
          ← Back to work
        </Link>
        <p className="my-2">{project.client}</p>
        <h1>{project.title}</h1>
      </header>

      <section className="border-b py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p>Role</p>
            <p className="italic">{project.role}</p>
          </div>
          <div>
            <p>Duration</p>
            <p className="italic">{project.duration}</p>
          </div>
          <div>
            <p>Tools</p>
            <p className="italic">{project.tools.join(", ")}</p>
          </div>
        </div>
      </section>

      <section className="py-8">
        {project.content.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </section>

      <footer className="border-t py-8">
        <p>
          Last updated: {project.lastUpdated} — <a href="mailto:nia.bieliavtseva@gmail.com" className="underline">Let's design it!</a>
        </p>
        <p className="my-2">
          <Link to="/" className="underline">
            ← Back to work
          </Link>
        </p>
      </footer>
    </main>
  );
}
