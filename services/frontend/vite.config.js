import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100
    },
    proxy: {
      '/api': {
        target: 'http://compose-gateway-1', // użyj nazwy kontenera gateway
        changeOrigin: true,
        secure: false,
        rewrite: path => path
      }
    }

  }
})
