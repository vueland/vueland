import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig, type PluginOption } from 'vite'

import { defineRule, utilsJIT } from '../../packages/utils-jit/src/index'

const useBuiltUi = process.env.USE_BUILT_UI === 'true'
const uiSrcDir = path.resolve(__dirname, '../../packages/ui/src/')
const utilsJitSrcEntry = path.resolve(__dirname, '../../packages/utils-jit/src/index.ts')

export default defineConfig({
    plugins: [
        vue(),
        utilsJIT({
            emitFile: true,
            breakpoints: {
                xs: 0,
                sm: 680,
                md: 1024,
                lg: 1280,
                xl: 1920,
                xxl: 2560,
                tablet: 1400,
            },
            rules: [
                defineRule({
                    name: 'field-radius',
                    matcher: /^field-radius-\[(.+)\]$/,
                    validate: v => !!v,
                    declaration: value => ({
                        '--c-sys-shape-md': `${value}`,
                    }),
                }),
                defineRule({
                    name: 'flex-center',
                    matcher: /^flex-center$/,
                    validate: v => !!v,
                    declaration: () => ({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }),
                }),
            ],
            variants: {
                tablet: {
                    kind: 'media',
                    value: 900,
                },
            },
        }) as PluginOption,
    ],

    resolve: {
        alias: useBuiltUi
            ? {
                '@vueland/utils-jit': utilsJitSrcEntry,
            }
            : {
                '@vueland/ui': uiSrcDir,
                '@vueland/utils-jit': utilsJitSrcEntry,
                '@': uiSrcDir,
            },
    },


    server: {
        host: '0.0.0.0',
        port: 8081,
    },

    optimizeDeps: {
        exclude: useBuiltUi ? ['@vueland/utils-jit'] : ['@vueland/ui', '@vueland/utils-jit'],
    },
})
