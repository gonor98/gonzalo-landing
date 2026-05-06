import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Verify PDFs/videos declared in BONUS_MATERIALS and BENEFITS exist in /public,
// plus that landingPath/downloadsPath in BENEFITS map to a real route in App.tsx.
const verifyPublicAssets = () => ({
  name: "verify-public-assets",
  configResolved() {
    const root = path.resolve(__dirname, "public");
    const required = new Set<string>();

    const read = (rel: string) => {
      try { return fs.readFileSync(path.resolve(__dirname, rel), "utf8"); } catch { return ""; }
    };

    const bonus = read("src/lib/bonusMaterials.ts");
    Array.from(bonus.matchAll(/href:\s*"(\/[^"]+\.(?:pdf|mp4|webm|jpg|png|webp))"/g))
      .forEach((m) => required.add(m[1].replace(/^\//, "")));
    // optional poster on CONFERENCE_VIDEO
    Array.from(bonus.matchAll(/poster:\s*"(\/[^"]+)"/g))
      .forEach((m) => required.add(m[1].replace(/^\//, "")));

    // Benefits — pick up any "/foo.ext" paths (skip route-like paths without ext)
    const benefits = read("src/lib/benefits.ts");
    Array.from(benefits.matchAll(/"(\/[A-Za-z0-9._\-/]+\.(?:pdf|mp4|webm|jpg|jpeg|png|webp|svg))"/g))
      .forEach((m) => required.add(m[1].replace(/^\//, "")));

    for (const f of required) {
      const full = path.join(root, f);
      if (!fs.existsSync(full)) {
        // eslint-disable-next-line no-console
        console.warn(`\u001b[33m[assets] WARNING: missing public/${f} — declarado en BONUS_MATERIALS/BENEFITS pero no existe.\u001b[0m`);
      }
    }

    // Validate Benefits route paths actually exist in App.tsx
    const app = read("src/App.tsx");
    const routes = new Set(
      Array.from(app.matchAll(/<Route\s+[^>]*path="([^"]+)"/g)).map((m) => m[1]),
    );
    const benefitPaths = Array.from(benefits.matchAll(/(?:landingPath|downloadsPath):\s*"([^"]+)"/g))
      .map((m) => m[1]);
    for (const p of benefitPaths) {
      const matched = Array.from(routes).some((r) => r === p || (r.includes(":") && new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+") + "$").test(p)));
      if (!matched) {
        // eslint-disable-next-line no-console
        console.warn(`\u001b[33m[benefits] WARNING: ruta ${p} declarada en BENEFITS pero no existe en App.tsx.\u001b[0m`);
      }
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), verifyPublicAssets(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
