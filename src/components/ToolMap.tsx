import { Fragment, useCallback, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { NADIIA_ACCENT, NADIIA_LABEL, NADIIA_SHAPE, NADIIA_SMALL, NADIIA_SURFACE } from "./nadiia";
import { Tag } from "./NadiiaParts";

/**
 * Tools reviewed, grouped by what they taught, in the Nadiia style. Every tool
 * is one white box in a single evenly spaced column; each group's findings sit
 * in a card to the right, centred on its boxes. A pair's two lines merge into
 * one arrow that touches the card; a lone tool gets a single arrow.
 *
 * Connectors are measured off the real layout rather than hard-coded, since
 * the findings wrap differently at every width. On phones there is no room for
 * two columns and an arrow between them, so each group folds into a single
 * card with its tools named inside it — the link the arrows carried on wider
 * screens, without the ragged column of narrow boxes.
 */

export interface ToolMapItem {
  names: string[];
  plus: string;
  minus: string;
}

// Tailwind's `sm` breakpoint, where the side-by-side layout (and connectors) begin.
const SIDE_BY_SIDE = "(min-width: 40rem)";
// How far right of the boxes a pair's two lines meet.
const MERGE_X = 32;

interface Connector {
  d: string;
  arrow: boolean;
}

export default function ToolMap({ items }: { items: ToolMapItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxes = useRef(new Map<string, HTMLElement>());
  const cards = useRef(new Map<number, HTMLElement>());
  const [connectors, setConnectors] = useState<Connector[]>([]);
  // useId can contain characters that break an SVG `url(#…)` reference.
  const markerId = `tool-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // First grid row of each group, so its boxes and card line up.
  const startRows = items.map(
    (_, g) => 1 + items.slice(0, g).reduce((rows, item) => rows + item.names.length, 0),
  );

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || !window.matchMedia(SIDE_BY_SIDE).matches) {
      setConnectors([]);
      return;
    }
    const origin = container.getBoundingClientRect();
    const next: Connector[] = [];
    items.forEach((item, g) => {
      const card = cards.current.get(g)?.getBoundingClientRect();
      const sources = item.names
        .map((name) => boxes.current.get(name)?.getBoundingClientRect())
        .filter((rect): rect is DOMRect => rect !== undefined);
      if (!card || sources.length === 0) return;

      const sx = sources[0].right - origin.left + 6;
      const centres = sources.map((rect) => rect.top + rect.height / 2 - origin.top);
      const ex = card.left - origin.left - 10;
      const ey = card.top + card.height / 2 - origin.top;

      if (centres.length === 1) {
        next.push({ d: `M${sx},${centres[0]} L${ex},${ey}`, arrow: true });
        return;
      }
      const mx = sx + MERGE_X;
      const my = centres.reduce((sum, y) => sum + y, 0) / centres.length;
      for (const cy of centres) {
        next.push({
          d: `M${sx},${cy} C${sx + MERGE_X / 2},${cy} ${mx - MERGE_X / 2},${my} ${mx},${my}`,
          arrow: false,
        });
      }
      next.push({ d: `M${mx},${my} L${ex},${ey}`, arrow: true });
    });
    setConnectors(next);
  }, [items]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    // Geist Mono swapping in changes how the findings wrap.
    document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div
      ref={containerRef}
      className="relative my-8 flex max-w-[46rem] flex-col gap-4 sm:grid sm:auto-rows-[3.5rem] sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-x-24 sm:gap-y-6"
    >
      {items.map((item, g) => (
        <Fragment key={item.names.join()}>
          {item.names.map((name, i) => (
            <p
              key={name}
              ref={(el) => {
                if (el) boxes.current.set(name, el);
                else boxes.current.delete(name);
              }}
              className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} ${NADIIA_LABEL} hidden h-14 w-40 items-center justify-center px-4 text-center sm:col-start-1 sm:flex sm:[grid-row:var(--row)]`}
              style={{ "--row": startRows[g] + i } as CSSProperties}
            >
              {name}
            </p>
          ))}
          <div
            ref={(el) => {
              if (el) cards.current.set(g, el);
              else cards.current.delete(g);
            }}
            className={`${NADIIA_SHAPE} ${NADIIA_SURFACE.white} mx-auto max-w-sm p-4 sm:col-start-2 sm:mx-0 sm:self-center sm:[grid-row:var(--row)]`}
            style={{ "--row": `${startRows[g]} / span ${item.names.length}` } as CSSProperties}
          >
            {/* The tools this card speaks for, since their boxes are hidden here. */}
            <div className="mb-3 flex flex-wrap gap-1.5 sm:hidden">
              {item.names.map((name) => (
                <Tag key={name}>{name}</Tag>
              ))}
            </div>
            <ul className={`${NADIIA_SMALL} flex flex-col gap-2`}>
              <li className="flex gap-2 text-[var(--nd-ink,#262626)]">
                <span className="sr-only">Strength: </span>
                <span aria-hidden style={{ color: NADIIA_ACCENT.green }}>
                  +
                </span>
                {item.plus}
              </li>
              <li className="flex gap-2 text-neutral-500">
                <span className="sr-only">Weakness: </span>
                <span aria-hidden style={{ color: NADIIA_ACCENT.orange }}>
                  −
                </span>
                {item.minus}
              </li>
            </ul>
          </div>
        </Fragment>
      ))}

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible sm:block"
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 z" className="fill-neutral-400" />
          </marker>
        </defs>
        {connectors.map((connector, i) => (
          <path
            key={i}
            d={connector.d}
            fill="none"
            strokeWidth={1}
            className="stroke-[var(--nd-line,#d4d4d4)]"
            markerEnd={connector.arrow ? `url(#${markerId})` : undefined}
          />
        ))}
      </svg>
    </div>
  );
}
