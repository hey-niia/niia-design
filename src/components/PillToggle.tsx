import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

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
  // ConnectIQ's own accent, so its toggle matches the rest of that page.
  orange: { from: "#e65f2e", to: "#f0753f", light: "255,190,160", shade: "140,45,10" },
  purple: { from: "#bd89f0", to: "#c89ff3", light: "238,224,252", shade: "80,40,130" },
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
/** Track = 16px + label + 8px + knob + 5px: snug around the word, no gap. */
const TRACK_EXTRA = 16 + 8 + KNOB + INSET;

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
  // The track hugs whichever label is showing, so a short word ("Color")
  // doesn't sit in a pill sized for a long one. Both are measured off-screen.
  const onRef = useRef<HTMLSpanElement>(null);
  const offRef = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<[number, number] | null>(null);
  useLayoutEffect(() => {
    const read = () =>
      setWidths([onRef.current?.offsetWidth ?? 0, offRef.current?.offsetWidth ?? 0]);
    read();
    const ro = new ResizeObserver(read);
    if (onRef.current) ro.observe(onRef.current);
    if (offRef.current) ro.observe(offRef.current);
    return () => ro.disconnect();
  }, [onLabel, offLabel]);
  const width = widths ? (checked ? widths[0] : widths[1]) + TRACK_EXTRA : undefined;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`Showing ${checked ? onLabel : offLabel}. Switch to ${checked ? offLabel : onLabel}`}
      onClick={() => onChange(!checked)}
      className={`relative inline-block h-[42px] cursor-pointer overflow-hidden rounded-[21px] transition-[width,background,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 ${className}`}
      style={{
        width,
        ...(checked
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
              // White on a light page; a dark page (.dark-matter) swaps these
              // for a charcoal track.
              background: "var(--toggle-off-face, #ffffff)",
              boxShadow: [
                "inset -1px -1px 0 var(--toggle-off-edge, #ffffff)",
                "inset 2px 2px 1.2px var(--toggle-off-shade, rgba(176,176,176,0.14))",
                "inset 4px 4px 4px var(--toggle-off-shade, rgba(176,176,176,0.14))",
                "inset -1px -1px 30px var(--toggle-off-edge, #ffffff)",
              ].join(", "),
            }),
      }}
    >
      {[
        { label: onLabel, ref: onRef },
        { label: offLabel, ref: offRef },
      ].map((m) => (
        <span
          key={m.label}
          ref={m.ref}
          aria-hidden
          className="invisible absolute top-0 left-0 font-mono text-[15px] whitespace-nowrap uppercase"
        >
          {m.label}
        </span>
      ))}
      {[
        { label: onLabel, shown: checked, side: "left-4", color: "text-white" },
        { label: offLabel, shown: !checked, side: "right-4", color: "text-[var(--toggle-off-label,#6b7280)]" },
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
            // The knob's light is always the page's own tone (never a fixed
            // colour), at the strength set in Tweak → Toggle.
            `calc(var(--toggle-glow-dist, 19px) * -1) calc(var(--toggle-glow-dist, 19px) * -1) var(--toggle-glow-blur, 32px) ${
              checked
                ? `rgba(${v("light", TOGGLE_TONES.orange.light)}, var(--toggle-light-a, 0%))`
                : "var(--toggle-glow-off, transparent)"
            }`,
            // Its drop shadow, falling bottom-right. On, it's a darker shade of
            // the page's tone, like the track's own inner shadow at the top;
            // off on a dark page it deepens so the knob still lifts off.
            checked
              ? `3px 3px 8px ${SHADE(0.45)}`
              : "var(--toggle-knob-shadow, 2px 2px 10px rgba(60,50,40,0.14))",
          ].join(", "),
        }}
      />
    </button>
  );
}
