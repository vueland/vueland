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
            // Пороги — измеренный уровень (89/85/86/89 на 2026-07) минус ~4пп зазора.
            // Понижать можно только осознанным решением в PR.
            thresholds: {
                statements: 85,
                branches: 80,
                functions: 82,
                lines: 85,
            },
        },
    },
})
