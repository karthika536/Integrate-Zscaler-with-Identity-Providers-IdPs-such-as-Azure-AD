import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "/Integrate-Zscaler-with-Identity-Providers-IdPs-such-as-Azure-AD/",
  server: {
    port: 5173
  },
  build: {
    outDir: "dist"
  }
});
