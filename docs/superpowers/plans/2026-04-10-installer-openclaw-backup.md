# OpenClaw Installer Backup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a silent pre-install backup of the current user's `.openclaw` directory, keep only the newest two backups, and never block installation if backup fails.

**Architecture:** Implement the backup flow directly in `installer/setup.iss` using Inno Setup Pascal scripting. Resolve the target profile from the original setup user when possible, recursively copy `.openclaw` into a sibling `.openclaw-backups` directory, then prune older `install-backup-*` folders.

**Tech Stack:** Inno Setup Pascal scripting, built-in file helpers, `ExecAsOriginalUser`, Inno Setup compiler verification

---

### Task 1: Add installer backup helpers

**Files:**
- Modify: `installer/setup.iss`
- Verify: `tools/innosetup/ISCC.exe installer/setup.iss`

- [ ] Add constants and helper functions for profile resolution, recursive directory copy, and backup pruning.
- [ ] Keep backup failures non-fatal by logging and exiting the backup routine instead of returning an installer error.

### Task 2: Hook backup into pre-install flow

**Files:**
- Modify: `installer/setup.iss`
- Verify: `tools/innosetup/ISCC.exe installer/setup.iss`

- [ ] Add a `PrepareToInstall` handler that invokes the backup routine before file installation starts.
- [ ] Keep the return value empty so installation continues even when backup is skipped or fails.

### Task 3: Verify compiler behavior

**Files:**
- Verify: `tools/innosetup/ISCC.exe installer/setup.iss`

- [ ] Compile a temporary TDD harness that references the new backup routine before implementation to confirm the symbol is missing.
- [ ] Compile the real installer script after implementation and confirm the compiler exits successfully.
