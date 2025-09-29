import type { Command } from 'commander';

import { renderTaskTable, renderTasksJson, formatValidationError } from '../presenters';
import type { CliContext, CommandErrorHandler } from '../context';
import { CliValidationError, parsePriority, parseStatus } from '../utils';

interface ListOptions {
  status?: string;
  priority?: string;
  json?: boolean;
}

export const registerListCommand = (
  program: Command,
  context: CliContext,
  onError: CommandErrorHandler,
): void => {
  program
    .command('list')
    .description('List tasks with optional filters')
    .option('--status <status>', 'Filter by status: todo or done')
    .option('--priority <priority>', 'Filter by priority: low, medium, or high')
    .option('--json', 'Output as JSON')
    .action(async (options: ListOptions) => {
      try {
        const status = parseStatus(options.status);
        const priority = parsePriority(options.priority);
        const tasks = await context.service.listTasks({ status, priority });

        if (options.json) {
          process.stdout.write(renderTasksJson(tasks));
        } else {
          process.stdout.write(renderTaskTable(tasks));
        }
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
