import fs from 'fs/promises'
import path from 'path'

const filesToCopy = [
    ['src/components/global-components.d.ts', 'dist/components/global-components.d.ts'],
]

for (const [from, to] of filesToCopy) {
    await fs.mkdir(path.dirname(to), { recursive: true })
    await fs.copyFile(from, to)
}
