# Contract — `ptm list`

## Command Synopsis
```
ptm list [--status <todo|done>] [--priority <low|medium|high>] [--json]
```
- Multiple filters combine using logical AND.
- When no sort flag is supplied, results are ordered by `createdAt` descending (newest first).

## Success Responses
### Human-Readable (default)
- stdout: tabular view with header row `ID`, `Priority`, `Status`, `Title`, ordered newest first.
- stderr: empty.
- exit code: `0`.

### JSON Mode (`--json`)
- stdout: serialized payload matching:
```json
{
  "tasks": [
    {
      "id": "<uuid>",
      "title": "<string>",
      "description": "<string|null>",
      "priority": "low|medium|high",
      "status": "todo|done",
      "createdAt": "<ISO8601>",
      "completedAt": "<ISO8601|null>"
    }
  ]
}
```
- stderr: empty.
- exit code: `0`.

## Validation Errors
| Condition | stdout | stderr | exit code |
|-----------|--------|--------|-----------|
| Invalid `--status` value | *(none)* | `Invalid status: <value>. Use todo or done.` | `1` |
| Invalid `--priority` value | *(none)* | `Invalid priority: <value>. Use low, medium, or high.` | `1` |

## Failure Modes
- Corrupted store detection delegates to storage contract, backing up to `tasks.json.bak-<timestamp>` and exiting `3`.
- I/O failures during read surface as `Failed to read task store: <reason>` on stderr with exit code `4`.
