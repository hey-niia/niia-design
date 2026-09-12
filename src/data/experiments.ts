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
  {
    name: "Skim",
    description:
      "A native Mac news reader for the 5 sites I actually read. Click a headline, get the main idea and key points, entirely on-device — no cloud API, no account. I designed and directed it end to end; Claude Code wrote the Swift.",
    stack: "SwiftUI, Apple Intelligence (Foundation Models)",
    link: "/skim",
  },
  {
    name: "08",
    description:
      "A tiny cat-video window that lives in your Mac's menu bar. Every few minutes it pops up in the corner playing a muted clip of a cat doing nothing productive, then disappears. No features, no notifications — just a small reminder to be lazy for a second.",
    stack: "Electron, TypeScript",
    link: "https://github.com/hey-niia/08/releases/latest",
  },
];
