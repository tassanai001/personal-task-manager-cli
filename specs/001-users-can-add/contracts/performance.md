# Contract: Performance & Offline Verification Harness

## Purpose
Validate Functional Requirement FR-006 by exercising each CLI command against a seeded store containing 100 tasks. The harness enforces the ≤200 ms response target and guarantees no network operations occur during command execution.

## Scenario Outline
1. Seed the JSON store (`${HOME}/.ptm/tasks.json`) with 100 deterministic tasks using fixtures under `tests/fixtures/`.
2. Measure wall-clock execution for the following invocations using `execa`:
   - `ptm add --title "Perf Task"`
   - `ptm list`
   - `ptm complete <fixture-id>`
   - `ptm complete <fixture-id> --undo`
   - `ptm delete <fixture-id>`
3. Capture stderr/stdout for regressions.
4. Assert each command finishes in ≤200 ms.
5. Stub Node's DNS/socket modules (or assert open handles) to fail the test if any network call is attempted.

## Expected Outputs
- Success: `PASS` with timing metadata per command recorded in the test snapshot/log.
- Failure: Test fails with message `Performance threshold exceeded for <command>` or `Network access detected during FR-006 verification`.

## Exit Codes
- Harness runs inside Vitest; individual CLI exit codes must remain `0` during success paths.

## Follow-up Actions
- Integrate this spec into `tests/acceptance/performance.spec.ts`.
- Include timing and offline assertions in final validation logs captured by T025.
