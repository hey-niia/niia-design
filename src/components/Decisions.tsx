import { NADIIA_ACCENT, NADIIA_LABEL, NADIIA_SHAPE, NADIIA_SMALL, NADIIA_SURFACE } from "./nadiia";
import { Arrow } from "./NadiiaParts";

/**
 * Key product decisions as before → after cards, in the Nadiia style: a white
 * card per decision, the old way in a subtle orange box, an arrow, the new way
 * in a subtle green box, and an optional one-line result underneath.
 */

export interface Decision {
  title: string;
  before: string;
  after: string;
  /** A short measurable result, e.g. "2 clicks → 1". */
  note?: string;
}

function State({ label, text, tone }: { label: string; text: string; tone: "orange" | "green" }) {
  return (
    <div className={`rounded-lg px-3 py-2.5 ring-1 ${NADIIA_SURFACE[tone]}`}>
      <p
        className="mb-1 font-mono text-[10px] tracking-widest uppercase"
        style={{
          color: tone === "orange" ? "var(--nd-orange-ink, #b25a2c)" : "var(--nd-green-ink, #3f7d58)",
        }}
      >
        {label}
      </p>
      <p className={`${NADIIA_SMALL} text-[var(--nd-tint-text,#525252)]`}>
        {text}
      </p>
    </div>
  );
}

export default function Decisions({ items }: { items: Decision[] }) {
  return (
    // From tablet width each card is a subgrid of the list's rows (title,
    // before, arrow, after, note), so the before and after boxes line up across
    // all three cards even when a title wraps or one box runs a line longer.
    <ol className="my-24 grid gap-5 md:grid-cols-3 md:gap-y-0">
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} flex flex-col p-5 md:row-span-5 md:grid md:grid-rows-subgrid`}
        >
          <p className="mb-4 flex items-baseline gap-2">
            <span
              aria-hidden
              className="font-mono text-[11px]"
              style={{ color: NADIIA_ACCENT.orange }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={NADIIA_LABEL}>{item.title}</span>
          </p>
          <State label="Before" text={item.before} tone="orange" />
          <Arrow direction="down" length={20} />
          <State label="After" text={item.after} tone="green" />
          {item.note && (
            // Same surface as the "After" box above, so the result reads as part of it.
            <div className={`mt-4 rounded-lg px-3 py-2.5 ring-1 ${NADIIA_SURFACE.green}`}>
              <p className={`${NADIIA_SMALL} text-[var(--nd-ink,#262626)]`}>{item.note}</p>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
