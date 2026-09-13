import { useRef, useState } from "react";

type Photo = { src: string; alt: string };

// Native horizontal scroll with snap points, so touch swipe and trackpad
// swipe work without a gesture library. Arrows are for mouse users; dots
// show position and jump to a slide.
export default function PhotoCarousel({
  photos,
  className,
}: {
  photos: Photo[];
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(photos.length - 1, i));
    // Slide width can be fractional (e.g. 309.33px), so aim at the slide's
    // own offset rather than a multiple of the rounded clientWidth.
    const slide = track.children[next] as HTMLElement;
    setIndex(next);
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.scrollWidth / photos.length;
    setIndex(Math.round(track.scrollLeft / slideWidth));
  }

  return (
    <div className={`group relative ${className ?? ""}`}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(index + 1);
          if (e.key === "ArrowLeft") goTo(index - 1);
        }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Photos"
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {index > 0 && (
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => goTo(index - 1)}
          className="absolute top-1/2 left-2 hidden -translate-y-1/2 bg-white/80 px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 md:block"
        >
          ←
        </button>
      )}
      {index < photos.length - 1 && (
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => goTo(index + 1)}
          className="absolute top-1/2 right-2 hidden -translate-y-1/2 bg-white/80 px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 md:block"
        >
          →
        </button>
      )}

      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Photo ${i + 1} of ${photos.length}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
