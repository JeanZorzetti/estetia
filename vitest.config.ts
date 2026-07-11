import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          // sem isso o happy-dom faz fetch REAL do src de iframes (Calendly)
          disableIframePageLoading: true,
          disableJavaScriptFileLoading: true,
          disableCSSFileLoading: true,
        },
      },
    },
    globals: true,
    setupFiles: './setup-tests.ts',
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'setup-tests.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/types/**',
        '**/__tests__/**',
        '**/dist/**',
        '**/.next/**',
      ],
    },
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist'],
    server: {
      deps: {
        // next-intl externalizado roda no ESM nativo do Node e falha ao
        // importar 'next/server' sem extensão; inline força o pipeline vite
        inline: ['next-intl'],
      },
    },
  },
  resolve: {
    alias: {
      // next-intl (ESM) importa 'next/server' sem extensão; o resolver ESM
      // do Node exige o caminho completo fora do pipeline do vite
      'next/server': 'next/server.js',
      '@': path.resolve(__dirname, './'),
    },
  },
})
