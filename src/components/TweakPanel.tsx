import { useEffect, useRef, useState } from "react";

/**
 * Dev-only panel for tuning the soft keycap buttons live. Each area maps to
 * a group of CSS variables defined in index.css (--nav-*, --pad-*). Values
 * persist in this browser; "Copy CSS" gives a :root block to paste back
 * into index.css once you like them. Only mounted when running `npm run dev`.
 */

type Area = "site" | "nav" | "navp" | "pad";

type SizeControl = { kind: "px" | "pct"; key: string; label: string; min: number; max: number };
type ColorControl = { kind: "color"; key: string; label: string; alpha?: boolean };
type Control = SizeControl | ColorControl;

type Values = Record<string, string | number>;

const AREAS: { id: Area; label: string; controls: Control[] }[] = [
  {
    id: "site",
    label: "Main color",
    controls: [
      { kind: "color", key: "accent", label: "Main color" },
      { kind: "color", key: "bg", label: "Page background" },
    ],
  },
  {
    id: "nav",
    label: "Header",
    controls: [
      { kind: "px", key: "gap", label: "Space between", min: 0, max: 40 },
      { kind: "px", key: "pad-x", label: "Padding sides", min: 2, max: 36 },
      { kind: "px", key: "pad-y", label: "Padding top/bottom", min: 0, max: 24 },
      { kind: "px", key: "radius", label: "Corner radius", min: 0, max: 30 },
      { kind: "color", key: "tl-shadow", label: "Shadow top-left", alpha: true },
      { kind: "px", key: "tl-dist", label: "↖ shadow distance", min: 0, max: 20 },
      { kind: "px", key: "tl-blur", label: "↖ shadow blur", min: 0, max: 40 },
      { kind: "color", key: "br-shadow", label: "Shadow bottom-right", alpha: true },
      { kind: "px", key: "br-dist", label: "↘ shadow distance", min: 0, max: 20 },
      { kind: "px", key: "br-blur", label: "↘ shadow blur", min: 0, max: 40 },
      { kind: "color", key: "edge", label: "Top edge", alpha: true },
      { kind: "px", key: "edge-w", label: "Top edge width", min: 0, max: 4 },
      { kind: "color", key: "face-tl", label: "Face light top-left" },
      { kind: "color", key: "face-br", label: "Face light bottom-right" },
    ],
  },
  {
    id: "navp",
    label: "Header pressed",
    controls: [
      { kind: "color", key: "shadow", label: "Inner shadow", alpha: true },
      { kind: "px", key: "shadow-dist", label: "↘ inner shadow distance", min: 0, max: 16 },
      { kind: "px", key: "shadow-blur", label: "↘ inner shadow blur", min: 0, max: 30 },
      { kind: "color", key: "light", label: "Inner light", alpha: true },
      { kind: "px", key: "light-dist", label: "↖ inner light distance", min: 0, max: 16 },
      { kind: "px", key: "light-blur", label: "↖ inner light blur", min: 0, max: 30 },
      { kind: "color", key: "edge", label: "Bottom-right edge", alpha: true },
      { kind: "px", key: "edge-w", label: "Bottom-right edge width", min: 0, max: 4 },
      { kind: "color", key: "face-tl", label: "Face top-left" },
      { kind: "color", key: "face-br", label: "Face bottom-right" },
    ],
  },
  {
    id: "pad",
    label: "Drawing pad",
    controls: [
      { kind: "color", key: "color", label: "Pad colour" },
      { kind: "px", key: "gap", label: "Space between", min: 0, max: 40 },
      { kind: "px", key: "size", label: "Brush button size", min: 28, max: 80 },
      { kind: "px", key: "pad-x", label: "Padding sides", min: 4, max: 40 },
      { kind: "px", key: "pad-y", label: "Padding top/bottom", min: 2, max: 28 },
      { kind: "px", key: "radius", label: "Corner radius", min: 0, max: 40 },
      { kind: "px", key: "lift", label: "Raise", min: 0, max: 16 },
      { kind: "px", key: "blur", label: "Shadow softness", min: 0, max: 40 },
      { kind: "pct", key: "shadow-a", label: "Shadow", min: 0, max: 100 },
      { kind: "pct", key: "glow-a", label: "Light — raised keys", min: 0, max: 100 },
      { kind: "pct", key: "glow-pressed-a", label: "Light — pressed-in keys", min: 0, max: 100 },
      { kind: "pct", key: "edge-a", label: "Top edge", min: 0, max: 100 },
    ],
  },
];

