# Tasks: Offline Task CLI MVP

**Input**: Design documents from `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md to confirm runtime (Node.js 20 + TypeScript 5), CLI scope, and storage path `${HOME}/.ptm/tasks.json`.
2. Load supplemental design docs:
   → data-model.md: Entities Task, TaskStore + validation/state rules.
   → contracts/: CLI command + storage contracts (add, list, complete, delete, storage).
   → quickstart.md: End-to-end scenario and expected outputs.
   → research.md: Technical decisions (commander, uuid, atomic writes, vitest/execa).
3. Generate dependency-ordered tasks:
   → Setup: npm dependencies, tooling config, project scaffolding.
   → Tests [P]: Acceptance/unit specs per contract + quickstart scenario + validation coverage.
   → Core: Entities [P], storage service, domain services, CLI command implementations.
   → Integration: CLI wiring, bin shim, formatting/error mapping.
   → Polish [P]: Docs, changelog, verification runs, transcript capture.
4. Apply task rules:
   → Tests precede implementation (TDD signal).
   → Models before services; services before endpoints.
   → Each contract → dedicated [P] test task; each entity → [P] implementation task.
   → User story → integration test [P]; same-file work stays sequential.
5. Number tasks sequentially (T001, T002, ...), annotate [P] where parallelizable.
6. Add dependency notes + parallel execution examples with actual task runner commands.
7. Validate coverage against plan.md Definition of Done and constitution gates (offline, atomic writes, docs, tests ≥90%).
8. Return SUCCESS when file `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/tasks.md` is updated.
```

## Format: `[ID] [P?] Description`
- **[P]**: Task can run in parallel (touches unique files/targets, no ordering dependency).
- Include concrete file paths, commands, and expected artifacts so an LLM can execute independently.

## Path Conventions
```
/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/
├── src/
│   ├── cli/             # Commander entry + command handlers
│   ├── core/            # Domain entities, services, validation helpers
│   └── storage/         # JSON persistence + path resolution
├── tests/
│   ├── acceptance/      # Vitest + execa CLI flows
│   ├── unit/            # Focused domain/storage specs
│   └── fixtures/        # Shared helpers (temp HOME, UUID stubs)
├── bin/ptm             # Node shim invoking dist build
├── docs/               # README.md, CHANGELOG.md
└── specs/001-users-can-add/  # Source design artifacts
```

