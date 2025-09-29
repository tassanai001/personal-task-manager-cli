import util from 'node:util';

import { run } from '../../src/cli/index';

export interface RunCliOptions {
  env?: Record<string, string>;
  input?: string;
}

const EXIT_SIGNAL = Symbol('PTM_EXIT');

export const runCli = async (args: string[], options: RunCliOptions = {}) => {
  const originalArgv = process.argv.slice();
  const originalEnvSnapshot = { ...process.env };
  const originalExit = process.exit;
  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  const appendStdout = (value: string | Uint8Array) => {
    stdout += typeof value === 'string' ? value : Buffer.from(value).toString('utf-8');
  };

  const appendStderr = (value: string | Uint8Array) => {
    stderr += typeof value === 'string' ? value : Buffer.from(value).toString('utf-8');
  };

  process.argv = ['node', 'ptm', ...args];

  if (options.env) {
    Object.entries(options.env).forEach(([key, value]) => {
      process.env[key] = value;
    });
  }

  process.stdout.write = ((chunk: string | Uint8Array) => {
    appendStdout(chunk);
    return true;
  }) as typeof process.stdout.write;

  process.stderr.write = ((chunk: string | Uint8Array) => {
    appendStderr(chunk);
    return true;
  }) as typeof process.stderr.write;

  console.log = (...args: unknown[]) => {
    appendStdout(`${util.format(...args)}\n`);
  };

  console.error = (...args: unknown[]) => {
    appendStderr(`${util.format(...args)}\n`);
  };

  process.exit = ((code?: number) => {
    exitCode = typeof code === 'number' ? code : 0;
    throw EXIT_SIGNAL;
  }) as typeof process.exit;

  try {
    await run();
    exitCode = process.exitCode ?? exitCode;
  } catch (error) {
    if (error !== EXIT_SIGNAL) {
      throw error;
    }
  } finally {
    process.argv = originalArgv;

    Object.keys(process.env).forEach((key) => {
      delete process.env[key];
    });
    Object.assign(process.env, originalEnvSnapshot);

    process.exit = originalExit;
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.exitCode = 0;
  }

  return {
    stdout,
    stderr,
    exitCode,
  };
};
