# Implementation Plan: Offline Task CLI MVP

**Branch**: `001-users-can-add` | **Date**: 2025-09-29 | **Spec**: /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/spec.md
**Input**: Feature specification from /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/spec.md

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Capture target runtime (e.g., Node.js, Python, Go) and CLI expectations
   → Record storage path strategy and testing approach
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Deliver an offline-first `ptm` CLI that lets a solo operator add, list, complete with `--undo`, and delete tasks while persisting to a single JSON file. The plan follows the spec clarifications by keeping all behavior offline, enforcing a ≤200 ms latency cap for up to 100 tasks, and scheduling an automated performance/offline verification harness to guard the new requirement.

## Technical Context
**Language/Version**: Node.js 20.x with TypeScript 5 in strict mode  
**Primary Dependencies**: commander (CLI wiring), uuid (ID generation), vitest + @vitest/coverage-istanbul (tests/coverage), execa (acceptance CLI harness)  
**Storage**: Local JSON store at `${HOME}/.ptm/tasks.json` with atomic temp-file writes and timestamped corruption backups  
**Testing**: Vitest driving unit and acceptance suites via execa; new automated performance harness seeded with 100 tasks to enforce ≤200 ms + offline rules  
**Target Platform**: macOS and Linux terminals for a single local operator  
**Project Type**: Single CLI binary compiled to `dist/` and executed via Node shim  
**Performance Goals**: Each command completes in ≤200 ms with a 100-task store; harness fails if latency or offline guarantees regress  
**Constraints**: Operate entirely offline, no telemetry, single JSON data store, deterministic exit codes, human + `--json` outputs  
**Scale/Scope**: One user profile managing up to 100 concurrent tasks; no multi-user or sync features

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] P1 — Follow SDD Flow: Plan remains within `/specify → /plan → /tasks` and references only authorized artifacts.
- [x] P2 — Simple, Local, No-Network: Retains single JSON storage, offline operation, and bans telemetry.
- [x] P3 — Clear CLI UX: Commands stay limited to add, list, complete (`--undo`), delete with deterministic exit codes and JSON output support.
- [x] P4 — Data Model Is the Source of Truth: Task schema (UUID id, ISO timestamps, status/priority) locked in data-model.md; storage honors atomic writes.
- [x] P5 — Minimum Quality Gates: Acceptance/unit suites, docs, coverage ≥90%, and the new performance harness are scheduled prior to implementation.
- [x] Definition of Done: Plan covers CLI behavior, persistence, tests, docs, offline guarantee, and performance validation.

## Project Structure

### Documentation (this feature)
```
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/
├── plan.md              # This file (/plan output)
├── research.md          # Phase 0 research
├── data-model.md        # Phase 1 entity definitions
├── quickstart.md        # Phase 1 scripted walkthrough
├── contracts/           # Phase 1 CLI/storage contracts
└── tasks.md             # Phase 2 output (/tasks command)
```

### Source Code (repository root)
```
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/
├── cli/             # Commander entry point + command handlers
├── core/            # Task entities, services, validation
└── storage/         # JSON persistence helpers (atomic writes)

/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/
├── acceptance/      # Vitest + execa flows for CLI commands
├── unit/            # Storage/domain unit specs
└── fixtures/        # Shared helpers (temp HOME, UUID stubs)

/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/docs/
├── README.md        # User-facing instructions
└── CHANGELOG.md     # Release notes
```

**Structure Decision**: Implementation keeps CLI surfaces under `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli`, domain/state logic in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/core`, persistence helpers in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/storage`, and Vitest coverage under `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests`, matching repository guidelines and constitution principles.

## Phase 0: Outline & Research
- Validated runtime, CLI stack, storage path, UUID/timestamp strategy, undo semantics, and corruption recovery decisions in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/research.md`.
- Captured best practices for Commander, atomic JSON writes, and Vitest-driven acceptance flows using execa.
- Confirmed no outstanding clarifications remain after the FR-006 verification update; research log notes the new performance harness requirement to prevent regressions.

**Output**: `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/research.md`

## Phase 1: Design & Contracts
- Described Task and TaskStore entities, validation rules (priority enum, status transitions, timestamps) in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/data-model.md`.
- Authored CLI/storage contracts under `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/contracts/` covering add, list, complete `--undo`, delete, storage atomicity, and the new performance harness expectations.
- Documented end-to-end flows, including human + JSON outputs and performance verification, in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/quickstart.md`.
- Ran `.specify/scripts/bash/update-agent-context.sh codex` to sync `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/AGENTS.md` with current technology choices.

**Output**: `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/data-model.md`, `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/contracts/`, `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/quickstart.md`, updated `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/AGENTS.md`

## Phase 2: Task Planning Approach
- `/tasks` will pull from contracts and quickstart to author failing acceptance specs for each command plus the automated performance/offline verification harness.
- Unit tests will cover storage atomic writes, validation failures, undo transitions, and performance guard helpers.
- Implementation tasks will sequence: toolchain setup → failing tests (acceptance + performance + unit) → domain/storage services → CLI commands/presenters → distribution assets → docs and final validation.
- Documentation tasks will refresh README usage, CHANGELOG entry, and quickstart transcripts captured from passing CLI runs.
- A dedicated task will add the performance harness between the existing test phase and polish phase to enforce FR-006.

**Estimated Output**: 25–27 ordered tasks with `[P]` markers for parallelizable specs and polish work while guarding shared files.

## Phase 3+: Future Implementation
- **Phase 3**: `/tasks` generates the executable backlog with the added performance/offline verification task.
- **Phase 4**: Implement tasks in order, keeping CLI offline, wiring the harness, and maintaining atomic storage semantics.
- **Phase 5**: Run `npm run lint`, `npm test`, `npm run build`, execute the quickstart + performance harness, archive results in `validation.log`, and ensure coverage ≥90%.

## Complexity Tracking
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| *(None)* | — | — |

## Progress Tracking
**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.1 - See `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/.specify/memory/constitution.md`*