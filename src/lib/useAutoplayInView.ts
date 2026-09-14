import { useEffect, useRef } from "react";

/**
 * Plays a muted video only while it's actually visible. Chrome aborts
 * autoplay on off-screen "video-only background media" to save power, so a
 * plain `autoPlay` attribute silently fails for anything below the fold.
 */
export function useAutoplayInView<T extends HTMLVideoElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
