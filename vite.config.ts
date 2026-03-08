import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // For GitHub Pages: set to '/<repo-name>/' for project sites,
  // or '/' for custom domains / user sites (username.github.io)
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
