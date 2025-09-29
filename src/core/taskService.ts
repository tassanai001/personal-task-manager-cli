import { randomUUID } from 'node:crypto';

import type { JsonStore } from '../storage/jsonStore';
import type { Task, TaskPriority } from './task';
import { TaskValidationError, createTask, updateTaskStatus, validateTask } from './task';
import type { TaskStore } from './taskStore';
import { emptyTaskStore, findTask, removeTask, sortTasksNewestFirst, upsertTask } from './taskStore';

export type TaskServiceErrorCode = 'validation' | 'not_found' | 'storage' | 'unknown';

export class TaskServiceError extends Error {
  constructor(message: string, public readonly code: TaskServiceErrorCode) {
    super(message);
  }
}

export interface TaskServiceDependencies {
  store: JsonStore<TaskStore>;
  generateId?: () => string;
  now?: () => string;
}

export interface AddTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface ListTaskFilters {
  status?: Task['status'];
  priority?: TaskPriority;
}

export interface CompleteTaskInput {
  id: string;
  undo?: boolean;
  timestamp?: string;
}

export interface DeleteTaskInput {
  id: string;
}

export interface TaskService {
  addTask: (input: AddTaskInput) => Promise<Task>;
  listTasks: (filters: ListTaskFilters) => Promise<Task[]>;
  completeTask: (input: CompleteTaskInput) => Promise<Task>;
  deleteTask: (input: DeleteTaskInput) => Promise<void>;
}

const defaultNow = (): string => new Date().toISOString();
const defaultId = (): string => randomUUID();

const ensureStoreShape = (store: TaskStore | undefined): TaskStore => {
  if (!store || !Array.isArray(store.tasks)) {
    return emptyTaskStore();
  }
  return store;
};

export const createTaskService = (deps: TaskServiceDependencies): TaskService => {
  const now = deps.now ?? defaultNow;
  const generateId = deps.generateId ?? defaultId;

  const loadStore = async (): Promise<TaskStore> => {
    try {
      const loaded = await deps.store.load();
      return ensureStoreShape(loaded);
    } catch (error) {
      throw new TaskServiceError((error as Error).message, 'storage');
    }
  };

  const saveStore = async (store: TaskStore): Promise<void> => {
    try {
      await deps.store.save(store);
    } catch (error) {
      throw new TaskServiceError((error as Error).message, 'storage');
    }
  };

  const addTask = async (input: AddTaskInput): Promise<Task> => {
    const store = await loadStore();
    const createdAt = now();

    try {
      const task = createTask({
        id: generateId(),
        title: input.title,
        description: input.description,
        priority: input.priority,
        createdAt,
      });

      const nextStore = upsertTask(store, task);
      await saveStore(nextStore);
      return task;
    } catch (error) {
      if (error instanceof TaskValidationError) {
        throw new TaskServiceError(error.message, 'validation');
      }
      throw error;
    }
  };

  const listTasks = async (filters: ListTaskFilters): Promise<Task[]> => {
    const store = await loadStore();
    const tasks = sortTasksNewestFirst(store.tasks);

    return tasks.filter((task) => {
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      return true;
    });
  };

  const completeTask = async (input: CompleteTaskInput): Promise<Task> => {
    const store = await loadStore();
    const current = findTask(store, input.id);

    if (!current) {
      throw new TaskServiceError(`Task not found: ${input.id}`, 'not_found');
    }

    const timestamp = input.timestamp ?? now();

    try {
      const updated = input.undo
        ? updateTaskStatus(current, { status: 'todo' })
        : updateTaskStatus(current, { status: 'done', timestamp });

      const nextStore = upsertTask(store, updated);
      await saveStore(nextStore);
      return updated;
    } catch (error) {
      if (error instanceof TaskValidationError) {
        throw new TaskServiceError(error.message, 'validation');
      }
      throw error;
    }
  };

  const deleteTask = async (input: DeleteTaskInput): Promise<void> => {
    const store = await loadStore();
    const current = findTask(store, input.id);

    if (!current) {
      throw new TaskServiceError(`Task not found: ${input.id}`, 'not_found');
    }

    validateTask(current);

    const nextStore = removeTask(store, input.id);
    await saveStore(nextStore);
  };

  return {
    addTask,
    listTasks,
    completeTask,
    deleteTask,
  };
};
