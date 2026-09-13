import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { experiments, type Experiment } from "../data/experiments";

function ExperimentCard({ exp }: { exp: Experiment }) {
  const isInternal = exp.link?.startsWith("/") ?? false;
  const tooltip = isInternal ? "View Case Study" : "Open Case Study";

  const media = exp.image && (
    <div className="relative aspect-[4/3] overflow-hidden bg-black">
      <img
        src={exp.image}
        alt={`${exp.name} screenshot`}
        className="h-full w-full object-contain"
      />
      {exp.link && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
          <span className="scale-95 rounded-full bg-[#e65f2e] px-4 py-2 text-sm text-white shadow-lg transition-transform duration-200 group-hover:scale-100">
            {tooltip}
          </span>
        </div>
      )}
    </div>
  );

  const body = (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 flex-1 text-lg font-semibold">{exp.name}</h4>
        <p className="shrink-0 font-mono text-xs tracking-widest text-neutral-400">
          {exp.platform}
        </p>
      </div>
      <p className="mt-2 text-sm text-neutral-600">{exp.description}</p>
    </div>
  );

  const className = "group block overflow-hidden rounded-sm bg-neutral-100";

  if (!exp.link) {
    return (
      <div className={className}>
        {media}
        {body}
      </div>
    );
  }

  if (isInternal) {
    return (
      <Link to={exp.link} className={className}>
        {media}
        {body}
      </Link>
    );
  }

  return (
    <a href={exp.link} target="_blank" rel="noopener noreferrer" className={className}>
      {media}
      {body}
    </a>
  );
}

export default function AIExperiments() {
  return (
    <main className="pb-24">
      <Nav />

      <header className="border-b py-8">
        <h1 className="font-black tracking-tight text-4xl lg:text-6xl">AI Experiments</h1>
        <p className="mt-4 max-w-3xl text-neutral-500">
          I've always been a builder, but I needed other people to help me out. AI finally
          empowered me to build products for myself and my friends, exactly the way I imagine
          them. Below are the apps, tools, and experiments that came out of it — each one built to
          chase an idea or fix something that actually bothered me.
        </p>
      </header>

      <section className="py-8">
        {experiments.length === 0 ? (
          <p className="italic">More coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((exp) => (
              <ExperimentCard key={exp.name} exp={exp} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