## Phase 3.1: Setup
- [ ] T001 Configure Node toolchain in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/package.json`: add scripts (`build`, `lint`, `test`), declare Node 20 engines, install deps (`commander`, `uuid`) and devDeps (`typescript`, `tsx`, `vitest`, `@vitest/coverage-istanbul`, `execa`, `eslint`, `@typescript-eslint/*`, `prettier`), then run `npm install` to persist lockfile.
- [ ] T002 Author tooling configs: create `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tsconfig.json`, `tsconfig.build.json`, `vitest.config.ts`, `.eslintrc.cjs`, `.prettierrc`, and `.npmrc` (save-exact) aligned with strict TypeScript ESM, coverage thresholds ≥90%, and lint rules from repository guidelines.
- [ ] T003 Scaffold project structure: create directories under `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/{cli,core,storage}`, `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/{acceptance,unit,fixtures}`, and stub files (`src/cli/index.ts`, `src/storage/jsonStore.ts`, `src/core/taskService.ts`, `tests/fixtures/testHome.ts`) exporting TODO placeholders so Vitest can import prior to implementation.

## Phase 3.2: Tests First (write & watch them fail before coding)
- [ ] T004 [P] Create failing acceptance spec `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/acceptance/add.spec.ts` using Vitest + execa to assert `ptm add` success output, default priority, and validation errors per `contracts/add.md`.
- [ ] T005 [P] Create failing acceptance spec `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/acceptance/list.spec.ts` covering filters, newest-first ordering, and `--json` payload from `contracts/list.md`.
- [ ] T006 [P] Create failing acceptance spec `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/acceptance/complete.spec.ts` validating complete + `--undo`, status transitions, and error codes from `contracts/complete.md`.
- [ ] T007 [P] Create failing acceptance spec `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/acceptance/delete.spec.ts` validating deletion success + missing ID errors from `contracts/delete.md`.
- [ ] T008 [P] Create failing unit spec `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/unit/storage.contract.spec.ts` asserting atomic temp-write/rename, corruption backup naming, and failure exit mapping from `contracts/storage.md`.
- [ ] T009 [P] Create failing end-to-end spec `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/acceptance/quickstart.spec.ts` that walks quickstart story (first run, add, list human+JSON, complete, undo, delete) using a temp HOME directory.
- [ ] T010 [P] Create failing unit spec `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/tests/unit/task-domain.spec.ts` capturing data-model validations (title length, priority enum, status/completedAt coupling, unique IDs).

## Phase 3.3: Models & Domain Foundations
- [ ] T011 [P] Implement Task entity in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/core/task.ts`: define TypeScript interfaces, default priority helper, validation utilities enforcing data-model rules.
- [ ] T012 [P] Implement TaskStore entity in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/core/taskStore.ts`: represent `{ tasks: Task[] }`, provide selectors for newest-first sorting and lookup helpers used by domain services.

## Phase 3.4: Core Services & Endpoints
- [ ] T013 Implement JSON storage service in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/storage/jsonStore.ts`: load/save with atomic temp files, fsync, backup on parse failure, directory bootstrap, and error mapping expected by T008.
- [ ] T014 Implement domain task service in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/core/taskService.ts`: expose `addTask`, `listTasks`, `completeTask`, `undoComplete`, `deleteTask` using Task/TaskStore validators and storage service, ensuring deterministic exit codes and ID uniqueness.
- [ ] T015 Implement CLI bootstrap in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli/index.ts`: configure Commander program, global options (`--json`, `--priority`, `--status`, `--undo`), shared error handler, and inject storage path resolver.
- [ ] T016 Implement `ptm add` handler in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli/commands/add.ts`: wire flags, call task service, emit success glyph/output, surface validation errors per contract.
- [ ] T017 Implement `ptm list` handler in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli/commands/list.ts`: support filters, newest-first default, table rendering, and JSON serialization per contract + quickstart.
- [ ] T018 Implement `ptm complete` handler in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli/commands/complete.ts`: support `<id>` arg, `--undo`, timestamp management, and error reporting per contract.
- [ ] T019 Implement `ptm delete` handler in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli/commands/delete.ts`: enforce required ID, integrate with task service, and use contract messaging.
- [ ] T020 Implement CLI presenters/utilities in `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/src/cli/presenters.ts`: shared formatting for tabular/JSON output, unicode glyphs, and stderr messaging reused by command handlers.
- [ ] T021 Integrate distribution assets: create `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/bin/ptm` Node shim, add `bin` mapping in `package.json`, ensure `npm run build` emits `dist/cli.js` via `tsc` and updates CLI entry in `docs/README.md` usage examples.

## Phase 3.5: Polish & Verification
- [ ] T022 [P] Update `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/docs/README.md` with install, PATH export, command examples, and storage/backup behavior aligned with quickstart.
- [ ] T023 [P] Update `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/docs/CHANGELOG.md` noting Offline Task CLI MVP, undo support, and storage safeguards.
- [ ] T024 [P] Refresh `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/quickstart.md` with actual CLI transcripts captured from passing tests (human + JSON outputs, error samples).
- [ ] T025 [P] Run final quality gate: execute `npm run lint`, `npm test`, `npm run build`, archive command outputs under `/Users/tassanaiyeeton/projects/learn/personal-task-manager-cli/specs/001-users-can-add/validation.log`, and confirm coverage ≥90%.

## Parallel Execution Guidance
After completing setup (T001-T003), schedule independent [P] test authoring:
```
specify tasks run --id T004 &
specify tasks run --id T005 &
specify tasks run --id T006 &
specify tasks run --id T007 &
specify tasks run --id T008 &
specify tasks run --id T009 &
specify tasks run --id T010 &
wait
```
Post-model implementations (T011-T012), Task entities can unblock storage (T013) while CLI presenters (T020) may begin once command handlers (T016-T019) finish. Polish tasks (T022-T025) can run together after integration task T021 and successful test run.

## Dependency Notes
- T001 → prerequisite for all subsequent tasks; T002 depends on T001 to configure TypeScript-aware scripts; T003 depends on T001-T002 to scaffold matching structure.
- Tests (T004-T010) require setup (T001-T003); they must all exist and fail before implementing models/services.
- T011 depends on T004-T010 for guiding assertions; T012 depends on T011; T013 depends on T012 to persist validated structures; T014 depends on T011-T013.
- CLI bootstrap/handlers (T015-T019) depend on domain service (T014) and corresponding acceptance specs; presenters (T020) depend on handlers to know formatting needs.
- Distribution task T021 depends on T015-T020 to expose finalized commands.
- Polish tasks (T022-T025) depend on running CLI via built artifacts (T021) and green test suite; validation log in T025 confirms Definition of Done.
