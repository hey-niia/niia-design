import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import WiggleText from "../components/WiggleText";
import { experiments } from "../data/experiments";

export default function AIExperiments() {
  return (
    <main className="pb-24">
      <Nav />

      <header className="border-b py-8">
        <h1 className="font-black tracking-tight text-4xl lg:text-6xl">AI Experiments</h1>
      </header>

      <section className="py-8">
        <p className="mb-4 italic">
          Things I've designed and built myself with AI — shipped, not mockups.
        </p>
        {experiments.length === 0 ? (
          <p className="italic">More coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {experiments.map((exp) => (
              <div key={exp.name} className="overflow-hidden rounded-sm bg-neutral-100">
                {exp.image &&
                  (exp.link ? (
                    exp.link.startsWith("/") ? (
                      <Link to={exp.link} className="block bg-black">
                        <img
                          src={exp.image}
                          alt={`${exp.name} screenshot`}
                          className="w-full"
                        />
                      </Link>
                    ) : (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-black"
                      >
                        <img
                          src={exp.image}
                          alt={`${exp.name} screenshot`}
                          className="w-full"
                        />
                      </a>
                    )
                  ) : (
                    <div className="bg-black">
                      <img src={exp.image} alt={`${exp.name} screenshot`} className="w-full" />
                    </div>
                  ))}
                <div className="p-4">
                  <h4>{exp.name}</h4>
                  <p className="my-2 italic">{exp.description}</p>
                  <p className="text-base">{exp.stack}</p>
                  {exp.link &&
                    (exp.link.startsWith("/") ? (
                      <Link to={exp.link} className="underline">
                        <WiggleText>Read more →</WiggleText>
                      </Link>
                    ) : (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        <WiggleText>View →</WiggleText>
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