// Must match the :root defaults in index.css.
const DEFAULTS: Record<Area, Values> = {
  site: { accent: "#ff75bf", bg: "#fafafa" },
  nav: {
    gap: 2, "pad-x": 18, "pad-y": 10, radius: 20,
    "tl-shadow": "#ffffff", "tl-shadow-a": 100, "tl-dist": 19, "tl-blur": 32,
    "br-shadow": "#3c3228", "br-shadow-a": 14, "br-dist": 2, "br-blur": 10,
    "face-tl": "#f8f8f8", "face-br": "#fdfdfd",
    edge: "#ffffff", "edge-a": 100, "edge-w": 1,
  },
  navp: {
    shadow: "#b0b0b0", "shadow-a": 14, "shadow-dist": 4, "shadow-blur": 4,
    light: "#ffffff", "light-a": 100, "light-dist": 1, "light-blur": 30,
    "face-tl": "#ffffff", "face-br": "#ffffff",
    edge: "#ffffff", "edge-a": 100, "edge-w": 1,
  },
  pad: {
    color: "#ffa4ca",
    gap: 8, size: 46, "pad-x": 22, "pad-y": 12, radius: 14, lift: 3, blur: 10,
    "shadow-a": 24, "glow-a": 27, "glow-pressed-a": 69, "edge-a": 27,
  },
};

const STORAGE_KEY = "niia-button-tweaks-v6";

function cssValue(control: Control, values: Values) {
  if (control.kind !== "color") return `${values[control.key]}${control.kind === "pct" ? "%" : "px"}`;
  const hex = String(values[control.key]);
  if (!control.alpha) return hex;
  return `color-mix(in srgb, ${hex} ${values[`${control.key}-a`]}%, transparent)`;
}

function loadSaved(): Record<Area, Values> {
  let saved: Partial<Record<Area, Values>> = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    // Storage unavailable — fall back to defaults.
  }
  return Object.fromEntries(
    AREAS.map((a) => [a.id, { ...DEFAULTS[a.id], ...saved[a.id] }]),
  ) as Record<Area, Values>;
}

// The colour as hex; with an opacity below 100% it becomes 8-digit #RRGGBBAA.
function colorHex(values: Values, control: ColorControl) {
  const hex = String(values[control.key]);
  if (!control.alpha) return hex;
  const a = Number(values[`${control.key}-a`]);
  if (a >= 100) return hex;
  return hex + Math.round((a / 100) * 255).toString(16).padStart(2, "0");
}

