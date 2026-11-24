import { useEffect, useState } from "react";

/**
 * The home page's "Agent" view: the files agents actually read, shown as
 * they are. Markdown and JSON are static files in public/ (agents fetch them
 * without running JavaScript); JSON-LD is the block in index.html's <head>.
 * One source of truth each — this view only displays them.
 */
const FORMATS = [
  { id: "md", label: "Markdown", type: "text/markdown", url: "/agent.md" },
  { id: "json", label: "JSON", type: "application/json", url: "/agent.json" },
  { id: "ld", label: "JSON-LD", type: "application/ld+json", url: null },
] as const;
type FormatId = (typeof FORMATS)[number]["id"];

function readJsonLd() {
  const raw = document.querySelector('script[type="application/ld+json"]')?.textContent ?? "";
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw.trim();
  }
}

export default function AgentProfile() {
  const [format, setFormat] = useState<FormatId>("md");
  const [text, setText] = useState<Partial<Record<FormatId, string>>>({});
  const current = FORMATS.find((f) => f.id === format)!;

  useEffect(() => {
    if (text[format] !== undefined) return;
    if (!current.url) {
      setText((t) => ({ ...t, [format]: readJsonLd() }));
      return;
    }
    fetch(current.url)
      .then((r) => r.text())
      .then((body) => setText((t) => ({ ...t, [format]: body.trim() })))
      .catch(() => setText((t) => ({ ...t, [format]: `Couldn't load ${current.url}` })));
  }, [format, current.url, text]);

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-neutral-100 px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 font-mono text-xs tracking-widest text-neutral-500 uppercase">
        <p>Agent view</p>
        <div className="flex gap-1" role="tablist" aria-label="Format">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={f.id === format}
              onClick={() => setFormat(f.id)}
              className={`cursor-pointer rounded-full px-3 py-1.5 tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                f.id === format ? "bg-white text-neutral-900 shadow-sm" : "hover:text-neutral-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-t-2xl border border-b-0 border-neutral-200 bg-white px-5 pt-5 font-mono text-[13px] sm:px-8">
        <p className="text-neutral-900">
          $ curl niia.design{current.url ?? " | grep ld+json"}
        </p>
        {current.url && (
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-neutral-400 underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            raw ↗
          </a>
        )}
      </div>
      <pre className="overflow-x-auto rounded-b-2xl border border-t-0 border-neutral-200 bg-white px-5 pt-3 pb-8 font-mono text-[13px] leading-[1.8] whitespace-pre-wrap text-neutral-700 sm:px-8">
        {text[format] ?? "…"}
      </pre>
    </section>
  );
}
