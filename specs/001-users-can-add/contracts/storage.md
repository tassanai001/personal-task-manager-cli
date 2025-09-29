# Contract — Storage & Recovery

## Atomic Persistence
- Writes occur to `${HOME}/.ptm/tasks.json.tmp` followed by `fs.rename` to `${HOME}/.ptm/tasks.json`.
- After writing, the CLI emits no stdout, stderr remains empty, and the calling command handles messaging.
- Any failure to rename or write surfaces as stderr: `Failed to persist task store: <reason>` with exit code `4`.

## Corruption Handling
1. Attempt to parse the existing JSON before mutation.
2. On failure, copy the unreadable file to `${HOME}/.ptm/tasks.json.bak-<ISO timestamp>`.
3. stderr: `Detected corrupted task store. Backed up to tasks.json.bak-<timestamp>.` and exit code `3`.
4. stdout remains empty; no writes occur to the original file.

## Store Initialization
- When the store path is missing, the CLI creates parent directories (`~/.ptm/`) and persists `{"tasks": []}` via the atomic flow.
- Success exit code propagated from the invoking command (typically `0`).

## Concurrency Assumptions
- CLI assumed to be single-process. If concurrent writes are detected (e.g., `EBUSY`), stderr explains the collision and exits `4`.
