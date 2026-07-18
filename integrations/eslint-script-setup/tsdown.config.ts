import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    target: 'es2020',
    outDir: 'dist',
    deps: { neverBundle: ['eslint', 'vue-eslint-parser'] },
    alias: { '@': './src' },
})
