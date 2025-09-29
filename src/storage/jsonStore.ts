import { mkdir, open, readFile, rename } from 'node:fs/promises';
import { dirname, join, basename } from 'node:path';

export interface JsonStoreOptions<T> {
  defaultData: T;
}

export interface JsonStore<T> {
  load: () => Promise<T>;
  save: (data: T) => Promise<void>;
}

const serialize = <T>(data: T): string => `${JSON.stringify(data, null, 2)}\n`;

const toBackupName = (filePath: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${basename(filePath)}.bak-${timestamp}`;
};

export const createJsonStore = <T>(filePath: string, options: JsonStoreOptions<T>): JsonStore<T> => {
  const directory = dirname(filePath);

  const load = async (): Promise<T> => {
    try {
      const raw = await readFile(filePath, 'utf-8');
      return JSON.parse(raw) as T;
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return options.defaultData;
      }

      if (error instanceof SyntaxError) {
        await mkdir(directory, { recursive: true });
        const backupName = toBackupName(filePath);
        await rename(filePath, join(directory, backupName));
        throw new Error(`Backup created at ${join(directory, backupName)} due to corrupted store.`);
      }

      throw error;
    }
  };

  const save = async (data: T): Promise<void> => {
    await mkdir(directory, { recursive: true });
    const tempPath = `${filePath}.tmp`;
    const contents = serialize(data);

    const handle = await open(tempPath, 'w');
    try {
      await handle.write(contents);
      await handle.sync();
    } finally {
      await handle.close();
    }

    await rename(tempPath, filePath);
  };

  return {
    load,
    save,
  };
};
