import { useEffect, useRef, useState } from "react";
import { useNiiaChat } from "../context/useNiiaChat";
import { SUGGESTED_QUESTIONS } from "../lib/niiaLLM";

export default function NiiaChatSidebar() {
  const { isOpen, messages, pendingQuote, close, reset, clearPendingQuote, sendMessage } =
    useNiiaChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, pendingQuote]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  function submit(text: string) {
    sendMessage(text);
    setDraft("");
  }

  return (
    <aside
      data-niia-chat-sidebar
      className="fixed inset-y-0 right-0 z-30 flex w-full flex-col border-l bg-white sm:w-[380px]"
    >
      <div className="flex items-center justify-between border-b p-4">
        <p className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
          <span aria-hidden>✦</span> Niia LLM
          <span
            title="Answers here are pre-written, not a live model — email Niia for anything else."
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
            className="hover:text-[#e65f2e]"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            title="Close"
            className="hover:text-[#e65f2e]"
          >
            ✕
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div>
            <p className="mb-6 text-lg">Hey there, I'm NiiaLLM.</p>
            <div className="flex flex-col gap-3">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  className="flex items-start gap-2 text-left text-sm text-neutral-600 hover:text-[#e65f2e]"
                >
                  <span aria-hidden>↳</span> {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((m, i) => (
              <div key={i}>
                <p className="mb-1 font-mono text-xs tracking-widest text-neutral-400 uppercase">
                  {m.role === "user" ? "You" : "NiiaLLM"}
                </p>
                {m.quote && (
                  <p className="mb-1.5 border-l-2 border-[#e65f2e]/40 pl-2 text-xs text-neutral-500 italic">
                    “{m.quote}”
                  </p>
                )}
                <p className="text-sm">{m.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t p-4">
        {pendingQuote && (
          <div className="mb-2 flex items-start justify-between gap-2 bg-neutral-50 px-2 py-1.5 text-xs text-neutral-500">
            <span className="line-clamp-1 italic">“{pendingQuote}”</span>
            <button
              type="button"
              onClick={clearPendingQuote}
              aria-label="Remove quote"
              className="shrink-0 text-neutral-400 hover:text-[#e65f2e]"
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
          className="flex items-center gap-2 border px-3 py-2"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={pendingQuote ? "Ask about this quote…" : "Ask about Niia…"}
            className="flex-1 text-sm outline-none"
          />
          <button type="submit" aria-label="Send" className="text-neutral-400 hover:text-[#e65f2e]">
            ↑
          </button>
        </form>
      </div>
    </aside>
  );
}
