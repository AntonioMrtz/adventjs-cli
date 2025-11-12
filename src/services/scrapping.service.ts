import { getChalkLogger } from './chalk.service';
import { launchBrowser, createPage, getChallengeDataFromPage } from './puppeteer.service';
import { FunctionData, ChallengeData, Language } from '../schema/scrapping.schema';

export { getChallengeDataFromJson };

const chalk = getChalkLogger();

const getChallengeDataFromJson = async (
  url: string,
  day: number,
  language: Language,
): Promise<ChallengeData | null> => {
  try {
    const browser = await launchBrowser();
    const page = await createPage(browser, url);

    // Extract JSON data that was already loaded with the page
    const jsonData = await getChallengeDataFromPage(page);

    await browser.close();

    if (!jsonData || !jsonData.props || !jsonData.props.pageProps) {
      console.error(chalk.red(`❌ Could not find JSON data in page for day ${day}.`));
      return null;
    }

    const pageProps = jsonData.props.pageProps;
    const description = pageProps.description;
    const typescriptCode = pageProps.defaultCode?.typescript;
    const pythonCode = pageProps.defaultCode?.python;

    if (!description || !typescriptCode || !pythonCode) {
      console.error(chalk.red(`❌ Missing description or code in page data for day ${day}.`));
      return null;
    }

    // Parse function data from TypeScript code
    let functionData: FunctionData | null;
    switch (language) {
      case Language.TS:
        functionData = _parseFunctionData(typescriptCode);
        break;
      case Language.PY:
        functionData = _parsePythonFunctionData(pythonCode);
        break;
      default:
        console.error(chalk.red(`❌ Unsupported language '${language}' for day ${day}.`));
        return null;
    }

    if (!functionData) {
      console.error(chalk.red(`❌ Could not parse the function data for day ${day}.`));
      return null;
    }

    chalk.green(`✓ Challenge data extracted from page JSON for day ${day}`);

    return {
      description,
      functionData,
    };
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error fetching challenge data from JSON for day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};

const _parseFunctionData = (codeText: string): FunctionData | null => {
  const functionNameMatch = codeText.match(/function\s+(\w+)\s*\(/);
  if (!functionNameMatch) return null;
  const functionName = functionNameMatch[1];
  return {
    functionName,
    functionCode: codeText.trim(),
  };
};

/**
 * Parses Python function code and extracts the function name and code block.
 * Returns null if no function is found.
 */
const _parsePythonFunctionData = (codeText: string): FunctionData | null => {
  // Split by lines and trim
  const lines = codeText.split('\n');
  let functionName = '';
  let functionStart = -1;
  let indent = '';
  // Find the first function definition
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^\s*def\s+(\w+)\s*\(/);
    if (match) {
      functionName = match[1];
      functionStart = i;
      indent = lines[i].match(/^\s*/)?.[0] || '';
      break;
    }
  }
  if (!functionName || functionStart === -1) return null;

  // Extract the function block (assumes no nested functions)
  const functionLines = [lines[functionStart]];
  for (let i = functionStart + 1; i < lines.length; i++) {
    // Stop if indentation is less or equal to the function definition
    if (lines[i].trim() === '') {
      functionLines.push(lines[i]);
      continue;
    }
    const currentIndent = lines[i].match(/^\s*/)?.[0] || '';
    if (currentIndent.length <= indent.length && !lines[i].startsWith(indent + ' ')) {
      break;
    }
    functionLines.push(lines[i]);
  }
  const functionCode = functionLines.join('\n').trim();
  return {
    functionName,
    functionCode,
  };
};
