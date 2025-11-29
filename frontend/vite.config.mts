import terser from "@rollup/plugin-terser";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import { compression as viteCompression } from "vite-plugin-compression2";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@style": path.resolve(__dirname, "./src/styles"),
      "@icons": path.resolve(__dirname, "./src/icons"),
      "@images": path.resolve(__dirname, "./src/images"),
    },
  },
  base: "/",
  server: {
    port: 6789,
  },
  preview: {
    port: 6789,
  },
  plugins: [
    svgr(),
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: true,
              ssr: false,
              meaninglessFileNames: ["index", "styles", "style"],
              namespace: "",
              transpileTemplateLiterals: true,
              minify: false,
              pure: false,
              cssProp: true,
            },
          ],
        ],
      },
    }),
    terser(),
    splitVendorChunkPlugin(),
    viteCompression({
      algorithm: "brotliCompress",
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  build: {
    chunkSizeWarningLimit: 550,
    minify: "terser",
    sourcemap: false,
    cssCodeSplit: true,
    emptyOutDir: true,
  },
});
