import { copySync } from 'fs-extra/esm'
import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const components = fs.readdirSync(resolve(root, 'src/components'))

const excludes = ['index.ts', 'global-components.d.ts']

copySync(
    resolve(root, 'src/styles'),
    resolve(root, 'dist/styles'),
    { overwrite: true },
)

components.forEach(dir => {
    if (!excludes.includes(dir)) {
        const files = fs.readdirSync(resolve(root, `src/components/${dir}`))

        files.forEach(file => {
            if (file.endsWith('.scss')) {
                copySync(
                    resolve(root, resolve(root, `src/components/${dir}/${file}`)),
                    resolve(root, resolve(root, `dist/components/${dir}/${file}`)),
                    { overwrite: true },
                )
            }
        })
    }
})

console.info('✓ SCSS files copied to dist')
