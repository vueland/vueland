import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const srcDir = path.resolve(rootDir, 'src')
const componentsDir = path.resolve(srcDir, 'components')
const utilsDir = path.resolve(srcDir, 'styles/utils')

const directEntries = [
    'components',
    'composables',
    'directives',
    'resolvers',
    'types',
    'utils',
    'constants',
    'enums',
]

const styleEntries = fs
    .readdirSync(utilsDir)
    .filter((file) => file.endsWith('.scss'))
    .sort()
    .reduce<Record<string, string>>((entries, file) => {
        const name = file.replace(/\.scss$/, '')

        entries[`css-utils-${name}`] = path.resolve(utilsDir, file)

        return entries
    }, {})

const componentIndexEntries = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.resolve(componentsDir, entry.name, 'index.ts')))
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce<Record<string, string>>((entries, entry) => {
        entries[`component-${entry.name}`] = path.resolve(componentsDir, entry.name, 'index.ts')

        return entries
    }, {})

const normalizePath = (value: string) => value.split(path.sep).join('/')

const toSourceRelativePath = (id: string) => {
    const cleanId = id.split('?')[0]

    return normalizePath(path.relative(srcDir, cleanId))
}

const toJsFileName = (id: string) => {
    if (id.includes('plugin-vue:export-helper')) {
        return '_virtual/_plugin-vue_export-helper.js'
    }

    const relativePath = toSourceRelativePath(id)

    if (relativePath.startsWith('../')) {
        return `_virtual/${path.basename(relativePath).replace(/^\0/, '_')}.js`
    }

    if (relativePath === 'styles/lib.scss') {
        return 'css/lib.js'
    }

    if (relativePath === 'styles/utils.scss') {
        return 'css/utils.js'
    }

    if (relativePath.startsWith('styles/utils/') && relativePath.endsWith('.scss')) {
        return `css/utils/${path.basename(relativePath, '.scss')}.js`
    }

    return relativePath.replace(/\.(json|mjs|js|jsx|ts|tsx|vue)$/, '.js')
}

const toCssFileName = (assetInfo: { name?: string, names?: string[], originalFileNames?: string[] }) => {
    const names = [
        ...(assetInfo.originalFileNames ?? []),
        ...(assetInfo.names ?? []),
        assetInfo.name,
    ].filter(Boolean).map((name) => normalizePath(String(name)))

    const sourceName = names.find((name) => name.endsWith('.scss') || name.endsWith('.css'))
    const cssName = names.find((name) => name.endsWith('.css'))
    const cssBaseName = cssName ? path.basename(cssName, '.css') : ''

    if (sourceName?.endsWith('/src/styles/styles.scss')
        || cssName === 'styles/styles.css'
        || names.includes('index.css')) {
        return 'styles.css'
    }

    if (sourceName?.endsWith('/src/styles/lib.scss') || names.includes('lib.css')) {
        return 'css/lib.css'
    }

    if (sourceName?.endsWith('/src/styles/utils.scss') || names.includes('utils.css')) {
        return 'css/utils.css'
    }

    if (cssBaseName === 'cssUtils') {
        return 'css/utils.css'
    }

    const utilsMatch = sourceName?.match(/\/src\/styles\/utils\/([^/]+)\.scss$/)

    if (utilsMatch) {
        return `css/utils/${utilsMatch[1]}.css`
    }

    if (cssBaseName.startsWith('css-utils-')) {
        return `css/utils/${cssBaseName.slice('css-utils-'.length)}.css`
    }

    return '[name][extname]'
}

export default defineConfig({
    root: rootDir,
    plugins: [
        vue({
            target: 'node',
            isProduction: true,
        }),
    ],
    resolve: {
        alias: {
            '@': srcDir,
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    css: {
        postcss: {
            plugins: [
                autoprefixer(),
            ],
        },
        preprocessorOptions: {
            sass: {
                api: 'modern',
            },
            scss: {
                api: 'modern',
            },
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: 'esbuild',
        sourcemap: false,
        cssCodeSplit: true,
        rollupOptions: {
            preserveEntrySignatures: 'strict',
            external: [
                'vue',
            ],
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
            },
            input: {
                index: path.resolve(srcDir, 'index.ts'),
                components: path.resolve(srcDir, 'components/index.ts'),
                composables: path.resolve(srcDir, 'composables/index.ts'),
                directives: path.resolve(srcDir, 'directives/index.ts'),
                resolvers: path.resolve(srcDir, 'resolvers/index.ts'),
                utils: path.resolve(srcDir, 'utils/index.ts'),
                constants: path.resolve(srcDir, 'constants/index.ts'),
                enums: path.resolve(srcDir, 'enums/index.ts'),
                ...componentIndexEntries,
                lib: path.resolve(srcDir, 'styles/lib.scss'),
                cssUtils: path.resolve(srcDir, 'styles/utils.scss'),
                ...styleEntries,
            },
            output: {
                format: 'es',
                preserveModules: true,
                preserveModulesRoot: srcDir,
                entryFileNames(chunk) {
                    const id = chunk.facadeModuleId

                    if (id) {
                        return toJsFileName(id)
                    }

                    if (directEntries.includes(chunk.name)) {
                        return `${chunk.name}/index.js`
                    }

                    return `${chunk.name}.js`
                },
                chunkFileNames: '_chunks/[name].js',
                assetFileNames(assetInfo) {
                    if (assetInfo.name?.endsWith('.css') || assetInfo.names?.some((name) => name.endsWith('.css'))) {
                        return toCssFileName(assetInfo)
                    }

                    return 'assets/[name][extname]'
                },
            },
        },
    },
})
