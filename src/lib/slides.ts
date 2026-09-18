/** Data shape for the `Slides` slideshow, kept apart from the component so fast refresh keeps working. */

export interface SlideImage {
  src: string;
  alt: string;
  /**
   * The component's real width in CSS px (its Figma size). When set, the image
   * is shown at exactly that size — never shrunk to fit — and the panel scrolls
   * if it's bigger. Exports are 3×, so this is a third of the file's pixel width.
   */
  width?: number;
  /**
   * The component brings its own card and shadow (e.g. the date picker), so it
   * sits straight on the panel grid without the white backing and extra shadow.
   */
  bare?: boolean;
  /**
   * Dark Matter only: a see-through or very small component (icons, strokes,
   * controls) gets its own surface-primary section with a hairline of padding,
   * so it doesn't dissolve into the grid. Solid cards float without one.
   */
  backed?: boolean;
  /**
   * Height ÷ width of the image. In a row of several screens (Nadiia look) it
   * sizes each one in proportion to its shape, so screens exported from
   * different devices come out the same height.
   */
  ratio?: number;
}

export interface Slide {
  title: string;
  /** One screen… */
  src?: string;
  alt?: string;
  /** …or several related components shown together (figma look only). */
  images?: SlideImage[];
  /** Grid columns for `images` shown fit-to-panel. Ignored when images have a real `width`. */
  columns?: number;
  /** A very tall screen: show it full width in a scroll window instead of shrinking it to fit. */
  scroll?: boolean;
  /**
   * Too big to read in the slider: kept out of it, but still shown on the
   * explore canvas, where it can be panned and zoomed like any other component.
   */
  gridOnly?: boolean;
}

/** Every image on a slide, whether it holds one or several. */
export function slideImages(slide: Slide): SlideImage[] {
  return slide.images ?? (slide.src ? [{ src: slide.src, alt: slide.alt ?? "" }] : []);
}
