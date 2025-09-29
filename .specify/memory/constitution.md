<!--
Sync Impact Report
Version change: 1.0.0 → 1.0.1 (patch: documented rationales for principles)
Modified principles:
- P1 — Follow SDD Flow (added rationale)
- P2 — Simple, Local, No-Network (added rationale)
- P3 — Clear CLI UX (added rationale)
- P4 — Data Model Is the Source of Truth (added rationale)
- P5 — Minimum Quality Gates (added rationale)
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (checklist already mirrors P1–P5)
- ✅ .specify/templates/spec-template.md (requirements align with CLI focus)
- ✅ .specify/templates/tasks-template.md (task categories enforce P1–P5)
- ✅ .specify/templates/agent-file-template.md (no conflicting placeholders)
- N/A .specify/templates/commands (directory absent)
Follow-up TODOs:
- None
-->
# Personal Task Manager CLI Constitution

## Core Principles

### P1 — Follow SDD Flow

- Execute work strictly in order: `/specify` → (optional `/clarify`) → `/plan` → `/tasks` → implementation.
- Do not modify source files outside the scope defined in the approved `tasks.md`.
- Each phase must produce its artifact and gain review before advancing to the next phase.

**Rationale**: Preserving the SDD progression keeps governance auditable and prevents scope drift.

### P2 — Simple, Local, No-Network

- The CLI MUST operate offline without reaching external services or telemetry endpoints.
- Persist all task data in a single JSON file (default `~/.ptm/tasks.json`; only changeable through an explicit CLI flag).
- Avoid features that introduce sync, multi-device state, or remote dependencies.

**Rationale**: Restricting runtime behavior to the local machine guarantees predictability and compliance with privacy constraints.

### P3 — Clear CLI UX

- Support exactly these commands:
  - `ptm add --title --description --priority`
  - `ptm list [--status | --priority | --json]`
  - `ptm complete <id>`
  - `ptm delete <id>`
- Return exit code `0` on success and non-zero on errors.
- Provide human-readable output by default and structured output when `--json` is supplied to enable scripting.

**Rationale**: Fixing the CLI surface ensures automation scripts and human operators share the same expectations.

### P4 — Data Model Is the Source of Truth

- Represent tasks with the following schema:

  ```json
  {
    "id": "<uuid>",
    "title": "<string>",
    "description": "<string|optional>",
    "priority": "low|medium|high",
    "status": "todo|done",
    "createdAt": "<ISO8601>",
    "completedAt": "<ISO8601|null>"
  }
  ```
- Generate UUIDs for `id`, and record timestamps in ISO 8601 format.
- Perform atomic writes: serialize to a temporary file and rename only after the write succeeds.
- Route all business logic through the data model layer to prevent schema drift.

**Rationale**: Enforcing a single schema source keeps persistence, CLI output, and tests aligned.

### P5 — Minimum Quality Gates

- Provide acceptance tests for every CLI command, covering success paths and primary failure modes.
- Maintain unit tests for JSON persistence, task state transitions, and ID/timestamp handling.
- Update `README` with installation/usage notes and append a concise `CHANGELOG` entry for each feature release.

**Rationale**: Quality gates catch regressions early and document changes for operators.

## Goal & Scope

**Goal**  
Build a simple command-line task management tool using Spec-Driven Development (SDD).

**Scope (non-negotiable)**
- Deliver only the four core commands: add, list, complete, delete.
- Track fields: `title`, `description`, `priority (low|medium|high)`, `status`.
- Store data exclusively in a single local JSON file; no sync or server components.
- Exclude authentication, multi-user support, or network connectivity features.

## Definition of Done

- ✅ All four CLI commands behave per specification, including `--json` output for `ptm list`.
- ✅ Task data persists and reloads from the designated JSON file in compliance with P2 and P4.
- ✅ Acceptance and unit test suites pass locally.
- ✅ `README` and `CHANGELOG` reflect the latest functionality and usage guidance.
- ✅ No code performs network or telemetry calls.

## Governance

- File amendments via Pull Request detailing rationale and expected Semantic Versioning (SemVer) impact.
- Versioning rules:
  - **MAJOR**: Breaking changes to CLI behavior, task schema, or governance rules.
  - **MINOR**: Addition of new principles or significant expansions to guidance.
  - **PATCH**: Editorial clarifications that do not alter requirements.
- Upon approval, update the constitution version, ratification, and amendment dates (ISO 8601) and record the change in the project CHANGELOG.
- Conduct compliance reviews before each release to verify alignment with Principles P1–P5 and the Definition of Done.

**Version**: 1.0.1 | **Ratified**: 2025-09-29 | **Last Amended**: 2025-09-29
