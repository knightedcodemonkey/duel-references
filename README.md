# duel-references

A minimal, real workspace that mirrors the `projectRefs` test fixture from `duel` without symlink overrides. Use this to manually exercise `duel` against project references and hoisted deps.

## Layout
- Root workspace: `package.json` (workspaces `packages/*`, depends on `hoisted`)
- Packages:
  - `packages/app` (depends on `project-refs-lib` and `hoisted`)
  - `packages/lib` (base lib)
  - `packages/chain-a`, `chain-b`, `chain-c` (reference chain)
  - `packages/custom-app` (depends on `custom-lib` via explicit build tsconfig)
  - `packages/custom-lib` (exports types/js)
  - `packages/hoisted` (dep hoisted to root node_modules)

## Usage
1. Install deps (creates real node_modules with workspace symlinks and installs the local `@knighted/duel` tarball referenced in package.json):
   ```sh
   npm install
   ```

2. Build the workspace so packages emit to their local `dist/` (required; sources no longer ship JS/DTS stubs):
   ```sh
   npm run build --workspaces
   ```

3. Choose how to run `duel` (the default is the local tgz in package.json):
   - Use the packed tgz (already wired via `file:../duel/knighted-duel-*.tgz`): nothing extra to do.
   - Swap to a published build instead:
     ```sh
     npm install @knighted/duel
     ```

4. Run `duel` against the reference packages, e.g.:
   ```sh
   npm run duel:lib
   npm run duel:app
   npm run duel:chain
   npm run duel:custom
   ```

5. Execute the built outputs to sanity-check runtime:
   ```sh
   npm run run:app
   npm run run:custom
   ```

6. Outputs land in `dist/` under each package (e.g., `dist/lib`, `dist/app`).

## Notes
- Nothing under `node_modules` is committed; install before running.
- Type declarations (`index.d.ts`) are intentional parts of the authored fixtures to mimic published packages.

## Future scenarios to exercise
- Alternative package managers and hoisting: try `pnpm`/`yarn` with/without hoist/plug'n'play to validate resolution and temp-copy behavior.
- Non-hoisted deps: add a workspace that depends on a private package without hoisting to ensure duel handles node_modules layouts that mirror production.
- CJS entrypoints: run the generated CJS outputs directly (e.g., `node packages/app/dist/cjs/index.cjs`) to cover both halves of the dual build at runtime.
- Incremental/watch flows: run `tsc -b --watch` plus repeated `duel` invocations to confirm stability with rebuilt tsbuildinfo.
- Path aliases and complex refs: introduce tsconfig path mappings and multi-level references (including optional refs) to stress resolution.
- Version skew: test with different TS versions (e.g., a matrix of 5.3–5.7) to confirm compatibility.
