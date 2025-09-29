import { homedir } from 'node:os';
import { join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

import type { TaskPriority, TaskStatus } from '../core/task';

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['todo', 'done'];

export class CliValidationError extends Error {}

export const parsePriority = (value: string | undefined): TaskPriority | undefined => {
  if (!value) {
    return undefined;
  }

  if ((PRIORITIES as string[]).includes(value)) {
    return value as TaskPriority;
  }

  throw new CliValidationError(
    `Invalid priority "${value}". Allowed values: ${PRIORITIES.join(', ')}.`,
  );
};

export const parseStatus = (value: string | undefined): TaskStatus | undefined => {
  if (!value) {
    return undefined;
  }

  if ((STATUSES as string[]).includes(value)) {
    return value as TaskStatus;
  }

  throw new CliValidationError(`Invalid status "${value}". Allowed values: ${STATUSES.join(', ')}.`);
};

export const resolveStorePath = (): string => {
  const home = process.env.PTM_HOME ?? process.env.HOME ?? homedir();
  return join(home, '.ptm', 'tasks.json');
};

export const makeIdFactory = (): (() => string) => () => process.env.PTM_TEST_UUID ?? uuidv4();

export const makeClock = (): (() => string) => () => process.env.PTM_TEST_NOW ?? new Date().toISOString();

const overrideFunction = (target: Record<string, unknown>, key: string, replacement: () => never): void => {
  if (typeof target[key] !== 'function') {
    return;
  }

  try {
    Object.defineProperty(target, key, {
      value: replacement,
      configurable: true,
      writable: true,
    });
  } catch {
    // ignore if property cannot be redefined
  }
};

export const enforceOfflineGuard = async (): Promise<void> => {
  if (!process.env.PTM_TEST_BLOCK_NETWORK) {
    return;
  }

  const deny = (): never => {
    throw new Error('Network access detected during FR-006 verification');
  };

  const net = (await import('node:net')) as unknown as Record<string, unknown>;
  const http = (await import('node:http')) as unknown as Record<string, unknown>;
  const https = (await import('node:https')) as unknown as Record<string, unknown>;
  const dns = (await import('node:dns')) as unknown as Record<string, unknown>;

  overrideFunction(net, 'createConnection', deny);
  overrideFunction(net, 'connect', deny);
  overrideFunction(http, 'request', deny);
  overrideFunction(http, 'get', deny);
  overrideFunction(https, 'request', deny);
  overrideFunction(https, 'get', deny);
  overrideFunction(dns, 'lookup', deny);
};
