import { noInlineComposable } from './rules/no-inline-composable'
import { noMultiDeclaration } from './rules/no-multi-declaration'
import { scriptSetupOrder } from './rules/script-setup-order'

const plugin = {
    meta: {
        name: '@vueland/eslint-script-setup',
        version: '0.0.1',
    },
    rules: {
        'no-multi-declaration': noMultiDeclaration,
        'no-inline-composable': noInlineComposable,
        'script-setup-order': scriptSetupOrder,
    },
    configs: {} as Record<string, unknown>,
}

plugin.configs['recommended'] = {
    plugins: { '@vueland': plugin },
    rules: {
        '@vueland/no-multi-declaration': 'error',
        '@vueland/no-inline-composable': 'error',
        '@vueland/script-setup-order': 'warn',
    },
}

export default plugin
