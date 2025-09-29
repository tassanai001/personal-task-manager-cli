import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

import { withTestHome } from '../fixtures/testHome';
import { runCli } from '../fixtures/runCli';

const HI_PRIORITY_ID = '00000000-0000-0000-0000-000000000001';
const DEFAULT_PRIORITY_ID = '00000000-0000-0000-0000-000000000002';

describe('ptm add', () => {
  test('adds tasks with priority defaults and validates inputs', async () => {
    await withTestHome(async ({ storePath }) => {
      const highPriority = await runCli(
        [
          'add',
          '--title',
          'Write report',
          '--description',
          'Draft Q3 summary',
          '--priority',
          'high',
        ],
        { env: { PTM_TEST_UUID: HI_PRIORITY_ID } },
      );

      expect(highPriority.exitCode).toBe(0);
      expect(highPriority.stdout).toContain('✔ Added task');
      expect(highPriority.stdout).toContain('priority: high');

      const defaultPriority = await runCli(
        ['add', '--title', 'Plan sprint'],
        { env: { PTM_TEST_UUID: DEFAULT_PRIORITY_ID } },
      );

      expect(defaultPriority.exitCode).toBe(0);
      expect(defaultPriority.stdout).toContain('✔ Added task');
      expect(defaultPriority.stdout).toContain('priority: medium');

      const invalidPriority = await runCli([
        'add',
        '--title',
        'Bad priority',
        '--priority',
        'urgent',
      ]);

      expect(invalidPriority.exitCode).toBeGreaterThan(0);
      expect(invalidPriority.stderr).toContain('Invalid priority');

      const parsed = JSON.parse(await readFile(storePath, 'utf-8'));
      const highTask = parsed.tasks.find((task: any) => task.id === HI_PRIORITY_ID);
      const defaultTask = parsed.tasks.find((task: any) => task.id === DEFAULT_PRIORITY_ID);

      expect(highTask).toMatchObject({
        title: 'Write report',
        description: 'Draft Q3 summary',
        priority: 'high',
        status: 'todo',
      });
      expect(defaultTask).toMatchObject({
        title: 'Plan sprint',
        description: null,
        priority: 'medium',
        status: 'todo',
      });
    });
  });
});