function buildCss(all: Record<Area, Values>) {
  const lines = AREAS.flatMap((area) =>
    area.controls.map((c) => `  --${area.id}-${c.key}: ${cssValue(c, all[area.id])};`),
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

// Typography per section. Elements carry a `t-*` class (or are matched by
// selector); an override here is injected as a style rule, so untouched
// sections keep their responsive sizes.
const FONT_SECTIONS = [
  { id: "name", label: "Header — name", selector: ".t-name" },
  { id: "role", label: "Header — subtitle", selector: ".t-role" },
  { id: "nav", label: "Header — buttons", selector: "header .soft-hover" },
  { id: "intro", label: "Home — intro", selector: ".t-intro" },
  { id: "card-title", label: "Work cards — title", selector: ".t-card-title" },
  { id: "card-meta", label: "Work cards — tag", selector: ".t-card-meta" },
  { id: "page-intro", label: "AI Playground — intro", selector: ".t-page-intro" },
  { id: "exp-title", label: "AI Playground cards — title", selector: ".t-exp-title" },
  { id: "exp-desc", label: "AI Playground cards — text", selector: ".t-exp-desc" },
  { id: "about", label: "About — text", selector: ".t-about" },
  { id: "journey", label: "About — journey", selector: ".t-journey p" },
  { id: "footer", label: "Footer — links", selector: ".t-footer a" },
  { id: "pad", label: "Drawing pad — buttons", selector: "#draw .soft-pill" },
] as const;
type FontOverride = { size?: number; weight?: number };
type Fonts = Record<string, FontOverride>;
const FONT_KEY = "niia-font-tweaks-v1";
const POS_KEY = "niia-tweak-panel-pos-v1";
const WEIGHT_NAMES: Record<number, string> = {
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extra bold",
  900: "Black",
};

function loadFonts(): Fonts {
  try {
    return JSON.parse(localStorage.getItem(FONT_KEY) || "{}");
  } catch {
    return {};
  }
}

function fontCss(fonts: Fonts, important: boolean) {
  const bang = important ? " !important" : "";
  return FONT_SECTIONS.flatMap(({ id, selector }) => {
    const f = fonts[id];
    if (!f || (f.size === undefined && f.weight === undefined)) return [];
    const decls = [
      f.size !== undefined ? `font-size: ${f.size}px${bang};` : "",
      f.weight !== undefined ? `font-weight: ${f.weight}${bang};` : "",
    ].filter(Boolean);
    return [`${selector} { ${decls.join(" ")} }`];
  }).join("\n");
}

// What a section currently renders at, for sliders that haven't been touched.
function measured(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const cs = getComputedStyle(el);
  return { size: Math.round(parseFloat(cs.fontSize)), weight: Number(cs.fontWeight) };
}

export default function TweakPanel() {
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState<Area | "fonts">("site");
  const [fonts, setFonts] = useState<Fonts>(loadFonts);

  // The panel can be dragged anywhere by its title bar (or the closed pill),
  // so it never has to sit on top of what you're tuning. Position is kept.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(POS_KEY) || "null");
    } catch {
      return null;
    }
  });
  const drag = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const clamp = (x: number, y: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    const w = r?.width ?? 200;
    const h = r?.height ?? 40;
    return {
      x: Math.min(Math.max(0, x), window.innerWidth - w),
      y: Math.min(Math.max(0, y), window.innerHeight - h),
    };
  };
  const onDragStart = (e: React.PointerEvent) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current.moved = true;
    setPos(clamp(e.clientX - drag.current.dx, e.clientY - drag.current.dy));
  };
  const onDragEnd = () => {
    drag.current = null;
  };
  useEffect(() => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(pos));
    } catch {
      // Ignore.
    }
  }, [pos]);
  // Keep it on screen when the window shrinks or the panel opens/closes.
  useEffect(() => {
    const fit = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    const id = requestAnimationFrame(fit);
    window.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", fit);
    };
  }, [open]);
  const placement: React.CSSProperties = pos ? { left: pos.x, top: pos.y } : { left: 16, bottom: 16 };
  const [values, setValues] = useState<Record<Area, Values>>(loadSaved);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    for (const a of AREAS) {
      for (const c of a.controls) {
        root.style.setProperty(`--${a.id}-${c.key}`, cssValue(c, values[a.id]));
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      // Ignore — tweaks just won't persist.
    }
    // Let layout that measures itself (the header's fit check) re-measure.
    window.dispatchEvent(new Event("resize"));
  }, [values]);

  useEffect(() => {
    let tag = document.getElementById("font-tweaks") as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement("style");
      tag.id = "font-tweaks";
      document.head.appendChild(tag);
    }
    tag.textContent = fontCss(fonts, true);
    try {
      localStorage.setItem(FONT_KEY, JSON.stringify(fonts));
    } catch {
      // Ignore — tweaks just won't persist.
    }
    window.dispatchEvent(new Event("resize"));
  }, [fonts]);

  // Undo history. Dragging a slider makes many changes in a row; they count
  // as one step as long as it's the same control within half a second.
  const history = useRef<{ values: Record<Area, Values>; fonts: Fonts }[]>([]);
  const lastChange = useRef({ key: "", at: 0 });
  const [canUndo, setCanUndo] = useState(false);
  const remember = (key: string) => {
    const now = Date.now();
    if (key !== lastChange.current.key || now - lastChange.current.at > 500) {
      history.current = [...history.current.slice(-99), { values, fonts }];
      setCanUndo(true);
    }
    lastChange.current = { key, at: now };
  };
  const undo = () => {
    const prev = history.current.pop();
    if (!prev) return;
    lastChange.current = { key: "", at: 0 };
    setValues(prev.values);
    setFonts(prev.fonts);
    setCanUndo(history.current.length > 0);
  };

  const set = (key: string, value: string | number) => {
    if (area === "fonts") return;
    remember(`${area}:${key}`);
    setValues((v) => ({ ...v, [area]: { ...v[area], [key]: value } }));
  };

  const setFont = (id: string, prop: keyof FontOverride, value: number | undefined) => {
    remember(`fonts:${id}:${prop}`);
    setFonts((f) => ({ ...f, [id]: { ...f[id], [prop]: value } }));
  };

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const copyColor = async (c: ColorControl) => {
    if (area === "fonts") return;
    const text = colorHex(values[area], c);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(c.key);
      setTimeout(() => setCopiedColor(null), 1200);
    } catch {
      window.prompt("Copy this colour:", text);
    }
  };

  const fullCss = () => {
    const f = fontCss(fonts, false);
    return f ? `${buildCss(values)}\n\n${f}` : buildCss(values);
  };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(fullCss());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy these values:", fullCss());
    }
  };

  if (!open) {
    return (
      <div
        ref={boxRef}
        style={placement}
        role="button"
        tabIndex={0}
        title="Drag to move · click to open"
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={() => {
          const wasDrag = drag.current?.moved;
          onDragEnd();
          if (!wasDrag) setOpen(true);
        }}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
        className="fixed z-[100] cursor-grab touch-none rounded-full bg-black px-4 py-2 font-mono text-xs tracking-widest text-white uppercase shadow-lg select-none active:cursor-grabbing"
      >
        ◐ Tweak
      </div>
    );
  }

  const current = AREAS.find((a) => a.id === area);
  const av: Values = area === "fonts" ? {} : values[area];

  return (
    <div
      ref={boxRef}
      style={placement}
      className="fixed z-[100] flex max-h-[75vh] w-[320px] flex-col overflow-hidden rounded-2xl bg-white font-mono text-[11px] text-black shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
      <div
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          onDragStart(e);
        }}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        title="Drag to move"
        className="flex cursor-grab touch-none items-center justify-between border-b border-black/10 px-3 py-2 select-none active:cursor-grabbing"
      >
        <span className="tracking-widest uppercase">⠿ Tweaks</span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close tweaks" className="px-1 text-base">
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1 px-3 pt-2">
        {AREAS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setArea(a.id)}
            className={`rounded-lg px-2 py-1.5 tracking-wider uppercase ${
              area === a.id ? "bg-black text-white" : "bg-black/5 text-black/70"
            }`}
          >
            {a.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setArea("fonts")}
          className={`rounded-lg px-2 py-1.5 tracking-wider uppercase ${
            area === "fonts" ? "bg-black text-white" : "bg-black/5 text-black/70"
          }`}
        >
          Fonts
        </button>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto px-3 py-3">
        {area === "fonts" && (
          <>
            <p className="text-black/50">
              Untouched sections keep their own (responsive) sizes. Sections on other pages show “—”
              until you visit them.
            </p>
            {FONT_SECTIONS.map(({ id, label, selector }) => {
              const o = fonts[id] ?? {};
              const m = measured(selector);
              const size = o.size ?? m?.size ?? 16;
              const weight = o.weight ?? m?.weight ?? 400;
              const touched = o.size !== undefined || o.weight !== undefined;
              return (
                <div key={id} className="flex flex-col gap-1 border-b border-black/5 pb-2">
                  <span className="flex items-center justify-between">
                    <span className={touched ? "text-black" : "text-black/60"}>{label}</span>
                    {touched && (
                      <button
                        type="button"
                        onClick={() => {
                          remember(`fonts:${id}:clear`);
                          setFonts((f) => ({ ...f, [id]: {} }));
                        }}
                        className="rounded bg-black/5 px-1.5 text-[10px] uppercase"
                      >
                        Clear
                      </button>
                    )}
                  </span>
                  <label className="flex items-center gap-2">
                    <span className="w-12 text-black/50">Size</span>
                    <input
                      type="range"
                      min={8}
                      max={96}
                      value={size}
                      onChange={(e) => setFont(id, "size", Number(e.target.value))}
                      className="min-w-0 flex-1 accent-black"
                    />
                    <span className="w-10 text-right">{m || o.size !== undefined ? `${size}px` : "—"}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-12 text-black/50">Weight</span>
                    <input
                      type="range"
                      min={300}
                      max={900}
                      step={100}
                      value={weight}
                      onChange={(e) => setFont(id, "weight", Number(e.target.value))}
                      className="min-w-0 flex-1 accent-black"
                    />
                    <span className="w-16 text-right">
                      {m || o.weight !== undefined ? (WEIGHT_NAMES[weight] ?? weight) : "—"}
                    </span>
                  </label>
                </div>
              );
            })}
          </>
        )}
        {current?.controls.map((c) =>
          c.kind !== "color" ? (
            <label key={c.key} className="flex flex-col gap-1">
              <span className="flex justify-between text-black/60">
                <span>{c.label}</span>
                <span className="text-black">
                  {av[c.key]}
                  {c.kind === "pct" ? "%" : "px"}
                </span>
              </span>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={1}
                value={Number(av[c.key])}
                onChange={(e) => set(c.key, Number(e.target.value))}
                className="accent-black"
              />
            </label>
          ) : (
            <div key={c.key} className="flex items-center gap-2">
              <input
                type="color"
                value={String(av[c.key])}
                onChange={(e) => set(c.key, e.target.value)}
                aria-label={c.label}
                className="h-6 w-8 shrink-0 cursor-pointer rounded border border-black/10 bg-transparent p-0"
              />
              <span className="w-[100px] shrink-0 text-black/60">{c.label}</span>
              {c.alpha && (
                <>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Number(av[`${c.key}-a`])}
                    onChange={(e) => set(`${c.key}-a`, Number(e.target.value))}
                    aria-label={`${c.label} opacity`}
                    className="min-w-0 flex-1 accent-black"
                  />
                  <span className="w-8 text-right">{av[`${c.key}-a`]}%</span>
                </>
              )}
              <button
                type="button"
                onClick={() => copyColor(c)}
                title={`Copy ${colorHex(av, c)}`}
                aria-label={`Copy ${c.label} colour`}
                className="ml-auto shrink-0 rounded bg-black/5 px-1.5 py-0.5 text-[10px] tracking-wider uppercase"
              >
                {copiedColor === c.key ? "✓" : "Copy"}
              </button>
            </div>
          ),
        )}
      </div>

      <div className="flex gap-2 border-t border-black/10 px-3 py-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo last change"
          title="Undo last change"
          className="rounded-lg bg-black/5 px-2.5 py-1.5 disabled:opacity-30"
        >
          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            remember("reset");
            if (area === "fonts") setFonts({});
            else setValues((v) => ({ ...v, [area]: { ...DEFAULTS[area] } }));
          }}
          className="flex-1 rounded-lg bg-black/5 px-2 py-1.5 tracking-wider uppercase"
        >
          Reset {current?.label ?? "fonts"}
        </button>
        <button
          type="button"
          onClick={copyCss}
          className="flex-1 rounded-lg bg-black px-2 py-1.5 tracking-wider text-white uppercase"
        >
          {copied ? "Copied ✓" : "Copy CSS"}
        </button>
      </div>
    </div>
  );
}
