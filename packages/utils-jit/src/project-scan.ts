import * as fs from 'node:fs'
import * as path from 'node:path'

import {
    matchesPattern,
    normalizePath,
    shouldProcess,
} from './core'
import type { Pattern, ResolvedJitOptions } from './types'

function isExcluded(file: string, exclude: Pattern[]): boolean {
    return exclude.some((pattern) => matchesPattern(file, pattern))
}

export function isSameFile(a: string, b: string): boolean {
    return normalizePath(path.resolve(a)) === normalizePath(path.resolve(b))
}

export function readFileSafe(file: string): string | null {
    try {
        return fs.readFileSync(file, 'utf8')
    } catch {
        return null
    }
}

export function collectProjectFiles(
    root: string,
    include: ResolvedJitOptions['include'],
    exclude: ResolvedJitOptions['exclude'],
    outFile: string,
): string[] {
    const files: string[] = []

    function walk(dir: string): void {
        if (isExcluded(dir, exclude)) {
            return
        }

        let entries: fs.Dirent[]

        try {
            entries = fs.readdirSync(dir, { withFileTypes: true })
        } catch {
            return
        }

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)

            if (entry.isDirectory()) {
                walk(fullPath)
                continue
            }

            if (!entry.isFile()) {
                continue
            }

            if (isSameFile(fullPath, outFile)) {
                continue
            }

            if (shouldProcess(fullPath, include, exclude)) {
                files.push(fullPath)
            }
        }
    }

    walk(root)

    return files
}
