import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { getCannedAnswer } from "../lib/niiaLLM";
import { NiiaChatContext, type ChatMessage } from "./chatContext";

export function NiiaChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingQuote, setPendingQuote] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<number | null>(null);

  const clearTypingTimeout = useCallback(() => {
    if (typingTimeout.current !== null) {
      window.clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
  }, []);

  const openWelcome = useCallback(() => {
    setIsOpen(true);
  }, []);

  const openWithQuote = useCallback((quote: string) => {
    setIsOpen(true);
    setPendingQuote(quote);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const reset = useCallback(() => {
    clearTypingTimeout();
    setIsTyping(false);
    setMessages([]);
    setPendingQuote(null);
  }, [clearTypingTimeout]);

  const clearPendingQuote = useCallback(() => setPendingQuote(null), []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const quote = pendingQuote ?? undefined;
      setMessages((prev) => [...prev, { role: "user", text: trimmed, quote }]);
      setPendingQuote(null);

      // A brief "typing" beat before the canned answer lands — makes the
      // reveal feel considered rather than instant, since it's not a real
      // model generating anything. Length randomized a little so repeated
      // questions don't all land on the same beat.
      clearTypingTimeout();
      setIsTyping(true);
      typingTimeout.current = window.setTimeout(
        () => {
          const answer = getCannedAnswer(trimmed);
          setMessages((prev) => [...prev, { role: "bot", text: answer }]);
          setIsTyping(false);
          typingTimeout.current = null;
        },
        500 + Math.random() * 400,
      );
    },
    [pendingQuote, clearTypingTimeout],
  );

  const value = useMemo(
    () => ({
      isOpen,
      messages,
      isTyping,
      pendingQuote,
      openWelcome,
      openWithQuote,
      close,
      reset,
      clearPendingQuote,
      sendMessage,
    }),
    [
      isOpen,
      messages,
      isTyping,
      pendingQuote,
      openWelcome,
      openWithQuote,
      close,
      reset,
      clearPendingQuote,
      sendMessage,
    ],
  );

  return <NiiaChatContext.Provider value={value}>{children}</NiiaChatContext.Provider>;
}
