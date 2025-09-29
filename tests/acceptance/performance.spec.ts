import { describe, test } from 'vitest';
import { withTestHome } from '../fixtures/testHome';

describe('performance harness', () => {
  test('enforces latency and offline guarantees', async () => {
    await withTestHome(async () => {
      throw new Error('Performance harness spec not implemented yet.');
    });
  });
});
