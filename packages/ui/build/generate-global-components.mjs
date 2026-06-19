import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { components } from './components.mjs'

const content = [
    'export {}',
    '',
    'declare module \'vue\' {',
    '    export interface GlobalComponents {',
    ...components.map(([name, from]) => {
        return `        ${name}: typeof import('${from}').${name}`
    }),
    '    }',
    '}',
    '',
].join('\n')

writeFileSync(
    resolve(process.cwd(), 'dist/components/global-components.d.ts'),
    content,
)
writeFileSync(
    resolve(process.cwd(), 'src/components/global-components.d.ts'),
    content,
)
