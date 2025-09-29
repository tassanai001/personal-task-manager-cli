# Quickstart — Offline Task CLI MVP

## Prerequisites
- Node.js 20.x and npm installed locally (no global network calls during runtime).
- Writable home directory to allow creation of `~/.ptm/tasks.json`.

## Installation
```
# from repository root
npm install
npm run build   # compiles TypeScript to dist/
```

Add the CLI to your PATH during development:
```
export PATH="$(pwd)/bin:$PATH"
```
(The `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/bin/ptm` shim will execute `node dist/cli.js`.)

## First Run
```
ptm list
```
- Creates `~/.ptm/tasks.json` if missing with an empty `tasks` array.
- Returns exit code `0` and prints "No tasks yet" when the store is empty.

## Adding Tasks
```
ptm add --title "Write report" --description "Draft Q3 summary" --priority high
```
Expected output:
```
✔ Added task 3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20 (priority: high)
```
- Exit code: `0`
- Persists the new task with `status="todo"`.

## Listing Tasks
Human-readable:
```
ptm list --priority high
```
Sample output:
```
ID                                   Priority  Status  Title
3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20 high      todo    Write report
```

Structured JSON:
```
ptm list --json
```
Sample output:
```json
{
  "tasks": [
    {
      "id": "3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20",
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

## Completing Tasks
```
ptm complete 3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20
```
Output:
```
✔ Completed task 3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20
```
- Sets `status="done"` and records `completedAt`.
- Exit code: `0`

Undo completion:
```
ptm complete 3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20 --undo
```
Output:
```
↺ Reopened task 3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20
```
- Restores `status="todo"` and clears `completedAt`.

## Deleting Tasks
```
ptm delete 3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20
```
Output:
```
✖ Deleted task 3b1fc8c8-1a8a-4651-89d3-5dbe8bcd9f20
```
- Removes the task from the JSON store.
- Exit code: `0`

## Error Handling
- Missing required flags (e.g., `--title`) emit a validation message on stderr and exit with code `1`.
- Nonexistent IDs trigger an error "Task not found" on stderr and exit code `2`.
- Corrupted `tasks.json` causes the CLI to back up the file to `tasks.json.bak-<timestamp>`, print recovery instructions, and exit with code `3`.

## Cleanup & Recovery
- To reset the store, delete `~/.ptm/tasks.json`; the CLI will recreate it on the next command run.
- Backups remain alongside the store file for manual merge or inspection.

## Next Steps
- Run `npm test` to execute Vitest suites once implementation tasks are complete.
- Update `docs/README.md` and `docs/CHANGELOG.md` to reflect the command usage outlined above during Phase 4.
