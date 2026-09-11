export interface Experiment {
  name: string;
  description: string;
  stack: string;
  link?: string;
}

export const experiments: Experiment[] = [
  {
    name: "Taski",
    description:
      "A black-and-white to-do app built for my wife, who has ADHD. Free-form tasks for today, plus a routine list that checks off and resets daily instead of nagging or scoring you.",
    stack: "React, TypeScript, Tailwind — no backend, saved locally in the browser",
    link: "/taski",
  },
];
