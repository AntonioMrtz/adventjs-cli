import puppeteer, { Browser, Page } from 'puppeteer';
import { getChalkLogger } from './chalk.service';

export {
  launchBrowser,
  getPuppeteerConfig,
  createPage,
  waitForElement,
  getElementContent,
  getCodeBlockContent,
  clickButtonByProperty,
};

const chalk = getChalkLogger();

const PUPPETEER_CONFIG = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

const NAVIGATION_CONFIG = {
  waitUntil: 'networkidle2' as const,
  timeout: 30000,
};

const SELECTOR_WAIT_CONFIG = {
  timeout: 5000,
};

const getPuppeteerConfig = (): typeof PUPPETEER_CONFIG => PUPPETEER_CONFIG;

const launchBrowser = async (): Promise<Browser> => {
  try {
    const browser = await puppeteer.launch(PUPPETEER_CONFIG);
    return browser;
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error launching browser: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    throw error;
  }
};

const createPage = async (browser: Browser, url: string): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(url, NAVIGATION_CONFIG);
  return page;
};

const waitForElement = async (page: Page, selector: string): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, SELECTOR_WAIT_CONFIG);
    return true;
  } catch {
    console.warn(
      chalk.yellow(`⚠️  Element not found: "${selector}", but continuing with page content...`),
    );
    return false;
  }
};

const getElementContent = async (page: Page, selector: string): Promise<string | null> => {
  try {
    const content = await page.$eval(selector, (el) => {
      // Use textContent to get plain text without HTML tags
      // This will preserve the actual code better
      return el.textContent || '';
    });
    return content;
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error getting element content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};

const getCodeBlockContent = async (
  page: Page,
  selector: string,
  subSelector: string,
): Promise<string | null> => {
  try {
    const content = await page.$eval(
      selector,
      (el, subSel: string) => {
        // Get ALL view-line divs
        const lines = Array.from(el.querySelectorAll(subSel));

        // Sort by their visual position (using the 'top' CSS property from style attribute)
        const sortedLines = lines.sort((a: Element, b: Element) => {
          const aStyle = (a as HTMLElement).getAttribute('style') || '';
          const bStyle = (b as HTMLElement).getAttribute('style') || '';

          const aTop = parseInt(aStyle.match(/top:(\d+)/)?.[1] || '0');
          const bTop = parseInt(bStyle.match(/top:(\d+)/)?.[1] || '0');

          return aTop - bTop;
        });

        // Extract text from each line in the correct order
        const codeLines = sortedLines.map((lineEl: Element) => {
          // Get the textContent which includes all text from all nested spans
          let lineText = lineEl.textContent || '';

          // Normalize nbsp entities to spaces
          lineText = lineText.replace(/\xa0/g, ' ');

          // Normalize multiple spaces to single space
          lineText = lineText.replace(/\s+/g, ' ').trim();

          return lineText;
        });

        // Join with newlines, preserving each view-line as a separate line
        const result = codeLines.filter((line) => line.length > 0).join('\n');

        return result;
      },
      subSelector,
    );

    return content;
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error getting code block content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};

const clickButtonByProperty = async (
  page: Page,
  property: string,
  value: string,
  tag: string = '*',
): Promise<boolean> => {
  try {
    const selector = `${tag}[${property}="${value}"]`;

    // Wait for element to be visible before clicking
    await page.waitForSelector(selector, { visible: true, timeout: 3000 });

    await page.click(selector);
    chalk.green(`✓ Element ${tag}[${property}="${value}"] clicked successfully`);

    // Wait longer for the page to settle after click
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {
      // Navigation might not happen, that's okay
    });

    // Add extra wait time for content to update
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return true;
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error clicking element ${tag}[${property}="${value}"]: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return false;
  }
};
