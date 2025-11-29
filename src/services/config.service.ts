import { getChalkLogger } from './chalk.service';
import { ConfigSchema } from '../schema/config.schema';
import { promisify } from 'util';
import { readFile } from 'fs';
import {
  CONFIG_FILE,
  createFile,
  SavePath,
  findAdventjsFolderInCurrentLevel,
  isConfigFileInCurrentDirectory,
} from './file.service';

export { parseConfig, readConfigAsync, generateConfig };

const readConfigAsync = promisify(readFile);
const chalk = getChalkLogger();

const parseConfig = async (): Promise<ConfigSchema | null> => {
  try {
    let parsedJson: ConfigSchema | null = null;

    const isRootFolderPresent = findAdventjsFolderInCurrentLevel();
    const isConfigPresentCurrentDir = isConfigFileInCurrentDirectory();

    if (isRootFolderPresent) {
      const path = `${isRootFolderPresent}/${CONFIG_FILE.CONFIG}`;
      const data = await readConfigAsync(path, 'utf8');
      parsedJson = JSON.parse(data);
    }

    if (isConfigPresentCurrentDir) {
      const data = await readConfigAsync(CONFIG_FILE.CONFIG, 'utf8');
      parsedJson = JSON.parse(data);
    }

    if (parsedJson && (isRootFolderPresent || isConfigPresentCurrentDir)) {
      // Config present inside root folder takes precedence
      parsedJson.runningFromRoot = !isConfigPresentCurrentDir && Boolean(isRootFolderPresent);
      return parsedJson;
    }

    console.error(
      chalk.red(
        `❌ No adventjs-* folder or ${CONFIG_FILE.CONFIG} found in the current directory. Please run "adventjs-cli init" first.`,
      ),
    );
    return null;
  } catch {
    console.error(chalk.red(`❌ Error getting config from ${CONFIG_FILE.CONFIG}.`));
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
  createFile(
    year,
    SavePath.ROOT,
    CONFIG_FILE.CONFIG,
    JSON.stringify(config, null, 2),
    true, // Always create config from root
  );
  console.log(chalk.green('✅ Adventjs CLI Configuration file generated'));
};
