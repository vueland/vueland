#!/usr/bin/env node
// Pack smoke test: packs every publishable package, installs the tarballs into a
// clean fixture project with npm (real-world resolver — no workspace links) and
// verifies the public export contract:
//   1. every runtime subpath is importable in Node (ESM);
//   2. static (css/scss) subpaths resolve to real files inside the tarball;
//   3. type-only subpaths (./types) are NOT importable at runtime;
//   4. TypeScript resolves every subpath under both moduleResolution=bundler
//      (Vite consumers) and nodenext (Node consumers).
// Exits non-zero on the first broken subpath. Run: pnpm test:pack

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const repoRoot = process.cwd()

const PACKAGES = [
    { dir: 'packages/ui', name: '@vueland/ui' },
    { dir: 'packages/utils-jit', name: '@vueland/utils-jit' },
    { dir: 'integrations/eslint-script-setup', name: '@vueland/eslint-script-setup' },
]

// Peers the fixture needs so installs and imports don't fail.
const PEERS = ['vue@^3.5.0', 'vite@^8.0.0', 'eslint@^9.0.0', 'typescript@^5.5.0']

const failures = []
const check = (ok, label, detail = '') => {
    console.info(`${ok ? '  ✓' : '  ✗'} ${label}${ok || !detail ? '' : ` — ${detail}`}`)
    if (!ok) failures.push(label)
}

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8' })

// ---------------------------------------------------------------- pack + install

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vueland-pack-'))
console.info(`workdir: ${workDir}`)

const tarballs = PACKAGES.map(({ dir, name }) => {
    console.info(`packing ${name}…`)
    run(`pnpm pack --pack-destination ${workDir}`, path.join(repoRoot, dir))
    const tgz = fs.readdirSync(workDir).find((f) =>
        f.startsWith(name.replace('@', '').replace('/', '-')) && f.endsWith('.tgz'))
    if (!tgz) throw new Error(`tarball for ${name} not found in ${workDir}`)
    return path.join(workDir, tgz)
})

const fixture = path.join(workDir, 'fixture')
fs.mkdirSync(fixture)
fs.writeFileSync(path.join(fixture, 'package.json'), JSON.stringify({
    name: 'pack-smoke-fixture',
    private: true,
    type: 'module',
}, null, 2))

console.info('installing tarballs into fixture (npm)…')
run(
    `npm install --no-audit --no-fund --loglevel=error ${[...tarballs, ...PEERS].map((t) => JSON.stringify(t)).join(' ')}`,
    fixture,
)

const installedUiPkg = JSON.parse(
    fs.readFileSync(path.join(fixture, 'node_modules/@vueland/ui/package.json'), 'utf8'),
)

// ---------------------------------------------------------------- node runtime

console.info('\n— Node runtime resolution (ESM, from inside the fixture) —')

// Wildcard subpaths resolve against real dist files — pick one per pattern.
// A wildcard key may map to a FIXED target (./enums/* → dist/enums/index.js):
// then any name matches. A bare-star target (./css/utils/*) maps names verbatim,
// so the probe keeps the file extension; a starred suffix (*.js) strips it.
const expandWildcard = (subpath, target) => {
    const t = typeof target === 'string' ? target : (target.default ?? target.import)
    if (!t.includes('*')) return subpath.replace('*', 'probe')

    const [prefix, suffix] = t.split('*')
    const dir = path.join(fixture, 'node_modules/@vueland/ui', prefix)
    const first = fs.readdirSync(dir).find((f) => f.endsWith(suffix || '.css') || f.endsWith('.js'))
    return first ? subpath.replace('*', suffix ? first.slice(0, -suffix.length) : first) : null
}

// { spec, kind: 'js' | 'static' | 'none' } — 'none' must FAIL to resolve (type-only).
const probes = []

for (const [subpath, target] of Object.entries(installedUiPkg.exports)) {
    if (subpath === './types') {
        probes.push({ spec: `@vueland/ui${subpath.slice(1)}`, kind: 'none' })
        continue
    }

    const isStatic = typeof target === 'string' || /\.(css|scss)$/.test(subpath) || subpath.includes('styles/')
    const concrete = subpath.includes('*') ? expandWildcard(subpath, target) : subpath

    if (!concrete) {
        check(false, `@vueland/ui${subpath.slice(1)} — no dist file matches wildcard`)
        continue
    }

    probes.push({ spec: `@vueland/ui${concrete.slice(1)}`, kind: isStatic ? 'static' : 'js' })
}

