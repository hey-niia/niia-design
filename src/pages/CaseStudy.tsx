import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject, type ContentBlock } from "../data/projects";
import WiggleText from "../components/WiggleText";

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
    case "quote":
      return (
        <blockquote className="my-6 border-l-2 pl-4 italic">
          <p>“{block.text}”</p>
          <footer className="mt-2 text-sm not-italic">— {block.attribution}</footer>
        </blockquote>
      );
    case "image":
      return (
        <div className="my-4">
          <div className="bg-neutral-900">
            <img
              src={block.src}
              alt={block.alt}
              className="w-full cursor-zoom-in"
              onClick={() => onImageClick(block.src, block.alt)}
            />
          </div>
          {block.caption && (
            <p className="mt-2 text-sm italic text-neutral-500">{block.caption}</p>
          )}
        </div>
      );
    case "gallery":
      return (
        <div className="my-4 flex flex-col gap-4">
          {block.images.map((img) => (
            <div key={img.src}>
              <div className="bg-neutral-900">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full cursor-zoom-in"
                  onClick={() => onImageClick(img.src, img.alt)}
                />
              </div>
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
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [activeId, setActiveId] = useState("overview");

  const toc = useMemo(() => {
    const items = [{ id: "overview", title: "Overview" }];
    for (const block of project?.content ?? []) {
      if (block.type === "section") items.push({ id: block.id, title: block.title });
    }
    return items;
  }, [project]);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

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
      <header className="border-b pb-8">
        <Link to="/" className="underline">
          <WiggleText>← Back to work</WiggleText>
        </Link>
        <p className="my-2">{project.client}</p>
        <h1>{project.title}</h1>
        {project.summary && <p className="mt-2 max-w-2xl italic">{project.summary}</p>}
      </header>

      <div className={hasToc ? "lg:grid lg:grid-cols-[1fr_200px] lg:items-start lg:gap-16" : ""}>
        <div>
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
                </div>
              )}
              <div>
                <p>Timeline</p>
                <p className="italic">{project.duration}</p>
              </div>
              <div>
                <p>Tools</p>
                <p className="italic">{project.tools.join(", ")}</p>
              </div>
            </div>

            {project.impact && project.impact.length > 0 && (
              <div className="mt-10">
                <p className="mb-4 text-sm tracking-wide text-neutral-500 uppercase">
                  Impact overview
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {project.impact.map((stat) => (
                    <div key={stat.metric} className="border p-4">
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

          <section className="py-8">
            {project.content.map((block, i) => (
              <Block
                key={i}
                block={block}
                onImageClick={(src, alt) => setLightbox({ src, alt })}
              />
            ))}
          </section>
        </div>

        {hasToc && (
          <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
            <p className="mb-4 text-sm tracking-wide text-neutral-500 uppercase">On this page</p>
            <nav className="flex flex-col gap-3 border-l pl-4">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm ${activeId === item.id ? "nav-active" : ""}`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>

      <footer className="border-t py-8">
        <p>
          Last updated: {project.lastUpdated} —{" "}
          <a href="mailto:nia.bieliavtseva@gmail.com" className="underline">
            <WiggleText>Let's design it!</WiggleText>
          </a>
        </p>
        <p className="my-2">
          <Link to="/" className="underline">
            <WiggleText>← Back to work</WiggleText>
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
