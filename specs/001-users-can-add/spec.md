# Feature Specification: Offline Task CLI MVP

**Feature Branch**: `001-users-can-add`  
**Created**: 2025-09-29  
**Status**: Draft  
**Input**: User description: "Users can add, list, complete, and delete tasks; Tasks have a title, description, priority (low/medium/high), and status; Data persists to a local JSON file; No authentication required"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "store tasks" without path or format), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Default data location and filesystem permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

## Clarifications

### Session 2025-09-29

- Q: Should the CLI support reversing a completed task back to `todo`, or are tasks immutable once marked done? → A: Allow re-opening via flag on `ptm complete`

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
A solo operator launches the offline CLI to capture and track personal tasks. When they mark items complete they can also undo a completion via the same command if they finish prematurely. They add new work items with a title, optional description, and priority, list tasks to review progress, mark items complete once done, and delete tasks that are no longer needed, all without leaving the terminal or connecting to a network service.

### Acceptance Scenarios
1. **Given** the task store JSON exists or is creatable, **When** the user runs `ptm add --title "Write report" --description "Draft Q3 summary" --priority high`, **Then** the CLI confirms creation, persists the task with status `todo`, and returns exit code 0.
2. **Given** a task with status `todo`, **When** the user runs `ptm complete <id>`, **Then** the CLI updates the task to status `done`, stamps `completedAt`, and the change is reflected when listing tasks.
3. **Given** multiple tasks in different priorities, **When** the user runs `ptm list --priority low`, **Then** only low-priority tasks are shown in both human-readable and `--json` formats.
4. **Given** a stale or unnecessary task, **When** the user runs `ptm delete <id>`, **Then** the CLI removes the task from the JSON file and confirms removal.

### Edge Cases
- Missing task store file: CLI creates the JSON file at the default local path (`~/.ptm/tasks.json`) before proceeding.
- Invalid priority flag or missing title: CLI rejects the command with a validation error message and non-zero exit code.
- Concurrent edits or corrupted JSON: CLI warns, preserves a backup, and guides the user to resolve the conflict without losing data.
- Attempting to complete or delete a nonexistent task ID: CLI surfaces an error and leaves stored data unchanged.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: CLI MUST allow users to add a task with a required title, optional description, and priority flag (`low`, `medium`, `high`).
- **FR-002**: CLI MUST list tasks with filters for `status`, `priority`, and a `--json` option for machine-readable output.
- **FR-003**: CLI MUST update a task's status to `done` when the user completes it, record `completedAt`, and support an `--undo` flag on `ptm complete` to revert the task to `todo` and clear `completedAt`.
- **FR-004**: CLI MUST delete a specified task by ID and confirm removal to the user.
- **FR-005**: CLI MUST persist all task mutations to a single local JSON file using atomic write semantics and create the file if missing.
- **FR-006**: CLI MUST operate entirely offline with no network or authentication requirements.
- **FR-007**: CLI MUST enforce validation errors with descriptive stderr output and non-zero exit codes when inputs are invalid.

### Key Entities *(include if feature involves data)*
- **Task**: Represents an individual work item with properties `id`, `title`, `description`, `priority`, `status`, `createdAt`, and `completedAt`.
- **Task Store**: The local JSON document (`~/.ptm/tasks.json` by default) that stores an array of tasks and enforces schema integrity and atomic writes.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
