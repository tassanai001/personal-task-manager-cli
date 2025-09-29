
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

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
[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context
**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., Click, Cobra, Commander.js or NEEDS CLARIFICATION]  
**Storage**: [e.g., Local JSON file, SQLite fallback, in-memory stub or N/A]  
**Testing**: [e.g., pytest, Go test, Node tap, bats or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., macOS, Linux, Windows, containerized CLI or NEEDS CLARIFICATION]
**Project Type**: [single CLI, CLI with background service, multi-binary toolchain or NEEDS CLARIFICATION]  
**Performance Goals**: [e.g., command completes <200ms, handles 10k tasks, minimal memory footprint or NEEDS CLARIFICATION]  
**Constraints**: [e.g., offline-only, single JSON file, no telemetry, limited filesystem permissions or NEEDS CLARIFICATION]  
**Scale/Scope**: [e.g., number of concurrent tasks, expected data size, multi-profile support or NEEDS CLARIFICATION]

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] P1 — Follow SDD Flow: Plan follows `/specify` → `/plan` → `/tasks` and stays within approved scope.
- [ ] P2 — Simple, Local, No-Network: Feature preserves offline operation and single JSON persistence.
- [ ] P3 — Clear CLI UX: Command coverage, flags, and exit codes remain defined or updated with rationale.
- [ ] P4 — Data Model Is the Source of Truth: Task schema changes are intentional, documented, and migration-safe.
- [ ] P5 — Minimum Quality Gates: Acceptance/unit tests and doc updates are scheduled before implementation.
- [ ] Definition of Done: Deliverables align with DoD checklist (CLI behavior, storage, tests, docs, no network).

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── cli/             # argument parsing and command execution
├── core/            # task domain logic and validation
├── storage/         # JSON persistence helpers (atomic writes)
└── utils/           # shared utilities if needed

tests/
├── acceptance/      # high-level CLI scenarios
└── unit/            # storage and state transition tests

docs/
├── README.md
└── CHANGELOG.md
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Define CLI command contracts** from functional requirements:
   - For each command or flag change → document arguments, prompts, exit codes
   - Capture human-readable output and `--json` payload expectations in `quickstart.md`
   - Store structured command specs or golden fixtures in `/contracts/`

3. **Generate acceptance tests** from command contracts:
   - One failing test per command/flag scenario in `tests/acceptance`
   - Include error cases for invalid input, missing files, and conflicting IDs
   - Record command invocations and expected stdout/stderr artifacts

4. **Detail data model impacts**:
   - Update `data-model.md` with field changes, validation rules, and state transitions
   - Describe migration steps if schema evolves
   - Note atomic write strategy and recovery behavior

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh codex`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as baseline guidance.
- Derive acceptance test tasks from the documented CLI command contracts.
- Translate data-model updates into storage/unit test tasks and migration work.
- Define implementation tasks for CLI command handlers, output formatting, and persistence wiring.
- Schedule documentation tasks (README, CHANGELOG) tied to DoD items.

**Ordering Strategy**:
- Preserve TDD: acceptance tests → unit tests → command implementation → docs.
- Implement storage/core logic before wiring CLI surfaces.
- Mark \[P\] only when tasks touch different files/directories.

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
