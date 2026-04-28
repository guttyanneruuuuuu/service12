import { defineConfig } from 'vite'

// Static SPA build for GitHub Pages
export default defineConfig({
  base: '/service12/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  }
})
