import { getChalkLogger } from './chalk.service';
import { launchBrowser, createPage, getChallengeDataFromPage } from './puppeteer.service';
import { FunctionData, ChallengeData } from '../schema/scrapping.schema';

export { getChallengeDataFromJson };

const chalk = getChalkLogger();

const getChallengeDataFromJson = async (
  url: string,
  day: number,
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

    if (!description || !typescriptCode) {
      console.error(
        chalk.red(`❌ Missing description or TypeScript code in page data for day ${day}.`),
      );
      return null;
    }

    // Parse function data from TypeScript code
    const functionData = _parseFunctionData(typescriptCode);
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
