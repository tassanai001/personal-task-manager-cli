# Suggested Commands
- `bash .specify/scripts/bash/setup-plan.sh [--json]`: copies the plan template for the current feature branch into `specs/<feature>/plan.md`.
- `bash .specify/scripts/bash/update-agent-context.sh codex`: refreshes the Codex agent context file with recent technology decisions from the plan.
- `bash .specify/scripts/bash/create-new-feature.sh <name>`: scaffolds a new feature spec directory (see script help for options).
- `bash .specify/scripts/bash/check-prerequisites.sh`: quick health check to ensure required tools and repo structure exist before running Spec commands.