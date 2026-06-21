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
        coverage: { provider: 'v8' },
    },
})
