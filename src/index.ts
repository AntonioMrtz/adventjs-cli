#!/usr/bin/env node
import { Command } from 'commander';
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from './schema/app.schema';
import { ALL_COMMANDS } from './schema/command.schema';
import { isDev, loadEnv } from './services/dev.service';

const program = new Command();

program.name(APP_NAME).description(APP_DESCRIPTION).version(APP_VERSION);

const main = async (): Promise<void> => {
  loadEnv();
  const devMode = isDev();
  if (devMode) {
    console.log('🔧 DEV MODE ENABLED');
  }
  await initAllCommands();

  // Custom parser for concatenated commands (order independent, but g <day> waits for lang)
  const args = process.argv.slice(2);
  if (args.length > 0) {
    // Parse commands and their arguments into a queue
    const commandQueue: { cmdObj: (typeof ALL_COMMANDS)[number]; cmdArgs: unknown[] }[] = [];
    let i = 0;
    while (i < args.length) {
      const cmdObj = ALL_COMMANDS.find((cmd) => {
        const cmdName = cmd.command.split(' ')[0];
        return args[i] === cmdName;
      });
      if (cmdObj) {
        const cmdParts = cmdObj.command.split(' ');
        const cmdArgs: unknown[] = [];
        for (let j = 1; j < cmdParts.length; j++) {
          if (i + j < args.length) {
            cmdArgs.push(args[i + j]);
          }
        }
        commandQueue.push({ cmdObj, cmdArgs });
        i += cmdParts.length;
      } else {
        i++;
      }
    }

    // First, execute LanguageCommand if present
    for (const item of commandQueue) {
      if (item.cmdObj.command.startsWith('lang')) {
        // eslint-disable-next-line no-await-in-loop
        await item.cmdObj.function?.(...item.cmdArgs);
      }
    }
    // Then, execute all other commands except LanguageCommand
    for (const item of commandQueue) {
      if (!item.cmdObj.command.startsWith('lang')) {
        // eslint-disable-next-line no-await-in-loop
        await item.cmdObj.function?.(...item.cmdArgs);
      }
    }
  } else {
    program.parse(process.argv);
  }
};

const initAllCommands = async (): Promise<void> => {
  const commands = ALL_COMMANDS;
  commands.forEach((cmd) => {
    program
      .command(cmd.command)
      .description(cmd.description)
      .action((...args: unknown[]) => cmd.function(...args));
  });
};

main();
