import type { TaskService } from '../core/taskService';

export interface CliContext {
  service: TaskService;
}

export type CommandErrorHandler = (error: unknown) => void;
