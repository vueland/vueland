import { defineConfig } from 'vitest/config'

export default defineConfig({
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
            // Пороги — измеренный уровень (89/88/81/89 на 2026-07) минус ~4пп зазора.
            thresholds: {
                statements: 85,
                branches: 84,
                functions: 77,
                lines: 85,
            },
        },
    },
})
