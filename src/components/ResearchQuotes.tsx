const ACCENT = "#e65f2e";

export interface ResearchQuote {
  /** Shown inside the avatar circle, e.g. "AS". */
  initials: string;
  /** Revealed on hover/focus — anonymized to first name + last initial. */
  name: string;
  /** One line of who they are and when we spoke, e.g. "London · build 2.9.0, May 2026". */
  context: string;
  quote: string;
  /** What this interview changed — the reason it's in the case study at all. */
  takeaway: string;
}

/**
 * Interview evidence: an avatar you can hover for who said it, the quote, and
 * the takeaway. Avatars are initials rather than photos — these are real users
 * and the client is anonymized.
 */
export default function ResearchQuotes({ items }: { items: ResearchQuote[] }) {
  return (
    <div
      className={`my-8 grid grid-cols-1 gap-6 ${items.length > 1 ? "sm:grid-cols-2" : ""}`}
    >
      {items.map((item, i) => (
        <figure key={i} className="flex flex-col bg-neutral-100 p-6">
          <div className="group relative mb-4 w-fit">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: i % 2 === 0 ? ACCENT : "#000000" }}
              tabIndex={0}
              role="img"
              aria-label={`${item.name}, ${item.context}`}
            >
              {item.initials}
            </div>
            <span className="pointer-events-none absolute -top-9 left-0 z-10 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              {item.name} — {item.context}
            </span>
          </div>

          <blockquote className="grow">
            <p className="text-lg leading-snug italic">“{item.quote}”</p>
          </blockquote>

          <figcaption className="mt-4 border-t border-neutral-300 pt-4 text-sm text-gray-500">
            {item.takeaway}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
