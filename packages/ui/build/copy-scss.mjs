import { copySync } from 'fs-extra/esm'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

copySync(
    resolve(root, 'src/styles'),
    resolve(root, 'dist/scss'),
    { overwrite: true },
)

console.info('✓ SCSS files copied to dist/scss')
