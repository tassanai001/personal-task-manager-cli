export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface CreateTaskInput {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  createdAt: string;
}

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export class TaskValidationError extends Error {}

export const assertPriority = (value: TaskPriority | undefined): TaskPriority => {
  if (!value) {
    return 'medium';
  }

  if (!PRIORITIES.includes(value)) {
    throw new TaskValidationError(
      `Invalid priority "${value}". Allowed values: ${PRIORITIES.join(', ')}.`,
    );
  }

  return value;
};

export const createTask = ({
  id,
  title,
  description,
  priority,
  createdAt,
}: CreateTaskInput): Task => {
  const normalizedTitle = (title ?? '').trim();
  if (!normalizedTitle) {
    throw new TaskValidationError('Title is required. Provide --title with non-empty text.');
  }

  const finalPriority = assertPriority(priority);

  const task: Task = {
    id,
    title: normalizedTitle,
    description: description ?? null,
    priority: finalPriority,
    status: 'todo',
    createdAt,
    completedAt: null,
  };

  validateTask(task);
  return task;
};

export const validateTask = (task: Task): void => {
  const normalizedTitle = (task.title ?? '').trim();
  if (!normalizedTitle) {
    throw new TaskValidationError('Title is required. Provide --title with non-empty text.');
  }

  if (!PRIORITIES.includes(task.priority)) {
    throw new TaskValidationError(
      `Invalid priority "${task.priority}". Allowed values: ${PRIORITIES.join(', ')}.`,
    );
  }

  if (task.status === 'done' && !task.completedAt) {
    throw new TaskValidationError('Completed tasks must include completedAt timestamps.');
  }

  if (task.status === 'todo' && task.completedAt) {
    throw new TaskValidationError('Todo tasks must not include completedAt timestamps.');
  }
};

export interface UpdateTaskStatusInput {
  status: TaskStatus;
  timestamp?: string;
}

export const updateTaskStatus = (task: Task, update: UpdateTaskStatusInput): Task => {
  if (update.status === 'done') {
    const completedAt = update.timestamp ?? new Date().toISOString();
    const updated: Task = {
      ...task,
      status: 'done',
      completedAt,
    };
    validateTask(updated);
    return updated;
  }

  const updated: Task = {
    ...task,
    status: 'todo',
    completedAt: null,
  };
  validateTask(updated);
  return updated;
};
