import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: { '@': resolve(__dirname, 'src') },
    },
    test: {
        environment: 'node',
        globals: false,
        include: ['tests/**/*.spec.ts'],
        typecheck: { tsconfig: './tsconfig.test.json' },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', '**/*.d.ts'],
            // Пороги — измеренный уровень (95/92/100/95 на 2026-07) минус ~4пп зазора.
            thresholds: {
                statements: 90,
                branches: 87,
                functions: 95,
                lines: 90,
            },
        },
    },
})
