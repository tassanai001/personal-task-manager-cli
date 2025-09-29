# Phase 0 Research — Offline Task CLI MVP

## Runtime Selection
- **Decision**: Implement the CLI with Node.js 20 and TypeScript 5 compiled with `ts-node` for development and `tsx` for execution.
- **Rationale**: Node.js offers first-class filesystem and process utilities for building CLIs, TypeScript enforces the Task schema, and the environment is readily available on macOS/Linux without extra tooling.
- **Alternatives Considered**:
  - **Python 3.12**: Rich CLI ecosystem, but mixing `click` with TypeScript-style static typing would complicate the toolchain.
  - **Rust**: High performance but significantly longer lead time for an MVP.

## CLI Argument Parsing
- **Decision**: Use the `commander` package to define commands (`add`, `list`, `complete`, `delete`) and shared options such as `--json` and `--priority` filters.
- **Rationale**: `commander` provides declarative command definitions, built-in help/validation, and plays well with TypeScript typings.
- **Alternatives Considered**:
  - **yargs**: Comparable feature set but more verbose configuration.
  - **oclif**: Powerful, yet introduces plugin scaffolding overhead not needed for a single binary CLI.

## Persistence & Atomic Writes
- **Decision**: Store tasks in `~/.ptm/tasks.json` using a temp file strategy: write to `tasks.json.tmp` then `fs.rename` for atomic persistence.
- **Rationale**: Aligns with constitution P2/P4, keeps writes resilient against process crashes, and avoids third-party storage dependencies.
- **Alternatives Considered**:
  - **fs-extra writeJson**: Convenience helpers but adds dependency weight for limited benefit.
  - **SQLite**: Reliable but violates "single JSON file" constraint.

## Identifier & Timestamp Strategy
- **Decision**: Generate UUID v4 identifiers via the `uuid` package and use `new Date().toISOString()` for timestamps.
- **Rationale**: UUIDs avoid collisions across sessions, ISO 8601 aligns with constitution and simplifies sorting.
- **Alternatives Considered**:
  - **Incremental IDs**: Simpler but create race hazards if file edits happen manually.
  - **Nanoid**: Smaller dependency, but UUIDs better match existing tooling expectations.

## Testing Stack
- **Decision**: Use `vitest` for both unit (core/storage) and acceptance (CLI execution via `execa`) tests.
- **Rationale**: Single runner reduces maintenance, supports TypeScript, and offers snapshot/assertion utilities for CLI stdout/stderr.
- **Alternatives Considered**:
  - **Jest**: Overlapping capability but heavier configuration with ESM.
  - **bats**: Shell-based acceptance tests increase duplication when TypeScript already drives integration tests.

## Error Handling & Recovery
- **Decision**: Detect JSON corruption, back up the invalid file to `tasks.json.bak-<timestamp>`, and exit with guidance per spec edge cases.
- **Rationale**: Meets acceptance scenario for corrupted data without losing user tasks.
- **Alternatives Considered**:
  - **Hard failure**: Leaves user with broken store, unacceptable per specification.
  - **Silent overwrite**: Risks data loss; rejected.

## Undo Completion Semantics
- **Decision**: Implement `ptm complete <id> --undo` to revert status to `todo` and clear `completedAt` while keeping `updatedAt` implicit through file timestamp.
- **Rationale**: Directly satisfies clarification session; minimal CLI surface change.
- **Alternatives Considered**:
  - **Separate command (`ptm reopen`)**: Adds command proliferation against constitution P3.
  - **Toggle behavior**: Ambiguous exit states; rejected for clarity.

## User Inputs from /plan Arguments
- **Decision**: No additional user arguments provided for this /plan run.
- **Rationale**: Maintains default assumptions from specification without overrides.
- **Alternatives Considered**: N/A
