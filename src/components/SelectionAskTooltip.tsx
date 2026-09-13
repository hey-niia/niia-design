import { useEffect, useState } from "react";
import { useNiiaChat } from "../context/useNiiaChat";

interface Pill {
  text: string;
  top: number;
  left: number;
}

/** Floating "Ask NiiaLLM" pill that appears above any text the visitor selects
 * on the page, mirroring rachelchen.tech's select-to-ask affordance. */
export default function SelectionAskTooltip() {
  const { openWithQuote } = useNiiaChat();
  const [pill, setPill] = useState<Pill | null>(null);

  useEffect(() => {
    function handleSelection() {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!selection || !text || selection.isCollapsed || selection.rangeCount === 0) {
        setPill(null);
        return;
      }

      const anchorNode = selection.anchorNode;
      const anchorEl = anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;
      if (anchorEl?.closest("[data-niia-chat-sidebar]")) {
        setPill(null);
        return;
      }

      const rect = selection.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPill(null);
        return;
      }

      setPill({
        text,
        top: rect.top - 40,
        left: rect.left + rect.width / 2,
      });
    }

    function handleScroll() {
      setPill(null);
    }

    document.addEventListener("selectionchange", handleSelection);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  if (!pill) return null;

  return (
    <button
      type="button"
      style={{ top: pill.top, left: pill.left, transform: "translateX(-50%)" }}
      className="fixed z-40 flex items-center gap-1.5 rounded-full bg-[#e65f2e] px-3 py-1.5 text-xs whitespace-nowrap text-white shadow-lg"
      onMouseDown={(e) => {
        // Prevent the browser from collapsing the selection before onClick fires.
        e.preventDefault();
      }}
      onClick={() => {
        openWithQuote(pill.text);
        setPill(null);
      }}
    >
      <span aria-hidden>✦</span> Ask NiiaLLM
    </button>
  );
}
