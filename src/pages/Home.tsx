import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import TitledSection from "../components/TitledSection";
import WorkGridItem from "../components/WorkGridItem";
import WiggleText from "../components/WiggleText";
import { projects } from "../data/projects";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      requestAnimationFrame(() => {
        document.getElementById(state.scrollTo!)?.scrollIntoView();
      });
    }
  }, [location.state]);

  return (
    <main className="pb-24">
      <Nav />
      <Hero />

      <TitledSection id="about" title="About" contentClassName="md:max-w-6xl">
        <p className="mb-2">
          I help startups and scale-ups turn complex, AI-driven products into interfaces people
          actually use.
        </p>
        <p>
          I design interfaces and build them into working products{" "}
          <Link to="/ai-experiments" className="underline">
            <WiggleText>with AI</WiggleText>
          </Link>{" "}
          — from narrative websites to data-rich dashboards, closing the gap between idea and
          shipped.
        </p>
      </TitledSection>

      <TitledSection id="experience" title="Experience" contentClassName="md:max-w-6xl">
        <p>Freelance — 2022–Present</p>
        <p className="my-2 italic">
          End-to-end product design for startups and scale-ups. Current work spans an AI-first
          iOS wellness app, enterprise dashboards, and web platforms — covering research, design
          systems, interaction design, and full delivery.
        </p>

        <p className="mt-6">
          <a
            href="https://overspace.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <WiggleText>Overspace</WiggleText>
          </a>{" "}
          — Co-founder — 2021–Present
        </p>
        <p className="my-2 italic">
          Co-founded a product design studio for startups and teams building what's next — from
          strategy and research to UI/UX design and design systems.
        </p>

        <p className="mt-6">
          <a
            href="https://superleap.com.ua/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <WiggleText>Leap</WiggleText>
          </a>{" "}
          — Founder — 2016–2021
        </p>
        <p className="my-2 italic">
          Before Overspace, founded Leap, growing it into [growth stat — TK]. As the sole founder
          I did everything: working with designers, product and packaging design, distribution,
          and social media — the generalist range startups still hire me for today.
        </p>
      </TitledSection>

      <section id="work" className="my-8">
        <h3 className="mb-6 border-b pb-2">Selected Work</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
          {projects.map((project) => (
            <WorkGridItem key={project.slug} project={project} wide />
          ))}
        </div>
      </section>
    </main>
  );
}
