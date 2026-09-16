import type { ReactNode } from "react";

/**
 * The full-bleed dark grey band from Niia's PDF case study, still used behind
 * the final-design screenshots. Diagrams moved to the light Nadiia style.
 */

/**
 * Breaks out of the reading column to the full viewport width. Uses a negative
 * margin rather than a transform: a transformed ancestor would become the
 * containing block for anything `position: fixed` inside it.
 */
export function Band({ children }: { children: ReactNode }) {
  return (
    <div className="my-12 ml-[calc(50%-50vw)] w-screen bg-[#292929] px-4 py-12 text-white sm:px-10 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">{children}</div>
    </div>
  );
}
