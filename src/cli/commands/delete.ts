import type { Command } from 'commander';

import { formatDeleteSuccess } from '../presenters';
import type { CliContext, CommandErrorHandler } from '../context';

export const registerDeleteCommand = (
  program: Command,
  context: CliContext,
  onError: CommandErrorHandler,
): void => {
  program
    .command('delete')
    .description('Delete a task by id')
    .argument('<id>', 'Task identifier')
    .action(async (id: string) => {
      try {
        await context.service.deleteTask({ id });
        console.log(formatDeleteSuccess(id));
      } catch (error) {
        onError(error);
      }
    });
};
