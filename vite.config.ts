import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages serves the site from /ai-portfolio/ (built with --mode pages); Vercel serves it from the root.
  base: mode === 'pages' ? '/ai-portfolio/' : '/',
}))
