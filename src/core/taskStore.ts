import type { Task } from './task';

export interface TaskStore {
  tasks: Task[];
}

export const emptyTaskStore = (): TaskStore => ({ tasks: [] });

export const sortTasksNewestFirst = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0));
};

export const upsertTask = (store: TaskStore, task: Task): TaskStore => {
  const existingIndex = store.tasks.findIndex((candidate) => candidate.id === task.id);
  if (existingIndex === -1) {
    return {
      tasks: sortTasksNewestFirst([...store.tasks, task]),
    };
  }

  const next = [...store.tasks];
  next[existingIndex] = task;
  return { tasks: sortTasksNewestFirst(next) };
};

export const removeTask = (store: TaskStore, taskId: string): TaskStore => {
  return { tasks: store.tasks.filter((task) => task.id !== taskId) };
};

export const findTask = (store: TaskStore, taskId: string): Task | undefined =>
  store.tasks.find((task) => task.id === taskId);
