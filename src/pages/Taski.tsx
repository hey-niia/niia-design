import { Link } from "react-router-dom";
import ExperimentCard from "../components/ExperimentCard";
import GitHubIcon from "../components/GitHubIcon";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";
import Zoomable from "../components/Zoomable";
import { experiments } from "../data/experiments";

export default function Taski() {
  const moreExperiments = experiments.filter((exp) => exp.link !== "/taski");

  return (
    <main>
      <Nav />

      <div className="mx-auto max-w-4xl pt-6 md:pt-24">
        <header className="border-b border-gray-200 pb-8">
          <Link
            to="/ai-playground"
            className="mb-6 block text-sm text-gray-400 hover:text-[#e65f2e]"
          >
            <WiggleText>← AI Playground</WiggleText>
          </Link>

          <h1 className="mb-4 text-3xl font-medium lg:text-5xl">Taski</h1>
          <p className="max-w-2xl text-gray-500 italic">
            A native Mac to-do app for routines that reset instead of nagging
            you. Group tasks into named routines that check off and start fresh
            each day, let anything recur on its own schedule, and keep one-off
            life-admin in a plain "Unsorted" list — no streaks, no red, no
            guilt.
          </p>
        </header>

        <section className="py-8">
          <div className="mb-12 bg-black">
            <Zoomable
              src="/experiments/taski-cover.png"
              alt="Taski showing a Morning routine, a Work routine, and an Evening wind-down routine, each with recurring tasks and schedule chips"
              className="w-full"
            />
          </div>

          <div className="flex justify-center">
            <a
              href="https://github.com/hey-niia/taski/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
            >
              Download for Mac <span aria-hidden>→</span>
            </a>
          </div>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            The story
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            Ever notice how an unstructured day quietly turns into working until
            midnight? Not from a lack of trying — just because nothing external
            gave the day a shape. That's the wall I kept watching family and
            friends with ADHD hit, and it's exactly where typical to-do apps
            make things worse: streaks that break, overdue items that turn red,
            a running score of how behind you are. None of that helps when the
            problem is structure, not motivation — so instead of guessing at
            what would, I dove into the actual research on ADHD and attention.
          </p>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            The clearest finding wasn't really about color — it's that red's
            alarm association is a <em>learned convention</em>, exactly the
            emotional register this app opts out of, which is the actual case
            for building real theming instead of settling on one "correct"
            palette.
          </p>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            The product idea that came out of that: <strong>routines</strong>,
            not tasks with due dates, are the right unit for structure. A
            "Morning" routine that resets every day gives the start of the day a
            shape without anyone deciding anything; a one-off task like "renew
            car insurance" doesn't need to belong to a routine at all, so it
            lives in a plain Unsorted list instead of being forced somewhere it
            doesn't fit.
          </p>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            What I actually did here
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            I design software for a living but had never shipped a native Mac
            app myself, and a Tauri + Rust + Swift stack was new ground. I
            directed Claude Code through the whole build — architecture, every
            UI decision, and the research — rather than writing the Rust or
            Swift myself. A few of the calls along the way:
          </p>
          <ul className="my-4 max-w-[46rem] list-outside list-disc space-y-2 pl-5 text-[1.125rem] leading-[1.8]">
            <li className="pl-1">
              Choosing routines-with-recurrence over due-dates-with-tags as the
              core model, and deciding a one-off task shouldn't be forced into a
              routine to be useful.
            </li>
            <li className="pl-1">
              Reading the actual literature on color and attention before
              deciding on the palette and motion rules, instead of assuming
              "calming" meant a specific color — and writing down where the
              evidence was strong versus thin.
            </li>
            <li className="pl-1">
              Rejecting an early redesign pass that quietly turned "overdue" red
              and asking for it back out — the app's whole premise is that
              overdue shouldn't look like an alarm.
            </li>
            <li className="pl-1">
              Catching repeated pixel-level misalignments between the routine
              header icon, the task checkbox, and the composer row that I kept
              sending back until they were actually identical, not just close.
            </li>
            <li className="pl-1">
              Asking for the routine icon field to become a real searchable
              emoji picker, like the native macOS picker or Slack's, instead of
              a text field you type or paste an emoji into.
            </li>
            <li className="pl-1">
              Directing the on-device icon-suggestion feature: a new routine's
              icon is suggested automatically by Apple's on-device Foundation
              Models framework, editable by hand at any time — no cloud call, no
              account.
            </li>
          </ul>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            What it does
          </h3>
          <ul className="my-4 max-w-[46rem] list-outside list-disc space-y-2 pl-5 text-[1.125rem] leading-[1.8]">
            <li className="pl-1">
              <strong>Routines</strong> — named, reorderable groups of tasks,
              each with its own icon, suggested on-device when you create it.
            </li>
            <li className="pl-1">
              <strong>Recurrence</strong> — daily, weekly on specific days, or a
              custom interval; anything can recur, not just routine tasks.
            </li>
            <li className="pl-1">
              <strong>Drag-and-drop reordering</strong> — within a routine or
              between routines, via a hover-revealed handle that stays out of
              the way otherwise.
            </li>
            <li className="pl-1">
              <strong>Calendar</strong> — an Upcoming list grouped by day, or a
              Month grid with a day-detail panel, both backed by the same
              completion history.
            </li>
            <li className="pl-1">
              <strong>Four themes</strong> — Paper, Clay, Sky, and Dusk (a dark
              mode), covering the light-sensitivity gap the research turned up.
            </li>
          </ul>

          <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-black">
              <Zoomable
                src="/experiments/taski-theme.png"
                alt="Taski's theme picker open, showing four palette options"
                className="w-full"
              />
            </div>
            <div className="bg-black">
              <Zoomable
                src="/experiments/taski-calendar-upcoming.png"
                alt="Taski's Calendar screen in Upcoming view, tasks grouped by day"
                className="w-full"
              />
            </div>
            <div className="bg-black">
              <Zoomable
                src="/experiments/taski-calendar-month.png"
                alt="Taski's Calendar screen in Month view, with a day-detail panel"
                className="w-full"
              />
            </div>
          </div>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            Worth knowing
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            Taski is unsigned but runs natively on both Apple Silicon and Intel
            Macs. No account, no server, no analytics — every task, routine, and
            completion lives in a local SQLite database on your Mac.
          </p>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            This is the second version. The{" "}
            <Link to="/taski-v1" className="underline">
              <WiggleText>first version</WiggleText>
            </Link>{" "}
            was a simple web to-do list — still live, if you want to see where
            it started.
          </p>
        </section>

        <footer className="border-t border-gray-200 py-16">
          <div className="flex items-center justify-center">
            <a
              href="https://github.com/hey-niia/taski"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <GitHubIcon className="h-4 w-4" />
              <WiggleText>View on GitHub</WiggleText>
            </a>
          </div>
        </footer>

        {moreExperiments.length > 0 && (
          <section className="py-16">
            <p className="mb-6 text-sm tracking-wide text-gray-400 uppercase">
              More AI experiments
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreExperiments.map((exp) => (
                <ExperimentCard key={exp.name} exp={exp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
