#!/usr/bin/env node
// Validates a git branch name against the project's naming convention.
// Single source of truth for the local `pre-push` hook and the CI "Branch name" job.
//
// Convention: <type>/<short-kebab-description>
//   <type> ∈ the same set as `type-enum` in commitlint.config.js
//
// A branch either matches the pattern or is on the exact-match whitelist
// (branches we never create by hand — the default branch and the changesets bot).

import { execSync } from 'node:child_process'

// Keep in sync with `type-enum` in commitlint.config.js.
const TYPES = ['feat', 'fix', 'refactor', 'chore', 'docs', 'test', 'style', 'perf', 'ci', 'revert']

// Bypass the pattern for branches not authored by contributors.
const WHITELIST = ['master', 'changeset-release/master']

const PATTERN = new RegExp(`^(${TYPES.join('|')})/[a-z0-9][a-z0-9._-]*$`)

function resolveBranch() {
    // CI (pull_request) exposes the head branch here; locally we ask git.
    const fromEnv = process.env.GITHUB_HEAD_REF || process.env.BRANCH_NAME
    if (fromEnv) return fromEnv.trim()

    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
}

const branch = resolveBranch()

if (WHITELIST.includes(branch) || PATTERN.test(branch)) {
    console.info(`✓ Branch name "${branch}" is valid.`)
    process.exit(0)
}

console.error(`
✗ Invalid branch name: "${branch}"

Branch names must follow: <type>/<short-kebab-description>
  types: ${TYPES.join(', ')}

Examples:
  feat/add-datepicker
  fix/select-keyboard-nav
  refactor/cfield-types
  chore/update-deps
  docs/tooltip-examples

Rename the current branch:
  git branch -m ${branch} feat/your-description
`)
process.exit(1)
