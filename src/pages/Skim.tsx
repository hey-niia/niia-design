import { Link } from "react-router-dom";
import ExperimentCard from "../components/ExperimentCard";
import GitHubIcon from "../components/GitHubIcon";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";
import Zoomable from "../components/Zoomable";
import { experiments } from "../data/experiments";

export default function Skim() {
  const moreExperiments = experiments.filter((exp) => exp.link !== "/skim");

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

          <h1 className="mb-4 text-3xl font-medium lg:text-5xl">Skim</h1>
          <p className="max-w-2xl text-gray-500 italic">
            A native Mac news reader that reads the article for you — one main
            idea, a few key points, entirely on-device. No account, no cloud
            API, no cost.
          </p>
        </header>

        <section className="py-8">
          <div className="mb-12 bg-black">
            <Zoomable
              src="/experiments/skim-cover.png"
              alt="Skim showing a Pitchfork headline digested into a main idea and numbered key points"
              className="w-full"
            />
          </div>

          <div className="flex justify-center">
            <a
              href="https://github.com/hey-niia/skim/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
            >
              Download for Mac <span aria-hidden>→</span>
            </a>
          </div>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            The habit this came from
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            I read the same three sites every day — The New York Times,
            Ukrainian Pravda, and Pitchfork — by keeping a row of pinned browser
            tabs open and clicking between them. Most of what's actually{" "}
            <em>in</em> an article is one idea and a couple of supporting facts;
            the rest is scrolling. Apple News solves the "too many sources"
            problem by drowning you in more sources. I wanted the opposite: a
            short, deliberate list of the handful of sites I actually read, and
            a way to get to the point of each article without leaving the app.
          </p>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            The idea I kept coming back to was to treat sources the way the Dock
            treats apps — a short row of icons you click between — paired with
            something a browser tab genuinely can't do: read the headline, pull
            the article body, and hand it to an on-device model that hands back
            one main idea and a few key points. On-device wasn't a compromise,
            it was the point — no API key, no per-article cost, nothing about
            what I read leaving my Mac.
          </p>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            What I actually did here
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            I'm a product designer, not an iOS engineer — I directed this the
            way I'd direct any product, not by writing Swift. Claude Code wrote
            the code; the idea, the interaction model, and every call on whether
            something was right were mine, made by actually using the app and
            pushing back until it held up. A few of the calls I made along the
            way:
          </p>
          <ul className="my-4 max-w-[46rem] list-outside list-disc space-y-2 pl-5 text-[1.125rem] leading-[1.8]">
            <li className="pl-1">
              The core concept — sources as a dock, articles reduced to a main
              idea plus key points — and the decision to keep it on-device
              instead of reaching for a cloud LLM API.
            </li>
            <li className="pl-1">
              Catching that a "62 best albums of the year" article came back as
              a generic blurb instead of the actual albums, and pushing for a
              rewrite until list-style articles surfaced the real named items.
            </li>
            <li className="pl-1">
              Asking for a compact/comfortable density toggle once the
              image-heavy list started crowding out the article — the article is
              the point, the list shouldn't fight it for space (I asked for a
              60:40 split in its favor).
            </li>
            <li className="pl-1">
              Flagging that a failed summary should say so in the list, so I'm
              not clicking the same dead article twice.
            </li>
            <li className="pl-1">
              Asking for background pre-summarization so headlines are already
              digested by the time I open the app, and a 15-minute auto-refresh
              so I don't have to think about it.
            </li>
            <li className="pl-1">
              Rejecting a first-pass icon, a misaligned reading column, and a
              title that wasn't centered against its cover image — and sending
              each back until it actually looked considered.
            </li>
          </ul>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            Worth knowing
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            Apple's on-device model has its own safety guardrails and will
            decline to summarize some articles — mostly ones about war or
            violence, which matters given one of my three sources is a Ukrainian
            paper covering an active war. When that happens, Skim says so
            plainly instead of pretending it's a bug.
          </p>
        </section>

        <footer className="border-t border-gray-200 py-16">
          <div className="flex items-center justify-center">
            <a
              href="https://github.com/hey-niia/skim"
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
