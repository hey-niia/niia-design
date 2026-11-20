import { writeFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Dev only: the AI Playground's "Arrange" mode posts the dragged positions
// here, and they're written into src/data/playgroundLayout.ts.
function savePlaygroundLayout(): Plugin {
  return {
    name: "save-playground-layout",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__playground-layout", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          type Layout = Record<string, { x: number; y: number }>;
          const all = JSON.parse(body) as Record<string, Layout>;
          const block = (layout: Layout) =>
            Object.entries(layout)
              .map(([k, p]) => `    ${JSON.stringify(k)}: { "x": ${Math.round(p.x)}, "y": ${Math.round(p.y)} },`)
              .join("\n");
          const sets = Object.entries(all)
            .map(([mode, layout]) => `  ${JSON.stringify(mode)}: {\n${block(layout)}\n  },`)
            .join("\n");
          writeFileSync(
            new URL("./src/data/playgroundLayout.ts", import.meta.url),
            `// Where each block sits on the AI Playground canvas: the centre of each block,
// in px, with the world's centre at 0,0. Desktop and phones each have their
// own arrangement. Rearranged by dragging in dev ("Arrange" button on
// /ai-playground, on a wide or a narrow window), which rewrites this file.
type Layout = Record<string, { x: number; y: number }>;

const playgroundLayout: { desktop: Layout; phone: Layout } = {
${sets}
};

export default playgroundLayout;
`,
          );
          res.end("ok");
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), savePlaygroundLayout()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
});
