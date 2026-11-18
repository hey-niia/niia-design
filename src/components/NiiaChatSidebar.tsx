import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useNiiaChat } from "../context/useNiiaChat";
import { CONTACT_EMAIL, PROJECT_LINKS, type AnswerCard } from "../lib/niiaLLM";

const LINKEDIN_URL = "https://www.linkedin.com/in/niia-bieliavtseva/";
const CHAT_POS_KEY = "niia-chat-pos-v1";
const RESUME_URL = "/resume.pdf";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches the contact email, "LinkedIn", "resume"/"résumé", or any case
// study's name — whichever known terms show up in a canned answer's
// plain-text copy — so they render as real links instead of inert prose.
const LINK_TERM_REGEX = new RegExp(
  `(${CONTACT_EMAIL.replace(/\./g, "\\.")}|LinkedIn|r[ée]sum[ée]|${PROJECT_LINKS.map(
    (p) => escapeRegExp(p.name),
  ).join("|")})`,
  "gi",
);

interface TermLink {
  href: string;
  internal: boolean;
}

function linkForTerm(term: string): TermLink | null {
  if (term.toLowerCase() === CONTACT_EMAIL.toLowerCase()) {
    return { href: `mailto:${CONTACT_EMAIL}`, internal: false };
  }
  if (/^linkedin$/i.test(term)) return { href: LINKEDIN_URL, internal: false };
  if (/^r[ée]sum[ée]$/i.test(term))
    return { href: RESUME_URL, internal: false };
  const project = PROJECT_LINKS.find(
    (p) => p.name.toLowerCase() === term.toLowerCase(),
  );
  if (project) return { href: `/work/${project.slug}`, internal: true };
  return null;
}

// Chat prose otherwise reads identically to plain text, so links here need
// their own underline at rest (unlike the rest of the site, where hover
// color alone is enough) — hover still turns orange via the global a:hover.
const CHAT_LINK_CLASSES = "underline decoration-neutral-400 underline-offset-2";

/** Turns known mentions (email, LinkedIn, résumé, case-study names) into real links. */
function linkifyKnownTerms(text: string): ReactNode {
  const parts = text.split(LINK_TERM_REGEX);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const link = linkForTerm(part);
    if (!link) return part;
    if (link.internal) {
      return (
        <Link key={i} to={link.href} className={CHAT_LINK_CLASSES}>
          {part}
        </Link>
      );
    }
    return (
      <a
        key={i}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={CHAT_LINK_CLASSES}
      >
        {part}
      </a>
    );
  });
}

