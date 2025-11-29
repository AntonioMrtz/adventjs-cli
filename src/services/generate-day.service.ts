import { parseConfig } from './config.service';
import { getChalkLogger } from './chalk.service';
import { addDayHeader, htmlToMarkdown } from './markdown.service';
import { createFile, createFolder, SavePath } from './file.service';
import { formatDayNumber } from './parsing.service';
import { FunctionData } from '../schema/scrapping.schema';
import { getChallengeDataFromJson } from './scrapping.service';

export { handleGenerateDay };

const CHALLENGE_URL_TEMPLATE = 'https://adventjs.dev/challenges';
const chalk = getChalkLogger();

const handleGenerateDay = async (day: string): Promise<void> => {
  const config = await parseConfig();
  if (!config) {
    return;
  }

  const dayNumber = parseInt(day, 10);
  // NOTE: we may need to adjust this range for future years. Some challenges have more than 25 days. Example: 2024 has 26 challenges.
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 25) {
    console.error(chalk.red('❌ Please provide a valid day number between 1 and 25.'));
    return;
  }

  const url = `${CHALLENGE_URL_TEMPLATE}/${config.year}/${dayNumber}`;

  console.log(chalk.cyan(`🌐 Fetching challenge from ${url}...`));

  const challengeData = await getChallengeDataFromJson(url, dayNumber);
  if (!challengeData) {
    console.error(chalk.red(`❌ Could not fetch the challenge data for day ${dayNumber}.`));
    return;
  }

  const markdown = htmlToMarkdown(challengeData.description);
  const markdownWithHeader = addDayHeader(markdown, dayNumber);

  _saveDayFiles(
    config.year,
    dayNumber,
    markdownWithHeader,
    challengeData.functionData,
    config.tests,
    config.runningFromRoot,
  );

  console.log(
    chalk.green(`✅ Challenge ${dayNumber} for year ${config.year} generated successfully.`),
  );
};

const _saveDayFiles = (
  year: string,
  day: number,
  descriptionMarkdown: string,
  functionData: FunctionData,
  generateTests: boolean,
  runningFromRoot: boolean,
): void => {
  console.log(chalk.blue(`Generating files for Day ${day}...`));
  const dayFormatted = formatDayNumber(String(day));
  const dayFolderName = dayFormatted;

  // Create day folder if it doesn't exist
  createFolder(year, dayFolderName, runningFromRoot);

  _generateMarkdownFile(year, dayFormatted, descriptionMarkdown, runningFromRoot);
  _generateTypeScriptFile(year, dayFormatted, functionData, runningFromRoot);

  if (generateTests) {
    _generateTests(year, day, dayFormatted, functionData, runningFromRoot);
  }
};

const _generateMarkdownFile = (
  year: string,
  formattedDay: string,
  descriptionMarkdown: string,
  runningFromRoot: boolean,
): void => {
  const mdDayFileName = `${formattedDay}.md`;
  createFile(year, SavePath.DAY, mdDayFileName, descriptionMarkdown, runningFromRoot, formattedDay);
};

const _generateTypeScriptFile = (
  year: string,
  formattedDay: string,
  functionData: FunctionData,
  runningFromRoot: boolean,
): void => {
  const tsDayFileName = `${formattedDay}.ts`;
  const exportHeader = `export { ${functionData.functionName} };\n\n`;
  const tsFileContent = `${exportHeader}${functionData.functionCode}\n`;
  createFile(year, SavePath.DAY, tsDayFileName, tsFileContent, runningFromRoot, formattedDay);
};

const _generateTests = (
  year: string,
  day: number,
  formattedDay: string,
  functionData: FunctionData,
  runningFromRoot: boolean,
): void => {
  const tsTestFileName = `${formattedDay}.spec.ts`;
  const testFileContent = `import { ${functionData.functionName} } from './${formattedDay}';\n\ndescribe('Challenge Day ${day}', () => {\n  it('should ...', () => {\n    // TODO: Add test cases\n  });\n});\n`;
  createFile(year, SavePath.DAY, tsTestFileName, testFileContent, runningFromRoot, formattedDay);
};
