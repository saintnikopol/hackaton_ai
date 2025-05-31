import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/electron",
    emptyOutDir: false, // Don't delete other outputs (like your main process code)
    lib: {
      entry: "src/electron/preload.ts",
      formats: ["cjs"], // Electron requires CommonJS for preload
      fileName: () => "preload.cjs",
    },
    // rollupOptions: {
    //   external: [
    //     // You might need to externalize electron here, depending on your code
    //     "electron",
    //   ],
    // },
    target: "node16", // Preload runs in Node context
    minify: false, // (optional) easier to debug
  },
});
