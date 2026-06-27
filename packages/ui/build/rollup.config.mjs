import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import * as fs from 'node:fs'
import path from 'path'
import { defineConfig } from 'rollup'
import postcss from 'rollup-plugin-postcss'
import { fileURLToPath } from 'url'

import base from './rollup-base.config.mjs'

const cmpMap = {}
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const scssUtils = fs.readdirSync(path.resolve(__dirname, '../src/styles/utils'))

const vuePlugin = vue({
    target: 'node',
    preprocessStyles: true,
    css: false,
    isProduction: true,
})

const makeCssPlugin = (fileName) =>
    postcss({
        extract: fileName,
        minimize: true,
        plugins: [autoprefixer()],
        sourceMap: false,
        use: ['sass'],
    })

const directChunks = [
    'components',
    'composables',
    'directives',
    'resolvers',
    'types',
    'utils',
    'constants',
    'enums',
]

const processChunk = (chunk, ext) => {
    if (directChunks.includes(chunk.name)) {
        return `${chunk.name}/index.js`
    }

    const id = chunk.facadeModuleId || ''


    if (id.includes('.vue')) {
        const path = chunk.name.replace(/\.vue$/, '') + `.${ext}`

        if (cmpMap[path]) {
            const [dir, cmpDir] = path.split('/')
            return `${dir}/${cmpDir}/index.${ext}`
        }

        cmpMap[path] = true
        return path
    }

    return chunk.name + `.${ext}`
}

export default defineConfig([
    {
        input: {
            index: 'src/index.ts',
            components: 'src/components/index.ts',
            composables: 'src/composables/index.ts',
            directives: 'src/directives/index.ts',
            resolvers: 'src/resolvers/index.ts',
            utils: 'src/utils/index.ts',
            constants: 'src/constants/index.ts',
            enums: 'src/enums/index.ts',
        },
        output: {
            dir: 'dist',
            format: 'es',
            sourcemap: false,
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: (chunk) => processChunk(chunk, 'js'),
            chunkFileNames: '_chunks/[name].js',
        },
        ...base,
        plugins: [
            vuePlugin,
            vueJsx(),
            makeCssPlugin('styles.css'),
            ...base.plugins,
        ],
    },
    {
        input: 'src/styles/lib.scss',
        output: {
            dir: 'dist/css',
            sourcemap: false,
        },
        ...base,
        plugins: [
            makeCssPlugin('lib.css'),
            ...base.plugins,
        ],
    },
    {
        input: 'src/styles/utils.scss',
        output: {
            dir: 'dist/css',
            sourcemap: false,
        },
        ...base,
        plugins: [
            makeCssPlugin('utils.css'),
            ...base.plugins,
        ],
    },
    ...scssUtils.map((file) => {
        const [name] = file.split('.')
        return {
            input: `src/styles/utils/${file}`,
            output: {
                dir: 'dist/css/utils',
                sourcemap: false,
            },
            ...base,
            plugins: [
                makeCssPlugin(`${name}.css`),
                ...base.plugins,
            ],
        }
    }),
])
