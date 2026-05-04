import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Verify each PDF declared in BONUS_MATERIALS exists in /public at build/dev start.
const verifyPublicAssets = () => ({
  name: "verify-public-assets",
  configResolved() {
    const file = path.resolve(__dirname, "src/lib/bonusMaterials.ts");
    let required: string[] = [];
    try {
      const src = fs.readFileSync(file, "utf8");
      // Parse `href: "/foo.pdf"` and `filename: "foo.pdf"` entries from BONUS_MATERIALS
      const hrefs = Array.from(src.matchAll(/href:\s*"(\/[^"]+\.pdf)"/g)).map((m) => m[1].replace(/^\//, ""));
      required = Array.from(new Set(hrefs));
    } catch {
      required = ["bonus-guia-estudiante-ceti.pdf", "conferencia-ceti-gonzalo.pdf"];
    }
    const root = path.resolve(__dirname, "public");
    for (const f of required) {
      const full = path.join(root, f);
      if (!fs.existsSync(full)) {
        // eslint-disable-next-line no-console
        console.warn(`\u001b[33m[assets] WARNING: missing public/${f} — declarado en BONUS_MATERIALS pero no existe.\u001b[0m`);
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
