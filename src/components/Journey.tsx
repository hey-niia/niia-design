import { FreelanceIcon } from "./icons";

type Milestone = {
  years: string;
  role: string;
  org: string;
  /** Real logo image for orgs that have a website; omitted for Freelance. */
  iconSrc?: string;
  description: string;
  bullets: string[];
};

const MILESTONES: Milestone[] = [
  {
    years: "2016–2021",
    role: "Founder",
    org: "Leap",
    iconSrc: "/logos/leap.png",
    description: "Solo founder, so \"role\" meant whatever needed doing that week.",
    bullets: [
      "Ran product and packaging design end to end",
      "Handled distribution and every social account myself",
      "Learned the generalist range that still shows up in client work today",
    ],
  },
  {
    years: "2021–Present",
    role: "Co-founder",
    org: "Overspace",
    iconSrc: "/logos/overspace.png",
    description: "Built a studio around the parts of design that don't fit in a portfolio shot.",
    bullets: [
      "Research, strategy, and systems work for startups and scale-ups",
      "Partnered with a small team instead of scaling headcount",
      "[Notable client outcome — TK]",
    ],
  },
  {
    years: "2022–Present",
    role: "Senior Product Designer, AI Design Engineer",
    org: "Freelance",
    description: "Went from designing interfaces to shipping them.",
    bullets: [
      "Design + build for an AI-first iOS wellness app",
      "Enterprise dashboards and narrative marketing sites",
      "Increasingly, less handoff — more just... done",
    ],
  },
];

const INDENT_STEP = 32;

export default function Journey() {
  return (
    <div className="divide-y divide-black">
      {MILESTONES.map((m, i) => (
        <div
          key={m.years}
          className="group px-4 py-4 transition-colors hover:bg-black hover:text-white"
          style={{ marginLeft: i * INDENT_STEP }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="font-mono text-sm tracking-wide uppercase">{m.years}</span>
            <span className="mr-auto ml-4">
              {m.role} —{" "}
              {m.iconSrc ? (
                <img
                  src={m.iconSrc}
                  alt=""
                  className="mr-1 inline-block h-6 w-6 rounded-sm align-[-6px]"
                />
              ) : (
                <FreelanceIcon className="mr-1 inline-block h-4 w-4 align-[-3px]" />
              )}
              {m.org}
            </span>
          </div>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="mt-3 italic">{m.description}</p>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {m.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
