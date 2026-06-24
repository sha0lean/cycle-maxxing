import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Alias @/ → racine de app/ (miroir de tsconfig.json), sans plugin supplémentaire.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
})
