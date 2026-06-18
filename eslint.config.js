import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const multilineThreshold = {
    "multiline": true,
    "minProperties": 4,
}

const objectCurlyNewline = ["error", {
    "ImportDeclaration": multilineThreshold,
    "ExportDeclaration": multilineThreshold,
    "ObjectExpression": multilineThreshold,
    "ObjectPattern": multilineThreshold,
}]

export default [
    {
        ignores: [
            "**/dist/**",
            "**/.vitepress/cache/**",
            "**/.vitepress/dist/**",
            "**/__tests__/**",
            "**/node_modules/**",
            "packages/playground",
            "packages/docs",
        ],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...vue.configs["flat/recommended"],
    {
        plugins: {
            'import': importPlugin,
            'simple-import-sort': simpleImportSort,
        },
    },
    {
        rules: {
            "no-console": ["warn", {allow: ["warn", "error", "info"]}],
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        // Пакеты (сторонние библиотеки)
                        ["^@?\\w"],
                        // Внутренние алиасы (@/, ~/)
                        ["^@/", "^~/"],
                        // Абсолютные пути
                        ["^\\u0000"],
                        // Относительные пути (родители и текущая директория)
                        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                        // Стили
                        ["^.+\\.s?css$"],
                        // Side-effect импорты
                        ["^\\u0000"],
                    ]
                }
            ],
            "simple-import-sort/exports": "error",
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
        }
    },

    {
        files: ["**/*.{tsx,ts,mjs,js}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            semi: "off",
            "@/semi": ["error", "never"],
            "object-curly-newline": objectCurlyNewline,
            '@typescript-eslint/no-explicit-any': 'off',
            "@typescript-eslint/ban-ts-ignore": "off",
            "vue/require-default-prop": "off",
        },
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            semi: "off",
            "object-curly-newline": objectCurlyNewline,
        },
    },

    // {} как тип-параметр — намеренно в Vue-internal утилитах и тест-файлах
    {
        files: ["**/src/utils/**/*.ts", "**/*.spec.ts", "**/*.spec.tsx"],
        rules: {
            "@typescript-eslint/no-empty-object-type": "off",
            "vue/one-component-per-file": "off",
        },
    },

    //Vue (важно: parser для SFC + TS внутри script)
    {
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                parser: tseslint.parser,
                extraFileExtensions: [".vue"],
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            semi: "off",
            "@/semi": ["error", "never"],
            "object-curly-newline": objectCurlyNewline,
            "no-undef": "off",
            "vue/multi-word-component-names": "error",
            "vue/html-indent": ["error", 4],
            "vue/require-default-prop": "off",
            "vue/one-component-per-file": "off",
            "vue/script-indent": ["error", 4, {baseIndent: 1}],
            '@typescript-eslint/no-explicit-any': 'off',
            "@typescript-eslint/ban-ts-ignore": "off",
            "@typescript-eslint/no-unused-expressions": "off"
        },
    },
]
