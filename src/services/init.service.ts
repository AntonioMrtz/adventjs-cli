import { getChalkLogger } from './chalk.service';
import inquirer from 'inquirer';
import {
  DependenciesAnswer,
  TestsAnswer,
  YearAnswer,
  GenerateProjectAnswer,
  GenerateGitProjectAnswer,
  HuskyAnswer,
  AIInlineSuggestionsAnswer,
} from '../schema/answer.schema';
import { spawn } from 'child_process';
import {
  CONFIG_FILE,
  copyFromTemplates,
  copyFromTemplatesWithReplacements,
  copyFromTemplatesWithYearReplacement,
  createRootFolder,
  getRootFolderName,
} from './file.service';
import { isDev } from './dev.service';
import { generateConfig } from './config.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CURRENT_YEAR, SUPPORTED_YEARS } from '../schema/app.schema';
import { getDevDependencies } from './dependencies.service';

export { handleInit };

const chalk = getChalkLogger();

const handleInit = async (): Promise<void> => {
  _displayAsciiArt();

  console.log(
    chalk.bold.cyan('AdventJS CLI Generator – Spin up your AdventJS challenges in seconds! 🎄⚡'),
  );

  const dev = isDev();

  const userInput = {
    year: CURRENT_YEAR,
    tests: true,
    dependencies: true,
    generateProject: true,
    generateGitProject: true,
    husky: true,
    AIInlineSuggestions: true,
  };

  if (!dev) {
    const yearAnswer = await inquirer.prompt<YearAnswer>({
      type: 'list',
      name: 'year',
      message: 'Choose the year of the AdventJS challenges you want to set up:',
      choices: SUPPORTED_YEARS,
      default: CURRENT_YEAR,
    });
    userInput.year = yearAnswer.year;

    const testsAnswer = await inquirer.prompt<TestsAnswer>({
      type: 'confirm',
      name: 'tests',
      message: 'Do you want to use tests? (Recommended)',
      default: true,
    });
    userInput.tests = testsAnswer.tests;

    const dependenciesAnswer = await inquirer.prompt<DependenciesAnswer>({
      type: 'confirm',
      name: 'dependencies',
      message: 'Do you want to install dependencies? (Recommended)',
      default: true,
    });
    userInput.dependencies = dependenciesAnswer.dependencies;

    const generateProjectAnswer = await inquirer.prompt<GenerateProjectAnswer>({
      type: 'confirm',
      name: 'generateProject',
      message: 'Do you want to generate the AdventJS project now?',
      default: true,
    });
    userInput.generateProject = generateProjectAnswer.generateProject;

    const generateGitProjectAnswer = await inquirer.prompt<GenerateGitProjectAnswer>({
      type: 'confirm',
      name: 'generateGitProject',
      message: 'Do you want to generate a git project?',
      default: true,
    });
    userInput.generateGitProject = generateGitProjectAnswer.generateGitProject;

    const huskyAnswer = await inquirer.prompt<HuskyAnswer>({
      type: 'confirm',
      name: 'husky',
      message: 'Do you want to add Husky pre-commit hooks (format & lint)?',
      default: true,
    });
    userInput.husky = huskyAnswer.husky;

    const AIInlineSuggestions = await inquirer.prompt<AIInlineSuggestionsAnswer>({
      type: 'confirm',
      name: 'AIInlineSuggestions',
      message: 'Do you want to enable AI inline suggestions?',
      default: true,
    });
    userInput.AIInlineSuggestions = AIInlineSuggestions.AIInlineSuggestions;
  }

  createRootFolder(userInput.year);

  generateConfig(userInput.year, userInput.tests);

  await _generateProject(userInput.generateProject, userInput.year);
  await _generateGitProject(userInput.generateGitProject, userInput.year);

  _generateTsConfig(userInput.year);

  _generateConfigFiles(userInput.year, {
    tests: userInput.tests,
    AIInlineSuggestions: userInput.AIInlineSuggestions,
  });

  await _installDependencies(userInput.dependencies, userInput.year, {
    husky: userInput.husky,
    tests: userInput.tests,
    gitProject: userInput.generateGitProject,
  });

  await _installHusky(userInput.husky && userInput.generateGitProject, userInput.year);

  console.log(chalk.bold.green('🎉 Your AdventJS project is ready! Happy coding!'));
  console.log(
    chalk.bold.green(
      `🚀 To get started, cd ${getRootFolderName(userInput.year)} && npx adventjs-cli g 1`,
    ),
  );
  console.log(
    chalk.bold.green('🌐 Visit our website: https://antoniomrtz.github.io/adventjs-cli-web/'),
  );
};

const _installDependencies = (
  shouldInstall: boolean,
  year: string,
  options: {
    husky: boolean;
    tests: boolean;
    gitProject: boolean;
  },
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!shouldInstall) {
      resolve();
      return;
    }
    console.log(chalk.blue('Installing dependencies... (this may take a few moments)'));

    const devDependencies = getDevDependencies(options);

    const child = spawn('npm', ['install', '--save-dev', ...devDependencies], {
      cwd: getRootFolderName(year),
      stdio: 'inherit',
    });

    child.on('close', (code: number) => {
      if (code !== 0) {
        console.error(
          chalk.red(`❌ Error installing dependencies: process exited with code ${code}`),
        );
        reject(new Error(`npm install failed with code ${code}`));
        return;
      }
      console.log(chalk.green('✅ Dependencies installed successfully'));
      resolve();
    });

    child.on('error', (error: Error) => {
      console.error(chalk.red(`❌ Error installing dependencies: ${error.message}`));
      reject(error);
    });
  });
};

