# Contract — `ptm complete`

## Command Synopsis
```
ptm complete <taskId> [--undo]
```
- `taskId` must match an existing Task `id`.
- `--undo` toggles the task back to `todo`.

## Success Responses
| Mode | stdout | stderr | exit code | Store Mutation |
|------|--------|--------|-----------|----------------|
| Complete | `✔ Completed task <taskId>` | empty | `0` | Sets `status="done"`, `completedAt=now`. |
| Undo | `↺ Reopened task <taskId>` | empty | `0` | Sets `status="todo"`, `completedAt=null`. |

## Validation Errors
| Condition | stdout | stderr | exit code |
|-----------|--------|--------|-----------|
| Missing `taskId` | *(none)* | `Task ID is required.` | `1` |
| Task not found | *(none)* | `Task <taskId> not found.` | `2` |
| `--undo` on already `todo` task | *(none)* | `Task <taskId> is not completed.` | `2` |

## Failure Modes
- Corrupted store backup & abort (exit `3`).
- Atomic write failure surfaces filesystem error on stderr and exits `4`.
