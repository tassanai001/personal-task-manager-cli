import { describe, expect, test } from 'vitest';

import { withTestHome } from '../fixtures/testHome';
import { runCli } from '../fixtures/runCli';

describe('quickstart journey', () => {
  test('captures the end-to-end workflow', async () => {
    await withTestHome(async () => {
      const firstList = await runCli(['list']);
      expect(firstList.exitCode).toBe(0);
      expect(firstList.stdout).toContain('No tasks yet');

      const add = await runCli(
        ['add', '--title', 'Write report', '--description', 'Draft Q3 summary'],
        { env: { PTM_TEST_UUID: 'quickstart-task' } },
      );
      expect(add.exitCode).toBe(0);
      expect(add.stdout).toContain('✔ Added task quickstart-task');

      const list = await runCli(['list']);
      expect(list.exitCode).toBe(0);
      expect(list.stdout).toContain('quickstart-task');
      expect(list.stdout).toContain('Write report');

      const listJson = await runCli(['list', '--json']);
      expect(JSON.parse(listJson.stdout).tasks[0].id).toBe('quickstart-task');

      const complete = await runCli(['complete', 'quickstart-task'], {
        env: { PTM_TEST_NOW: '2025-09-29T17:00:00.000Z' },
      });
      expect(complete.exitCode).toBe(0);

      const undo = await runCli(['complete', 'quickstart-task', '--undo']);
      expect(undo.exitCode).toBe(0);

      const del = await runCli(['delete', 'quickstart-task']);
      expect(del.exitCode).toBe(0);

      const finalList = await runCli(['list']);
      expect(finalList.stdout).toContain('No tasks yet');
    });
  });
});
