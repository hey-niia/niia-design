// Where each block sits on the AI Playground canvas: the centre of each block,
// in px, with the world's centre at 0,0. Desktop and phones each have their
// own arrangement. Rearranged by dragging in dev ("Arrange" button on
// /ai-playground, on a wide or a narrow window), which rewrites this file.
type Layout = Record<string, { x: number; y: number }>;

const playgroundLayout: { desktop: Layout; phone: Layout } = {
  "desktop": {
    "center": { "x": -561, "y": -279 },
    "Skin": { "x": -43, "y": -153 },
    "Taski 1.0": { "x": 539, "y": -227 },
    "Taski": { "x": 363, "y": 227 },
    "Skim": { "x": -320, "y": 288 },
  },
  "phone": {
    "center": { "x": 0, "y": 0 },
    "Skin": { "x": -480, "y": -330 },
    "Taski 1.0": { "x": 490, "y": -350 },
    "Taski": { "x": -460, "y": 370 },
    "Skim": { "x": 490, "y": 360 },
  },
};

export default playgroundLayout;
