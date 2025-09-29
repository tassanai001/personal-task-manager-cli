import { describe, expect, test } from 'vitest';

import {
  Task,
  TaskPriority,
  TaskStatus,
  createTask,
  updateTaskStatus,
  validateTask,
} from '../../src/core/task';

describe('task domain', () => {
  test('creates tasks with defaults and validation', () => {
    const task = createTask({
      id: 'alpha',
      title: 'Write report',
      description: undefined,
      priority: undefined,
      createdAt: '2025-09-29T12:00:00.000Z',
    });

    expect(task.priority).toBe<TaskPriority>('medium');
    expect(task.status).toBe<TaskStatus>('todo');
    expect(task.description).toBeNull();

    expect(() =>
      createTask({
        id: 'beta',
        title: '',
        description: undefined,
        priority: undefined,
        createdAt: '2025-09-29T12:00:00.000Z',
      }),
    ).toThrow('Title is required');

    expect(() =>
      createTask({
        id: 'gamma',
        title: 'Invalid priority',
        description: undefined,
        priority: 'urgent' as TaskPriority,
        createdAt: '2025-09-29T12:00:00.000Z',
      }),
    ).toThrow('Invalid priority');
  });

  test('validates consistency between status and completedAt', () => {
    const task: Task = {
      id: 'task-1',
      title: 'Do work',
      description: null,
      priority: 'medium',
      status: 'done',
      createdAt: '2025-09-29T12:00:00.000Z',
      completedAt: '2025-09-29T13:00:00.000Z',
    };

    expect(() => validateTask(task)).not.toThrow();

    expect(() =>
      validateTask({
        ...task,
        status: 'done',
        completedAt: null,
      }),
    ).toThrow('Completed tasks must include completedAt');

    expect(() =>
      validateTask({
        ...task,
        status: 'todo',
        completedAt: '2025-09-29T13:00:00.000Z',
      }),
    ).toThrow('Todo tasks must not include completedAt');
  });

  test('updates status with undo semantics', () => {
    const base = createTask({
      id: 'task-undo',
      title: 'Undo me',
      description: undefined,
      priority: 'low',
      createdAt: '2025-09-29T10:00:00.000Z',
    });

    const done = updateTaskStatus(base, {
      status: 'done',
      timestamp: '2025-09-29T11:00:00.000Z',
    });

    expect(done.status).toBe<TaskStatus>('done');
    expect(done.completedAt).toBe('2025-09-29T11:00:00.000Z');

    const undone = updateTaskStatus(done, { status: 'todo' });
    expect(undone.status).toBe<TaskStatus>('todo');
    expect(undone.completedAt).toBeNull();
  });
});
