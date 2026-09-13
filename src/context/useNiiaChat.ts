import { useContext } from "react";
import { NiiaChatContext } from "./chatContext";

export function useNiiaChat() {
  const ctx = useContext(NiiaChatContext);
  if (!ctx) throw new Error("useNiiaChat must be used within a NiiaChatProvider");
  return ctx;
}
