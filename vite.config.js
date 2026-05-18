import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/lucid_dev_backup/' : '/',
  optimizeDeps: {
    include: ['html2pdf.js'],
  },
}))
