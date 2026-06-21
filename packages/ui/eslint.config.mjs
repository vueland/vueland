import tsParser from '@typescript-eslint/parser'
import vueScriptSetup from '@vueland/eslint-script-setup'
import vueParser from 'vue-eslint-parser'

export default [
    {
        files: ['src/**/*.vue'],
        plugins: { '@vueland': vueScriptSetup },
        languageOptions: {
            parser: vueParser,
            parserOptions: { parser: tsParser },
        },
        rules: {
            '@vueland/script-setup-order': ['error', {
                order: ['import', 'type', 'macros'],
            }],
        },
    },
]
