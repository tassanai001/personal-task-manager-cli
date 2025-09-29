import { mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { describe, expect, test } from 'vitest';

import { withTestHome } from '../fixtures/testHome';
import { runCli } from '../fixtures/runCli';

const MAX_DURATION_MS = 200;

const measure = async <T>(fn: () => Promise<T>) => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
};

describe('performance harness', () => {
  test('enforces ≤200 ms latency and offline guarantees', async () => {
    await withTestHome(async ({ storeDir, storePath }) => {
      await mkdir(storeDir, { recursive: true });
      const seededTasks = Array.from({ length: 100 }, (_, index) => ({
        id: `seed-${index}`,
        title: `Seed task ${index}`,
        description: null,
        priority: index % 3 === 0 ? 'high' : index % 2 === 0 ? 'medium' : 'low',
        status: 'todo',
        createdAt: `2025-09-29T10:${String(index).padStart(2, '0')}:00.000Z`,
        completedAt: null,
      }));

      await writeFile(storePath, JSON.stringify({ tasks: seededTasks }, null, 2));

      const env = { PTM_TEST_BLOCK_NETWORK: '1' };

      const { result: addResult, duration: addDuration } = await measure(() =>
        runCli(
          [
            'add',
            '--title',
            'Performance task',
            '--description',
            'Ensure harness passes',
            '--priority',
            'high',
          ],
          {
            env: {
              ...env,
              PTM_TEST_UUID: 'performance-add',
            },
          },
        ),
      );
      expect(addResult.exitCode).toBe(0);

      const { duration: listDuration } = await measure(() =>
        runCli(['list'], { env }),
      );

      const { duration: listJsonDuration } = await measure(() =>
        runCli(['list', '--json'], { env }),
      );

      const { result: completeResult, duration: completeDuration } = await measure(() =>
        runCli(
          ['complete', 'seed-0'],
          {
            env: {
              ...env,
              PTM_TEST_NOW: '2025-09-29T18:00:00.000Z',
            },
          },
        ),
      );
      expect(completeResult.exitCode).toBe(0);

      const { result: undoResult, duration: undoDuration } = await measure(() =>
        runCli(['complete', 'seed-0', '--undo'], { env }),
      );
      expect(undoResult.exitCode).toBe(0);

      const { result: deleteResult, duration: deleteDuration } = await measure(() =>
        runCli(['delete', 'seed-1'], { env }),
      );
      expect(deleteResult.exitCode).toBe(0);

      const durations = [
        addDuration,
        listDuration,
        listJsonDuration,
        completeDuration,
        undoDuration,
        deleteDuration,
      ];

      durations.forEach((duration) => {
        expect(duration).toBeLessThanOrEqual(MAX_DURATION_MS);
      });
    });
  });
});
