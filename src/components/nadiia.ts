/**
 * "Nadiia" — the light visual style for case-study diagrams, named by Niia:
 * white boxes with a soft shadow on the white page, Geist Mono capitals,
 * hairline connectors with small arrowheads, and colour only as a very subtle
 * green or orange tint. Build new diagrams from these rather than retyping
 * the classes, so every Nadiia visual stays in step.
 */

/** Shape shared by every Nadiia box; pair it with one of `NADIIA_SURFACE`. */
export const NADIIA_SHAPE =
  "rounded-xl shadow-[var(--nd-shadow,0_1px_2px_rgba(0,0,0,0.05),0_6px_20px_rgba(0,0,0,0.07))] ring-1";

/**
 * Every Nadiia colour below is a CSS variable with its light value as the
 * fallback, so a `.dark-matter` wrapper (see index.css) repaints a whole page
 * of diagrams in Dark Matter's charcoal without any component knowing about it.
 */

export const NADIIA_SURFACE = {
  // `nd-card` lets a dark page give every card the same hover (see index.css).
  white: "nd-card bg-[var(--nd-box,#fff)] ring-[var(--nd-box-ring,rgba(0,0,0,0.05))]",
  // The tint is a whisper, and hover lifts it just enough to notice — the way
  // Retool's dark cards pick up their accent when you point at one.
  green:
    "bg-[var(--nd-green,#f5faf6)] ring-[var(--nd-green-ring,rgba(79,157,110,0.15))] transition-colors duration-200 hover:bg-[var(--nd-green-hover,#eef6f0)] hover:ring-[var(--nd-green-ring-hover,rgba(79,157,110,0.3))]",
  orange:
    "bg-[var(--nd-orange,#fdf7f2)] ring-[var(--nd-orange-ring,rgba(217,114,63,0.15))] transition-colors duration-200 hover:bg-[var(--nd-orange-hover,#fcf1e8)] hover:ring-[var(--nd-orange-ring-hover,rgba(217,114,63,0.3))]",
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
  green: "bg-[var(--nd-green,#eef6f0)] text-[var(--nd-green-ink,#3f7d58)] ring-[var(--nd-green-ring,rgba(79,157,110,0.2))]",
  orange: "bg-[var(--nd-orange,#fcf1e8)] text-[var(--nd-orange-ink,#b25a2c)] ring-[var(--nd-orange-ring,rgba(217,114,63,0.2))]",
  /** For a tag sitting on an orange area, where a tinted chip would disappear. */
  onOrange: "bg-white text-[#b25a2c] ring-[#d9723f]/20",
  /** For a tag sitting on a green area. */
  onGreen: "bg-white text-[#3f7d58] ring-[#4f9d6e]/20",
};

/** Area behind a group of boxes: a notch off the page colour, with a faint dot grid. */
export const NADIIA_AREA = {
  neutral: {
    backgroundColor: "var(--nd-area, #f4f4f3)",
    backgroundImage:
      "radial-gradient(circle, var(--nd-area-dot, rgba(0,0,0,0.09)) 1px, transparent 1.2px)",
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
export const NADIIA_LABEL = "font-mono text-xs tracking-wider text-[var(--nd-ink,#262626)] uppercase";

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
  backgroundColor: "#17191a",
  backgroundImage: `linear-gradient(to right, ${DARK_MATTER_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${DARK_MATTER_LINE} 1px, transparent 1px)`,
  backgroundSize: "16px 16px",
  backgroundAttachment: "local",
};

/** Shadow for a component on a Dark Matter panel: a drop-shadow, so a transparent export casts no rectangle. */
export const DARK_MATTER_SHADOW = "drop-shadow(0 1px 1px rgba(0,0,0,0.4)) drop-shadow(0 4px 10px rgba(0,0,0,0.35))";

/** A label chip sitting on a Dark Matter panel. */
/** A label chip on Dark Matter: the panel's own grey, so chip and panel read
 *  as one material. Used by every Dark Matter slider header. */
export const DARK_MATTER_CHIP =
  "rounded-md bg-[#17191a] text-[13px] font-medium text-[#a9a8a3] ring-1 ring-white/10";

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
  "nd-card rounded-2xl p-6 shadow-[var(--nd-shadow,0_1px_2px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.05))] ring-1 ring-[var(--nd-box-ring,rgba(0,0,0,0.05))]";

/** A card with no dot field: the box fill, the hairline and the soft shadow. */
export const NADIIA_CARD_SHELL =
  "nd-card rounded-2xl bg-[var(--nd-box,#fff)] shadow-[var(--nd-shadow,0_1px_2px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.05))] ring-1 ring-[var(--nd-box-ring,rgba(0,0,0,0.05))]";

/** A Nadiia card's header: Geist Mono capitals. */
export const NADIIA_CARD_TITLE = "font-mono text-xs tracking-wider text-[var(--nd-ink,#262626)] uppercase";

/** A Nadiia card's text: 14px grey, the same size as Role and Team in a case study header. */
export const NADIIA_CARD_TEXT = "text-sm text-[var(--nd-body,#737373)]";

/**
 * The hint pill that floats over a visual to name the gesture it wants —
 * "Scroll to see more" on a long screenshot, "Pinch to zoom" on the explore
 * canvas. White on anything, so it reads on a light panel, a dark one or a
 * screenshot; pair it with `CANVAS_BUTTON_SHADOW` and an icon.
 */
export const CANVAS_HINT_PILL =
  "inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] tracking-wider text-black uppercase";

/** Shadow under the buttons that float on the explore canvas and slider ("Tap to explore", "Press Esc to exit"). */
export const CANVAS_BUTTON_SHADOW = "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.08)]";
