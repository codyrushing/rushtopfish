import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import viteImagemin from "vite-plugin-imagemin";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // integrations: [react(), markdoc(), keystatic()],

  vite: {
    plugins: [
      tailwindcss(),
      viteImagemin({
        // JPEG optimization
        mozjpeg: {
          quality: 70,
          progressive: true
        },
        // PNG optimization
        pngquant: {
          quality: [0.6, 0.8],
          speed: 4
        },
        // WebP conversion
        webp: {
          quality: 70
        },
        // SVG optimization
        svgo: {
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeEmptyAttrs', active: false }
          ]
        }
      })
    ],
  },
});
