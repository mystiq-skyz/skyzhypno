import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as { version: string };

export default defineConfig({
  resolve: { alias: { "@": resolve(process.cwd(), "src") } },
  define: { __SH_VERSION__: JSON.stringify(pkg.version) },
  build: {
    sourcemap: true,
    minify: "esbuild",
    lib: {
      entry: resolve(process.cwd(), "src/main.ts"),
      name: "SkyzHypnoBundle",
      formats: ["es", "iife"],
      fileName: (format) => `skyz-hypno.${format}.js`
    },
    rollupOptions: {
      output: { inlineDynamicImports: true }
    }
  }
});
