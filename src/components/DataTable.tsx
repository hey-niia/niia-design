import { NADIIA_CARD_SHELL } from "./nadiia";

export interface DataTableRow {
  /** The row's name, with an optional quieter qualifier after it, e.g. "(Baseline)". */
  label: string;
  qualifier?: string;
  cells: string[];
}

/**
 * An analytics readout rebuilt as a table rather than pasted in as a
 * screenshot, so it stays crisp and follows the page's theme. The source tool
 * sits in the corner as a chip, the way a dashboard names its data.
 */
export default function DataTable({
  title,
  source,
  columns,
  rows,
}: {
  title: string;
  /** Where the numbers came from, e.g. "Amplitude". */
  source?: string;
  /** Header for the label column first, then one per cell. */
  columns: string[];
  rows: DataTableRow[];
}) {
  return (
    <figure className={`overflow-hidden ${NADIIA_CARD_SHELL}`}>
      <figcaption className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <span className="text-[15px] font-medium text-[var(--nd-ink,#262626)]">{title}</span>
        {source && (
          <span className="rounded-md px-2 py-0.5 font-mono text-[11px] tracking-wider text-[var(--nd-body,#737373)] uppercase ring-1 ring-[var(--nd-box-ring,rgba(0,0,0,0.08))]">
            {source}
          </span>
        )}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-[var(--nd-box-ring,rgba(0,0,0,0.08))] bg-[var(--nd-table-head,rgba(0,0,0,0.03))] text-[var(--nd-body,#737373)]">
              {columns.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={`px-5 py-3 font-mono text-[11px] font-normal tracking-wider uppercase sm:px-6 ${
                    i > 0 && i < columns.length - 1 ? "text-right" : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-[var(--nd-box-ring,rgba(0,0,0,0.08))] last:border-b-0"
              >
                <th scope="row" className="px-5 py-3.5 font-normal sm:px-6">
                  <span className="text-[var(--nd-ink,#262626)]">{row.label}</span>
                  {row.qualifier && (
                    <span className="text-[var(--nd-body,#737373)]"> {row.qualifier}</span>
                  )}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-5 py-3.5 sm:px-6 ${
                      i < row.cells.length - 1
                        ? "text-right text-[var(--nd-ink,#262626)] tabular-nums"
                        : "text-[var(--nd-body,#737373)]"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
