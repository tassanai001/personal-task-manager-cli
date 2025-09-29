export interface TaskService {
  addTask: () => Promise<void>;
  listTasks: () => Promise<void>;
  completeTask: () => Promise<void>;
  deleteTask: () => Promise<void>;
}

export const createTaskService = (): TaskService => {
  throw new Error('Task service not implemented yet.');
};
