import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['../**/*.js'],
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/coverage/**',
        '**/scripts/**',
        '**/infra/**',
        '**/data/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    },
    globals: true,
  }
});
