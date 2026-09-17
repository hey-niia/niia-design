/** Work history, shared by the About page (in full) and the home page (compact, expandable). */

export interface Role {
  company: string;
  href?: string;
  role: string;
  period: string;
  description: string;
}

export const experience: Role[] = [
  {
    company: "Freelance",
    role: "Senior Product Designer, AI Design Engineer",
    period: "2022–Present",
    description:
      "End-to-end product design for startups and scale-ups. Current work spans an AI-first iOS wellness app, enterprise dashboards, and web platforms — covering research, design systems, interaction design, and full delivery.",
  },
  {
    company: "Overspace",
    href: "https://overspace.co",
    role: "Co-founder",
    period: "2022–Present",
    description:
      "Co-founded a product design studio for startups and teams building what's next — from strategy and research to UI/UX design and design systems.",
  },
  {
    company: "Leap",
    href: "https://superleap.com.ua/",
    role: "Founder",
    period: "2016–2022",
    description:
      "Before Overspace, I founded Leap, a health snack brand that reached 1000+ shops and cafés across Ukraine. Sole founder: product and packaging design, manufacturing, distribution, social, and the team I hired to run it. That generalist range is still what startups hire me for.",
  },
];
