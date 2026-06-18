import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        globals: false,
        include: [
            'tests/**/*.spec.ts',
        ],
        typecheck: {tsconfig: './tsconfig.test.json',},
        coverage: {
            provider: 'v8',
            reporter: [
                'text',
                'json',
                'html',
            ],
            include: [
                'src/**/*.ts',
            ],
            exclude: [
                'src/index.ts',
                '**/*.d.ts',
            ],
        },
    },
})
