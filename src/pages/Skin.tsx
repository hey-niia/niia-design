import { Link } from "react-router-dom";
import ExperimentCard from "../components/ExperimentCard";
import GitHubIcon from "../components/GitHubIcon";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";
import Zoomable from "../components/Zoomable";
import { experiments } from "../data/experiments";

const skins = [
  {
    src: "/experiments/skin-settings.webp",
    name: "Settings",
    caption: "Pick a skin, set the paper grain, tilt the sheets, choose how chats get sent.",
    alt: "Skin settings panel with the neon, kraft, fold and vellum skins, a grain slider and paper toggles",
  },
  {
    src: "/experiments/skin-neon.webp",
    name: "Neon",
    caption: "Flat and bright on black.",
    alt: "Skin board in the neon skin: bright pink, yellow, blue and green paper folders on black",
  },
  {
    src: "/experiments/skin-vellum.webp",
    name: "Vellum",
    caption: "Quiet, almost white — a single yellow sheet stands out.",
    alt: "Skin board in the vellum skin: off-white and grey folders with two yellow ones",
  },
];

const paragraph = "my-4 max-w-[46rem] text-[1.125rem] leading-[1.8]";
const heading = "mt-12 mb-3 max-w-[46rem] text-[1.375rem] font-semibold";

export default function Skin() {
  const moreExperiments = experiments.filter((exp) => exp.link !== "/skin");

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

          <h1 className="mb-4 text-3xl font-medium lg:text-5xl">Skin</h1>
          <p className="max-w-2xl text-gray-500 italic">
            A private, local-first skin for your LLM — like Winamp skins, but
            for Claude and ChatGPT.
          </p>
        </header>

        <section className="py-8">
          <div className="mb-12 bg-black">
            <Zoomable
              src="/experiments/skin-cover.webp"
              alt="Skin board in the kraft skin: conversations sorted into risograph-colored paper folders, private ones in vellum envelopes"
              className="w-full"
            />
          </div>

          <div className="flex justify-center">
            <a
              href="https://github.com/hey-niia/skin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-black px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
            >
              Download for Mac <span aria-hidden>→</span>
            </a>
          </div>

          <h3 className={heading}>The idea</h3>
          <p className={paragraph}>
            Instead of the default chat UI, you see your own board: every
            conversation sorted into folders, and every folder is a tile you
            style yourself — color, image, label, or no label at all.
          </p>

          <h3 className={heading}>Principles</h3>
          <ul className="my-4 max-w-[46rem] list-outside list-disc space-y-2 pl-5 text-[1.125rem] leading-[1.8]">
            <li className="pl-1">
              <strong>Local-first.</strong> No Skin server. Chats, folders and
              settings live on your device.
            </li>
            <li className="pl-1">
              <strong>Hide what you want.</strong> Turn off a folder's name and
              keep just a color. You know what pink means.
            </li>
            <li className="pl-1">
              <strong>Open source</strong>, so anyone can verify where the data
              goes.
            </li>
          </ul>

          <h3 className={heading}>Skins</h3>
          <p className={paragraph}>
            The design direction is analog paper — grain, soft shadows, folded
            corners, vellum envelopes for private folders. Pick a skin in settings
            and the same board changes paper:
          </p>
          <div className="mt-8 space-y-10">
            {skins.map((s) => (
              <figure key={s.src}>
                <div className="bg-black">
                  <Zoomable src={s.src} alt={s.alt} className="w-full" />
                </div>
                <figcaption className="mt-3 text-sm text-gray-500">
                  <span className="font-medium text-gray-900">{s.name}.</span>{" "}
                  {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <h3 className={heading}>Status</h3>
          <p className={paragraph}>
            Early concept — a paper prototype of the board.
          </p>

          <figure className="mt-12">
            <div className="bg-black">
              <Zoomable
                src="/experiments/skin-chat.webp"
                alt="An open Skin conversation on a blue sheet of paper, filed under board / design / reading, with Claude's answer and image results"
                className="w-full"
              />
            </div>
            <figcaption className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-900">Chat.</span> Open a
              folder and the conversation lives on its sheet of paper.
            </figcaption>
          </figure>
        </section>

        <footer className="border-t border-gray-200 py-16">
          <div className="flex items-center justify-center">
            <a
              href="https://github.com/hey-niia/skin"
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
