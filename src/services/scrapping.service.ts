import { getChalkLogger } from './chalk.service';
import {
  launchBrowser,
  createPage,
  waitForElement,
  getElementContent,
  getCodeBlockContent,
  clickButtonByProperty,
} from './puppeteer.service';
import { FunctionData, ChallengeData } from '../schema/scrapping.schema';

export { getChallengeData };

const ID_DESCRIPTION = 'challenge-description';
const CLASS_FUNCTION_BLOCK = '.view-lines';
const SUB_SELECTOR_FUNCTION_BLOCK = 'div.view-line';
const chalk = getChalkLogger();

const getChallengeData = async (url: string, day: number): Promise<ChallengeData | null> => {
  try {
    const browser = await launchBrowser();
    const page = await createPage(browser, url);

    const clickSuccess = await clickButtonByProperty(page, 'title', 'typescript', 'span');
    if (!clickSuccess) {
      console.warn(chalk.yellow('⚠️  Click on TypeScript button failed, continuing anyway...'));
    }

    // Wait longer for the content to change after clicking
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 }).catch(() => {});

    // Wait for function block to have specific content (not the placeholder)
    await page
      .waitForFunction(
        () => {
          const el = document.querySelector(CLASS_FUNCTION_BLOCK);
          if (!el || !el.textContent) return false;
          const content = el.textContent.trim();
          // Check that we don't have the placeholder content
          return content.length > 50 && !content.includes('Code here');
        },
        { timeout: 10000 },
      )
      .catch(() => {
        console.warn(
          chalk.yellow('⚠️  Function block content did not load properly, continuing anyway...'),
        );
      });

    // Add final delay to ensure all DOM is rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await waitForElement(page, `#${ID_DESCRIPTION}`);
    await waitForElement(page, CLASS_FUNCTION_BLOCK);

    const challengeDescription = await getElementContent(page, `#${ID_DESCRIPTION}`);
    const functionBlockHTML = await getCodeBlockContent(
      page,
      CLASS_FUNCTION_BLOCK,
      SUB_SELECTOR_FUNCTION_BLOCK,
    );

    await browser.close();

    if (!challengeDescription) {
      console.error(
        chalk.red(
          `❌ Could not find the challenge description for day ${day}. The structure of the page may have changed.`,
        ),
      );
      return null;
    }

    if (!functionBlockHTML) {
      console.error(
        chalk.red(
          `❌ Could not find the challenge function for day ${day}. The structure of the page may have changed.`,
        ),
      );
      return null;
    }

    // Parse function data
    const functionData = _parseFunctionData(functionBlockHTML);
    if (!functionData) {
      console.error(chalk.red(`❌ Could not parse the function data for day ${day}.`));
      return null;
    }

    return {
      description: challengeDescription,
      functionData,
    };
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error fetching challenge data for day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};

const _parseFunctionData = (codeText: string): FunctionData | null => {
  // Start with the single-line content
  let cleaned = codeText.trim();

  // Decode any remaining HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&quot;/g, '"');
  // eslint-disable-next-line quotes
  cleaned = cleaned.replace(/&#39;/g, "'");

  // Normalize multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Format the code: add newlines after { and before } appropriately
  // Replace " { " with " {\n  " to add newlines and indentation
  cleaned = cleaned.replace(/\s*{\s*/g, ' {\n  ');
  // Replace " } " with "\n}" to close blocks
  cleaned = cleaned.replace(/\s*}\s*/g, '\n}');
  // Replace comment markers with newlines
  cleaned = cleaned.replace(/\s+(\/\/.*?)(\s+return|\s*}|$)/g, '\n  $1\n  $2');

  // Clean up multiple newlines
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');

  // Trim overall
  cleaned = cleaned.trim();

  // Find export statement if exists
  const exportMatch = cleaned.match(/export\s*{\s*(\w+)\s*}/);
  let functionName = '';

  // Try to find function name from export first
  if (exportMatch && exportMatch[1]) {
    functionName = exportMatch[1];
  } else {
    // Otherwise find from function/const declaration
    const functionNameMatch = cleaned.match(/(?:function|const)\s+(\w+)\s*(?:\(|=)/);
    if (functionNameMatch && functionNameMatch[1]) {
      functionName = functionNameMatch[1];
    }
  }

  if (!functionName) {
    return null;
  }

  return {
    functionName,
    functionCode: cleaned,
  };
};
