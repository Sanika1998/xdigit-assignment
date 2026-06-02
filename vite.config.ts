import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      // Single stylis copy (must match @emotion/cache) so RTL plugins don't crash at runtime.
      stylis: path.resolve(__dirname, 'node_modules/stylis'),
    },
    dedupe: ['stylis', '@emotion/react', '@emotion/styled', '@emotion/cache'],
  },
  optimizeDeps: {
    include: ['stylis', '@mui/stylis-plugin-rtl'],
  },
})
