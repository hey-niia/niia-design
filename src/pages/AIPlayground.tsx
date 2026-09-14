import Nav from "../components/Nav";
import ExperimentCard from "../components/ExperimentCard";
import { experiments } from "../data/experiments";

export default function AIPlayground() {
  return (
    <main className="pb-24">
      <Nav />

      <header className="border-b py-8">
        <h1 className="font-black tracking-tight text-4xl lg:text-6xl">AI Playground</h1>
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
