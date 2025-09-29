import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { createJsonStore } from '../../src/storage/jsonStore';

const fixture = () => {
  const root = join(tmpdir(), `ptm-storage-${Math.random().toString(16).slice(2)}`);
  const storePath = join(root, 'tasks.json');
  return { root, storePath };
};

describe('storage contract', () => {
  test('creates directories and persists data atomically', async () => {
    const { root, storePath } = fixture();
    const store = createJsonStore<{ tasks: unknown[] }>(storePath, {
      defaultData: { tasks: [] },
    });

    await store.save({ tasks: [{ id: 'a' }] });

    const persisted = JSON.parse(await readFile(storePath, 'utf-8'));
    expect(persisted.tasks[0].id).toBe('a');

    const files = await readdir(root);
    expect(files.some((file) => file.endsWith('.tmp'))).toBe(false);
  });

  test('returns default data when file missing', async () => {
    const { storePath } = fixture();
    const store = createJsonStore<{ tasks: unknown[] }>(storePath, {
      defaultData: { tasks: [] },
    });

    const data = await store.load();
    expect(data.tasks).toHaveLength(0);
  });

  test('backs up corrupted JSON and throws', async () => {
    const { root, storePath } = fixture();
    await mkdir(root, { recursive: true });
    await writeFile(storePath, '{ this is not json }', 'utf-8');

    const store = createJsonStore<{ tasks: unknown[] }>(storePath, {
      defaultData: { tasks: [] },
    });

    await expect(store.load()).rejects.toThrow('Backup created at');

    const files = await readdir(root);
    expect(files.some((file) => file.startsWith('tasks.json.bak-'))).toBe(true);
  });
});
