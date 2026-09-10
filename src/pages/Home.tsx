import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import { experiments } from "../data/experiments";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl py-16">
      <Header />

      <section className="border-b py-8">
        <h3 className="mb-2">About</h3>
        <p className="mb-2">
          I help startups and scale-ups turn complex, AI-driven products into interfaces people
          actually use.
        </p>
        <p>
          I design interfaces and build them into working products{" "}
          <a href="#ai-experiments" className="underline">
            with AI
          </a>{" "}
          — from narrative websites to data-rich dashboards, closing the gap between idea and
          shipped.
        </p>
      </section>

      <section className="border-b py-8">
        <h3 className="mb-2">Experience</h3>

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
            Overspace
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
            Leap
          </a>{" "}
          — Founder — 2016–2021
        </p>
        <p className="my-2 italic">
          Before Overspace, founded Leap, growing it into [growth stat — TK]. As the sole founder
          I did everything: working with designers, product and packaging design, distribution,
          and social media — the generalist range startups still hire me for today.
        </p>
      </section>

      <section id="work" className="my-8">
        <h3 className="mb-2">Selected Work</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </section>

      <section id="ai-experiments" className="my-8 border-t pt-8">
        <h3 className="mb-2">AI Experiments</h3>
        <p className="mb-4 italic">
          Things I've designed and built myself with AI — shipped, not mockups.
        </p>
        {experiments.length === 0 ? (
          <p className="italic">More coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {experiments.map((exp) => (
              <div key={exp.name} className="border p-4">
                <h4>{exp.name}</h4>
                <p className="my-2 italic">{exp.description}</p>
                <p className="text-base">{exp.stack}</p>
                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
