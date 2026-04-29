# Build Optional Bundled Deps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Windows build script so bundled plugin dependency verification treats plugin `optionalDependencies` as warnings without modifying the upstream `src` checkout.

**Architecture:** Keep the change local to `build.ps1` by replacing the staging verification inline Node script with a self-contained manifest scan. The script should classify bundled plugin deps as required vs optional directly from `staging/dist/extensions/*/package.json`, then fail only for missing required deps.

**Tech Stack:** PowerShell 5.1, inline Node.js ESM script, existing staging layout under `dist/extensions`

---

### Task 1: Reproduce The Current Failure

**Files:**
- Modify: `d:\code\openclaw-exe\build.ps1`

- [ ] **Step 1: Write the failing test**

Use a one-off PowerShell harness that creates a temporary fake staging root with:
- `scripts/postinstall-bundled-plugins.mjs` exporting no helper
- `dist/extensions/discord/package.json` declaring `@discordjs/opus` under `optionalDependencies`
- no matching root `node_modules/@discordjs/opus/package.json`

- [ ] **Step 2: Run test to verify it fails**

Run the current inline verification command from `build.ps1` against the fake staging root.
Expected: Node fails during `import { collectMissingBundledPluginRuntimeDeps } ...` because the helper export is absent.

### Task 2: Make Verification Self-Contained In build.ps1

**Files:**
- Modify: `d:\code\openclaw-exe\build.ps1`

- [ ] **Step 1: Write minimal implementation**

Replace the inline Node verification script so it:
- reads `dist/extensions/*/package.json`
- merges `dependencies` and `optionalDependencies`
- marks a package as required if any plugin declares it in `dependencies`
- marks a package as optional only if every declaration is optional
- checks root `node_modules/<package>/package.json`
- logs optional misses without exiting
- exits non-zero only for missing required deps

- [ ] **Step 2: Run test to verify it passes**

Re-run the fake staging harness.
Expected: exit code `0`, optional dep is reported as warning/info, no helper import is required.

### Task 3: Verify Against The Real Build Path

**Files:**
- Modify: `d:\code\openclaw-exe\build.ps1`

- [ ] **Step 1: Run targeted verification**

Run the real staging verification command against the current `staging` root or a fresh local build.
Expected: missing optional deps do not fail the build; missing required deps still fail.

- [ ] **Step 2: Run full build verification**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File .\build.ps1 -Local`
Expected: full build succeeds end-to-end.
