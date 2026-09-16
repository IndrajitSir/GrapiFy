import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local dev: forward /api/run-code to the Express proxy (npm run server)
      '/api': 'http://localhost:4000',
    },
  },
})
