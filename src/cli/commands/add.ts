import type { Command } from 'commander';

import { formatAddSuccess, formatValidationError } from '../presenters';
import type { CliContext, CommandErrorHandler } from '../context';
import { CliValidationError, parsePriority } from '../utils';

interface AddOptions {
  title?: string;
  description?: string;
  priority?: string;
}

export const registerAddCommand = (
  program: Command,
  context: CliContext,
  onError: CommandErrorHandler,
): void => {
  program
    .command('add')
    .description('Add a new task')
    .requiredOption('--title <title>', 'Title for the task')
    .option('--description <description>', 'Optional description for the task')
    .option('--priority <priority>', 'Priority: low, medium, or high')
    .action(async (options: AddOptions) => {
      try {
        const priority = parsePriority(options.priority);
        const task = await context.service.addTask({
          title: options.title ?? '',
          description: options.description,
          priority,
        });
        console.log(formatAddSuccess(task));
      } catch (error) {
        if (error instanceof CliValidationError) {
          console.error(formatValidationError(error.message));
          process.exitCode = 1;
          return;
        }
        onError(error);
      }
    });
};
