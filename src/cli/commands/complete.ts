import type { Command } from 'commander';

import { formatCompleteSuccess, formatUndoSuccess } from '../presenters';
import type { CliContext, CommandErrorHandler } from '../context';

interface CompleteOptions {
  undo?: boolean;
}

export const registerCompleteCommand = (
  program: Command,
  context: CliContext,
  onError: CommandErrorHandler,
): void => {
  program
    .command('complete')
    .description('Mark a task as done or undo completion')
    .argument('<id>', 'Task identifier')
    .option('--undo', 'Reopen a completed task')
    .action(async (id: string, options: CompleteOptions) => {
      try {
        const updated = await context.service.completeTask({
          id,
          undo: options.undo ?? false,
        });

        if (options.undo) {
          console.log(formatUndoSuccess(updated.id));
        } else {
          console.log(formatCompleteSuccess(updated.id));
        }
      } catch (error) {
        onError(error);
      }
    });
};
