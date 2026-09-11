import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Journey from "../components/Journey";
import WiggleText from "../components/WiggleText";

export default function About() {
  return (
    <main className="pb-24">
      <Nav />

      <header className="border-b py-8">
        <h1 className="font-black tracking-tight text-4xl lg:text-6xl">About</h1>
      </header>

      <section className="border-b py-8">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4">
            I started as a founder, not a designer. Leap was mine from day one — packaging,
            distribution, the Instagram page, all of it — because there was no one else to hand it
            to. Design was just the tool I reached for most.
          </p>
          <p className="mb-4">
            Overspace is where that turned into a craft instead of a habit — a small studio built
            with people I trust, doing the unglamorous parts of product design that make the
            flashy parts possible: research nobody sees, systems nobody notices until they're
            missing.
          </p>
          <p>
            These days I split my time between client work and building things myself, mostly in
            the AI space — wellness apps, dashboards, tools that have to explain themselves to
            people who didn't ask for more software in their lives. I still write the code, not
            just the spec.
          </p>
        </div>
      </section>

      <section className="border-b py-8">
        <h3 className="mb-6 font-bold">My Journey</h3>
        <Journey />
      </section>

      <section className="border-b py-8">
        <h3 className="mb-6 font-bold">Values I Believe In</h3>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:flex-1">
            <p className="font-mono text-sm opacity-60">01</p>
            <h4 className="mt-1 mb-2">Build the thing, not the deck.</h4>
            <p className="italic">
              Leap didn't leave room for slideware — customers cared whether the box worked, not
              why. That bias never left. I'd rather ship a rough prototype than defend a polished
              one.
            </p>
          </div>
          <div className="md:flex-1">
            <p className="font-mono text-sm opacity-60">02</p>
            <h4 className="mt-1 mb-2">Hide the complexity, not the effort.</h4>
            <p className="italic">
              AI products get complicated fast, and the job is making sure the person using them
              never has to know that. If a feature needs a tooltip to explain itself, the design
              isn't done yet.
            </p>
          </div>
          <div className="md:flex-1">
            <p className="font-mono text-sm opacity-60">03</p>
            <h4 className="mt-1 mb-2">Trust compounds faster than good ideas.</h4>
            <p className="italic">
              Running a studio taught me the best outcome rarely comes from being the smartest
              person in the room — it comes from a client or team that trusts the process enough
              to let it actually play out.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b py-8">
        <h3 className="mb-6 font-bold">Outside of Work</h3>
        <p className="mb-6 max-w-xl">Work isn't the whole file.</p>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:flex-1">
            {/* Wikimedia Commons, CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Child_engaged_in_creative_play_with_wooden_building_blocks_on_a_pink_play_mat_in_a_cozy_indoor_space.jpg */}
            <img
              src="/photos/blocks.jpg"
              alt=""
              className="mb-3 h-40 w-full rounded-sm object-cover"
            />
            <h4 className="mb-2">I'm a bit obsessed with how kids learn to make things.</h4>
            <p className="italic">
              Long before software, most of us learned to build by playing — blocks, scribbles,
              taking stuff apart to see how it worked. I spend time thinking about how that kind
              of learning survives past age six [volunteer/mentor detail — TK], and it quietly
              shapes how I think about onboarding a total beginner into anything.
            </p>
          </div>
          <div className="md:flex-1">
            <img
              src="/photos/drawing.jpg"
              alt=""
              className="mb-3 h-40 w-full rounded-sm object-cover"
            />
            <h4 className="mb-2">I still draw, badly and often.</h4>
            <p className="italic">
              [Medium — TK, e.g. gouache / sketchbook] is where I get to be wrong without
              consequences — no user testing, no stakeholders, just deciding something looks right
              and moving on. It's the fastest way I know to reset a design brain that's been
              staring at the same Figma file too long.
            </p>
          </div>
          <div className="md:flex-1">
            <img
              src="/photos/yoga.jpg"
              alt=""
              className="mb-3 h-40 w-full rounded-sm object-cover"
            />
            <h4 className="mb-2">Yoga is the one meeting I don't reschedule.</h4>
            <p className="italic">
              [Frequency — TK, e.g. most mornings] on the mat, mostly to remember that not
              everything needs to be optimized. It's the closest thing I have to a version control
              system for my own attention.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h3 className="mb-6 font-bold">Let's Talk</h3>
        <p className="max-w-xl">
          I'm generally in for AI-first products, small studios doing unusually good work, or
          anything where the interface has to do more explaining than the sales page. Reach out —
          I read everything myself.
        </p>
        <p className="mt-4">
          <a
            href="mailto:nia.bieliavtseva@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <WiggleText>Say hello →</WiggleText>
          </a>{" "}
          or{" "}
          <a
            href="https://www.linkedin.com/in/niia-bieliavtseva/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <WiggleText>find me on LinkedIn</WiggleText>
          </a>
          . Or head back{" "}
          <Link to="/" className="underline">
            <WiggleText>home</WiggleText>
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
