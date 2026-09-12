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
      "A tiny Pomodoro-style break reminder shaped like a cat. Tell her how often to check in and how long to stay, and she pops into the corner of your screen — napping, stretching, walking — for exactly that long, then disappears. No tasks, no streaks, no guilt-tripping.",
    stack: "Electron, TypeScript",
    link: "https://github.com/hey-niia/08/releases/latest",
  },
];
