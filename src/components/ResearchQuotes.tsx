import { NADIIA_CARD_SHELL } from "./nadiia";

const ACCENT = "#e65f2e";

export interface ResearchQuote {
  /** Shown inside the avatar circle, e.g. "AS". */
  initials: string;
  /** Revealed on hover/focus — anonymized to first name + last initial. */
  name: string;
  /** One line of who they are and when we spoke, e.g. "London · build 2.9.0, May 2026". */
  context: string;
  quote: string;
  /** Anything else they said worth quoting, each shown as its own message. */
  followUps?: string[];
  /** What this interview changed — the reason it's in the case study at all. */
  takeaway: string;
}

/**
 * Interview evidence as a short chat: an avatar you can hover for who said it,
 * what they said as message bubbles on the dotted field, and the takeaway as an
 * orange note along the bottom of the card, on the page's own colour so it reads
 * as a margin note rather than another message. Avatars are initials rather than
 * photos — these are real users and the client is anonymized.
 */
export default function ResearchQuotes({ items }: { items: ResearchQuote[] }) {
  return (
    <div className={`my-8 grid grid-cols-1 gap-4 ${items.length > 1 ? "sm:grid-cols-2 sm:gap-6" : ""}`}>
      {items.map((item, i) => (
        <QuoteCard key={i} item={item} dark={i % 2 === 1} single={items.length === 1} />
      ))}
    </div>
  );
}

function QuoteCard({
  item,
  dark,
  single = false,
}: {
  item: ResearchQuote;
  dark: boolean;
  /** The only quote on its row: the note sits beside the message rather than under it. */
  single?: boolean;
}) {
  return (
    // No card around the chat: the avatar and the message sit on the page, and
    // the orange note is a card of its own, as wide and as tall as the message.
    <figure
      className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 ${
        single ? "sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)]" : ""
      }`}
    >
      <div className="group relative self-start">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: dark ? "#000000" : ACCENT }}
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

      {/* Everything they said in one bubble, in the card style: fill, hairline
          and soft shadow, with the corner by the avatar tucked in. */}
      {/* The bubble hugs what they said, like a real message, rather than
          stretching to the note beside it. */}
      <blockquote className="flex min-w-0 items-start">
        <p className={`w-fit rounded-tl-md px-5 py-4 text-sm text-[var(--nd-ink-strong,#262626)] ${NADIIA_CARD_SHELL}`}>
          {[item.quote, ...(item.followUps ?? [])].join(" ")}
        </p>
      </blockquote>

      {/* A margin note rather than a third card: orange text on a thin orange
          rule, so it reads as commentary on the message, not another message. */}
      <figcaption
        className={`flex items-center border-l-2 border-[var(--nd-note-rule,rgba(230,95,46,0.35))] py-1 pl-4 text-sm leading-relaxed ${
          // Under the message on a phone; beside it on a wider screen.
          single ? "col-start-2 sm:col-start-auto sm:ml-3" : "col-start-2"
        }`}
        style={{ color: "var(--nd-note, #e65f2e)" }}
      >
        {item.takeaway}
      </figcaption>
    </figure>
  );
}
