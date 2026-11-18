import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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

      {/* The intro: a centred block as wide as its longest line, text aligned
          left, with a little more room below it than above, before the work. */}
      <section id="about" className="pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="mx-auto flex w-fit max-w-full flex-col gap-4 text-left">
          <p className="t-intro text-2xl">I design products, build with AI, and think like a founder.</p>
          <p className="t-intro text-2xl">
            <span className="md:whitespace-nowrap">What I love: taking ownership, solving business problems</span>{" "}
            <br className="hidden md:block" />
            through design, and turning ideas into real products.
          </p>
        </div>
      </section>

      {/* On phones the columns dissolve into one list that reads across the rows
          (left, right, left, right), not down the first column and then the second. */}
      <section id="work" className="flex flex-col gap-8 sm:flex-row">
        {splitIntoColumns(homeProjects).map((column, i) => (
          <div key={i} className="max-sm:contents sm:flex sm:flex-1 sm:flex-col sm:gap-8">
            {column.map((project, row) => (
              <div
                key={project.slug}
                // Phones read across the rows; the first row is flipped so Giant
                // Pumpkin (right column) comes before the app (left column).
                style={{ order: row === 0 ? 1 - i : row * 2 + i }}
              >
                <WorkGridCard project={project} />
              </div>
            ))}
          </div>
        ))}
      </section>

    </main>
  );
}
