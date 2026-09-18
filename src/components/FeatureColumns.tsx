import type { CSSProperties, ReactNode } from "react";
import { NADIIA_AREA, NADIIA_CARD, NADIIA_CARD_TEXT, NADIIA_CARD_TITLE } from "./nadiia";

/**
 * A short row of approaches or features, one per column: a line icon, a short
 * title, then a sentence or two, laid out like Retool's feature rows. Each
 * column is a Nadiia card on the light dotted field, matching the impact cards. Stacks on phones.
 */

export type FeatureIcon = "screens" | "chart" | "conversation";

export interface FeatureColumn {
  icon: FeatureIcon;
  title: string;
  text: string;
}

// 24px line icons, drawn at the same weight as the body text.
const ICONS: Record<FeatureIcon, ReactNode> = {
  screens: (
    <>
      <rect x="3.5" y="4" width="11" height="16" rx="2" />
      <path d="M17.5 7.5h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1M7 16.5h4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="m7.5 15 3.5-4 3 2.5L19 8" />
    </>
  ),
  conversation: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3H6.5A2.5 2.5 0 0 1 4 10.5z" />
      <path d="M19 9.5a1.5 1.5 0 0 1 1 1.4v4.1a2.5 2.5 0 0 1-2.5 2.5h-.5v2.5L14 17.5h-2.5" />
    </>
  ),
};

export default function FeatureColumns({ items }: { items: FeatureColumn[] }) {
  return (
    <ul
      className="my-10 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
      style={{ "--cols": items.length } as CSSProperties}
    >
      {items.map((item) => (
        <li key={item.title} className={`flex flex-col ${NADIIA_CARD}`} style={NADIIA_AREA.neutral}>
          <svg
            aria-hidden
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--nd-body,#737373)]"
          >
            {ICONS[item.icon]}
          </svg>
          <p className={`mt-4 ${NADIIA_CARD_TITLE}`}>{item.title}</p>
          <p className={`mt-2 ${NADIIA_CARD_TEXT}`}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
