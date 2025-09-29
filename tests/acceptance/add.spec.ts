import { describe, expect, test } from 'vitest';
import { withTestHome } from '../fixtures/testHome';

const CLI_PATH = 'bin/ptm';

describe('ptm add', () => {
  test('adds a task with defaults and validates inputs', async () => {
    await withTestHome(async () => {
      throw new Error('Acceptance spec not implemented yet.');
    });
  });
});
