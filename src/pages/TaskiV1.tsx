import { Link } from "react-router-dom";
import MoreExperiments from "../components/MoreExperiments";
import Nav from "../components/Nav";
import TaskiChecklist from "../components/TaskiChecklist";
import WiggleText from "../components/WiggleText";

export default function TaskiV1() {
  return (
    <main>
      <Nav />

      <div className="mx-auto max-w-4xl pt-6 md:pt-24">
        <header className="pb-8">
          {/* Same header as the Work case studies. */}
          <p className="mb-4 font-mono text-xs tracking-widest text-gray-400 uppercase">
            Web app
          </p>
          <h1 className="mb-4 text-3xl font-medium lg:text-5xl">Taski 1.0</h1>
          <p className="mt-4 max-w-2xl">
            Just a simple checklist for you. No distractions, no pressure. Open
            it in a new tab whenever you need it, add your tasks, and check them
            off at your own pace.
          </p>
          <a
            href="/focus"
            target="_blank"
            rel="noopener noreferrer"
            className="soft-hover soft-key mt-6 gap-2 font-mono text-xs tracking-widest text-neutral-700 uppercase"
          >
            Open in a new tab <span aria-hidden>↗</span>
          </a>
        </header>

        <section className="py-8">
          <TaskiChecklist />

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            Why it became something else
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            This version proved the idea — routines instead of due dates — but
            it lived in a browser tab, which meant it was only ever as close as
            the tab I happened to have open. The{" "}
            <Link to="/taski" className="underline">
              <WiggleText>native Mac app</WiggleText>
            </Link>{" "}
            picks up from here: same core idea, now with recurrence,
            drag-and-drop, a calendar, and real theming.
          </p>
        </section>

        <footer className="py-16">
          <div className="flex items-center justify-center">
            <Link
              to="/taski"
              className="soft-hover soft-key gap-2 font-mono text-xs tracking-widest text-neutral-700 uppercase"
            >
              See the current version <span aria-hidden>→</span>
            </Link>
          </div>
        </footer>
      </div>

      <MoreExperiments current="/taski-v1" />
    </main>
  );
}