probes.push(
    { spec: '@vueland/utils-jit', kind: 'js' },
    { spec: '@vueland/eslint-script-setup', kind: 'js' },
)

// The probe runs INSIDE the fixture so bare specifiers resolve with the ESM
// "import"/"default" conditions against the installed tarballs — exactly like a
// real consumer. import.meta.resolve validates the exports map; the follow-up
// import() proves JS entries actually execute (css imports inside dist are fine
// for bundler consumers — count resolution as success for those).
fs.writeFileSync(path.join(fixture, 'probe.mjs'), `
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const probes = JSON.parse(process.argv[2])
const results = []

for (const { spec, kind } of probes) {
    const r = { spec, kind }
    try {
        const file = fileURLToPath(import.meta.resolve(spec))
        r.resolved = fs.existsSync(file)
        r.target = file.replace(/^.*node_modules\\//, '')
        if (kind === 'js') {
            try { r.exportCount = Object.keys(await import(spec)).length }
            catch (e) { r.importError = e.code ?? String(e).split('\\n')[0] }
        }
    } catch (e) { r.resolveError = e.code ?? String(e).split('\\n')[0] }
    results.push(r)
}

process.stdout.write(JSON.stringify(results))
`)

const probeOut = run(`node probe.mjs ${JSON.stringify(JSON.stringify(probes))}`, fixture)
const results = JSON.parse(probeOut)

for (const r of results) {
    if (r.kind === 'none') {
        check(!!r.resolveError, `${r.spec} is type-only (no runtime branch)`)
        continue
    }

    if (r.resolveError || !r.resolved) {
        check(false, r.spec, r.resolveError ?? 'resolved to a missing file')
        continue
    }

    if (r.kind === 'static') {
        check(true, `${r.spec} → ${path.basename(r.target)}`)
        continue
    }

    // JS entry: must execute, or at worst trip over a css import (bundler concern).
    const ok = r.exportCount > 0 || r.importError === 'ERR_UNKNOWN_FILE_EXTENSION'
    check(ok, `import('${r.spec}')`, r.importError ?? (r.exportCount === 0 ? 'empty namespace' : ''))
}

// ---------------------------------------------------------------- typescript

console.info('\n— TypeScript resolution —')

fs.writeFileSync(path.join(fixture, 'consumer.ts'), `
import * as root from '@vueland/ui'
import * as components from '@vueland/ui/components'
import * as composables from '@vueland/ui/composables'
import * as directives from '@vueland/ui/directives'
import * as resolvers from '@vueland/ui/resolvers'
import * as constants from '@vueland/ui/constants'
import * as utils from '@vueland/ui/utils'
import type * as types from '@vueland/ui/types'
import * as jit from '@vueland/utils-jit'
import * as eslintPlugin from '@vueland/eslint-script-setup'

export const all = { root, components, composables, directives, resolvers, constants, utils, jit, eslintPlugin }
export type T = typeof import('@vueland/ui/types')
export type Probe = types.Maybe<string>
`)

for (const moduleResolution of ['bundler', 'nodenext']) {
    fs.writeFileSync(path.join(fixture, 'tsconfig.json'), JSON.stringify({
        compilerOptions: {
            module: moduleResolution === 'bundler' ? 'esnext' : 'nodenext',
            moduleResolution,
            target: 'es2022',
            strict: true,
            noEmit: true,
            skipLibCheck: true,
        },
        include: ['consumer.ts'],
    }, null, 2))

    try {
        run('npx tsc --noEmit', fixture)
        check(true, `tsc --moduleResolution ${moduleResolution}`)
    } catch (e) {
        check(false, `tsc --moduleResolution ${moduleResolution}`, (e.stdout || e.message).split('\n').slice(0, 5).join('\n    '))
    }
}

// ---------------------------------------------------------------- summary

console.info('')
if (failures.length) {
    console.error(`✗ pack smoke failed: ${failures.length} broken subpath(s)`)
    process.exit(1)
}
console.info('✓ pack smoke passed — every public subpath resolves')
fs.rmSync(workDir, { recursive: true, force: true })
