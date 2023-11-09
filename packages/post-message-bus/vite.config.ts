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
      name: "@meso-network/post-message-bus",
      fileName: "index",
    },
    rollupOptions: {
      output: {
        sourcemap: true,
      },
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      "@meso-network/types": resolve(__dirname, "../types"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setupTests.ts",
  },
});
