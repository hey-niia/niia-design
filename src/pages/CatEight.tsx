import { Link } from "react-router-dom";
import ExperimentCard from "../components/ExperimentCard";
import GitHubIcon from "../components/GitHubIcon";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";
import Zoomable from "../components/Zoomable";
import { experiments } from "../data/experiments";

export default function CatEight() {
  const moreExperiments = experiments.filter((exp) => exp.link !== "/08");

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

          <h1 className="mb-4 text-3xl font-medium lg:text-5xl">08</h1>
          <p className="max-w-2xl text-gray-500 italic">
            A little Mac app named after my cat. Every now and then she walks
            onto your screen, sits down, and reminds you to step away from the
            computer and enjoy life for a bit.
          </p>
        </header>

        <section className="py-8">
          <div className="mb-12 bg-black">
            <Zoomable
              src="/experiments/08-cover.png"
              alt="08, a white-and-grey pixel cat, sitting in the middle of a dark Mac desktop"
              className="w-full"
            />
          </div>

          <div className="flex justify-center">
            <a
              href="https://github.com/hey-niia/08/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
            >
              Download for Mac <span aria-hidden>→</span>
            </a>
          </div>

          <h3 className="mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold">
            Why a cat
          </h3>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            08 is my cat. Whenever I look at her, she reminds me that there's a
            whole life away from the screen — and that it's fine to slow down
            and go live it for a bit.
          </p>
          <p className="my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]">
            The app does the same: after you've worked for a while, she slowly
            walks in, sits in the middle of your screen and swishes her tail.
            That's your cue to get up too: stretch, look out of the window, make
            some tea. When the break is over, she walks away. You choose how
            long you work and how long the break is.
          </p>
        </section>

        <footer className="border-t border-gray-200 py-16">
          <div className="flex items-center justify-center">
            <a
              href="https://github.com/hey-niia/08"
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
