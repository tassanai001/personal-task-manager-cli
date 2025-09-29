import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface TestHomeContext {
  homeDir: string;
  storeDir: string;
  storePath: string;
}

export const withTestHome = async <T>(
  fn: (context: TestHomeContext) => Promise<T>,
): Promise<T> => {
  const tempHome = await mkdtemp(join(tmpdir(), 'ptm-home-'));
  const originalHome = process.env.HOME;
  const context: TestHomeContext = {
    homeDir: tempHome,
    storeDir: join(tempHome, '.ptm'),
    storePath: join(tempHome, '.ptm', 'tasks.json'),
  };

  process.env.HOME = tempHome;

  try {
    return await fn(context);
  } finally {
    if (originalHome) {
      process.env.HOME = originalHome;
    } else {
      delete process.env.HOME;
    }
    await rm(tempHome, { recursive: true, force: true });
  }
};
