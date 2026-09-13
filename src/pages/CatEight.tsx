import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";
import Zoomable from "../components/Zoomable";

export default function CatEight() {
  return (
    <main className="pb-24">
      <Nav />

      <section className="py-8">
        <Link to="/ai-experiments" className="underline">
          <WiggleText>← AI Experiments</WiggleText>
        </Link>

        <h1 className="mt-6 mb-2 text-3xl font-medium lg:text-5xl">08</h1>
        <p className="mb-10 max-w-xl italic">
          A tiny Pomodoro-style break reminder shaped like a cat. Tell her how often to check in
          and how long to stay, and up to four cats wander your screen — napping, stretching,
          playing, or just walking through — then disappear.
        </p>

        <div className="mb-12 bg-black">
          <Zoomable
            src="/experiments/08-cover.png"
            alt="08, Biscuit, Ash, and Mocha wandering the screen with the tray menu open, showing Number of cats, Show every, and Stay on screen"
            className="w-full"
          />
        </div>

        <div className="mb-12 flex justify-center">
          <a
            href="https://github.com/hey-niia/08/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="border px-6 py-3 underline"
          >
            <WiggleText>Download for Mac →</WiggleText>
          </a>
        </div>

        <h3 className="mt-8 mb-2">Why a cat</h3>
        <p className="my-4">
          08 is named after my actual cat. Whenever I look at her, she reminds me that I don't
          have to run around doing a hundred things like the world is ending — that it's fine to
          be lazy, do nothing for a second, and let time slow down. The name is also a quiet nod
          to <em>108 Bows of Gratitude</em>, a practice of gratitude and slowing down through
          repeated, mindful bows. Underneath, "show every" and "stay on screen" borrow a familiar
          Pomodoro shape because it's practical, but the spirit is closer to the bows: not just
          clocking work and breaks, but actually pausing, noticing, being grateful for a moment.
        </p>

        <h3 className="mt-8 mb-2">What I actually did here</h3>
        <p className="my-4">
          I'm a product designer, not a Swift or Electron engineer — I directed this the way I'd
          direct any product, by using it constantly and pushing back until it held up. Claude
          Code wrote the TypeScript; the calls were mine:
        </p>
        <ul className="my-4 list-inside list-disc space-y-2">
          <li>
            Rejecting a first pass where the cat only ever appeared as a static image, and asking
            for her to actually run across the screen with a real walk-cycle animation.
          </li>
          <li>
            Pushing further once that worked — asking her to wander freely wherever she wants
            instead of pacing a fixed line back and forth, "like she owns the screen."
          </li>
          <li>
            Asking for up to four cats with fun names, each on an independent schedule, and
            catching the bug where changing the count made all of them vanish instead of just
            resizing the roster.
          </li>
          <li>
            Catching that a cat could pop back up on its own moments after I'd just hidden
            everything — traced to the auto-schedule running off a fixed clock instead of
            resetting whenever a cat actually hid.
          </li>
          <li>
            Sending back three separate icon designs — a full-body cat that "didn't remind me of
            a cat," a filled glyph that was "hard to see," and a redesign based on a reference
            icon that turned out to be commercially licensed — before landing on the honest
            answer: use 08's own pixel art as the icon instead of drawing a new one.
          </li>
          <li>
            Deciding the placeholder sprites for the other three cats (borrowed from an
            open-source project, credited in the repo) needed to look like distinct animals, not
            recolors of the same shape — sent one back for reading as a faded duplicate instead of
            its own cat.
          </li>
        </ul>

        <h3 className="mt-8 mb-2">Worth knowing</h3>
        <p className="my-4">
          08 herself is original black-and-white pixel art. Biscuit, Ash, and Mocha are temporary
          placeholder sprites from the open-source{" "}
          <a
            href="https://github.com/wil-pe/CATAI"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            CATAI
          </a>{" "}
          project (MIT-licensed, credited in the repo) — the plan is to replace them with original
          art once there's time for a proper pass.
        </p>
      </section>

      <footer className="border-t py-8">
        <p>
          <a
            href="https://github.com/hey-niia/08"
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