const _generateProject = (shouldGenerate: boolean, year: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!shouldGenerate) {
      resolve();
      return;
    }
    console.log(chalk.blue('Generating AdventJS project...'));
    try {
      copyFromTemplatesWithYearReplacement(year, CONFIG_FILE.PACKAGE_JSON);
      console.log(chalk.green('✅ AdventJS project generated successfully'));
      resolve();
    } catch (error) {
      console.error(
        chalk.red(
          `❌ Error generating project: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ),
      );
      reject(error);
    }
  });
};

const _generateGitProject = (shouldGenerate: boolean, year: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!shouldGenerate) {
      resolve();
      return;
    }
    console.log(chalk.blue('Generating git project...'));

    const child = spawn('git', ['init'], {
      cwd: getRootFolderName(year),
      stdio: 'inherit',
    });

    child.on('close', (code: number) => {
      if (code !== 0) {
        console.error(
          chalk.red(`❌ Error generating git project: process exited with code ${code}`),
        );
        reject(new Error(`git init failed with code ${code}`));
        return;
      }
      console.log(chalk.green('✅ Git project generated successfully'));
      resolve();
    });

    child.on('error', (error: Error) => {
      console.error(chalk.red(`❌ Error generating git project: ${error.message}`));
      reject(error);
    });
  });
};

const _generateConfigFiles = (
  year: string,
  options: {
    tests: boolean;
    AIInlineSuggestions: boolean;
  },
): void => {
  _generateGitignore(year);
  _generateEslintConfig(year);
  _generatePrettierConfig(year);
  _generateVscodeConfig(year, options.AIInlineSuggestions);
  _generateNvmrc(year);
  _generateReadme(year);
  _generateGithubConfig(year);

  if (options.tests) {
    _generateTestsConfig(year);
  }

  console.log(chalk.green('✅ Configuration files generated'));
};

const _generateTsConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.TSCONFIG);
  console.log(chalk.blue('Generating tsconfig.json file...'));
};

const _generateVscodeConfig = (year: string, AIInlineSuggestions: boolean): void => {
  copyFromTemplates(year, CONFIG_FILE.VSCODE);

  copyFromTemplatesWithReplacements(
    year,
    CONFIG_FILE.VSCODE_SETTINGS,
    CONFIG_FILE.VSCODE_SETTINGS,
    { AIInlineSuggestions: AIInlineSuggestions },
  );

  console.log(chalk.blue('Generating VSCode configuration...'));
};

const _generateReadme = (year: string): void => {
  copyFromTemplatesWithYearReplacement(year, CONFIG_FILE.README);
  console.log(chalk.blue('Generating README.md file...'));
};

const _generateTestsConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.VITEST);
  console.log(chalk.blue('Generating tests configuration...'));
};

const _generateGitignore = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.GITIGNORE_TEMPLATE, CONFIG_FILE.GITIGNORE);
  console.log(chalk.blue('Generating .gitignore file...'));
};

const _generateEslintConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.ESLINT);
  console.log(chalk.blue('Generating ESLint configuration...'));
};

const _generatePrettierConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.PRETTIER);
  copyFromTemplates(year, CONFIG_FILE.PRETTIER_IGNORE);
  console.log(chalk.blue('Generating Prettier configuration...'));
};

const _generateNvmrc = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.NVMRC);
  console.log(chalk.blue('Generating .nvmrc file...'));
};

const _generateGithubConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.GITHUB);
  console.log(chalk.blue('Generating GitHub configuration...'));
};

const _installHusky = async (shouldInstall: boolean, year: string): Promise<void> => {
  if (!shouldInstall) {
    return;
  }

  copyFromTemplates(year, CONFIG_FILE.HUSKY_DIR);

  return new Promise((resolve, reject) => {
    console.log(chalk.blue('Installing Husky...'));
    const child = spawn('npx', ['husky'], {
      cwd: getRootFolderName(year),
      stdio: 'inherit',
    });

    child.on('close', (code: number) => {
      if (code !== 0) {
        console.error(chalk.red(`❌ Error installing Husky: process exited with code ${code}`));
        reject(new Error(`Husky installation failed with code ${code}`));
        return;
      }
      console.log(chalk.green('✅ Husky installed successfully'));
      resolve();
    });

    child.on('error', (error: Error) => {
      console.error(chalk.red(`❌ Error installing Husky: ${error.message}`));
      reject(error);
    });
  });
};

const _displayAsciiArt = (): void => {
  try {
    const asciiPath = join(__dirname, '..', 'assets', 'ascii.txt');
    const asciiContent = readFileSync(asciiPath, 'utf-8');
    console.log(chalk.cyan(asciiContent));
  } catch {
    // Ignore errors related to ASCII art display
  }
};
