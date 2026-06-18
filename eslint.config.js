import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import importNewlines from 'eslint-plugin-import-newlines'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import { createRequire } from 'module'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const require = createRequire(import.meta.url)
const newlineDestructuring = require('eslint-plugin-newline-destructuring')

const stylisticRules = {
    '@stylistic/indent': ['error', 4],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/object-curly-newline': ['error', {
        ObjectPattern: {
            multiline: true,
            minProperties: 3, 
        },
        ObjectExpression: {
            multiline: true,
            minProperties: 3, 
        },
        ImportDeclaration: {
            multiline: true,
            minProperties: 4, 
        },
        ExportDeclaration: {
            multiline: true,
            minProperties: 4, 
        },
    }],
    '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
}

export default [
    {
        ignores: [
            '**/dist/**',
            '**/.vitepress/cache/**',
            '**/.vitepress/dist/**',
            '**/__tests__/**',
            '**/node_modules/**',
            'packages/playground',
            'packages/docs',
            '**/*.json',
            '**/*.yaml',
            '**/*.yml',
            '**/*.md',
        ],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...vue.configs['flat/recommended'],
    {
        plugins: {
            'import': importPlugin,
            'import-newlines': importNewlines,
            'simple-import-sort': simpleImportSort,
            '@stylistic': stylistic,
            'newline-destructuring': newlineDestructuring,
        },
    },
    {
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^@?\\w'],
                        ['^@/', '^~/'],
                        ['^\\u0000'],
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        ['^.+\\.s?css$'],
                        ['^\\u0000'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': ['error', { 'prefer-inline': true }],
            'newline-destructuring/newline': ['error', {
                items: 2,
                itemsWithRest: 2,
                maxLength: 999, 
            }],
            'import-newlines/enforce': ['error', {
                items: 3,
                'max-len': 999,
                semi: false, 
            }],
        },
    },

    // TS / TSX — stylistic ESLint, без Prettier
    {
        files: ['**/*.{ts,tsx,mjs,js,cjs}'],
        plugins: { '@stylistic': stylistic },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            ...stylisticRules,
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/no-empty-object-type': 'error',
            'vue/require-default-prop': 'off',
        },
    },

    // {} намеренно в Vue-internal утилитах и тест-файлах
    {
        files: ['**/src/utils/**/*.ts', '**/*.spec.ts', '**/*.spec.tsx'],
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
            'vue/one-component-per-file': 'off',
        },
    },

    // Vue SFC
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                parser: tseslint.parser,
                extraFileExtensions: ['.vue'],
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            ...stylisticRules,
            'no-undef': 'off',
            'vue/multi-word-component-names': 'error',
            'vue/html-indent': ['error', 4],
            'vue/require-default-prop': 'off',
            'vue/one-component-per-file': 'off',
            'vue/script-indent': ['error', 4, { baseIndent: 1 }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },

    // eslint-config-prettier отключает правила @stylistic только для файлов,
    // которые форматирует Prettier (MD/JSON/CSS). TS/TSX/Vue форматирует ESLint.
    {
        files: ['**/*.{md,json,css,yml,yaml}'],
        ...prettierConfig,
    },
]
