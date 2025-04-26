// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://fullstackatbrown.github.io/project-ccg",
  base: "/project-ccg",
  output: "static",
  build: {
    format: "directory",
    assets: "assets",
  },
});
