import { NADIIA_ACCENT, NADIIA_AREA, NADIIA_SHAPE, NADIIA_SMALL, NADIIA_SURFACE } from "./nadiia";
import { Arrow, Tag } from "./NadiiaParts";

/**
 * Usability test scope and what came out of it, in the Nadiia style, on a
 * subtle green dotted area: a white "We tested" card with green checks, an
 * arrow, then each finding as its own numbered white box. Both columns start
 * at the same line under matching tags, and the tested card stretches to the
 * findings' height so the two read as a pair. Stacked on phones.
 */
export default function Findings({ tested, findings }: { tested: string[]; findings: string[] }) {
  return (
    <div
      className="my-10 grid gap-4 rounded-2xl p-4 ring-1 ring-[#4f9d6e]/15 sm:p-6 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1.35fr)] md:gap-0"
      style={NADIIA_AREA.green}
    >
      <div className="flex flex-col">
        <Tag tone="onGreen" className="mb-3 self-start">
          We tested
        </Tag>
        <div className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} flex flex-1 flex-col px-5 py-4`}>
          <ul className={`${NADIIA_SMALL} flex flex-1 flex-col justify-around gap-2.5 text-[var(--nd-ink,#262626)]`}>
            {tested.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] text-[9px] text-white"
                  style={{ backgroundColor: NADIIA_ACCENT.green }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Arrow direction="down" className="md:hidden" />
      {/* Offset by the tag row so the arrow points at the middle of the cards, not of the whole column. */}
      <div className="hidden items-center md:flex md:pt-9">
        <Arrow direction="right" className="mx-2" />
      </div>

      <div className="flex flex-col">
        <Tag tone="onOrange" className="mb-3 self-start">
          Key findings
        </Tag>
        <ol className="flex flex-col gap-3">
          {findings.map((finding, i) => (
            <li
              key={finding}
              className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} flex gap-3 px-4 py-3`}
            >
              <span
                aria-hidden
                className="font-mono text-[11px] leading-relaxed"
                style={{ color: NADIIA_ACCENT.orange }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`${NADIIA_SMALL} text-[var(--nd-ink,#262626)]`}>{finding}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
