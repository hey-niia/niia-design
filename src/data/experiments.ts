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
      "A native Mac to-do app built for family and friends with ADHD, for whom typical to-do apps never stuck — researched and designed around real ADHD/attention findings. Routines reset daily instead of nagging you, anything can recur, and on-device Apple Intelligence suggests each routine's icon.",
    stack: "Tauri, Rust, React, TypeScript, SQLite, Apple Intelligence (Foundation Models)",
    link: "/taski",
    image: "/experiments/taski-cover.png",
  },
  {
    name: "Taski — first version",
    description:
      "The original Taski, before it became a Mac app: a to-do list that doesn't pressure you, built and shipped as a simple web app. Still live, still working exactly as it did back then.",
    stack: "React, TypeScript, Tailwind — no backend, saved locally in the browser",
    link: "/taski-v1",
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
