import { describe, test } from 'vitest';
import { withTestHome } from '../fixtures/testHome';

const CLI_PATH = 'bin/ptm';

describe('ptm list', () => {
  test('lists tasks with filters and formats', async () => {
    await withTestHome(async () => {
      throw new Error('Acceptance spec not implemented yet.');
    });
  });
});
