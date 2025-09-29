export interface JsonStore<T> {
  load: () => Promise<T>;
  save: (data: T) => Promise<void>;
}

export const createJsonStore = <T>(): JsonStore<T> => {
  throw new Error('JSON store not implemented yet.');
};
