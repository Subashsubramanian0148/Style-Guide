import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Relative asset paths — the docs site uses HashRouter, so it also needs
  // no server-side rewrite rules and works unmodified whether it's hosted at
  // a domain root or a subpath (GitHub Pages project sites, a Netlify/Vercel
  // preview URL, etc).
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@tokens": path.resolve(__dirname, "../../packages/tokens/dist"),
    },
  },
  server: { port: 5173 },
});
