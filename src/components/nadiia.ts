/**
 * "Nadiia" — the light visual style for case-study diagrams, named by Niia:
 * white boxes with a soft shadow on the white page, Geist Mono capitals,
 * hairline connectors with small arrowheads, and colour only as a very subtle
 * green or orange tint. Build new diagrams from these rather than retyping
 * the classes, so every Nadiia visual stays in step.
 */

/** Shape shared by every Nadiia box; pair it with one of `NADIIA_SURFACE`. */
export const NADIIA_SHAPE =
  "rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07)] ring-1";

export const NADIIA_SURFACE = {
  white: "bg-white ring-black/5",
  green: "bg-[#f5faf6] ring-[#4f9d6e]/15",
  orange: "bg-[#fdf7f2] ring-[#d9723f]/15",
};

/**
 * Figma-section panel colour for showcasing real components — sampled from
 * ConnectIQ's own empty placeholder slot, so the components sit on the app's
 * surface rather than on a colour they never appear against.
 */
export const FIGMA_SECTION_BG = "#f0f1ec";

/**
 * The same panel with Figma's square canvas grid, drawn very faintly. `local`
 * attachment makes the grid scroll with an oversized component instead of
 * staying pinned while the component slides over it.
 */
const GRID_LINE = "rgba(0,0,0,0.035)";
export const FIGMA_SECTION_GRID = {
  backgroundColor: FIGMA_SECTION_BG,
  backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
  backgroundSize: "16px 16px",
  backgroundAttachment: "local",
};

/** Small accents only: dots, + and − signs. Never a fill. */
export const NADIIA_ACCENT = { green: "#4f9d6e", orange: "#d9723f" };

/** Small name tags (e.g. a lane's user group): tinted chip, coloured text. */
export const NADIIA_TAG = {
  white: "bg-white text-neutral-500 ring-black/5",
  green: "bg-[#eef6f0] text-[#3f7d58] ring-[#4f9d6e]/20",
  orange: "bg-[#fcf1e8] text-[#b25a2c] ring-[#d9723f]/20",
  /** For a tag sitting on an orange area, where a tinted chip would disappear. */
  onOrange: "bg-white text-[#b25a2c] ring-[#d9723f]/20",
  /** For a tag sitting on a green area. */
  onGreen: "bg-white text-[#3f7d58] ring-[#4f9d6e]/20",
};

/** Area behind a group of boxes: a notch off the page colour, with a faint dot grid. */
export const NADIIA_AREA = {
  neutral: {
    backgroundColor: "#f4f4f3",
    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.09) 1px, transparent 1.2px)",
    backgroundSize: "14px 14px",
  },
  green: {
    backgroundColor: "#f3f8f4",
    backgroundImage: "radial-gradient(circle, rgba(79,157,110,0.2) 1px, transparent 1.2px)",
    backgroundSize: "14px 14px",
  },
  orange: {
    backgroundColor: "#fdf6f0",
    backgroundImage: "radial-gradient(circle, rgba(217,114,63,0.18) 1px, transparent 1.2px)",
    backgroundSize: "14px 14px",
  },
};

/** Label text inside a box. */
export const NADIIA_LABEL = "font-mono text-xs tracking-wider text-neutral-800 uppercase";

/** Body text inside a box: findings, bullet points. */
export const NADIIA_SMALL = "font-mono text-[11px] leading-relaxed tracking-wide uppercase";

/**
 * "Dark Matter" — Nadiia's dark sibling, named by Niia for the Matter case
 * study, whose app is dark. A charcoal panel with a faint square grid (Figma's
 * canvas grid, in light lines on the grey); the components sit straight on it
 * with no box behind them, lifted only by a small shadow that follows each
 * component's own shape.
 */
const DARK_MATTER_LINE = "rgba(255,255,255,0.04)";
export const DARK_MATTER_AREA = {
  backgroundColor: "#232425",
  backgroundImage: `linear-gradient(to right, ${DARK_MATTER_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${DARK_MATTER_LINE} 1px, transparent 1px)`,
  backgroundSize: "16px 16px",
  backgroundAttachment: "local",
};

/** Shadow for a component on a Dark Matter panel: a drop-shadow, so a transparent export casts no rectangle. */
export const DARK_MATTER_SHADOW = "drop-shadow(0 1px 1px rgba(0,0,0,0.4)) drop-shadow(0 4px 10px rgba(0,0,0,0.35))";

/** A label chip sitting on a Dark Matter panel. */
export const DARK_MATTER_CHIP = "rounded-md bg-[#2c2d2f] text-[13px] font-medium text-neutral-300 ring-1 ring-white/10";

/** Matter's surface-primary token, behind see-through and tiny components on a Dark Matter panel. */
export const DARK_MATTER_SURFACE = "#121517";

/** The section those components sit in: a hairline of padding and a subtle shadow. */
export const DARK_MATTER_SECTION =
  "box-content rounded-xl p-3 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_6px_18px_rgba(0,0,0,0.28)]";

/**
 * A Nadiia card: the light dotted field (`NADIIA_AREA.neutral`, the same one
 * the user-flow lanes sit on) with a soft shadow. Pair with that as its style.
 */
export const NADIIA_CARD =
  "rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.05)] ring-1 ring-black/5";

/** A Nadiia card's header: Geist Mono capitals. */
export const NADIIA_CARD_TITLE = "font-mono text-xs tracking-wider text-neutral-800 uppercase";

/** A Nadiia card's text: 14px grey, the same size as Role and Team in a case study header. */
export const NADIIA_CARD_TEXT = "text-sm text-neutral-500";

/** Shadow under the buttons that float on the explore canvas and slider ("Tap to explore", "Press Esc to exit"). */
export const CANVAS_BUTTON_SHADOW = "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.08)]";
