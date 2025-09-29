# Contract — `ptm add`

## Command Synopsis
```
ptm add --title <string> [--description <string>] [--priority <low|medium|high>]
```
- Default priority: `medium`.
- Omitting `--description` persists the field as `null` in the store.

## Success Response
- stdout: `✔ Added task <uuid> (priority: <priority>)`
- stderr: empty
- exit code: `0`
- Store mutation: append new Task with `status="todo"`, `createdAt=ISO`, `completedAt=null`.

## Validation Errors
| Condition | stdout | stderr | exit code |
|-----------|--------|--------|-----------|
| Missing `--title` | *(none)* | `Title is required (use --title "...")` | `1` |
| Invalid `--priority` value | *(none)* | `Invalid priority: <value>. Use low, medium, or high.` | `1` |

## Failure Modes
- JSON parse failure before write → delegate to storage contract to back up corrupt file and abort without mutation.
