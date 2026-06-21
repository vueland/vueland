import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'rollup-plugin-esbuild'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
    external: ['vue'],
    treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
    },
    plugins: [
        alias({
            entries: [
                { find: '@', replacement: path.resolve(__dirname, '../src') },
            ],
        }),
        peerDepsExternal({ includeDependencies: true }),
        nodeResolve({
            extensions: ['.mjs', '.js', '.json', '.ts', 'tsx', '.vue'],
            browser: false,
        }),
        commonjs(),
        json(),

        replace({
            preventAssignment: true,
            values: { 'process.env.NODE_ENV': JSON.stringify('production') },
        }),

        esbuild({
            target: 'es2018',
            sourceMap: false,
            tsconfig: path.resolve(process.cwd(), 'tsconfig.base.json'),
            loaders: {
                '.vue': 'ts',
                '.tsx': 'tsx',
                '.jsx': 'jsx',
            },
        }),
    ],
}
