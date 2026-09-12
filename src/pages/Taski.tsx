import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";

export default function Taski() {
  return (
    <main className="pb-24">
      <Nav />

      <section className="py-8">
        <Link to="/ai-experiments" className="underline">
          <WiggleText>← AI Experiments</WiggleText>
        </Link>

        <h1 className="mt-6 mb-2 text-3xl font-medium lg:text-5xl">Taski</h1>
        <p className="mb-10 max-w-xl italic">
          A native Mac to-do app for routines that reset instead of nagging you. Group tasks into
          named routines that check off and start fresh each day, let anything recur on its own
          schedule, and keep one-off life-admin in a plain "Unsorted" list — no streaks, no red,
          no guilt.
        </p>

        <div className="mb-12 bg-black">
          <img
            src="/experiments/taski-cover.png"
            alt="Taski showing a Morning routine, a Work routine, and an Evening wind-down routine, each with recurring tasks and schedule chips"
            className="w-full"
          />
        </div>

        <div className="mb-12 flex justify-center">
          <a
            href="https://github.com/hey-niia/taski/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="border px-6 py-3 underline"
          >
            <WiggleText>Download for Mac →</WiggleText>
          </a>
        </div>

        <h3 className="mt-8 mb-2">The story</h3>
        <p className="my-4">
          This started as a to-do app for my wife, who has ADHD. The specific thing it's built
          against is how an unstructured day quietly turns into working until midnight — not from
          a lack of trying, but because nothing external gave the day a shape. Most to-do apps
          make that worse: streaks that break, overdue items that turn red, a running score of how
          behind you are. None of that helps someone whose problem is executive function, not
          motivation.
        </p>
        <p className="my-4">
          I did the design research properly rather than guessing — it's checked against every
          decision already made, gaps and overclaims called out rather than smoothed over. The
          clearest, most defensible finding wasn't about color — ADHD doesn't change hue
          perception — it was that red's alarm association is a <em>learned convention</em>,
          exactly the emotional register this app opts out of, and that light sensitivity is
          dramatically more common in ADHD adults (69% vs. 28% in one clinical review), which is
          the actual case for building real theming instead of guessing at one "correct" palette.
        </p>
        <p className="my-4">
          The product idea that came out of that: <strong>routines</strong>, not tasks with due
          dates, are the right unit for structure. A "Morning" routine that resets every day gives
          the start of the day a shape without anyone deciding anything; a one-off task like
          "renew car insurance" doesn't need to belong to a routine at all, so it lives in a plain
          Unsorted list instead of being forced somewhere it doesn't fit.
        </p>

        <h3 className="mt-8 mb-2">What I actually did here</h3>
        <p className="my-4">
          I design software for a living but had never shipped a native Mac app myself, and a
          Tauri + Rust + Swift stack was new ground. I directed Claude Code through the whole
          build — architecture, every UI decision, and the research — rather than writing the Rust
          or Swift myself. A few of the calls along the way:
        </p>
        <ul className="my-4 list-inside list-disc space-y-2">
          <li>
            Choosing routines-with-recurrence over due-dates-with-tags as the core model, and
            deciding a one-off task shouldn't be forced into a routine to be useful.
          </li>
          <li>
            Reading the actual ADHD/UX literature before deciding on the palette and motion rules,
            instead of assuming "ADHD-friendly" meant a specific color — and writing down where
            the evidence was strong versus thin.
          </li>
          <li>
            Rejecting an early redesign pass that quietly turned "overdue" red and asking for it
            back out — the app's whole premise is that overdue shouldn't look like an alarm.
          </li>
          <li>
            Catching repeated pixel-level misalignments between the routine header icon, the task
            checkbox, and the composer row that I kept sending back until they were actually
            identical, not just close.
          </li>
          <li>
            Asking for the routine icon field to become a real searchable emoji picker, like the
            native macOS picker or Slack's, instead of a text field you type or paste an emoji
            into.
          </li>
          <li>
            Directing the on-device icon-suggestion feature: a new routine's icon is suggested
            automatically by Apple's on-device Foundation Models framework, editable by hand at
            any time — no cloud call, no account.
          </li>
        </ul>

        <h3 className="mt-8 mb-2">What it does</h3>
        <ul className="my-4 list-inside list-disc space-y-2">
          <li>
            <strong>Routines</strong> — named, reorderable groups of tasks, each with its own icon,
            suggested on-device when you create it.
          </li>
          <li>
            <strong>Recurrence</strong> — daily, weekly on specific days, or a custom interval;
            anything can recur, not just routine tasks.
          </li>
          <li>
            <strong>Drag-and-drop reordering</strong> — within a routine or between routines, via
            a hover-revealed handle that stays out of the way otherwise.
          </li>
          <li>
            <strong>Calendar</strong> — an Upcoming list grouped by day, or a Month grid with a
            day-detail panel, both backed by the same completion history.
          </li>
          <li>
            <strong>Four themes</strong> — Paper, Clay, Sky, and Dusk (a dark mode), covering the
            light-sensitivity gap the research turned up.
          </li>
        </ul>

        <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-black">
            <img
              src="/experiments/taski-theme.png"
              alt="Taski's theme picker open, showing four palette options"
              className="w-full"
            />
          </div>
          <div className="bg-black">
            <img
              src="/experiments/taski-calendar-upcoming.png"
              alt="Taski's Calendar screen in Upcoming view, tasks grouped by day"
              className="w-full"
            />
          </div>
          <div className="bg-black">
            <img
              src="/experiments/taski-calendar-month.png"
              alt="Taski's Calendar screen in Month view, with a day-detail panel"
              className="w-full"
            />
          </div>
        </div>

        <h3 className="mt-8 mb-2">Worth knowing</h3>
        <p className="my-4">
          Taski is unsigned and Apple Silicon only. No account, no server, no analytics — every
          task, routine, and completion lives in a local SQLite database on your Mac.
        </p>
      </section>

      <footer className="border-t py-8">
        <p>
          <a
            href="https://github.com/hey-niia/taski"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <WiggleText>View source on GitHub</WiggleText>
          </a>
        </p>
        <p className="my-2">
          <Link to="/ai-experiments" className="underline">
            <WiggleText>← AI Experiments</WiggleText>
          </Link>
        </p>
      </footer>
    </main>
  );
}
