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
      "A native macOS news reader that digests articles into a main idea and key points entirely on-device with Apple Intelligence — no cloud API, no accounts.",
    stack: "SwiftUI, Apple Intelligence (Foundation Models)",
  },
  {
    name: "08",
    description:
      "A tiny black-and-white cat who lives in your Mac's menu bar. Every few minutes she wanders across the screen — napping, stretching, chasing yarn — then disappears. No features, no notifications, just a small reminder to do nothing for a second.",
    stack: "Electron, TypeScript",
    link: "https://github.com/hey-niia/08/releases/latest",
  },
];
