import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Journey from "../components/Journey";
import PhotoCarousel from "../components/PhotoCarousel";

const playPhotos = [
  { src: "/photos/play/play-01.webp", alt: "A child cutting foam blocks on a hot-wire cutter" },
  { src: "/photos/play/play-02.webp", alt: "Foam sculptures built by kids, displayed in a shop window" },
  { src: "/photos/play/play-03.webp", alt: "A structure of skewers and yellow clay balls" },
  { src: "/photos/play/play-04.webp", alt: "A geometric frame built from straws and clay joints" },
  { src: "/photos/play/play-05.webp", alt: "A skewer-and-clay tower on a white board" },
  { src: "/photos/play/play-06.webp", alt: "Hand-painted pink and blue pots arranged on grass" },
  { src: "/photos/play/play-07.webp", alt: "Paper silhouette cut-outs hung along a black outdoor wall" },
  { src: "/photos/play/play-08.webp", alt: "Orange painted cardboard animals laid out on a wooden deck" },
  { src: "/photos/play/play-09.webp", alt: "Painted animal cut-outs and paint pots on a table" },
];

export default function About() {
  return (
    <main className="pb-24">
      <Nav />

      <section className="pt-6 md:pt-24">
        <div className="max-w-2xl">
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

      <section className="flex justify-center pt-12">
        <div className="max-w-xl">
          <p className="mb-8 font-mono text-xs tracking-widest text-neutral-400 uppercase">
            My Journey
          </p>
          <Journey />
        </div>
      </section>

      <section className="pt-12">
        <p className="mb-8 font-mono text-xs tracking-widest text-neutral-400 uppercase">
          Values I Believe In
        </p>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:flex-1">
            <p className="font-mono text-6xl leading-none text-neutral-200">01</p>
            <p className="mt-4">Build the thing, not the deck.</p>
            <p className="mt-2 text-sm">
              Leap didn't leave room for slideware — customers cared whether the box worked, not
              why. That bias never left. I'd rather ship a rough prototype than defend a polished
              one.
            </p>
          </div>
          <div className="md:flex-1">
            <p className="font-mono text-6xl leading-none text-neutral-200">02</p>
            <p className="mt-4">Hide the complexity, not the effort.</p>
            <p className="mt-2 text-sm">
              AI products get complicated fast, and the job is making sure the person using them
              never has to know that. If a feature needs a tooltip to explain itself, the design
              isn't done yet.
            </p>
          </div>
          <div className="md:flex-1">
            <p className="font-mono text-6xl leading-none text-neutral-200">03</p>
            <p className="mt-4">Trust compounds faster than good ideas.</p>
            <p className="mt-2 text-sm">
              Running a studio taught me the best outcome rarely comes from being the smartest
              person in the room — it comes from a client or team that trusts the process enough
              to let it actually play out.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-12">
        <p className="mb-8 font-mono text-xs tracking-widest text-neutral-400 uppercase">
          Outside of Work
        </p>
        <p className="mb-6 max-w-xl">Work isn't the whole file.</p>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:flex-1">
            <PhotoCarousel photos={playPhotos} className="mb-3 h-40 w-full" />
            <p>My other design practice.</p>
            <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
              Play
            </p>
            <p className="mt-2 text-sm">
              I have kids, which reorganised my life around them — and turned out to be some of
              the best design training I've had. I ran creative workshops, then built a camp in
              Odesa where artists, musicians and directors from across Ukraine made things with
              kids rather than for them. It hadn't been done before. Now, in Berlin, it's
              quieter: our own kids, small performances, invented projects.
            </p>
          </div>
          <div className="md:flex-1">
            <img src="/photos/drawing.jpg" alt="" className="mb-3 h-40 w-full object-cover" />
            <p>I still draw, badly and often.</p>
            <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
              Sketchbook
            </p>
            <p className="mt-2 text-sm">
              [Medium — TK, e.g. gouache / sketchbook] is where I get to be wrong without
              consequences — no user testing, no stakeholders, just deciding something looks right
              and moving on. It's the fastest way I know to reset a design brain that's been
              staring at the same Figma file too long.
            </p>
          </div>
          <div className="md:flex-1">
            <img src="/photos/yoga.jpg" alt="" className="mb-3 h-40 w-full object-cover" />
            <p>Yoga is the one meeting I don't reschedule.</p>
            <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
              Movement
            </p>
            <p className="mt-2 text-sm">
              [Frequency — TK, e.g. most mornings] on the mat, mostly to remember that not
              everything needs to be optimized. It's the closest thing I have to a version control
              system for my own attention.
            </p>
          </div>
        </div>
      </section>

      <section className="flex justify-center pt-12">
        <div className="max-w-xl">
          <p className="mb-8 font-mono text-xs tracking-widest text-neutral-400 uppercase">
            Let's Talk
          </p>
          <p>
            I'm generally in for AI-first products, small studios doing unusually good work, or
            anything where the interface has to do more explaining than the sales page. Reach out
            — I read everything myself.
          </p>
          <p className="mt-4">
            <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
              Say hello →
            </a>{" "}
            or{" "}
            <a
              href="https://www.linkedin.com/in/niia-bieliavtseva/"
              target="_blank"
              rel="noopener noreferrer"
            >
              find me on LinkedIn
            </a>
            . Or head back <Link to="/">home</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
