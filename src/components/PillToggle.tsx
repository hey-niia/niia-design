import type { CSSProperties } from "react";

/**
 * The site's toggle (design.md → "Pill toggle"): a pressed-in track with the
 * current state's label inside it, and a raised white knob — the same soft
 * keys as the header. The track fills with the page's tone when it's on.
 *
 * Tones are always the muted (subtle) version of a product's colour, never
 * its brand-bright one. A page picks its tone with `toggleToneVars`; without
 * one the toggle is orange.
 */
export const TOGGLE_TONES = {
  orange: { from: "#d9774f", to: "#e8936b", light: "255,205,180", shade: "120,50,20" },
  purple: { from: "#8f6fae", to: "#a68ac2", light: "228,212,245", shade: "60,30,90" },
  grey: { from: "#8a8a8a", to: "#a3a3a3", light: "235,235,235", shade: "40,40,40" },
} as const;

export type ToggleTone = keyof typeof TOGGLE_TONES;

/** CSS variables that paint every PillToggle inside an element in `tone`. */
export function toggleToneVars(tone: ToggleTone): CSSProperties {
  const t = TOGGLE_TONES[tone];
  return {
    "--toggle-from": t.from,
    "--toggle-to": t.to,
    "--toggle-light": t.light,
    "--toggle-shade": t.shade,
  } as CSSProperties;
}

const v = (name: string, fallback: string) => `var(--toggle-${name}, ${fallback})`;
const FROM = v("from", TOGGLE_TONES.orange.from);
const TO = v("to", TOGGLE_TONES.orange.to);
const LIGHT = (a: number) => `rgba(${v("light", TOGGLE_TONES.orange.light)}, ${a})`;
const SHADE = (a: number) => `rgba(${v("shade", TOGGLE_TONES.orange.shade)}, ${a})`;

const KNOB = 32;
const INSET = 5;

export default function PillToggle({
  checked,
  onChange,
  onLabel,
  offLabel,
  className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Shown inside the track while on (e.g. "After"). */
  onLabel: string;
  /** Shown inside the track while off (e.g. "Before"). */
  offLabel: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`Showing ${checked ? onLabel : offLabel}. Switch to ${checked ? offLabel : onLabel}`}
      onClick={() => onChange(!checked)}
      className={`relative inline-grid h-[42px] cursor-pointer items-center overflow-hidden rounded-[21px] pr-[45px] pl-4 transition-[background,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 ${className}`}
      style={
        checked
          ? {
              background: `linear-gradient(135deg, ${FROM}, ${TO})`,
              boxShadow: [
                `inset -1px -1px 0 ${LIGHT(0.6)}`,
                `inset 2px 2px 1.2px ${SHADE(0.25)}`,
                `inset 4px 4px 4px ${SHADE(0.25)}`,
                `inset -1px -1px 30px ${LIGHT(0.4)}`,
              ].join(", "),
            }
          : {
              background: "#ffffff",
              boxShadow: [
                "inset -1px -1px 0 #ffffff",
                "inset 2px 2px 1.2px rgba(176,176,176,0.14)",
                "inset 4px 4px 4px rgba(176,176,176,0.14)",
                "inset -1px -1px 30px #ffffff",
              ].join(", "),
            }
      }
    >
      {/* Both labels share one grid cell, invisible, so the track is always as
          wide as the longer one and doesn't jump when it flips. */}
      {[onLabel, offLabel].map((label) => (
        <span
          key={label}
          aria-hidden
          className="invisible font-mono text-[15px] whitespace-nowrap uppercase [grid-area:1/1]"
        >
          {label}
        </span>
      ))}
      {[
        { label: onLabel, shown: checked, side: "left-4", color: "text-white" },
        { label: offLabel, shown: !checked, side: "right-4", color: "text-gray-500" },
      ].map((t) => (
        <span
          key={t.label}
          aria-hidden
          className={`absolute top-1/2 -translate-y-1/2 ${t.side} ${t.color} font-mono text-[15px] whitespace-nowrap uppercase transition-opacity duration-200`}
          style={{ opacity: t.shown ? 1 : 0 }}
        >
          {t.label}
        </span>
      ))}
      <span
        aria-hidden
        className="absolute rounded-full transition-[left] duration-300"
        style={{
          top: INSET,
          width: KNOB,
          height: KNOB,
          left: checked ? `calc(100% - ${KNOB + INSET}px)` : INSET,
          transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
          background: "linear-gradient(135deg, #f8f8f8, #fdfdfd)",
          boxShadow: [
            "inset 1px 1px 0 #ffffff",
            checked ? `-19px -19px 32px ${LIGHT(0.9)}` : "-19px -19px 32px #ffffff",
            "2px 2px 10px rgba(60,50,40,0.14)",
          ].join(", "),
        }}
      />
    </button>
  );
}
