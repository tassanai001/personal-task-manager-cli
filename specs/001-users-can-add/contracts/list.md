# Contract — `ptm list`

## Command Synopsis
```
ptm list [--status <todo|done>] [--priority <low|medium|high>] [--json]
```
- Multiple filters combine (logical AND).
- If no filters supplied, all tasks ordered by `createdAt` ascending.

## Success Responses
### Human-Readable (default)
- stdout: tabular view with header row `ID`, `Priority`, `Status`, `Title`.
- stderr: empty
- exit code: `0`

### JSON Mode (`--json`)
- stdout: serialized payload matching `{
