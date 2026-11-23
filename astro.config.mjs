import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, envField } from 'astro/config';
import wix from "@wix/astro";
import wixPages from "@wix/astro-pages";

import react from "@astrojs/react";
import wixHostingAdapter from "@wix/astro-wix-hosting-adapter";

// Per-release asset version: the SSR HTML appends ?v=<BUILD_ID> to every /_astro/
// URL so each release gets fresh cache keys — the Wix CDN has cached corrupt
// compressed variants of same-hash assets across releases, and browsers keep them
// under cache-control: immutable, which left visitors with an unstyled page until
// they manually cleared the cache.
const BUILD_ID = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, "")
  .slice(0, 14);

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    define: { "import.meta.env.BUILD_ID": JSON.stringify(BUILD_ID) },
  },
  integrations: [wix({ essentials: true }), wixPages(), react()],
  security: { checkOrigin: false },
  adapter: wixHostingAdapter(),

  image: {
    domains: ["static.wixstatic.com"],
  },

  output: "server",

  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
});