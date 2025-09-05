import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // SPA em host estático
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2017',
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('supabase')) return 'vendor-supabase'
            return 'vendor'
          }
        }
      }
    }
  }
})