// A canned answer can carry "- " bullet lines (e.g. the hiring answer) —
// this renders those as a real list, everything else as plain paragraphs,
// linkifying each line's text either way.
function renderAnswer(text: string): ReactNode {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul
        key={key}
        className="list-disc space-y-1 pl-4 marker:text-neutral-400"
      >
        {bullets.map((b, bi) => (
          <li key={bi}>{linkifyKnownTerms(b)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
    } else {
      flushBullets(`ul-${i}`);
      blocks.push(<p key={`p-${i}`}>{linkifyKnownTerms(line)}</p>);
    }
  });
  flushBullets("ul-end");

  return (
    <div className="flex flex-col gap-2 text-sm leading-relaxed">{blocks}</div>
  );
}

// Thumbnail cards for case studies / AI playground projects mentioned in an answer —
// one horizontally-scrollable row, sized generously so the image actually
// reads as a preview rather than a cramped icon.
function AnswerCards({ cards }: { cards: AnswerCard[] }) {
  if (cards.length === 0) return null;

  return (
    <div className="-mx-1 mt-2 flex gap-4 overflow-x-auto px-1 pb-1">
      {cards.map((c) => (
        <Link
          key={c.href}
          to={c.href}
          className="group/card block w-64 shrink-0 overflow-hidden rounded-xl bg-[color-mix(in_srgb,var(--pad-color)_35%,white)]"
        >
          <div className="h-36 w-full overflow-hidden bg-black">
            <img
              src={c.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-200 group-hover/card:scale-105"
            />
          </div>
          <div className="p-3.5">
            <p className="text-base leading-snug text-black">{c.title}</p>
            <p className="mt-1 truncate text-sm text-black/50">{c.caption}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function NiiaChatSidebar() {
  const {
    isOpen,
    messages,
    isTyping,
    pendingQuote,
    suggestions,
    close,
    reset,
    clearPendingQuote,
    sendMessage,
  } = useNiiaChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLElement>(null);

  // On wider screens the chat is a floating window you can drag anywhere by
  // its title bar (it remembers where you left it). On phones it's a sheet
  // across the bottom of the screen.
  const [isWide, setIsWide] = useState(
    () => window.matchMedia("(min-width: 640px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => setIsWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(CHAT_POS_KEY) || "null");
    } catch {
      return null;
    }
  });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const clamp = (x: number, y: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    const w = r?.width ?? 400;
    const h = r?.height ?? 600;
    return {
      x: Math.min(Math.max(8, x), window.innerWidth - w - 8),
      y: Math.min(Math.max(8, y), window.innerHeight - h - 8),
    };
  };
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_POS_KEY, JSON.stringify(pos));
    } catch {
      // Ignore — it just won't remember the spot.
    }
  }, [pos]);
  useEffect(() => {
    const fit = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const dragHandlers = isWide
    ? {
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          if ((e.target as HTMLElement).closest("button, a, input")) return;
          const r = boxRef.current?.getBoundingClientRect();
          if (!r) return;
          drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
          e.currentTarget.setPointerCapture(e.pointerId);
        },
        onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
          if (!drag.current) return;
          setPos(
            clamp(e.clientX - drag.current.dx, e.clientY - drag.current.dy),
          );
        },
        onPointerUp: () => {
          drag.current = null;
        },
      }
    : {};
  // Phones: the chat fills the visible part of the screen from the very top,
  // and shrinks when the keyboard opens so the latest messages and the input
  // stay above it. visualViewport is the area the keyboard leaves visible.
  const [phoneView, setPhoneView] = useState<{
    top: number;
    height: number;
  } | null>(null);
  useEffect(() => {
    if (isWide) return;
    const vv = window.visualViewport;
    const update = () =>
      setPhoneView(
        vv
          ? { top: vv.offsetTop, height: vv.height }
          : { top: 0, height: window.innerHeight },
      );
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isWide]);
  // Jump to the newest message only when the keyboard opens (a big drop in
  // height). Safari's toolbar also nudges the height while you scroll, and
  // reacting to that kept snapping the chat back to the bottom.
  const lastHeight = useRef<number | null>(null);
  useEffect(() => {
    const h = phoneView?.height;
    if (h == null) return;
    if (lastHeight.current != null && lastHeight.current - h > 150) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
    lastHeight.current = h;
  }, [phoneView?.height]);

  // While the chat covers the phone screen, the page behind it stays put, so
  // swipes scroll the conversation instead of the page.
  useEffect(() => {
    if (isWide || !isOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [isWide, isOpen]);

  const placement: React.CSSProperties = isWide
    ? pos
      ? { left: pos.x, top: pos.y }
      : { right: 24, bottom: 24 }
    : phoneView
      ? { top: phoneView.top + 8, height: phoneView.height - 16 }
      : {};

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, pendingQuote]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, suggestions]);

  function submit(text: string) {
    sendMessage(text);
    setDraft("");
  }

  return (
    <aside
      ref={boxRef}
      data-niia-chat-sidebar
      aria-hidden={!isOpen}
      style={placement}
      // The same pink pressed/raised look as the drawing pad's send window.
      className={`niia-sidebar soft-window fixed inset-x-2 top-2 z-40 flex h-[calc(100dvh-16px)] flex-col gap-2 rounded-[28px] p-3 text-black/80 sm:inset-x-auto sm:top-auto sm:bottom-auto sm:gap-3 sm:p-4 sm:h-[min(640px,80vh)] sm:w-[400px] ${
        isOpen
          ? "scale-100 opacity-100"
          : "pointer-events-none -translate-y-4 scale-95 opacity-0 sm:translate-y-4"
      }`}
    >
      <div
        {...dragHandlers}
        title={isWide ? "Drag to move" : undefined}
        className={`flex items-center justify-between px-1 select-none ${isWide ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
      >
        <p className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
          <span aria-hidden>✦</span> Niia AI
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset conversation"
            title="Reset conversation"
            className="soft-raised flex h-9 w-9 items-center justify-center text-sm"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            title="Close"
            className="soft-raised flex h-9 w-9 items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        // On phones the chat covers the page, so any link inside an answer
        // (a project card or a linked name) closes it to show the page.
        onClick={(e) => {
          if (!isWide && (e.target as HTMLElement).closest("a[href^='/']"))
            close();
        }}
        className="soft-inset flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-2xl p-3 sm:p-4"
      >
        <div className="mt-auto flex flex-col gap-5">
          {messages.length === 0 && (
            <p className="niia-fade-in-up text-lg leading-relaxed">
              Hey, I'm Niia AI — the pre-written version of her, anyway.
            </p>
          )}

          {messages.map((m, i) => (
            <div key={i} className="niia-fade-in-up">
              <p className="mb-1 font-mono text-xs tracking-widest text-black/50 uppercase">
                {m.role === "user" ? "You" : "Niia AI"}
              </p>
              {m.quote && (
                <p className="mb-1.5 border-l-2 border-[var(--site-accent)]/40 pl-2 text-xs text-neutral-500 italic">
                  “{m.quote}”
                </p>
              )}
              {m.role === "bot" ? (
                <>
                  {renderAnswer(m.text)}
                  {m.image && (
                    <img
                      src={m.image.src}
                      alt={m.image.alt}
                      className="mt-3 w-full rounded-xl shadow-[0_1px_2px_rgba(60,50,40,0.08),0_8px_20px_rgba(60,50,40,0.12)]"
                    />
                  )}
                  {m.cards && (
<AnswerCards cards={m.cards} />
                  )}
                </>
              ) : (
                <p className="text-sm leading-relaxed">{m.text}</p>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="niia-fade-in-up">
              <p className="mb-1 font-mono text-xs tracking-widest text-black/50 uppercase">
                Niia AI
              </p>
              <div
                className="flex items-center gap-1 py-1.5"
                aria-label="Niia AI is typing"
              >
                <span
                  className="niia-typing-dot h-1.5 w-1.5 rounded-full bg-black/40"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="niia-typing-dot h-1.5 w-1.5 rounded-full bg-black/40"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="niia-typing-dot h-1.5 w-1.5 rounded-full bg-black/40"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          )}

          {!isTyping && suggestions.length > 0 && (
            <div className="flex flex-col gap-0.5">
              {suggestions.map((q, i) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                  className="niia-fade-in-up -mx-2 flex items-start gap-2 rounded-md px-2 py-1 text-left text-sm leading-relaxed text-black/70 transition-colors hover:bg-white/40 hover:text-black"
                >
                  <span aria-hidden>↳</span> {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {pendingQuote && (
          <div className="niia-fade-in-up mb-2 flex items-start justify-between gap-2 rounded-xl bg-white/40 px-3 py-1.5 text-xs text-black/60">
            <span className="line-clamp-1 italic">“{pendingQuote}”</span>
            <button
              type="button"
              onClick={clearPendingQuote}
              aria-label="Remove quote"
              className="shrink-0 text-neutral-400 transition-colors hover:text-[var(--site-accent)]"
            >
              ✕
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(draft);
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              pendingQuote ? "Ask about this quote…" : "Ask me anything…"
            }
            className="soft-inset min-w-0 flex-1 rounded-full px-4 py-3 text-base text-black sm:text-sm placeholder:text-black/40 focus:outline-none"
          />
          <button type="submit" className="soft-raised soft-pill">
            Send
          </button>
        </form>
      </div>
    </aside>
  );
}
