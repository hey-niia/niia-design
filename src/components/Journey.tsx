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
    description:
      "Solo founder, so \"role\" meant whatever needed doing that week — design was just the tool I reached for most often, not a title I'd chosen yet.",
    bullets: [
      "Ran product and packaging design end to end, with no handoff to wait on",
      "Handled distribution and every social account myself, so design decisions had to survive contact with a real customer, not just a critique",
      "Learned the generalist range that still shows up in client work today — I'd rather understand the whole problem than own one slice of it",
    ],
  },
  {
    years: "2022–Present",
    role: "Senior Product Designer, AI Design Engineer",
    org: "Freelance",
    description:
      "Went from designing interfaces to shipping them — mostly in the AI space, where the interface has to do more explaining than the sales page.",
    bullets: [
      "Design + build for an AI-first iOS wellness app",
      "Enterprise dashboards and narrative marketing sites",
      "Increasingly, less handoff — more just... done. I still write the code, not just the spec",
    ],
  },
];

export default function Journey() {
  return (
    <div className="relative">
      <div className="absolute top-[13px] right-0 left-0 hidden h-px bg-neutral-200 md:block" />
      <div className="flex flex-col gap-10 md:flex-row md:gap-6">
        {MILESTONES.map((m) => (
          <div key={m.years} className="group relative md:flex-1">
            <div className="relative z-10 mb-5 flex items-center gap-3">
              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-black transition-colors duration-300 group-hover:bg-[#e65f2e]" />
              <span className="inline-flex items-center rounded-full bg-black px-3 py-1 font-mono text-[11px] tracking-widest text-white uppercase transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#e65f2e]">
                {m.years}
              </span>
            </div>
            <p className="text-base transition-transform duration-200 md:group-hover:translate-x-1">
              {m.org}
            </p>
            <p className="mt-1 font-mono text-xs tracking-widest text-neutral-400 uppercase">
              {m.role}
            </p>
            <p className="mt-3 text-sm">{m.description}</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {m.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
