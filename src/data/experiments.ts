export interface Experiment {
  name: string;
  description: string;
  stack: string;
  platform: "MacOS" | "WEB APP";
  link?: string;
  image?: string;
}

export const experiments: Experiment[] = [
  {
    name: "Taski",
    description:
      "A native Mac to-do app for family and friends with ADHD, built around routines that reset daily instead of nagging you.",
    stack: "Tauri, Rust, React, TypeScript, SQLite, Apple Intelligence (Foundation Models)",
    platform: "MacOS",
    link: "/taski",
    image: "/experiments/taski-cover.png",
  },
  {
    name: "Taski — first version",
    description:
      "The original Taski — a no-pressure to-do list I shipped as a simple web app, still live and working exactly as it did back then.",
    stack: "React, TypeScript, Tailwind — no backend, saved locally in the browser",
    platform: "WEB APP",
    link: "/taski-v1",
    image: "/experiments/taski-v1-cover.png",
  },
  {
    name: "Skim",
    description:
      "A native Mac news reader for the 5 sites I actually read, boiling headlines down to the key points entirely on-device.",
    stack: "SwiftUI, Apple Intelligence (Foundation Models)",
    platform: "MacOS",
    link: "/skim",
    image: "/experiments/skim-cover.png",
  },
  {
    name: "08",
    description:
      "Named after my cat, she pops into the corner of your screen on your schedule for a small, guilt-free pause, then wanders off.",
    stack: "Electron, TypeScript",
    platform: "MacOS",
    link: "/08",
    image: "/experiments/08-cover.png",
  },
];
