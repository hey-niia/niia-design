import { useEffect, useRef, useState } from "react";
import { useNiiaChat } from "../context/useNiiaChat";
import { SUGGESTED_QUESTIONS } from "../lib/niiaLLM";

export default function NiiaChatSidebar() {
  const { isOpen, messages, isTyping, pendingQuote, close, reset, clearPendingQuote, sendMessage } =
    useNiiaChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, pendingQuote]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

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
        {messages.length === 0 ? (
          <div className="niia-fade-in-up mt-auto">
            <p className="mb-6 text-lg">Hey there, I'm NiiaLLM.</p>
            <div className="flex flex-col gap-3">
              {SUGGESTED_QUESTIONS.map((q, i) => (
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
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-5">
            {messages.map((m, i) => (
              <div key={i} className="niia-fade-in-up">
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
            {isTyping && (
              <div className="niia-fade-in-up">
                <p className="mb-1 font-mono text-xs tracking-widest text-neutral-400 uppercase">
                  NiiaLLM
                </p>
                <div className="flex items-center gap-1 py-1.5" aria-label="NiiaLLM is typing">
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
          </div>
        )}
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
            placeholder={pendingQuote ? "Ask about this quote…" : "Ask about Niia…"}
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
