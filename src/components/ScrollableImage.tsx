import { useEffect, useRef, useState } from "react";
import { FRAME_RADIUS, ScrollHint } from "./ScreenshotFrame";

interface ZoomCursorHandlers {
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * A plain screenshot in the same frame the comparisons use.
 *
 * With `viewportHeight` it scrolls inside a fixed window, for screens that
 * would otherwise run to 1,500px of page. Without it, it's just an image with
 * the shared corner radius, so every screenshot on the page matches.
 */
export default function ScrollableImage({
  src,
  alt,
  maxWidth,
  viewportHeight,
  onImageClick,
  zoomCursor,
}: {
  src: string;
  alt: string;
  maxWidth?: number;
  viewportHeight?: number;
  onImageClick?: (src: string) => void;
  zoomCursor?: ZoomCursorHandlers;
}) {
  const [hasMore, setHasMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const measure = () => {
    const el = scrollRef.current;
    if (!el) return;
    setHasMore(el.scrollHeight - el.clientHeight - el.scrollTop > 24);
  };

  // After a frame, not at onLoad — the image isn't laid out yet at onLoad.
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      className={`relative mx-auto overflow-hidden ${FRAME_RADIUS} ${
        viewportHeight ? "ring-1 ring-black/10" : ""
      }`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      <div
        ref={scrollRef}
        onScroll={measure}
        className={viewportHeight ? "overflow-y-auto overscroll-contain" : ""}
        style={{ height: viewportHeight }}
      >
        <img
          src={src}
          alt={alt}
          className={`block w-full ${onImageClick ? "cursor-none" : ""}`}
          onClick={onImageClick ? () => onImageClick(src) : undefined}
          onMouseMove={zoomCursor?.onMouseMove}
          onMouseLeave={zoomCursor?.onMouseLeave}
        />
      </div>
      {viewportHeight && <ScrollHint show={hasMore} />}
    </div>
  );
}
