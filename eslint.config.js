import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
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
        },
    },

    // ── TypeScript ────────────────────────────────────────────────────────
    {
        files: ['**/*.{ts,mts,cts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
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

    // ── JavaScript / config files ─────────────────────────────────────────
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
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
            'vue/max-attributes-per-line': ['error', { singleline: 1, multiline: 1 }],

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

            // Порядок defineXxx макросов внутри <script setup>
            'vue/define-macros-order': [
                'error',
                {
                    order: [
                        'defineOptions',
                        'defineProps',
                        'defineEmits',
                        'defineSlots',
                        'defineModel',
                    ],
                },
            ],

            // Пустая строка между блоками SFC
            'vue/padding-line-between-blocks': ['error', 'always'],

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

    // ── Prettier — только для TS/JS (Vue форматирует ESLint) ─────────────
    {
        files: ['**/*.{ts,js,mjs,cjs,mts,cts}'],
        ...prettierConfig,
    },

    // ── Без точек с запятой в JS/TS/Vue ──────────────────────────────────
    {
        files: ['**/*.{ts,js,mjs,cjs,mts,cts,vue}'],
        rules: {
            semi: ['error', 'never'],
        },
    },
]
