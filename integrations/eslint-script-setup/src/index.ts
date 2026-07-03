import { name, version } from '../package.json'

import { noInlineComposable } from './rules/no-inline-composable'
import { noMultiDeclaration } from './rules/no-multi-declaration'
import { scriptAttrsOrder } from './rules/script-attrs-order'
import { scriptSetupOrder } from './rules/script-setup-order'

const plugin = {
    meta: {
        name,
        version,
    },
    rules: {
        'no-multi-declaration': noMultiDeclaration,
        'no-inline-composable': noInlineComposable,
        'script-setup-order': scriptSetupOrder,
        'script-attrs-order': scriptAttrsOrder,
    },
    configs: {} as Record<string, unknown>,
}

plugin.configs['recommended'] = {
    plugins: { '@vueland': plugin },
    rules: {
        '@vueland/no-multi-declaration': 'error',
        '@vueland/no-inline-composable': 'error',
        '@vueland/script-setup-order': 'warn',
        '@vueland/script-attrs-order': 'warn',
    },
}

export default plugin
