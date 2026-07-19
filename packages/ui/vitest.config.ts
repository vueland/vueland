import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: { '@': resolve(__dirname, 'src') },
    },
    plugins: [vue()],
    test: {
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            // Пороги — измеренный в CI уровень (84.6/78.6/82.6/84.9 на 2026-07)
            // минус ~4пп зазора. Понижать можно только осознанным решением в PR.
            thresholds: {
                statements: 80,
                branches: 74,
                functions: 78,
                lines: 80,
            },
        },
    },
})
