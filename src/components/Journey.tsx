type Milestone = {
  years: string;
  role: string;
  org: string;
  description: string;
  bullets: string[];
};

const MILESTONES: Milestone[] = [
  {
    years: "2016–2021",
    role: "Founder",
    org: "Leap",
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

export default function Journey() {
  return (
    <div className="relative">
      <div className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-neutral-200" />
      {MILESTONES.map((m, i) => (
        <div key={m.years} className={`relative pl-8 ${i > 0 ? "mt-8" : ""}`}>
          <div className="absolute top-1.5 left-0 h-[7px] w-[7px] rounded-full bg-[#e65f2e]" />
          <p className="text-base">{m.org}</p>
          <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
            {m.role} · {m.years}
          </p>
          <p className="mt-2 text-sm">{m.description}</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {m.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
