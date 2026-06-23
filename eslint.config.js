import js from '@eslint/js'
import vueScriptSetup from '@vueland/eslint-script-setup'
import importPlugin from 'eslint-plugin-import'
import importNewlines from 'eslint-plugin-import-newlines'
import newlineDestructuring from 'eslint-plugin-newline-destructuring'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default [
    // ── Глобальные исключения ─────────────────────────────────────────────
    {
        ignores: [
            '**/dist/**',
            '**/.vitepress/cache/**',
            '**/.vitepress/dist/**',
            '**/node_modules/**',
            'packages/playground/**',
            'packages/docs/**',
        ],
    },

    // ── Базовые конфиги ───────────────────────────────────────────────────
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...vue.configs['flat/recommended'],

    // ── Плагины (регистрация) ─────────────────────────────────────────────
    {
        plugins: {
            import: importPlugin,
            'import-newlines': importNewlines,
            'newline-destructuring': newlineDestructuring,
            'simple-import-sort': simpleImportSort,
        },
    },

    // ── Глобальные правила (все файлы) ────────────────────────────────────
    {
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

            // Импорты
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^@?\\w'],
                        ['^@/', '^~/'],
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
            'import-newlines/enforce': ['error', { items: 2, 'max-len': 100, semi: false }],
            'newline-destructuring/newline': ['error', { items: 2, maxLength: 100 }],
        },
    },

    // ── Форматирование TS/JS (ESLint вместо Prettier) ─────────────────────
    {
        files: ['**/*.{ts,js,mjs,cjs,mts,cts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // Отступы
            indent: ['error', 4, { SwitchCase: 1 }],

            // Кавычки
            quotes: ['error', 'single', { avoidEscape: true }],

            // Запятые
            'comma-dangle': ['error', 'always-multiline'],

            // Пробелы
            'object-curly-spacing': ['error', 'always'],
            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'never',
                    named: 'never',
                    asyncArrow: 'always',
                },
            ],
            'space-infix-ops': 'error',
            'key-spacing': [
                'error',
                {
                    beforeColon: false,
                    afterColon: true,
                },
            ],
            'comma-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                },
            ],
            'arrow-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                },
            ],
            'space-before-blocks': 'error',

            // Объекты — перенос при multiline
            'object-curly-newline': [
                'error',
                {
                    ObjectExpression: {
                        multiline: true,
                        consistent: true,
                    },
                    ObjectPattern: {
                        multiline: true,
                        consistent: true,
                    },
                },
            ],
            'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],

            // TypeScript
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'error',
            '@typescript-eslint/ban-ts-comment': ['warn', { minimumDescriptionLength: 3 }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },

    // ── Vue SFC ───────────────────────────────────────────────────────────
    {
        files: ['**/*.vue'],
        plugins: { '@vueland': vueScriptSetup },
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
            // Vue форматирование (4 пробела, как в проекте)

            'vue/html-indent': ['error', 4],
            'vue/script-indent': ['error', 4, { baseIndent: 1 }],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: 1,
                    multiline: 1,
                },
            ],
            'vue/html-self-closing': [
                'error',
                {
                    html: {
                        void: 'always',
                        normal: 'any',
                        component: 'always',
                    },
                    svg: 'always',
                    math: 'always',
                },
            ],
            'vue/singleline-html-element-content-newline': [
                'error',
                {
                    ignoreWhenNoAttributes: true,
                    ignoreWhenEmpty: true,
                },
            ],
            'vue/multiline-html-element-content-newline': [
                'error',
                {
                    ignoreWhenEmpty: true,
                    allowEmptyLines: false,
                },
            ],

            // Vue качество
            'vue/no-v-html': 'off',
            'vue/multi-word-component-names': 'error',
            'vue/require-default-prop': 'off',
            'vue/one-component-per-file': 'off',
            'vue/no-unused-vars': 'error',

            // Компоненты в template всегда в kebab-case
            'vue/component-name-in-template-casing': [
                'error',
                'kebab-case',
                {
                    registeredComponentsOnly: false,
                    ignores: [],
                },
            ],

            // Порядок блоков в SFC: <script> → <template> → <style>
            'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],

            // Общий порядок <script setup> контролирует @vueland/script-setup-order.
            'vue/define-macros-order': 'off',

            // Пустая строка между блоками SFC
            'vue/padding-line-between-blocks': ['error', 'always'],
            '@vueland/no-multi-declaration': 'error',
            '@vueland/no-inline-composable': 'error',
            '@vueland/script-setup-order': [
                'error',
                {
                    order: [
                        'import',
                        'type',
                        'macros',
                        'reactive',
                        'composable',
                        'variable',
                        'computed',
                        'function',
                        'watchEffect',
                        'watch',
                        'lifecycle',
                    ],
                },
            ],

            // Объекты — перенос при multiline
            'object-curly-newline': [
                'error',
                {
                    ObjectExpression: { multiline: true, consistent: true },
                    ObjectPattern: { multiline: true, consistent: true },
                },
            ],
            'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],

            // TS в Vue
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },

    // ── Тесты ─────────────────────────────────────────────────────────────
    {
        files: ['**/*.spec.ts', '**/__tests__/**/*.ts'],
        rules: {
            'vue/one-component-per-file': 'off',
        },
    },

    // ── Без точек с запятой во всех файлах ───────────────────────────────
    {
        files: ['**/*.{ts,js,mjs,cjs,mts,cts,vue}'],
        rules: {
            semi: ['error', 'never'],
        },
    },
]
