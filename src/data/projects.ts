export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "gallery"; images: { src: string; alt: string }[] };

export interface Project {
  slug: string;
  category: string;
  name: string;
  title: string;
  summary: string;
  client: string;
  role: string;
  duration: string;
  tools: string[];
  cardImage: string;
  lastUpdated: string;
  content: ContentBlock[];
}

export const projects: Project[] = [
  {
    slug: "ios-app",
    category: "iOS App, AI",
    name: "Wellness AI Companion",
    title: "Pioneering AI-driven emotional fitness iOS app transforming lives worldwide",
    summary:
      "AI-first iOS wellness app — App of the Day across multiple countries. Research, design system, and full delivery.",
    client: "Client (NDA)",
    role: "Product Designer",
    duration: "4 months",
    tools: ["Figma", "Claude AI", "Figjam", "Notion"],
    cardImage: "/projects/ios-app.png",
    lastUpdated: "Feb, 2026",
    content: [
      {
        type: "paragraph",
        text: "Led the design pivot of a neuroscience-backed emotional fitness platform — from a complex multi-feature app into a streamlined AI coaching experience. The redesigned app was featured as App of the Day across multiple countries.",
      },
      {
        type: "paragraph",
        text: "The platform uses fMRI research from university partnerships to help millions of users train their emotional fitness through six neurotransmitter systems. It's been featured in a documentary series on the science of happiness and is expanding into clinical research applications.",
      },
      { type: "image", src: "/projects/ios-app/1.png", alt: "Wellness AI app screens" },
      { type: "heading", text: "Multi-Level Progression System" },
      {
        type: "paragraph",
        text: "Transformed a neuroscience-grounded progression framework into an aspirational yet achievable journey spanning beginner through master levels. Designed comprehensive progression tracking across multiple emotional fitness dimensions with intuitive visual feedback, including range-based balance calculations, progressive complexity unlocking, and optional achievement badges that encourage exploration and community engagement. Balanced scientific integrity from university research partnerships with behavioral psychology to create meaningful early wins while maintaining long-term goals.",
      },
      { type: "image", src: "/projects/ios-app/2.png", alt: "Progression system screens" },
      { type: "heading", text: "Design System Architecture" },
      {
        type: "paragraph",
        text: "Created a lightweight, future-ready design system purpose-built for the product's evolution toward a chat-based interface. The system includes primitive and semantic color tokens, spacing and radius values, typography styles, and gradients — all with intelligent naming conventions that bridge design and development seamlessly. Uniquely architected for AI-assisted implementation, enabling token names to map directly from design variables to code without requiring handoff documentation.",
      },
      { type: "image", src: "/projects/ios-app/3.png", alt: "Design system tokens" },
      { type: "heading", text: "App Store Screenshots" },
      {
        type: "paragraph",
        text: "Created screenshot sets, visual messaging, and privacy screen illustrations that contributed to the app being featured as App of the Day across multiple countries, reaching millions of potential users worldwide. Developed privacy-forward visual communication that addressed user concerns while clearly articulating the platform's neuroscience-based value proposition.",
      },
      { type: "image", src: "/projects/ios-app/4.png", alt: "App Store screenshot set" },
      { type: "heading", text: "Navigation & Iconography" },
      {
        type: "paragraph",
        text: "Designed a comprehensive icon system for bottom navigation that maintains clarity across varied contexts while reinforcing emotional fitness positioning. The icons balance approachability with precision, serving both casual users building initial habits and committed practitioners pursuing mastery.",
      },
      {
        type: "gallery",
        images: [
          { src: "/projects/ios-app/5.png", alt: "Navigation and iconography" },
          { src: "/projects/ios-app/6.png", alt: "Additional app screens" },
        ],
      },
      {
        type: "paragraph",
        text: "The design process involved close collaboration with neuroscience advisors to ensure all gamification and progression elements aligned with evidence-based emotional fitness principles validated through fMRI studies. I created interactive prototypes for rapid iteration, developed information architecture for AI coaching flows, and established a component library supporting both current features and ambitious future expansion — including the platform's evolution toward clinical research applications.",
      },
    ],
  },
  {
    slug: "enterprise-dashboard",
    category: "Dashboard, Web App",
    name: "Enterprise Dashboard",
    title: "Enterprise operations dashboard for digital screen deployment",
    summary:
      "Data-rich dashboard for an enterprise workflow — dense information made legible at a glance.",
    client: "Client (NDA)",
    role: "UI/UX Designer",
    duration: "2.5 months",
    tools: ["Figma", "Claude AI", "Figjam"],
    cardImage: "/projects/enterprise-dashboard.png",
    lastUpdated: "Nov, 2025",
    content: [
      {
        type: "paragraph",
        text: "I worked on a comprehensive workflow management system designed to replace an Airtable-based process for a company managing digital signage installations across major retail chains like KFC and Apple stores. The platform handles the complete lifecycle from initial quotations through deployment, maintenance, and inventory tracking, serving internal teams, partner companies, and customers across multiple brands and locations.",
      },
      {
        type: "paragraph",
        text: "I joined as the sole product designer in early 2025, taking the project from initial concept through to engineering implementation over three months. Working directly with the founder and head of operations, I conducted user research with internal deployment managers to understand pain points in their existing workflows, then designed the complete information architecture and interface system.",
      },
      { type: "image", src: "/projects/enterprise-dashboard/1.png", alt: "Dashboard overview" },
      {
        type: "gallery",
        images: [
          { src: "/projects/enterprise-dashboard/2.png", alt: "Dashboard workflow screen" },
          { src: "/projects/enterprise-dashboard/3.png", alt: "Dashboard detail screen" },
          { src: "/projects/enterprise-dashboard/4.png", alt: "Dashboard inventory screen" },
          { src: "/projects/enterprise-dashboard/5.png", alt: "Dashboard component library" },
        ],
      },
      {
        type: "paragraph",
        text: "The design process involved creating interactive HTML wireframes for rapid iteration and feedback, which I then developed into high-fidelity designs in Figma with Claude AI assistance for prototyping and design system documentation. I established a modular component library inspired by Linear's minimalist aesthetic, focusing on progressive disclosure and workflow-aware features that guide users through complex multi-step processes. I continued collaborating with the engineering team through implementation, ensuring the design vision translated effectively into the final product.",
      },
    ],
  },
  {
    slug: "digitalscreen",
    category: "Website",
    name: "Digital Screen Co.",
    title: "Corporate website for a digital signage company",
    summary:
      "Narrative corporate website for a digital signage company, built to explain a technical product simply.",
    client: "Client (NDA)",
    role: "UI/UX Designer",
    duration: "1 month",
    tools: ["Figma"],
    cardImage: "/projects/digitalscreen.png",
    lastUpdated: "Nov, 2025",
    content: [
      {
        type: "paragraph",
        text: "I designed a corporate website for a digital signage company to present its technology, services, and team in a clear and engaging way. The goal was to build a modern and credible online presence that communicates innovation and reliability.",
      },
      {
        type: "paragraph",
        text: "Starting from zero, I worked on information architecture, layout systems, and visual identity. The design focused on modularity and responsive behavior, ensuring consistency across desktop and mobile. Collaboration with the founder and operations team helped refine messaging and user flow.",
      },
      { type: "image", src: "/projects/digitalscreen/1.png", alt: "Digital signage company website" },
    ],
  },
  {
    slug: "hirement",
    category: "AI Tooling, Web App",
    name: "Hirement",
    title: "Collaborative hiring flow platform",
    summary:
      "AI-first hiring tool — interaction design and prototyping across the end-to-end recruiting flow.",
    client: "Hirement",
    role: "UI/UX Designer",
    duration: "2.5 months",
    tools: ["Figma"],
    cardImage: "/projects/hirement.png",
    lastUpdated: "Nov, 2025",
    content: [
      {
        type: "paragraph",
        text: "Hirement is a web platform that helps employers streamline their hiring process by creating structured, customizable interview flows. Each hiring flow consists of multiple rounds with tailored question types: checklists, ratings, or open-ended responses — allowing different interviewers to evaluate candidates with notes and 1–5 star scores.",
      },
      {
        type: "paragraph",
        text: "As the sole designer, I collaborated directly with the founder to translate an early idea into a functional product vision. I designed the logo, a clean and modern interface, and a lightweight design system that emphasized clarity, spaciousness, and ease of collaboration for hiring teams.",
      },
      {
        type: "gallery",
        images: [
          { src: "/projects/hirement/1.png", alt: "Hirement interview flow builder" },
          { src: "/projects/hirement/2.png", alt: "Hirement candidate evaluation screen" },
          { src: "/projects/hirement/3.png", alt: "Hirement scoring interface" },
          { src: "/projects/hirement/4.png", alt: "Hirement design system" },
        ],
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
