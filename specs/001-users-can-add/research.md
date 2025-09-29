# Phase 0 Research — Offline Task CLI MVP

## Runtime Selection
- **Decision**: Build the CLI with Node.js 20 and TypeScript 5, bundling via `tsx` for development and compiling to `dist/` for releases.
- **Rationale**: Node offers first-class filesystem APIs for atomic writes, TypeScript enforces the Task schema, and the stack aligns with repository tooling.
- **Alternatives Considered**:
  - **Python 3.12**: Mature CLI tooling (`click`), but mixing Python with an otherwise TypeScript repo increases friction.
  - **Rust**: High performance yet slower iteration speed for this MVP.

## CLI Argument Parsing
- **Decision**: Use the `commander` package to define `add`, `list`, `complete`, and `delete` commands plus shared flags such as `--priority`, `--status`, `--json`, and `--undo`.
- **Rationale**: Commander delivers declarative command wiring, help output, and integrates cleanly with TypeScript definitions.
- **Alternatives Considered**:
  - **yargs**: Comparable capability but more verbose configuration.
  - **oclif**: Adds plugin overhead that is unnecessary for a single-binary CLI.

## Listing & Sorting Defaults
- **Decision**: When users omit explicit sort options, `ptm list` will sort tasks by `createdAt` descending (newest first) while still supporting filters for `status` and `priority`.
- **Rationale**: Aligns with Session 2025-09-29 clarification and matches operator expectations when reviewing recent work.
- **Alternatives Considered**:
  - **Ascending order**: Easier to append, but conflicts with clarified requirement.
  - **Configurable default**: Adds scope beyond MVP and complicates UX.

## Persistence & Atomic Writes
- **Decision**: Persist to `${HOME}/.ptm/tasks.json` using a temp file strategy (`tasks.json.tmp` + `fs.rename`) with `tasks.json.bak-<timestamp>` backups on parse failure.
- **Rationale**: Satisfies constitution P2/P4, prevents partial writes, and protects user data during corruption events.
- **Alternatives Considered**:
  - **fs-extra writeJson**: Convenience helper but adds dependency weight for minimal gain.
  - **SQLite**: Reliable yet violates "single JSON file" constraint.

## Identifier & Timestamp Strategy
- **Decision**: Generate UUID v4 identifiers with the `uuid` package and record timestamps using `new Date().toISOString()`.
- **Rationale**: UUIDs avoid collisions across sessions; ISO 8601 timestamps simplify sorting and auditing.
- **Alternatives Considered**:
  - **Incremental IDs**: Simpler but break when files are edited manually or tasks are merged.
  - **Nanoid**: Smaller dependency, but UUIDs align with tooling expectations.

## Testing Stack
- **Decision**: Use `vitest` for both unit (core/storage) and acceptance (CLI via `execa`) tests, targeting ≥90% coverage.
- **Rationale**: Single runner reduces maintenance, supports TypeScript out of the box, and integrates with coverage tooling.
- **Alternatives Considered**:
  - **Jest**: Similar capability but heavier ESM configuration.
  - **bats**: Shell tests would duplicate logic already covered by TypeScript integration tests.

## Performance & Offline Verification
- **Decision**: Add a dedicated Vitest acceptance harness that seeds a 100-task store, times `ptm` commands, and fails if latency exceeds ≤200 ms or a network call is attempted.
- **Rationale**: Provides automated enforcement for FR-006 and constitution principles P2/P5 without relying on manual timing.
- **Alternatives Considered**:
  - **Manual benchmarking**: Prone to drift and lacks CI gate.
  - **External profiling tool**: Adds dependencies and potential network access in conflict with P2.

## Error Handling & Recovery
- **Decision**: Detect JSON corruption, back up the invalid file to `tasks.json.bak-<timestamp>`, and exit with actionable guidance before retrying writes.
- **Rationale**: Meets specification edge cases without risking silent data loss.
- **Alternatives Considered**:
  - **Hard failure without backup**: Leaves users stranded with a broken store.
  - **Silent overwrite**: Discards data and conflicts with resilience goals.

## Undo Completion Semantics
- **Decision**: Support `ptm complete <id> --undo` to revert status to `todo`, clearing `completedAt` while preserving other metadata.
- **Rationale**: Directly satisfies clarification allowing re-opening tasks without adding new commands.
- **Alternatives Considered**:
  - **Separate `ptm reopen` command**: Expands CLI surface against constitution P3.
  - **Toggle behavior**: Introduces ambiguous state transitions.

## User Inputs from /plan Arguments
- **Decision**: No additional user arguments were provided with this /plan invocation.
- **Rationale**: Maintain defaults from the feature specification and clarifications.
- **Alternatives Considered**: N/A
