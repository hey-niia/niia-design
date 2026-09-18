import { NADIIA_LABEL, NADIIA_SHAPE, NADIIA_SURFACE } from "./nadiia";
import { Arrow } from "./NadiiaParts";

/**
 * Separate systems merging into one, in the Nadiia style: a row of white
 * boxes, each dropping a line into a shared rail, and one arrow down to the
 * system they became (subtle green). Drawn with plain CSS lines — every
 * column is the same width with no gap between, so the rail's ends sit
 * exactly under the first and last box.
 */
export default function Silos({ from, to }: { from: string[]; to: string }) {
  const halfColumn = `${50 / from.length}%`;
  return (
    <div className="mx-auto my-24 max-w-[46rem]">
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${from.length}, minmax(0, 1fr))` }}
      >
        {from.map((silo) => (
          <div key={silo} className="flex flex-col items-center px-1.5 sm:px-2">
            <p
              className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} flex h-12 w-full items-center justify-center px-1 text-center font-mono text-[10px] tracking-wider text-[var(--nd-ink,#262626)] uppercase sm:h-14 sm:text-xs`}
            >
              {silo}
            </p>
            <span aria-hidden className="h-6 w-px bg-[var(--nd-line,#d4d4d4)]" />
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="h-px bg-[var(--nd-line,#d4d4d4)]"
        style={{ marginLeft: halfColumn, marginRight: halfColumn }}
      />
      <Arrow direction="down" length={32} />
      <p
        className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.green} ${NADIIA_LABEL} mx-auto flex h-14 w-fit items-center px-6`}
      >
        {to}
      </p>
    </div>
  );
}
