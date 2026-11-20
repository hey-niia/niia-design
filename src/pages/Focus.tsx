import { useEffect } from "react";
import { Link } from "react-router-dom";
import TaskiChecklist from "../components/TaskiChecklist";

/**
 * niia.design/focus: the Taski checklist on its own, nothing else on the page,
 * to keep open in a tab. Lists are saved in this browser only.
 */
export default function Focus() {
  useEffect(() => {
    const before = document.title;
    document.title = "Focus";
    // The site paints the page's overscroll pink to match the drawing pad;
    // this page has no pad, so keep it the page colour.
    const html = document.documentElement;
    html.style.backgroundColor = "var(--site-bg)";
    return () => {
      document.title = before;
      html.style.backgroundColor = "";
    };
  }, []);

  return (
    <main className="mx-auto max-w-[46rem] pt-12 pb-24 md:pt-24">
      <TaskiChecklist />
      {/* The site's name, pinned to the bottom-left corner. */}
      <Link
        to="/"
        className="fixed bottom-4 left-4 font-mono text-xs tracking-widest text-gray-400 uppercase hover:text-[var(--site-accent)]"
      >
        niia.design
      </Link>
    </main>
  );
}
