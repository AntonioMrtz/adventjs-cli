import { getChalkLogger } from './chalk.service';
import { ConfigSchema } from '../schema/config.schema';
import { promisify } from 'util';
import { readFile } from 'fs';
import {
  CONFIG_FILE,
  createFile,
  SavePath,
  findAdventjsFolderInCurrentLevel,
} from './file.service';

export { parseConfig, readConfigAsync, generateConfig };

const readConfigAsync = promisify(readFile);
const chalk = getChalkLogger();

const parseConfig = async (): Promise<ConfigSchema | null> => {
  try {
    const rootFolder = findAdventjsFolderInCurrentLevel();
    if (!rootFolder) {
      console.error(
        chalk.red(
          '❌ No adventjs- folder found in the current directory. Please run "adventjs-cli init" first.',
        ),
      );
      return null;
    }
    const path = `${rootFolder}/${CONFIG_FILE.CONFIG}`;
    const data = await readConfigAsync(path, 'utf8');
    return JSON.parse(data);
  } catch {
    console.error(
      chalk.red(
        `❌ Configuration file ${CONFIG_FILE.CONFIG} not found. Please run "adventjs-cli init" first.`,
      ),
    );
    return null;
  }
};

const generateConfig = (
  year: string,
  tests: boolean,
  configFiles: boolean,
  dependencies: boolean,
): void => {
  console.log(chalk.blue('Generating configuration file...'));
  const config = { year, tests, vscode: configFiles, dependencies };
  createFile(year, SavePath.ROOT, CONFIG_FILE.CONFIG, JSON.stringify(config, null, 2));
  console.log(chalk.green('✅ Adventjs CLI Configuration file generated'));
};
