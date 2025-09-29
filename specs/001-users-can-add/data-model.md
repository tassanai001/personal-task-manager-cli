# Data Model — Offline Task CLI MVP

## Entities

### Task
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID v4) | Yes | Stable identifier for each task. Generated at creation time. |
| `title` | `string` | Yes | Short description of the task (1–140 chars). |
| `description` | `string \| null` | No | Optional free-form details. Stored as empty string in CLI unless `--description` omitted. |
| `priority` | `"low" \| "medium" \| "high"` | Yes | Task urgency level. Defaults to `medium` when omitted. |
| `status` | `"todo" \| "done"` | Yes | Current lifecycle state. Initialized to `todo`. |
| `createdAt` | `string` (ISO 8601) | Yes | Timestamp recorded when task is added. |
| `completedAt` | `string \| null` (ISO 8601) | Yes | Timestamp when task is marked done; set to `null` otherwise or when undone. |

### TaskStore
| Field | Type | Description |
|-------|------|-------------|
| `tasks` | `Task[]` | Array of tasks sorted by `createdAt` ascending when persisted. |

## Relationships & Derived Views
- `TaskStore.tasks` contains all Task records; no foreign keys or nested collections.
- Listing commands filter and sort tasks in-memory based on `priority` or `status` flags.

## Validation Rules
1. `title` must be non-empty after trimming and no longer than 140 characters.
2. `priority` must match `low`, `medium`, or `high`; invalid values trigger CLI validation errors.
3. `status` transitions only between `todo` and `done`.
4. `completedAt` must be non-null only when `status === "done"`.
5. Task IDs must be unique; duplicates cause the CLI to reject operations until resolved.
6. The persisted JSON must match `{ "tasks": Task[] }`; missing `tasks` key implies corruption.

## State Transitions
| Command | Preconditions | Effects |
|---------|---------------|---------|
| `ptm add` | Store file readable (creates if absent). | Appends new Task with `status="todo"`, `createdAt=now`, `completedAt=null`. Writes atomically. |
| `ptm list` | Store file readable. | Pure read. Applies optional filters and formatting. |
| `ptm complete <id>` | Task exists. | Sets `status="done"`, `completedAt=now`. Writes atomically. |
| `ptm complete <id> --undo` | Task exists with `status="done"`. | Sets `status="todo"`, `completedAt=null`. Writes atomically. |
| `ptm delete <id>` | Task exists. | Removes task from array. Writes atomically. |

## Persistence Strategy
- Resolve data path to `${HOME}/.ptm/tasks.json`; ensure parent directories exist before writes.
- Persist via temp file: write JSON to `${path}.tmp`, `fsync`, then `rename` to `${path}` to guarantee durability.
- On corrupted JSON parse, back up original file to `${path}.bak-${ISO timestamp}` and inform the user before exiting with non-zero code.
- CLI ensures atomicity by serializing writes with file locks at application level (single process) and sequential command execution.

## Indexing & Performance Notes
- Primary lookups by `id` occur in-memory; dataset expected ≤5k items, so linear search acceptable.
- Sorting by `createdAt` or `priority` performed at read time; no persisted indexes required.

## Future Considerations (Out of Scope)
- Multi-profile support or alternate storage backends (SQLite, cloud) remain explicitly excluded per constitution.
- Additional fields (due dates, tags) would require schema revision and new migrations beyond this MVP.
