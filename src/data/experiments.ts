export interface Experiment {
  name: string;
  description: string;
  stack: string;
  link?: string;
  image?: string;
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
    image: "/experiments/skim-cover.png",
  },
  {
    name: "08",
    description:
      "Named after my cat, who reminds me just by existing that I don't have to run around like the world's ending. Tell her how often to check in and how long to stay, and she pops into the corner of your screen to nap, stretch, or wander, then disappears. No streaks, no guilt — just a small, grateful pause.",
    stack: "Electron, TypeScript",
    link: "/08",
    image: "/experiments/08-cover.png",
  },
];
