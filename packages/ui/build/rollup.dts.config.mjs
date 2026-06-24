import path from 'path'
import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const external = [/\.scss$/, /\.css$/, 'vue']

const dtsEntries = [
    ['index', 'types.d.ts'],
    ['components', 'components/index.d.ts'],
    ['composables', 'composables/index.d.ts'],
    ['directives', 'directives/index.d.ts'],
    ['resolvers', 'resolvers/index.d.ts'],
    ['types', 'types/index.d.ts'],
    ['utils', 'utils/index.d.ts'],
    ['constants', 'constants/index.d.ts'],
    ['enums', 'enums/index.d.ts'],
]

const makeDtsPlugin = () => dts({
    compilerOptions: {
        baseUrl: path.resolve(__dirname, '..'),
        paths: { '@/*': ['dist/temp-types/src/*'] },
    },
})

const toTempTypesInput = (entry) => entry === 'index'
    ? 'dist/temp-types/src/index.d.ts'
    : `dist/temp-types/src/${entry}/index.d.ts`

const makeDtsConfig = ([entry, outputFile]) => ({
    input: [toTempTypesInput(entry)],
    output: [{
        file: `dist/${outputFile}`,
        format: 'es',
    }],
    plugins: [makeDtsPlugin()],
    external,
})

export default defineConfig(dtsEntries.map(makeDtsConfig))
