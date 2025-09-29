# Changelog

## 0.1.0 — Offline Task CLI MVP (2025-09-29)
- Added Commander-based CLI with `add`, `list`, `complete --undo`, and `delete` commands.
- Implemented Task/TaskStore domain, JSON storage service with atomic writes, and corruption backup handling.
- Introduced Vitest acceptance suite (including performance/offline harness) and unit specs for storage and domain validation.
- Documented installation, usage, and recovery workflows; wired `bin/ptm` shim to compiled output.
