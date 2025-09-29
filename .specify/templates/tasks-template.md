# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: runtime, storage path, CLI command scope
2. Load optional design documents:
   → data-model.md: Extract entities, validation, state transitions
   → contracts/: Each command contract → acceptance test task
   → quickstart.md: Primary walkthrough → documentation + smoke tasks
3. Generate tasks by category:
   → Setup: environment prep, JSON storage path, config scaffolding
   → Tests: acceptance (CLI) + unit (storage/domain)
   → Core: domain services, storage adapters, CLI command handlers
   → Docs & Release: README, CHANGELOG, compliance checks
4. Apply task rules:
   → Tests precede implementation (TDD)
   → Commands sharing files stay sequential (no [P])
   → Independent files/modules qualify for [P]
5. Number tasks sequentially (T001, T002...)
6. Build dependency graph from plan.md structure
7. Provide parallel execution guidance for independent tasks
8. Validate coverage:
   → All principles P1–P5 satisfied
   → Definition of Done deliverables represented
   → No network/telemetry tasks introduced
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include explicit file paths and command names in descriptions

## Path Conventions
```
src/
├── cli/             # CLI entrypoints and argument parsing
├── core/            # task domain logic (create/list/complete/delete)
├── storage/         # JSON persistence + atomic write helpers
└── utils/           # shared helpers (logging, validation)

tests/
├── acceptance/      # end-to-end CLI scenarios using temporary JSON file
└── unit/            # domain logic and storage tests

docs/
├── README.md
└── CHANGELOG.md
```

## Phase 3.1: Setup
- [ ] T001 Confirm JSON storage path and bootstrap fixture data under `tests/fixtures/`.
- [ ] T002 Configure dependency/tooling prerequisites (e.g., install CLI parsing library, update lockfiles).
- [ ] T003 [P] Update `.specify/scripts` or config files if new commands/flags are introduced.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 Acceptance test `ptm add` success + validation errors in `tests/acceptance/test_add_command.py`.
- [ ] T005 [P] Acceptance test `ptm list` filters + `--json` output in `tests/acceptance/test_list_command.py`.
- [ ] T006 [P] Acceptance test `ptm complete <id>` state transition in `tests/acceptance/test_complete_command.py`.
- [ ] T007 [P] Acceptance test `ptm delete <id>` removal + nonexistent ID handling in `tests/acceptance/test_delete_command.py`.
- [ ] T008 Unit tests for storage read/write + atomic rename in `tests/unit/test_storage.py`.

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 Implement storage module (`src/storage/json_store.{py|ts|go}`) with atomic writes.
- [ ] T010 [P] Implement task domain services (`src/core/tasks_service.{py|ts|go}`) covering add/list/complete/delete logic.
- [ ] T011 [P] Implement CLI command handlers in `src/cli/commands.{py|ts|go}` with exit codes.
- [ ] T012 [P] Wire `--json` serialization helpers and ensure schema matches constitution (UUID, timestamps).
- [ ] T013 Handle validation and error messaging (stderr) shared across commands.

## Phase 3.4: Persistence & Validation
- [ ] T014 Ensure storage path resolution respects plan.md (default path + override flag).
- [ ] T015 [P] Implement migration/backfill if schema changes (e.g., add `priority`).
- [ ] T016 [P] Add logging/debug output (human + JSON) while staying offline.

## Phase 3.5: Docs & Polish
- [ ] T017 Update README with new usage examples, flags, and storage location notes.
- [ ] T018 [P] Append CHANGELOG entry summarizing CLI changes and version bump.
- [ ] T019 [P] Add developer quickstart or troubleshooting notes to quickstart.md.
- [ ] T020 [P] Run all tests, capture command transcripts, and attach to release notes if required.

## Dependencies
- Phase 3.2 (tests) must complete before Phase 3.3 implementation tasks.
- Storage (T009) precedes domain services (T010) and CLI handlers (T011).
- Validation/error handling (T013) depends on domain services.
- Documentation tasks (T017-T020) require all commands to function.

## Parallel Example
```
# Launch independent acceptance tests together once fixtures ready:
Task: "Acceptance test ptm list filters + --json output"
Task: "Acceptance test ptm complete <id> state transition"
Task: "Acceptance test ptm delete <id> removal + nonexistent ID handling"
```

## Notes
- Honor P2 by avoiding network calls in tasks and tests; prefer temp directories.
- Tag any migration work clearly; schema changes must include upgrade path.
- Commit after each task to preserve audit trail expected by P1/P5.

## Task Generation Rules
1. **From Command Contracts**:
   - Each command/flag scenario → acceptance test task
   - Document stdout/stderr expectations explicitly
2. **From Data Model**:
   - Each field/state change → storage and domain tasks
   - Atomic write/migration work must be explicit tasks
3. **From Quickstart**:
   - Steps in quickstart.md → doc or validation tasks
   - Error walkthroughs → negative test tasks
4. **Ordering**:
   - Tests → domain/storage → CLI → docs/polish
   - [P] only for tasks in different files with no runtime dependency

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] Every CLI command (add, list, complete, delete) has acceptance test + implementation task
- [ ] Storage schema changes have unit tests and migration tasks
- [ ] Tasks ensure README + CHANGELOG updates (DoD compliance)
- [ ] No task introduces network usage or telemetry
- [ ] Parallel tasks touch independent files only