import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import WorkGridCard from "../components/WorkGridCard";
import { projects } from "../data/projects";
import { splitIntoColumns } from "../lib/columns";
import { useNiiaChat } from "../context/useNiiaChat";

// The order projects appear in on the home page. Separate from the data's order,
// which the case studies' previous/next links follow.
const HOME_ORDER = ["ios-app", "hirement", "connectiq", "other-projects"];
const rank = (slug: string) => {
  const i = HOME_ORDER.indexOf(slug);
  return i === -1 ? HOME_ORDER.length : i;
};
const homeProjects = [...projects].sort((a, b) => rank(a.slug) - rank(b.slug));

// The highlighted part of the intro, quoted above the question in the chat.
const INTRO_LOVE = "Solving business problems through design";

export default function Home() {
  const { openWelcome, sendMessage } = useNiiaChat();
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
          {/* One phrase looks like text you've selected, with the Ask Niia AI pill
              beside it (below it on phones), to show visitors they can select
              any text and ask about it. */}
          <div className="relative flex flex-col items-start gap-4">
            <p className="t-intro text-2xl">
              <span className="md:whitespace-nowrap">
                What I love: collaborating with great teams,{" "}
                {/* The space sits inside the highlight so it stays one band on phones. */}
                <span className="intro-highlight">solving business problems </span>
              </span>
              <br className="hidden md:block" />
              <span className="intro-highlight">through design</span>, and turning ideas into real products.
            </p>
            <button
              type="button"
              onClick={() => {
                openWelcome();
                sendMessage("Tell me more about solving business problems through design", INTRO_LOVE);
              }}
              className="flex items-center gap-1.5 rounded-full bg-[var(--site-accent)]/90 px-3 py-1.5 text-xs whitespace-nowrap text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105 md:absolute md:top-0.5 md:left-full md:ml-6"
            >
              <span aria-hidden>✦</span> Ask Niia AI
            </button>
          </div>
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
