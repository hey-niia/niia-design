import { useCallback, useMemo, useState, type ReactNode } from "react";
import { getCannedAnswer } from "../lib/niiaLLM";
import { NiiaChatContext, type ChatMessage } from "./chatContext";

export function NiiaChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingQuote, setPendingQuote] = useState<string | null>(null);

  const openWelcome = useCallback(() => {
    setIsOpen(true);
  }, []);

  const openWithQuote = useCallback((quote: string) => {
    setIsOpen(true);
    setPendingQuote(quote);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const reset = useCallback(() => {
    setMessages([]);
    setPendingQuote(null);
  }, []);

  const clearPendingQuote = useCallback(() => setPendingQuote(null), []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const quote = pendingQuote ?? undefined;
      const answer = getCannedAnswer(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "user", text: trimmed, quote },
        { role: "bot", text: answer },
      ]);
      setPendingQuote(null);
    },
    [pendingQuote],
  );

  const value = useMemo(
    () => ({
      isOpen,
      messages,
      pendingQuote,
      openWelcome,
      openWithQuote,
      close,
      reset,
      clearPendingQuote,
      sendMessage,
    }),
    [isOpen, messages, pendingQuote, openWelcome, openWithQuote, close, reset, clearPendingQuote, sendMessage],
  );

  return <NiiaChatContext.Provider value={value}>{children}</NiiaChatContext.Provider>;
}
