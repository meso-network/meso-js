/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "lib",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Meso",
      fileName: "index",
      formats: ["es", "iife", "umd"],
    },
    rollupOptions: {
      output: {
        sourcemap: true,
      },
    },
  },
  resolve: {
    alias: {
      "@meso-network/types": resolve(__dirname, "../types"),
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
