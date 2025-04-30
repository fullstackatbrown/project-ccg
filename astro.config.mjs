// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://www.brownccg.com/",
  base: "brownccg.com",
  output: "static",
  build: {
    format: "directory",
  },
});
