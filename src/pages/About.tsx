import Nav from "../components/Nav";
import CardStack from "../components/CardStack";
import { ExperienceTimeline } from "../components/Experience";

const LINKEDIN_URL = "https://www.linkedin.com/in/niia-bieliavtseva/";

export default function About() {
  return (
    <main className="pb-16">
      <Nav />

      <div className="mx-auto max-w-4xl">
        {/* The journey and the story on the left, the photo on the right. */}
        <section className="pt-6 md:pt-24">
          <div className="flex flex-col-reverse gap-8 md:flex-row md:items-start md:gap-12">
            {/* Nudged up by the line's spare leading, so the first row's letters
                (not its line box) line up with the top of the photo. */}
            <div className="min-w-0 flex-1 md:-mt-[6px]">
              <ExperienceTimeline />
              {/* The story sits under the timeline, as wide as it, beside the photo. */}
              <div className="mt-8 md:mt-12">
                <p className="t-about mb-4 text-sm">
                  {
                    "I believe good design should be delightful, and a good solution should be beautiful. That's what makes people fall in love with a product and keep coming back to it."
                  }
                </p>
                <p className="t-about mb-4 text-sm">
                  {
                    "I've always had a founder's mindset. Years ago, I had an idea for what I thought would be the perfect healthy snack. So I built a company around it, from the product itself to the packaging, branding, and distribution. I sold the company in 2022."
                  }
                </p>
                <p className="t-about mb-4 text-sm">
                  {
                    "That experience shaped how I approach design today. I think about the whole product, not just how it looks, but how it works, why people need it, and whether it makes sense as a business."
                  }
                </p>
                <p className="t-about mb-4 text-sm">
                  {
                    "These days, I design digital products and use AI to build working prototypes. I work with tools like Claude, Xcode, and SwiftUI to explore ideas, write code, test interactions, and turn designs into functional experiences. It lets me move from an idea to something people can actually try without waiting for a full development cycle."
                  }
                </p>
                <p className="t-about mb-6 text-sm">
                  {
                    "I care a lot about the details, the little interactions, the moments of surprise, and making something complex feel effortless. AI helps me build faster, but deciding what to build and how it should feel is still my favorite part."
                  }
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soft-hover soft-key gap-2 font-mono text-xs tracking-widest text-neutral-700 uppercase"
                  >
                    <span aria-hidden>↓</span> Download Resume
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soft-hover soft-key gap-2 font-mono text-xs tracking-widest text-neutral-700 uppercase"
                  >
                    LinkedIn <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            </div>

            <img
              src="/photos/niia.jpg"
              alt="Niia Bieliavtseva"
              className="h-40 w-40 shrink-0 self-center object-cover grayscale md:h-52 md:w-52 md:self-auto"
            />
          </div>
        </section>

        <section className="pt-12">
          <p className="mb-8 font-mono text-xs tracking-widest text-neutral-400 uppercase">
            Outside of Work
          </p>
          <CardStack
            cards={[
              {
                id: "playlists",
                media: (
                  <iframe
                    title="Spotify playlist"
                    src="https://open.spotify.com/embed/playlist/6qaHceIrJis8W5COoyTZIE?utm_source=generator&theme=0"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                ),
                title: "I make playlists",
                label: "Music",
                text: "A playlist for every occasion — deep work, long walks, cooking, rainy Sundays. This one is last summer, start to finish.",
              },
              {
                id: "draw",
                media: (
                  <img
                    src="/photos/sketchbook.jpg"
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                ),
                title: "I draw",
                label: "Sketchbook",
                text: "My sketchbook is where I get to be wrong without consequences — no user testing, no stakeholders, just deciding something looks right and moving on. It's the fastest way I know to reset a design brain that's been staring at the same Figma file too long.",
              },
              {
                id: "yoga",
                media: (
                  <img
                    src="/photos/yoga.jpg"
                    alt=""
                    className="h-full w-full bg-white object-contain"
                  />
                ),
                title: "I do yoga",
                label: "Movement",
                text: "Most mornings on the mat, mainly to remember that not everything needs to be optimized. It's the closest thing I have to a version control system for my own attention.",
              },
            ]}
          />
        </section>
      </div>
    </main>
  );
}
