import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DrawingPad from "../components/DrawingPad";
import Nav from "../components/Nav";
import WorkGridCard from "../components/WorkGridCard";
import { projects } from "../data/projects";
import { splitIntoColumns } from "../lib/columns";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      requestAnimationFrame(() => {
        document.getElementById(state.scrollTo!)?.scrollIntoView();
      });
    }
  }, [location.state]);

  return (
    <main className="pb-24">
      <Nav />

      <section id="about" className="flex justify-center pt-6 md:pt-24">
        <div className="max-w-xl">
          <p className="mb-4 text-3xl">
            I help companies design ambitious products people actually use.
          </p>
          <p>
            My work sits at the intersection of visual arts and business, shaped by founding
            two companies — now sharpened by building with AI.
          </p>
        </div>
      </section>

      <section id="experience" className="flex justify-center py-12">
        <div className="max-w-xl">
          <div className="mb-8">
            <p className="text-base">Freelance</p>
            <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
              Senior Product Designer, AI Design Engineer · 2022–Present
            </p>
            <p className="mt-2 text-sm">
              End-to-end product design for startups and scale-ups. Current work spans an AI-first
              iOS wellness app, enterprise dashboards, and web platforms — covering research,
              design systems, interaction design, and full delivery.
            </p>
          </div>

          <div className="mb-8">
            <p className="text-base">
              <a href="https://overspace.co" target="_blank" rel="noopener noreferrer">
                Overspace
              </a>
            </p>
            <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
              Co-founder · 2022–Present
            </p>
            <p className="mt-2 text-sm">
              Co-founded a product design studio for startups and teams building what's next —
              from strategy and research to UI/UX design and design systems.
            </p>
          </div>

          <div>
            <p className="text-base">
              <a href="https://superleap.com.ua/" target="_blank" rel="noopener noreferrer">
                Leap
              </a>
            </p>
            <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
              Founder · 2016–2022
            </p>
            <p className="mt-2 text-sm">
              Before Overspace, I founded Leap, a health snack brand that reached 1000+ shops and
              cafés across Ukraine. Sole founder: product and packaging design, manufacturing,
              distribution, social, and the team I hired to run it. That generalist range is
              still what startups hire me for.
            </p>
          </div>
        </div>
      </section>

      <section id="work" className="flex flex-col gap-8 sm:flex-row">
        {splitIntoColumns(projects).map((column, i) => (
          <div key={i} className="flex flex-1 flex-col gap-8">
            {column.map((project) => (
              <WorkGridCard key={project.slug} project={project} />
            ))}
          </div>
        ))}
      </section>

      <DrawingPad />
    </main>
  );
}
