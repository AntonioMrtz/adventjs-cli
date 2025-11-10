import { load } from 'cheerio';
import { getChalkLogger } from './chalk.service';

export { scrapeDescription };

const ID_DESCRIPTION = 'challenge-description';
const chalk = getChalkLogger();

const scrapeDescription = (html: string, day: number): string | null => {
  const $ = load(html);

  const challengeDescription = $(`#${ID_DESCRIPTION}`).html();
  if (!challengeDescription) {
    console.error(
      chalk.red(
        `❌ Could not find the challenge description for day ${day}. The structure of the page may have changed.`,
      ),
    );
    return null;
  }

  return challengeDescription;
};
