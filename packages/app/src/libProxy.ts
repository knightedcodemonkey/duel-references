import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { basename, dirname, resolve } from 'node:path'

const req = createRequire(import.meta.url)
const from = dirname(fileURLToPath(import.meta.url))
const monorepoRoot = resolve(from, '..', '..')
// Intentionally load the sibling lib's built CJS output to exercise duel's dual-build (ESM + CJS) behavior.
const libPath = resolve(monorepoRoot, 'lib', 'dist', 'cjs', 'index.cjs')
const { lib } = req(libPath)

export { lib }
