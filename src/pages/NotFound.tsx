import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import WanderingCat from "../components/WanderingCat";
import WiggleText from "../components/WiggleText";
import { useNiiaChat } from "../context/useNiiaChat";

const DESTINATIONS = [
  {
    to: "/",
    state: { scrollTo: "work" } as const,
    title: "Work",
    description: "Browse the case studies",
  },
  {
    to: "/ai-playground",
    title: "AI Playground",
    description: "Experiments built with Claude Code",
  },
  {
    to: "/about",
    title: "About Me",
    description: "Get to know me better",
  },
];

export default function NotFound() {
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [catMinY, setCatMinY] = useState(0);
  const [measured, setMeasured] = useState(false);
  const { openWelcome } = useNiiaChat();

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const copy = copyRef.current;
    if (!stage || !copy) return;

    const measure = () => {
      setCatMinY(copy.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 24);
      setMeasured(true);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Nav />

      <div className="mx-auto max-w-4xl pt-6 md:pt-16">
        <div
          ref={stageRef}
          className="relative min-h-[58vh] overflow-hidden md:min-h-[65vh]"
        >
          {measured && (
            <>
              <WanderingCat boundsRef={stageRef} startDelayMs={200} minY={catMinY} />
              <WanderingCat
                boundsRef={stageRef}
                size={72}
                startDelayMs={1400}
                minY={catMinY}
                coat="gold"
              />
            </>
          )}

          <div
            ref={copyRef}
            className="pointer-events-none relative z-10 flex flex-col items-center pt-4 text-center"
          >
            <p className="text-[6rem] leading-none font-medium text-gray-100 select-none sm:text-[9rem]">
              404
            </p>

            <h1 className="mt-2 text-2xl font-medium sm:text-3xl">This page wandered off</h1>
            <p className="mt-4 max-w-md text-sm text-gray-500">
              Somewhere between shipping an AI chatbot and teaching a cat to roam my menu bar,
              this URL got lost. The black one up there is my actual cat — I coincidentally
              named{" "}
              <Link to="/08" className="pointer-events-auto underline">
                08
              </Link>{" "}
              after her. The gold one's just a friend she picked up along the way. Click either,
              they both like it.
            </p>

            <div className="pointer-events-auto mt-6 flex flex-col items-center gap-2 font-mono text-sm tracking-widest text-gray-400 uppercase sm:flex-row sm:gap-4">
              <Link to="/" className="text-black hover:text-[#e65f2e]">
                <WiggleText>Back to Homepage</WiggleText>
              </Link>
              <span aria-hidden className="hidden sm:inline">
                ·
              </span>
              <a href="mailto:nia.bieliavtseva@gmail.com" target="_blank" rel="noopener noreferrer">
                Need help? <WiggleText>Get in touch</WiggleText>
              </a>
            </div>
          </div>
        </div>

        <section className="relative z-10 border-t border-gray-200 pt-10 pb-8">
          <p className="mb-6 text-center text-sm tracking-wide text-gray-400 uppercase">
            Here's where you can go instead
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.title}
                to={dest.to}
                state={dest.state}
                className="group block rounded-sm bg-neutral-100 p-5 transition-colors hover:bg-neutral-200/70"
              >
                <p className="font-medium text-black">
                  <WiggleText>{dest.title}</WiggleText>{" "}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500">{dest.description}</p>
              </Link>
            ))}

            <button
              type="button"
              onClick={openWelcome}
              className="group block rounded-sm bg-neutral-100 p-5 text-left transition-colors hover:bg-neutral-200/70"
            >
              <p className="font-medium text-black">
                <span aria-hidden className="mr-1 text-[#e65f2e]">
                  ✦
                </span>
                <WiggleText>Talk to Niia AI</WiggleText>{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-500">Ask my AI about my work</p>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
