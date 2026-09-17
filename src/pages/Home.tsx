import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DrawingPad from "../components/DrawingPad";
import { ExperienceTimeline } from "../components/Experience";
import Nav from "../components/Nav";
import WorkGridCard from "../components/WorkGridCard";
import { projects } from "../data/projects";
import { splitIntoColumns } from "../lib/columns";

// The order projects appear in on the home page. Separate from the data's order,
// which the case studies' previous/next links follow.
const HOME_ORDER = ["ios-app", "hirement", "connectiq", "other-projects"];
const rank = (slug: string) => {
  const i = HOME_ORDER.indexOf(slug);
  return i === -1 ? HOME_ORDER.length : i;
};
const homeProjects = [...projects].sort((a, b) => rank(a.slug) - rank(b.slug));

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

      {/* Two equal columns with the work grid's 32px gap, so the bio lines up over the
          left illustration and the timeline starts where the right one does. */}
      <section
        id="about"
        className="grid gap-10 pt-6 pb-16 md:grid-cols-2 md:items-center md:gap-8 md:pt-24"
      >
        <div className="flex flex-col gap-4">
          <p className="text-3xl">I help companies design ambitious products people actually use.</p>
          <p className="text-3xl">
            I've founded two companies and that's shaped how I think about product and business
            together. Now I'm building with AI.
          </p>
        </div>
        <ExperienceTimeline />
      </section>

      <section id="work" className="flex flex-col gap-8 sm:flex-row">
        {splitIntoColumns(homeProjects).map((column, i) => (
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
