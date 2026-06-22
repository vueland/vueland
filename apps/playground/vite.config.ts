import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineRule, utilsJIT } from '@vueland/utils-jit'
import path from 'node:path'
import { defineConfig, type PluginOption } from 'vite'

const useBuiltUi = process.env.USE_BUILT_UI === 'true'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        utilsJIT({
            breakpoints: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
                xxl: 2560,
            },
            rules: [
                defineRule({
                    name: 'field-radius',
                    matcher: /^field-radius-\[(.+)\]$/,
                    validate: v => !!v,
                    declaration: value => ({
                        '--c-field-border-radius': `${value}`,
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
                '@vueland/ui': path.resolve(__dirname, '../../packages/ui/src/'),
                '@': path.resolve(__dirname, '../../packages/ui/src/'),
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
