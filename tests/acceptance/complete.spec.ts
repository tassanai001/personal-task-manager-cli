import { describe, test } from 'vitest';
import { withTestHome } from '../fixtures/testHome';

const CLI_PATH = 'bin/ptm';

describe('ptm complete', () => {
  test('completes and reopens tasks', async () => {
    await withTestHome(async () => {
      throw new Error('Acceptance spec not implemented yet.');
    });
  });
});
