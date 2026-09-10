import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl py-16">
      <Header />

      <section className="border-b py-8">
        <h3 className="mb-2">About</h3>
        <p>
          I design thoughtful interfaces that make complex systems feel clear and human — from
          narrative websites to data-rich dashboards. Trained in design, I'm always open to bold
          ideas and new collaborations.
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
      </section>

      <section className="my-8">
        <h3 className="mb-2">Selected Work</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </section>
    </main>
  );
}
