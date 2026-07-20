import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000
  },
  build: {
    // Relying on Vite's default chunking to avoid circular dependencies
    // between MUI and Framer Motion that cause runtime crashes in production.
  }
})
