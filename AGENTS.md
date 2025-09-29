# Repository Guidelines

## Project Structure & Module Organization
- `/src/cli/`: Commander-powered entry point and subcommand wiring.
- `/src/core/`: Task domain logic, validation rules, and state transitions.
- `/src/storage/`: JSON persistence utilities, atomic write helpers, and corruption recovery.
- `/tests/acceptance/`: Vitest suites driving the CLI through `execa` for end-to-end flows.
- `/tests/unit/`: Focused tests for storage and domain helpers.
- `/specs/001-users-can-add/`: Current SDD artifacts (`spec.md`, `plan.md`, contracts, and research) driving implementation.
- `/docs/`: User-facing references such as `README.md` and `CHANGELOG.md`.

## Build, Test, and Development Commands
- `npm install`: Install TypeScript, commander, vitest, and supporting tooling.
- `npm run build`: Transpile TypeScript sources to `dist/` with project tsconfig.
- `npm test`: Execute Vitest across unit and acceptance suites; fails fast on regression.
- `npm run lint`: Apply configured lint/format rules (ESLint + Prettier) and report violations.

## Coding Style & Naming Conventions
- TypeScript 5.x with strict mode; favor explicit types for exported APIs.
- 2-space indentation; single quotes in `.ts`; trailing commas for multi-line literals.
- File naming: kebab-case for CLI command files (`add.ts`), camelCase for functions, PascalCase for classes/types.
- Run `npm run lint` before commits; Prettier settings mirror `.prettierrc`.

## Testing Guidelines
- Acceptance tests live under `tests/acceptance/*.spec.ts` and mirror user commands (`add.spec.ts`, `list.spec.ts`).
- Unit tests use `tests/unit/<module>.spec.ts`; co-locate fixtures under `tests/fixtures/` when needed.
- Ensure new features add both happy-path and primary failure coverage; keep coverage ≥90% line/branch.
- Use deterministic UUIDs or seeded data in tests to avoid flaky snapshots.

## Commit & Pull Request Guidelines
- Commit messages follow `<component>: <imperative summary>` (e.g., `storage: add atomic rename helper`).
- Keep commits focused; include test updates alongside code changes.
- Pull requests must reference the driving spec (`specs/001-users-can-add/...`), summarize scope, list validation commands, and attach CLI output or screenshots for UX changes.
- Confirm lint and test commands pass locally before requesting review.

## Security & Configuration Tips
- CLI must run offline; never add telemetry or network calls.
- Store path defaults to `${HOME}/.ptm/tasks.json`; document overrides in quickstart if introduced.
- Back up corrupted stores to `tasks.json.bak-<timestamp>` and surface actionable errors to users.

## Codex Command Reference
- Available prompts under `.codex/prompts`: `analyze`, `clarify`, `constitution`, `implement`, `plan`, `specify`, `tasks`.
- Invoke a prompt with the pattern `*<prompt> <arguments>` (arguments optional); the CLI injects them into the corresponding markdown workflow.
- Example: `clarify my task-01` runs the clarification workflow using "my task-01" as contextual input.
- Always review each prompt's instructions before use; some (like `clarify`) require running prerequisite scripts or follow-up updates.
