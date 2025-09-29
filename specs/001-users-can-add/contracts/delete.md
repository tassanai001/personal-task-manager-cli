# Contract — `ptm delete`

## Command Synopsis
```
ptm delete <taskId>
```
- Removes the task from the JSON store.

## Success Response
- stdout: `✖ Deleted task <taskId>`
- stderr: empty
- exit code: `0`

## Validation Errors
| Condition | stdout | stderr | exit code |
|-----------|--------|--------|-----------|
| Missing `taskId` | *(none)* | `Task ID is required.` | `1` |
| Task not found | *(none)* | `Task <taskId> not found.` | `2` |

## Failure Modes
- Corrupted store or atomic write issues propagate as described in storage contract (exit `3` or `4`).
