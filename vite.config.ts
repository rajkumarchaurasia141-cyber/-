import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

function copyToAndroidAssetsPlugin(): Plugin {
  return {
    name: 'copy-to-android-assets',
    closeBundle() {
      const srcDir = path.resolve(import.meta.dirname, 'dist');
      const destDir = path.resolve(import.meta.dirname, 'app/src/main/assets/www');
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyToAndroidAssetsPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
