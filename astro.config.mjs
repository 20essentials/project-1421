import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
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

const fontsource = (name, cssVariable, weights, fallback) => ({
  provider: fontProviders.fontsource(),
  name,
  cssVariable,
  weights,
  styles: ['normal'],
  subsets: ['latin'],
  fallbacks: [fallback],
});

const fonts = [
  fontsource('Inter', '--font-inter', ['100 900'], 'sans-serif'),
  fontsource('Jost', '--font-jost', ['100 900'], 'sans-serif'),
  fontsource('Cormorant Garamond', '--font-cormorant-garamond', ['300 700'], 'serif'),
  fontsource('Playfair Display', '--font-playfair-display', ['400 900'], 'serif'),
  fontsource('Source Sans 3', '--font-source-sans-3', ['200 900'], 'sans-serif'),
  fontsource('Bodoni Moda', '--font-bodoni-moda', ['400 900'], 'serif'),
  fontsource('Lora', '--font-lora', ['400 700'], 'serif'),
  fontsource('Libre Baskerville', '--font-libre-baskerville', ['400 700'], 'serif'),
  fontsource('Nunito Sans', '--font-nunito-sans', ['200 1000'], 'sans-serif'),
  fontsource('Cinzel', '--font-cinzel', ['400 900'], 'serif'),
  fontsource('Raleway', '--font-raleway', ['100 900'], 'sans-serif'),
  fontsource('DM Serif Display', '--font-dm-serif-display', [400], 'serif'),
  fontsource('DM Sans', '--font-dm-sans', ['100 1000'], 'sans-serif'),
  fontsource('Fraunces', '--font-fraunces', ['100 900'], 'serif'),
  fontsource('Instrument Serif', '--font-instrument-serif', [400], 'serif'),
  fontsource('Instrument Sans', '--font-instrument-sans', ['400 700'], 'sans-serif'),
  fontsource('Gloock', '--font-gloock', [400], 'serif'),
  fontsource('Young Serif', '--font-young-serif', [400], 'serif'),
  fontsource('Ovo', '--font-ovo', [400], 'serif'),
  fontsource('Figtree', '--font-figtree', ['300 900'], 'sans-serif'),
  fontsource('Epilogue', '--font-epilogue', ['100 900'], 'sans-serif'),
  fontsource('Space Grotesk', '--font-space-grotesk', ['300 700'], 'sans-serif'),
  fontsource('Syne', '--font-syne', ['400 800'], 'sans-serif'),
  fontsource('Bricolage Grotesque', '--font-bricolage-grotesque', ['200 800'], 'sans-serif'),
  fontsource('Mulish', '--font-mulish', ['200 1000'], 'sans-serif'),
];

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

  fonts,

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