import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

import { withTestHome } from '../fixtures/testHome';
import { runCli } from '../fixtures/runCli';

describe('ptm complete', () => {
  test('completes tasks, allows undo, and validates missing ids', async () => {
    await withTestHome(async ({ storeDir, storePath }) => {
      await mkdir(storeDir, { recursive: true });
      await writeFile(
        storePath,
        JSON.stringify(
          {
            tasks: [
              {
                id: 'task-undo',
                title: 'Finish report',
                description: null,
                priority: 'medium',
                status: 'todo',
                createdAt: '2025-09-29T10:00:00.000Z',
                completedAt: null,
              },
            ],
          },
          null,
          2,
        ),
      );

      const complete = await runCli(['complete', 'task-undo'], {
        env: { PTM_TEST_NOW: '2025-09-29T16:00:00.000Z' },
      });

      expect(complete.exitCode).toBe(0);
      expect(complete.stdout).toContain('✔ Completed task task-undo');

      let parsed = JSON.parse(await readFile(storePath, 'utf-8'));
      expect(parsed.tasks[0]).toMatchObject({
        status: 'done',
        completedAt: '2025-09-29T16:00:00.000Z',
      });

      const undo = await runCli(['complete', 'task-undo', '--undo']);
      expect(undo.exitCode).toBe(0);
      expect(undo.stdout).toContain('↺ Reopened task task-undo');

      parsed = JSON.parse(await readFile(storePath, 'utf-8'));
      expect(parsed.tasks[0]).toMatchObject({
        status: 'todo',
        completedAt: null,
      });

      const missing = await runCli(['complete', 'missing-id']);
      expect(missing.exitCode).toBeGreaterThan(0);
      expect(missing.stderr).toContain('Task not found');
    });
  });
});
