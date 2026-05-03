import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Verify required PDFs in /public exist at build/dev start.
const verifyPublicAssets = () => {
  const required = [
    "bonus-guia-estudiante-ceti.pdf",
    "conferencia-ceti-gonzalo.pdf",
  ];
  return {
    name: "verify-public-assets",
    configResolved() {
      const root = path.resolve(__dirname, "public");
      for (const f of required) {
        const full = path.join(root, f);
        if (!fs.existsSync(full)) {
          // eslint-disable-next-line no-console
          console.warn(`\u001b[33m[assets] WARNING: missing public/${f} — descargas del bonus CETI fallarán.\u001b[0m`);
        }
      }
    },
  };
};

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
