# Quickstart — Offline Task CLI MVP

## Prerequisites
- Node.js 20.x and npm installed locally (no network calls during CLI runtime).
- Writable home directory to allow creation of `~/.ptm/tasks.json` (override with `PTM_HOME` for tests).

## Installation
```bash
# from repository root
npm install
npm run build   # compiles TypeScript to dist/
```

Add the CLI to your PATH during development:
```bash
export PATH="$(pwd)/bin:$PATH"
```
(`bin/ptm` invokes `node dist/cli/index.js`.)

## First Run
```bash
ptm list
```
Output:
```
No tasks yet
```
- Exit code: `0`
- Creates `~/.ptm/tasks.json` with `{ "tasks": [] }` if the store is missing.

## Adding Tasks
```bash
ptm add --title "Write report" --description "Draft Q3 summary" --priority high
```
Output:
```
✔ Added task 00000000-0000-0000-0000-000000000001 (priority: high)
```
- Exit code: `0`
- Persists the task with `status="todo"` and a generated UUID v4.

Adding a second task without `--priority` defaults to `medium`:
```
ptm add --title "Plan sprint"
✔ Added task 00000000-0000-0000-0000-000000000002 (priority: medium)
```

## Listing Tasks
```bash
ptm list
```
Table output (newest first):
```
ID                                    Priority  Status  Title
00000000-0000-0000-0000-000000000002  medium    todo    Plan sprint
00000000-0000-0000-0000-000000000001  high      todo    Write report
```

JSON mode:
```bash
ptm list --json
```
```
{
  "tasks": [
    {
      "id": "00000000-0000-0000-0000-000000000002",
      "title": "Plan sprint",
      "description": null,
      "priority": "medium",
      "status": "todo",
      "createdAt": "2025-09-29T17:00:00.000Z",
      "completedAt": null
    },
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "title": "Write report",
      "description": "Draft Q3 summary",
      "priority": "high",
      "status": "todo",
      "createdAt": "2025-09-29T16:45:00.000Z",
      "completedAt": null
    }
  ]
}
```

Filters:
- `--priority <low|medium|high>`
- `--status <todo|done>`

## Completing Tasks
```bash
ptm complete 00000000-0000-0000-0000-000000000001
```
Output:
```
✔ Completed task 00000000-0000-0000-0000-000000000001
```
- Sets `status="done"` and stamps `completedAt`.

Undo completion:
```bash
ptm complete 00000000-0000-0000-0000-000000000001 --undo
```
Output:
```
↺ Reopened task 00000000-0000-0000-0000-000000000001
```
- Restores `status="todo"` and clears `completedAt`.

## Deleting Tasks
```bash
ptm delete 00000000-0000-0000-0000-000000000002
```
Output:
```
✖ Deleted task 00000000-0000-0000-0000-000000000002
```
- Removes the task from the JSON store.

## Error Handling
- Missing required flags emit descriptive validation errors on stderr and exit with code `1`.
- Unknown task IDs surface `Task not found: <id>` on stderr and exit with code `2`.
- Corrupted stores trigger a backup (`tasks.json.bak-<timestamp>`), an instructional message, and exit with code `3`.

## Cleanup & Recovery
- Delete `~/.ptm/tasks.json` to reset; the CLI will recreate it on the next command run.
- Inspect backups (`tasks.json.bak-*`) to recover data after corruption.

## Performance & Offline Verification
```bash
npx vitest run tests/acceptance/performance.spec.ts
```
- Seeds 100 tasks, runs every CLI command, and enforces the ≤200 ms latency target.
- Throws if any network primitive (`net`, `http`, `https`, `dns`) is invoked.

## Next Steps
- Run `npm test` to execute the full Vitest suite (includes acceptance + performance harness).
- Keep `docs/README.md` and `docs/CHANGELOG.md` updated when shipping new functionality.
