import { useId, useState } from "react";
import { experience, type Role } from "../data/experience";

function Company({ item }: { item: Role }) {
  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer">
      {item.company}
    </a>
  ) : (
    <>{item.company}</>
  );
}

/** The full work history: company, role and dates, then what the work was. Used on About. */
export function ExperienceList() {
  return (
    <div className="max-w-2xl">
      {experience.map((item, i) => (
        <div key={item.company} className={i < experience.length - 1 ? "mb-8" : undefined}>
          <p className="text-base">
            <Company item={item} />
          </p>
          <p className="mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase">
            {item.role} · {item.period}
          </p>
          <p className="mt-2 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * The same history as a compact timeline: dates, company, role, one row each.
 * An expand button opens every row's description at once.
 */
export function ExperienceTimeline() {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    // A container: the rows go to three columns when the timeline itself is wide enough,
    // whatever the window width, so a narrow column never squeezes the role into a sliver.
    <div className="@container relative">
      {/* pr-10 keeps the rows clear of the button, which sits on the first row's line. */}
      <ul
        id={detailsId}
        // Opened, each role becomes a paragraph, so the roles get more room between them.
        className={`flex flex-col pr-10 transition-[gap] duration-300 ease-out ${open ? "gap-10" : "gap-3"}`}
      >
        {experience.map((item) => (
          <li
            key={item.company}
            className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 @lg:grid-cols-[7.5rem_6.5rem_minmax(0,1fr)]"
          >
            <p className="font-mono text-[15px] leading-6 tracking-wide text-neutral-400 uppercase">{item.period}</p>
            <p className="text-[15px] leading-6 text-neutral-800">
              <Company item={item} />
            </p>
            <p className="col-start-2 text-[15px] leading-6 text-neutral-400 @lg:col-start-3">{item.role}</p>

            {/* Height animates from 0 via a one-row grid, so the text can wrap to any length.
                It spans the whole section, out past the button's gutter. */}
            <div
              className={`col-span-full -mr-10 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!open}
            >
              <p className="overflow-hidden text-[15px] leading-6 text-neutral-500">
                <span className="block pt-1.5 pb-1">{item.description}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* The usual pattern: a chevron pointing down to expand, an X to close, at the right end
          of the first row, level with its role. */}
      <div className="absolute -top-1 right-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={open ? "Hide details" : "Show details"}
          title={open ? "Hide details" : "Show details"}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none"
        >
          {open ? (
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
