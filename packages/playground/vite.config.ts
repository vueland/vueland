import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, type PluginOption } from 'vite'
import { defineRule, utilsJIT } from '@vueland/utils-jit'

const useBuiltUi = process.env.USE_BUILT_UI === 'true'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        utilsJIT({
            breakpoints: {
                xs: 480,
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1440,
            },
            rules: [
                defineRule({
                    name: 'translate',
                    matcher: /^translate-\[(.+)\]$/,
                    validate: v => !!v,
                    declaration: value => ({
                        transform: `translate(${value})`,
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
            ? {}
            : {
                '@vueland/ui': path.resolve(__dirname, '../ui/src/'),
            },
    },

    css: {
        preprocessorOptions: {
            scss: {},
        },
    },

    server: {
        host: '0.0.0.0',
        port: 8081,
    },

    optimizeDeps: {
        exclude: useBuiltUi ? [] : ['@vueland/ui'],
    },
})
