import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject, type ContentBlock } from "../data/projects";

function Block({
  block,
  onImageClick,
}: {
  block: ContentBlock;
  onImageClick: (src: string, alt: string) => void;
}) {
  switch (block.type) {
    case "paragraph":
      return <p className="my-4">{block.text}</p>;
    case "heading":
      return <h3 className="mt-8 mb-2">{block.text}</h3>;
    case "image":
      return (
        <div className="my-4 bg-neutral-900">
          <img
            src={block.src}
            alt={block.alt}
            className="w-full cursor-zoom-in"
            onClick={() => onImageClick(block.src, block.alt)}
          />
        </div>
      );
    case "gallery":
      return (
        <div className="my-4 flex flex-col gap-4">
          {block.images.map((img) => (
            <div key={img.src} className="bg-neutral-900">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full cursor-zoom-in"
                onClick={() => onImageClick(img.src, img.alt)}
              />
            </div>
          ))}
        </div>
      );
  }
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

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
          <Block key={i} block={block} onImageClick={(src, alt) => setLightbox({ src, alt })} />
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

      {lightbox && (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-black/90"
          onClick={() => setLightbox(null)}
        >
          <div className="flex min-h-full items-center justify-center p-8">
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="cursor-zoom-out"
              style={{ maxWidth: "none", width: "auto" }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
