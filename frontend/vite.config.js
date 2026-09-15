import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'tracelessly-undefaming-breana.ngrok-free.dev', // Add your specific ngrok URL here
      '.ngrok-free.dev' // Or allow all ngrok domains dynamically
    ]
  }
})
