import path from 'path'
import * as sass from 'sass'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const scssLoadPaths = [
    path.resolve(__dirname, '../src/styles'),
    path.resolve(__dirname, '../node_modules'),
    path.resolve(__dirname, '../../../node_modules'),
]

// rollup-plugin-postcss v4 still calls sass.render; this loader keeps it on Sass' modern API.
const modernSassLoader = {
    name: 'sass',
    test: /\.(sass|scss)$/,
    async process({ code }) {
        const sourceMap = this.sourceMap === true || this.sourceMap === 'inline'
        const loadPaths = [
            ...scssLoadPaths,
            ...(this.options.includePaths ?? []),
            ...(this.options.loadPaths ?? []),
        ]

        const result = await sass.compileStringAsync(`${this.options.data ?? ''}${code}`, {
            url: pathToFileURL(this.id),
            syntax: this.id.endsWith('.sass') ? 'indented' : 'scss',
            sourceMap,
            loadPaths,
            style: this.options.outputStyle === 'compressed' ? 'compressed' : 'expanded',
        })

        for (const loadedUrl of result.loadedUrls ?? []) {
            if (loadedUrl.protocol === 'file:') {
                this.dependencies.add(fileURLToPath(loadedUrl))
            }
        }

        return {
            code: result.css,
            map: result.sourceMap && JSON.stringify(result.sourceMap),
        }
    },
}

export default modernSassLoader
