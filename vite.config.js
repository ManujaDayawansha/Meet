import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Custom domain → base stays '/'
  // If hosting at username.github.io/repo (no custom domain): base: '/n2n-meet/'
  base: '/',

  plugins: [react()],

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          peerjs: ['peerjs'],
        },
      },
    },
  },
})
