import { createContext } from "react";

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
  /** Selected-text context the user was asking about, shown as a quote above their message. */
  quote?: string;
}

export interface NiiaChatContextValue {
  isOpen: boolean;
  messages: ChatMessage[];
  /** True while a canned answer is "being typed" — drives the typing-dots indicator. */
  isTyping: boolean;
  /** Selection staged as context for the next question, shown as a dismissible chip. */
  pendingQuote: string | null;
  /** Suggested questions to offer right now — the welcome set, then a fresh blend after each answer. */
  suggestions: string[];
  openWelcome: () => void;
  openWithQuote: (quote: string) => void;
  close: () => void;
  reset: () => void;
  clearPendingQuote: () => void;
  sendMessage: (text: string) => void;
}

export const NiiaChatContext = createContext<NiiaChatContextValue | null>(null);
