# Personal Task Manager CLI

The Personal Task Manager (`ptm`) is an offline command-line tool for capturing, listing, completing, undoing, and deleting personal tasks stored in a single local JSON file.

## Installation

```bash
# from repository root
npm install
npm run build
```

Add the CLI shim to your `PATH` during development:

```bash
export PATH="$(pwd)/bin:$PATH"
```

The shim calls `node dist/cli/index.js`, so the compiled output must exist (`npm run build`).

## Commands

### `ptm add`

```bash
ptm add --title "Write report" --description "Draft Q3 summary" --priority high
# ✔ Added task 00000000-0000-0000-0000-000000000001 (priority: high)
```

- Title is required.
- Description optional; omitted descriptions persist as `null`.
- Priority accepts `low`, `medium`, or `high` (defaults to `medium`).
- Exit code: `0` on success, `1` on validation errors.

### `ptm list`

```bash
ptm list
# ID                                    Priority  Status  Title
# 00000000-0000-0000-0000-000000000001  high      todo    Write report
```

Filters:

- `--priority <low|medium|high>`
- `--status <todo|done>`
- `--json` emits machine-readable output matching the task schema.

Tasks are ordered newest first (descending `createdAt`).

### `ptm complete`

```bash
ptm complete 00000000-0000-0000-0000-000000000001
# ✔ Completed task 00000000-0000-0000-0000-000000000001

ptm complete 00000000-0000-0000-0000-000000000001 --undo
# ↺ Reopened task 00000000-0000-0000-0000-000000000001
```

- Marks tasks as `done`, recording `completedAt`.
- `--undo` reverts to `todo` and clears `completedAt`.
- Exit codes: `0` success, `2` if the task ID does not exist.

### `ptm delete`

```bash
ptm delete 00000000-0000-0000-0000-000000000001
# ✖ Deleted task 00000000-0000-0000-0000-000000000001
```

Removes the task from the JSON store. Exit codes mirror `ptm complete` (`0` success, `2` for missing IDs).

## Storage & Offline Guarantees

- Store path: `${HOME}/.ptm/tasks.json` (override with `PTM_HOME`).
- Writes use a temp file + rename for atomicity. On corruption, the previous store is backed up to `tasks.json.bak-<timestamp>` before the CLI exits with code `3` and a recovery message.
- No network or telemetry calls; a test harness patches core network modules and fails if any outbound request is attempted.

## Testing & Verification

```bash
npm run lint    # ESLint with TypeScript strict rules
npm test        # Vitest unit + acceptance suites
npm run build   # TypeScript compilation to dist/
```

To enforce the performance/offline requirement (FR-006) independently:

```bash
npx vitest run tests/acceptance/performance.spec.ts
```

The harness seeds 100 tasks, runs every CLI command, asserts ≤200 ms latency per command, and throws if a network primitive is invoked.

## Troubleshooting

- **Validation errors (exit 1):** Check stderr for a descriptive message that includes the failing command and remediation hint.
- **Task not found (exit 2):** Ensure the ID exists (IDs can be copied from `ptm list --json`).
- **Corrupted store (exit 3):** Inspect the generated `tasks.json.bak-<timestamp>` backup, fix the JSON, then rerun the command.
