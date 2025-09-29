import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

import { withTestHome } from '../fixtures/testHome';
import { runCli } from '../fixtures/runCli';

describe('ptm delete', () => {
  test('deletes tasks and reports missing ids', async () => {
    await withTestHome(async ({ storeDir, storePath }) => {
      await mkdir(storeDir, { recursive: true });
      await writeFile(
        storePath,
        JSON.stringify(
          {
            tasks: [
              {
                id: 'task-delete',
                title: 'Remove me',
                description: null,
                priority: 'low',
                status: 'todo',
                createdAt: '2025-09-29T11:00:00.000Z',
                completedAt: null,
              },
            ],
          },
          null,
          2,
        ),
      );

      const deleteResult = await runCli(['delete', 'task-delete']);
      expect(deleteResult.exitCode).toBe(0);
      expect(deleteResult.stdout).toContain('✖ Deleted task task-delete');

      const parsed = JSON.parse(await readFile(storePath, 'utf-8'));
      expect(parsed.tasks).toHaveLength(0);

      const missing = await runCli(['delete', 'task-delete']);
      expect(missing.exitCode).toBeGreaterThan(0);
      expect(missing.stderr).toContain('Task not found');
    });
  });
});
