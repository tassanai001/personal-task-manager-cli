#!/usr/bin/env node
import { Command } from 'commander';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

import { createTaskService, TaskServiceError } from '../core/taskService';
import { emptyTaskStore } from '../core/taskStore';
import type { TaskStore } from '../core/taskStore';
import { createJsonStore } from '../storage/jsonStore';
import { registerAddCommand } from './commands/add';
import { registerCompleteCommand } from './commands/complete';
import { registerDeleteCommand } from './commands/delete';
import { registerListCommand } from './commands/list';
import type { CliContext, CommandErrorHandler } from './context';
import { CliValidationError, enforceOfflineGuard, makeClock, makeIdFactory, resolveStorePath } from './utils';
import { formatValidationError } from './presenters';

export const run = async (): Promise<void> => {
  await enforceOfflineGuard();

  const program = new Command();
  program.name('ptm');
  program.configureOutput({
    outputError: (str) => process.stderr.write(str),
  });

  const storePath = resolveStorePath();
  const store = createJsonStore<TaskStore>(storePath, {
    defaultData: emptyTaskStore(),
  });

  const service = createTaskService({
    store,
    generateId: makeIdFactory(),
    now: makeClock(),
  });

  const context: CliContext = {
    service,
  };

  const handleError: CommandErrorHandler = (error) => {
    if (error instanceof CliValidationError) {
      console.error(formatValidationError(error.message));
      process.exit(1);
      return;
    }

    if (error instanceof TaskServiceError) {
      switch (error.code) {
        case 'validation':
          console.error(formatValidationError(error.message));
          process.exit(1);
          return;
        case 'not_found':
          console.error(error.message);
          process.exit(2);
          return;
        case 'storage':
          console.error(`Storage error: ${error.message}`);
          process.exit(3);
          return;
        default:
          console.error(`Unexpected error: ${error.message}`);
          process.exit(99);
          return;
      }
    }

    if (error instanceof Error) {
      console.error(`Unexpected error: ${error.message}`);
    } else {
      console.error('Unexpected error occurred.');
    }
    process.exit(99);
  };

  registerAddCommand(program, context, handleError);
  registerListCommand(program, context, handleError);
  registerCompleteCommand(program, context, handleError);
  registerDeleteCommand(program, context, handleError);

  await program.parseAsync(process.argv);
};

const modulePath = resolve(fileURLToPath(import.meta.url));
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : undefined;

if (modulePath === invokedPath) {
  void run();
}
