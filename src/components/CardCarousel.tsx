/**
 * An auto-scrolling strip of card screenshots.
 *
 * Showing six cards side by side in a static image makes each one too small to
 * read. A marquee trades "see them all at once" for "see each one properly",
 * and pausing on hover lets someone stop on the card they care about.
 *
 * The track holds the set twice and translates by exactly -50%, so the loop is
 * seamless. Each card carries its own right margin rather than the flex
 * container using `gap`, because a container gap would sit between the two
 * copies too and the halves would no longer tile exactly.
 */
export default function CardCarousel({
  images,
  alt,
  height = 340,
  seconds = 46,
}: {
  images: string[];
  /** Describes the set as a whole; the strip is one figure, not N images. */
  alt: string;
  /** Rendered card height in px — width follows the image's own ratio. */
  height?: number;
  /** Time for one full loop. Longer is slower. */
  seconds?: number;
}) {
  const group = (hidden: boolean) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {images.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className="mr-5 block w-auto"
          style={{ height }}
          draggable={false}
        />
      ))}
    </div>
  );

  return (
    <figure className="group my-8" role="img" aria-label={alt}>
      <div
        className="overflow-hidden"
        // A narrow fade: enough to soften the cut, not so much that the edge
        // cards read as washed out.
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
        }}
      >
        <div
          className="flex w-max animate-[marquee_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ ["--marquee-duration" as string]: `${seconds}s` }}
        >
          {group(false)}
          {group(true)}
        </div>
      </div>
    </figure>
  );
}
