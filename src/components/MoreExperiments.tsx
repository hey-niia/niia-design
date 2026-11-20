import { Link } from "react-router-dom";
import { PLATFORM_LABEL, experiments } from "../data/experiments";
import { STUD_BG, STUD_TILE } from "../lib/studs";
import { FooterLinks } from "./Footer";

// Each project's app window, cropped from its cover (no dark backdrop). All
// are shown at one size (Skim's shape, so Skim shows whole) and one corner
// radius; taller windows lose a little at the bottom, Skin a little at the sides.
const SHOT: Record<string, { image: string; position?: string }> = {
  Skin: { image: "/experiments/skin-cover.webp", position: "center top" },
  "Taski — first version": { image: "/experiments/canvas/taski-v1.jpg" },
  Taski: { image: "/experiments/canvas/taski.jpg" },
  Skim: { image: "/experiments/canvas/skim.jpg" },
};

/** "More AI experiments": the other projects, laid on the Lego plate. */
export default function MoreExperiments({ current }: { current: string }) {
  const others = experiments.filter(
    (e) => e.link && e.link !== current && SHOT[e.name],
  );
  if (others.length === 0) return null;

  return (
    <>
      <div className="-mx-4 mt-8">
        <FooterLinks
          title={{ label: "More AI experiments", to: "/ai-playground" }}
        />
      </div>
      <section
        className="-mx-4 py-16 md:py-20"
        style={{
          backgroundColor: STUD_BG,
          backgroundImage: STUD_TILE,
          backgroundSize: "22px 22px",
        }}
      >
        <div className="mx-auto max-w-4xl px-8 sm:px-4 md:px-0">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((e) => {
              const shot = SHOT[e.name];
              return (
                <Link
                  key={e.name}
                  to={e.link!}
                  aria-label={`${e.name} — ${PLATFORM_LABEL[e.platform]}`}
                  className="group relative block aspect-[1600/1087] overflow-hidden rounded-[8px] shadow-[0_2px_6px_rgba(60,50,40,0.08),0_18px_44px_rgba(60,50,40,0.18)] transition-transform duration-200 hover:scale-[1.02]"
                >
                  <img
                    src={shot.image}
                    alt={`${e.name} screenshot`}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: shot.position ?? "left top" }}
                  />
                  {/* Same as the AI Playground canvas: the name shows on hover. */}
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[var(--site-accent)] px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {e.name} · {PLATFORM_LABEL[e.platform]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
