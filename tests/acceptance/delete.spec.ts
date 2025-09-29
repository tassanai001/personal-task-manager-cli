import { describe, test } from 'vitest';
import { withTestHome } from '../fixtures/testHome';

const CLI_PATH = 'bin/ptm';

describe('ptm delete', () => {
  test('deletes tasks and handles missing ids', async () => {
    await withTestHome(async () => {
      throw new Error('Acceptance spec not implemented yet.');
    });
  });
});
