
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy all API requests to your ASP.NET backend
      '/api': {
        target: 'https://localhost:5232', // Your backend URL
        changeOrigin: true,
        secure: false, // For self-signed certs in development
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: Remove /api prefix
      },
      // Also proxy auth endpoints
      '/login': {
        target: 'https://localhost:5232',
        changeOrigin: true,
        secure: false
      },
      '/register': {
        target: 'https://localhost:5232',
        changeOrigin: true,
        secure: false
      }
    }
  }
})