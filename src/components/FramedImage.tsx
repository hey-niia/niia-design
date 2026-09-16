import { useEffect, useRef, useState } from "react";
import { FRAME_RADIUS, ScrollHint } from "./ScreenshotFrame";

interface ZoomCursorHandlers {
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/** The shape of the jobs board screenshot at the top of the case study (2880×2048). */
const FRAME_RATIO = "2880 / 2048";

/**
 * A screenshot in the same frame as a case study's first illustration: full
 * column width, the same proportions, rounded corners, hairline border and soft
 * shadow, on the white page. A screen taller than the frame scrolls inside it
 * (with the usual "scroll to see more" hint) rather than being cropped; one a
 * touch shorter fills the frame from the top.
 */
export default function FramedImage({
  src,
  alt,
  onImageClick,
  zoomCursor,
}: {
  src: string;
  alt: string;
  onImageClick?: (src: string) => void;
  zoomCursor?: ZoomCursorHandlers;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  const measure = () => {
    const el = scrollRef.current;
    if (el) setHasMore(el.scrollHeight - el.clientHeight - el.scrollTop > 24);
  };

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${FRAME_RADIUS} shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/10`}
      style={{ aspectRatio: FRAME_RATIO }}
    >
      <div ref={scrollRef} onScroll={measure} className="h-full overflow-y-auto overscroll-contain">
        <img
          src={src}
          alt={alt}
          onLoad={() => requestAnimationFrame(measure)}
          className={`block min-h-full w-full object-cover object-top ${onImageClick ? "cursor-none" : ""}`}
          onClick={onImageClick ? () => onImageClick(src) : undefined}
          onMouseMove={zoomCursor?.onMouseMove}
          onMouseLeave={zoomCursor?.onMouseLeave}
        />
      </div>
      <ScrollHint show={hasMore} />
    </div>
  );
}
