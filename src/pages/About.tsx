import Nav from "../components/Nav";
import Journey from "../components/Journey";
import WiggleText from "../components/WiggleText";
import { useNiiaChat } from "../context/useNiiaChat";

const EMAIL = "nia.bieliavtseva@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/niia-bieliavtseva/";

export default function About() {
  const { openWelcome } = useNiiaChat();

  return (
    <main className="pb-24">
      <Nav />

      <div className="mx-auto max-w-4xl">
        <section className="pt-6 md:pt-24">
          <div className="flex flex-col-reverse gap-8 md:flex-row md:items-start md:gap-12">
            <div className="max-w-2xl">
              <p className="mb-4">
                I started as a founder, not a designer. Leap was mine from day one — packaging,
                distribution, the Instagram page, all of it — because there was no one else to
                hand it to. Design was just the tool I reached for most.
              </p>
              <p className="mb-4">
                Overspace is where that turned into a craft instead of a habit — a small studio
                built with people I trust, doing the unglamorous parts of product design that make
                the flashy parts possible: research nobody sees, systems nobody notices until
                they're missing.
              </p>
              <p className="mb-6">
                These days I split my time between client work and building things myself, mostly
                in the AI space — wellness apps, dashboards, tools that have to explain themselves
                to people who didn't ask for more software in their lives. I still write the code,
                not just the spec.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-black px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
                >
                  <span aria-hidden>↓</span> Download Resume
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-black px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
                >
                  LinkedIn <span aria-hidden>↗</span>
                </a>
              </div>
            </div>

            <img
              src="/photos/niia.jpg"
              alt="Niia Bieliavtseva"
              className="h-40 w-40 shrink-0 self-center object-cover grayscale md:h-52 md:w-52 md:self-auto"
            />
          </div>
        </section>

        <section className="pt-16">
          <p className="mb-8 font-mono text-xs tracking-widest text-neutral-400 uppercase">
            My Journey
          </p>
          <Journey />
        </section>

        <section className="pt-16">
          <p className="mb-8 font-mono text-xs tracking-widest text-neutral-400 uppercase">
            Values I Believe In
          </p>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="group border-t border-neutral-200 pt-4 transition-colors duration-200 hover:border-[#e65f2e] md:flex-1">
              <p className="font-mono text-6xl leading-none text-neutral-200">01</p>
              <p className="mt-4 transition-transform duration-200 md:group-hover:translate-x-1">
                Build the thing, not the deck.
              </p>
              <p className="mt-2 text-sm">
                Leap didn't leave room for slideware — customers cared whether the box worked, not
                why. That bias never left. I'd rather ship a rough prototype than defend a
                polished one.
              </p>
            </div>
            <div className="group border-t border-neutral-200 pt-4 transition-colors duration-200 hover:border-[#e65f2e] md:flex-1">
              <p className="font-mono text-6xl leading-none text-neutral-200">02</p>
              <p className="mt-4 transition-transform duration-200 md:group-hover:translate-x-1">
                Hide the complexity, not the effort.
              </p>
              <p className="mt-2 text-sm">
                AI products get complicated fast, and the job is making sure the person using them
                never has to know that. If a feature needs a tooltip to explain itself, the design
                isn't done yet.
              </p>
            </div>
            <div className="group border-t border-neutral-200 pt-4 transition-colors duration-200 hover:border-[#e65f2e] md:flex-1">
              <p className="font-mono text-6xl leading-none text-neutral-200">03</p>
              <p className="mt-4 transition-transform duration-200 md:group-hover:translate-x-1">
                Trust compounds faster than good ideas.
              </p>
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <img src="/photos/drawing.jpg" alt="" className="mb-3 h-80 w-full object-cover" />
              <p>I draw</p>
              <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
                Sketchbook
              </p>
              <p className="mt-2 text-sm">
                My sketchbook is where I get to be wrong without consequences — no user testing,
                no stakeholders, just deciding something looks right and moving on. It's the
                fastest way I know to reset a design brain that's been staring at the same Figma
                file too long.
              </p>
            </div>
            <div>
              <img src="/photos/yoga.jpg" alt="" className="mb-3 h-80 w-full object-contain" />
              <p>I do yoga</p>
              <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
                Movement
              </p>
              <p className="mt-2 text-sm">
                Most mornings on the mat, mainly to remember that not everything needs to be
                optimized. It's the closest thing I have to a version control system for my own
                attention.
              </p>
            </div>
            <div className="sm:col-span-2">
              <iframe
                title="Spotify playlist"
                src="https://open.spotify.com/embed/playlist/6qaHceIrJis8W5COoyTZIE?utm_source=generator&theme=0"
                width="100%"
                height="352"
                style={{ borderRadius: 12 }}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-gray-200 py-16">
          <div className="flex items-center justify-center gap-8">
            <a
              href={`mailto:${EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <span aria-hidden>✉</span>
              <WiggleText>Email</WiggleText>
            </a>
            <button
              type="button"
              onClick={openWelcome}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <span aria-hidden>✦</span>
              <WiggleText>Talk to Niia AI</WiggleText>
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
