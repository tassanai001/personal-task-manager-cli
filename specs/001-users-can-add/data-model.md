# Data Model — Offline Task CLI MVP

## Entities

### Task
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID v4) | Yes | Stable identifier generated at creation time. |
| `title` | `string` | Yes | Short description of the task (1–140 characters after trim). |
| `description` | `string \| null` | No | Optional free-form details; persisted as `null` when omitted. |
| `priority` | `"low" \| "medium" \| "high"` | Yes | Task urgency level. Defaults to `medium` when the flag is absent. |
| `status` | `"todo" \| "done"` | Yes | Current lifecycle state. Initialized to `todo`. |
| `createdAt` | `string` (ISO 8601) | Yes | Timestamp recorded when the task is added. |
| `completedAt` | `string \| null` (ISO 8601) | Yes | Timestamp recorded when the task transitions to `done`; cleared to `null` on undo. |

### TaskStore
| Field | Type | Description |
|-------|------|-------------|
| `tasks` | `Task[]` | Array of tasks persisted in insertion order; CLI queries apply filtering and sort by `createdAt` descending when no explicit sort is provided. |

## Relationships & Derived Views
- `TaskStore.tasks` contains all Task records; no nested collections or foreign keys.
- CLI listing operations filter by `status` and/or `priority` and default to newest-first ordering.

## Validation Rules
1. `title` must be non-empty after trimming and no longer than 140 characters.
2. `priority` must match `low`, `medium`, or `high`; invalid values trigger CLI validation errors with exit code `1`.
3. `status` transitions only between `todo` and `done` and must correspond to `completedAt` (`done` ⇒ timestamp, `todo` ⇒ `null`).
4. Task IDs must be unique; duplicates cause the CLI to reject the operation and surface an error.
5. Persisted JSON must match `{ "tasks": Task[] }`; missing keys or alternate shapes imply corruption and trigger recovery.
6. Re-opened tasks (`--undo`) require an existing `done` state; attempting to undo a `todo` task returns an error without mutation.

## State Transitions
| Command | Preconditions | Effects |
|---------|---------------|---------|
| `ptm add` | Store file readable (creates if absent). | Appends new Task with `status="todo"`, `createdAt=now`, `completedAt=null`. Writes atomically. |
| `ptm list` | Store file readable. | Pure read. Applies filters and sorts newest-first when no sort flag is supplied. |
| `ptm complete <id>` | Task exists. | Sets `status="done"`, `completedAt=now`. Writes atomically. |
| `ptm complete <id> --undo` | Task exists with `status="done"`. | Sets `status="todo"`, `completedAt=null`. Writes atomically. |
| `ptm delete <id>` | Task exists. | Removes task from array. Writes atomically. |

## Persistence Strategy
- Resolve the data path to `${HOME}/.ptm/tasks.json`; ensure parent directories exist before writes.
- Persist via temp file: write JSON to `${path}.tmp`, `fsync`, then rename to `${path}` to guarantee durability.
- On corrupted JSON parse, back up the original file to `${path}.bak-${ISO timestamp}` and inform the user before exiting with a non-zero code.
- The CLI assumes single-process access; filesystem conflicts (e.g., `EBUSY`) surface explicit errors and abort the command with exit code `4`.

## Indexing & Performance Notes
- Primary lookups by `id` occur in-memory; dataset targeted at ≤100 tasks, so linear search is acceptable.
- Sorting by `createdAt` or `priority` happens on demand when commands execute; no persisted indexes required.

## Future Considerations (Out of Scope)
- Multi-profile support or alternate storage backends (SQLite, cloud sync) remain explicitly excluded per the constitution.
- Additional fields (due dates, tags) would require schema revisions and new migrations beyond this MVP.
