import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useNiiaChat } from "../context/useNiiaChat";
import { CONTACT_EMAIL, PROJECT_LINKS } from "../lib/niiaLLM";

const LINKEDIN_URL = "https://www.linkedin.com/in/niia-bieliavtseva/";
const RESUME_URL = "/resume.pdf";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches the contact email, "LinkedIn", "resume"/"résumé", or any case
// study's name — whichever known terms show up in a canned answer's
// plain-text copy — so they render as real links instead of inert prose.
const LINK_TERM_REGEX = new RegExp(
  `(${CONTACT_EMAIL.replace(/\./g, "\\.")}|LinkedIn|r[ée]sum[ée]|${PROJECT_LINKS.map((p) =>
    escapeRegExp(p.name),
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
  if (/^r[ée]sum[ée]$/i.test(term)) return { href: RESUME_URL, internal: false };
  const project = PROJECT_LINKS.find((p) => p.name.toLowerCase() === term.toLowerCase());
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
      <ul key={key} className="list-disc space-y-1 pl-4 marker:text-neutral-400">
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

  return <div className="flex flex-col gap-2 text-sm">{blocks}</div>;
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

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, pendingQuote]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, suggestions]);

  function submit(text: string) {
    sendMessage(text);
    setDraft("");
  }

  return (
    <aside
      data-niia-chat-sidebar
      aria-hidden={!isOpen}
      className={`niia-sidebar fixed inset-y-0 right-0 z-30 flex w-full flex-col bg-white/70 shadow-[-16px_0_40px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:w-[380px] ${
        isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between border-b border-black/5 p-4">
        <p className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
          <span aria-hidden>✦</span> Niia AI
          <span
            title="These are pre-written answers, not a live model — email Niia directly for anything else."
            className="cursor-help text-neutral-400"
          >
            ⓘ
          </span>
        </p>
        <div className="flex items-center gap-3 text-neutral-400">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset conversation"
            title="Reset conversation"
            className="transition-colors hover:text-[#e65f2e]"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            title="Close"
            className="transition-colors hover:text-[#e65f2e]"
          >
            ✕
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto p-4">
        <div className="mt-auto flex flex-col gap-5">
          {messages.length === 0 && (
            <p className="niia-fade-in-up text-lg">
              Hey, I'm Niia AI — the pre-written version of her, anyway.
            </p>
          )}

          {messages.map((m, i) => (
            <div key={i} className="niia-fade-in-up">
              <p className="mb-1 font-mono text-xs tracking-widest text-neutral-400 uppercase">
                {m.role === "user" ? "You" : "Niia AI"}
              </p>
              {m.quote && (
                <p className="mb-1.5 border-l-2 border-[#e65f2e]/40 pl-2 text-xs text-neutral-500 italic">
                  “{m.quote}”
                </p>
              )}
              {m.role === "bot" ? renderAnswer(m.text) : <p className="text-sm">{m.text}</p>}
            </div>
          ))}

          {isTyping && (
            <div className="niia-fade-in-up">
              <p className="mb-1 font-mono text-xs tracking-widest text-neutral-400 uppercase">
                Niia AI
              </p>
              <div className="flex items-center gap-1 py-1.5" aria-label="Niia AI is typing">
                <span
                  className="niia-typing-dot h-1.5 w-1.5 rounded-full bg-neutral-400"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="niia-typing-dot h-1.5 w-1.5 rounded-full bg-neutral-400"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="niia-typing-dot h-1.5 w-1.5 rounded-full bg-neutral-400"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          )}

          {!isTyping && suggestions.length > 0 && (
            <div className="flex flex-col gap-3">
              {suggestions.map((q, i) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                  className="niia-fade-in-up flex items-start gap-2 text-left text-sm text-neutral-600 transition-colors hover:text-[#e65f2e]"
                >
                  <span aria-hidden>↳</span> {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-black/5 p-4">
        {pendingQuote && (
          <div className="niia-fade-in-up mb-2 flex items-start justify-between gap-2 rounded-lg bg-white/50 px-2 py-1.5 text-xs text-neutral-500 backdrop-blur-sm">
            <span className="line-clamp-1 italic">“{pendingQuote}”</span>
            <button
              type="button"
              onClick={clearPendingQuote}
              aria-label="Remove quote"
              className="shrink-0 text-neutral-400 transition-colors hover:text-[#e65f2e]"
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
          className="flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-3.5 py-2 backdrop-blur-sm"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={pendingQuote ? "Ask about this quote…" : "Ask me anything…"}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            className="text-neutral-400 transition-colors hover:text-[#e65f2e]"
          >
            ↑
          </button>
        </form>
      </div>
    </aside>
  );
}
