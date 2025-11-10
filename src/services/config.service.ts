import { getChalkLogger } from './chalk.service';
import { ConfigSchema } from '../schema/config.schema';
import { promisify } from 'util';
import { readFile } from 'fs';
import { CONFIG_FILE } from './file.service';

export { parseConfig, readConfigAsync };

const readConfigAsync = promisify(readFile);
const chalk = getChalkLogger();

const parseConfig = async (): Promise<ConfigSchema | null> => {
  try {
    const data = await readConfigAsync(CONFIG_FILE.CONFIG, 'utf8');
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
