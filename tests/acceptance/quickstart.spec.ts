import { describe, test } from 'vitest';
import { withTestHome } from '../fixtures/testHome';

describe('quickstart journey', () => {
  test('walks the end-to-end workflow', async () => {
    await withTestHome(async () => {
      throw new Error('Quickstart acceptance spec not implemented yet.');
    });
  });
});
