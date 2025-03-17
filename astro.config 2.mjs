// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astro/tailwind'; // Add this if you are using Astro's Tailwind integration

export default defineConfig({
    integrations: [tailwind()],
});