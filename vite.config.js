import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-mui':       ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-mui-icons': ['@mui/icons-material'],
          'vendor-motion':    ['framer-motion'],
          'vendor-md':        ['react-markdown', 'remark-gfm', 'react-syntax-highlighter'],
        }
      }
    }
  }
})
