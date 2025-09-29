# Implementation Plan: Offline Task CLI MVP

**Branch**: `001-users-can-add` | **Date**: 2025-09-29 | **Spec**: /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/spec.md
**Input**: Feature specification from /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/spec.md

## Summary
Deliver an offline-first `ptm` CLI that lets a single operator add, list, complete (with `--undo`), and delete tasks while persisting to a single JSON file. Implementation relies on Node.js 20 with TypeScript 5, Commander for command wiring, Vitest with Execa for TDD, and atomic storage with corruption backups so the tool remains responsive for stores of up to 100 tasks.

## Technical Context
**Language/Version**: Node.js 20.x with TypeScript 5 strict mode  
**Primary Dependencies**: commander (CLI), uuid (ID generation), vitest & @vitest/coverage-istanbul (tests/coverage), execa (acceptance harness)  
**Storage**: Local JSON at `${HOME}/.ptm/tasks.json` persisted via temp-file write + rename with corruption backups  
**Testing**: Vitest for unit and acceptance specs executed through `npm test` with Execa subprocess orchestration  
**Target Platform**: macOS and Linux terminals for a single local operator  
**Project Type**: Single CLI binary compiled to `dist/` and executed via bin shim  
**Performance Goals**: Commands complete in <200 ms and remain stable for ≤100 tasks as specified in clarifications  
**Constraints**: Offline-only execution, no telemetry, single JSON store, deterministic exit codes, human + JSON outputs per constitution  
**Scale/Scope**: Single task store for one user profile, sustaining ≤100 concurrent tasks without degradation  
**Additional Inputs**: No supplemental arguments provided for this /plan run

## Constitution Check
- [x] P1 — Follow SDD Flow: Working within `/specify → /plan`; artifacts scoped to /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/
- [x] P2 — Simple, Local, No-Network: Plan maintains offline JSON persistence with atomic writes
- [x] P3 — Clear CLI UX: Command set remains `add`, `list`, `complete --undo`, `delete` with deterministic exit codes
- [x] P4 — Data Model Is the Source of Truth: Task schema locked to UUID/timestamp contract; storage design honors atomicity
- [x] P5 — Minimum Quality Gates: Tests, docs, and lint tasks scheduled before implementation
- [x] Definition of Done: Plan covers CLI behavior, persistence, tests, docs, and no-network guarantee

## Project Structure
```
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/core
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/storage
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/acceptance
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/unit
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/docs
```

**Structure Decision**: Implementation keeps CLI surfaces in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli, domain/state logic in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/core, persistence helpers in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/storage, with Vitest coverage under /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests per repository guidelines.

## Phase 0: Outline & Research
- Consolidated runtime, CLI stack, storage, ID/timestamp, testing, undo semantics, and corruption recovery decisions in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/research.md.
- Validated clarifications from Session 2025-09-29 (undo support, default priority `medium`, newest-first listing, backup strategy) and recorded that no additional /plan arguments were supplied.
- Confirmed there are no remaining `[NEEDS CLARIFICATION]` markers; Phase 0 requirements satisfied.

## Phase 1: Design & Contracts
- Documented Task schema, validation rules, state transitions, and persistence guidelines in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/data-model.md, aligning with clarified undo and backup behavior.
- Authored CLI contracts in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/contracts/ and user-facing flows in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/quickstart.md, covering human and JSON outputs alongside validation errors and exit codes.
- Ran `.specify/scripts/bash/update-agent-context.sh codex` to sync /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/AGENTS.md with current tooling decisions.
- Post-design constitution check confirms continued compliance with P1–P5 and the Definition of Done.

## Phase 2: Task Planning Approach
- Captured dependency-ordered tasks in /Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/tasks.md, sequencing setup → failing tests → models → storage/core services → CLI wiring → docs/QA to preserve TDD.
- Tasks include acceptance/unit coverage for each command, storage resilience work, documentation updates, and final validation gates, preparing for the `/tasks` execution step.

## Complexity Tracking
_No deviations requiring justification._

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
