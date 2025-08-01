import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: false,
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
  // Копируем CSS файлы
  loader: {
    ".css": "copy",
  },
});
