import { mkdir, writeFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

import { withTestHome } from '../fixtures/testHome';
import { runCli } from '../fixtures/runCli';

describe('ptm list', () => {
  test('lists tasks with filters, ordering, and JSON output', async () => {
    await withTestHome(async ({ storeDir, storePath }) => {
      await mkdir(storeDir, { recursive: true });
      await writeFile(
        storePath,
        JSON.stringify(
          {
            tasks: [
              {
                id: 'task-1',
                title: 'Old low task',
                description: null,
                priority: 'low',
                status: 'todo',
                createdAt: '2025-09-29T12:00:00.000Z',
                completedAt: null,
              },
              {
                id: 'task-2',
                title: 'Newest high task',
                description: 'Important',
                priority: 'high',
                status: 'todo',
                createdAt: '2025-09-29T13:00:00.000Z',
                completedAt: null,
              },
            ],
          },
          null,
          2,
        ),
      );

      const listAll = await runCli(['list']);
      expect(listAll.exitCode).toBe(0);

      const lines = listAll.stdout.trim().split('\n');
      expect(lines[1]).toContain('task-2');
      expect(lines[1]).toContain('Newest high task');
      expect(lines[2]).toContain('task-1');
      expect(lines[2]).toContain('Old low task');

      const listLow = await runCli(['list', '--priority', 'low']);
      expect(listLow.exitCode).toBe(0);
      expect(listLow.stdout).toContain('Old low task');
      expect(listLow.stdout).not.toContain('Newest high task');

      const listJson = await runCli(['list', '--json']);
      expect(listJson.exitCode).toBe(0);
      const parsed = JSON.parse(listJson.stdout);
      expect(parsed.tasks).toHaveLength(2);
      expect(parsed.tasks[0].id).toBe('task-2');
      expect(parsed.tasks[1].id).toBe('task-1');
    });
  });
});
