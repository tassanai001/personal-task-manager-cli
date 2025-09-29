import type { Task } from '../core/task';

const PAD = (value: string, length: number): string => value.padEnd(length, ' ');

const PRIORITY_WIDTH = 8;
const STATUS_WIDTH = 6;

export const renderTaskTable = (tasks: Task[]): string => {
  if (tasks.length === 0) {
    return 'No tasks yet\n';
  }

  const header = `${PAD('ID', 36)}  ${PAD('Priority', PRIORITY_WIDTH)}  ${PAD('Status', STATUS_WIDTH)}  Title`;
  const rows = tasks.map((task) => {
    return `${PAD(task.id, 36)}  ${PAD(task.priority, PRIORITY_WIDTH)}  ${PAD(task.status, STATUS_WIDTH)}  ${task.title}`;
  });

  return [header, ...rows].join('\n') + '\n';
};

export const renderTasksJson = (tasks: Task[]): string =>
  `${JSON.stringify({ tasks }, null, 2)}\n`;

export const formatAddSuccess = (task: Task): string =>
  `✔ Added task ${task.id} (priority: ${task.priority})`;

export const formatCompleteSuccess = (taskId: string): string =>
  `✔ Completed task ${taskId}`;

export const formatUndoSuccess = (taskId: string): string =>
  `↺ Reopened task ${taskId}`;

export const formatDeleteSuccess = (taskId: string): string =>
  `✖ Deleted task ${taskId}`;

export const formatValidationError = (message: string): string =>
  `Validation error: ${message}`;
