import { parseConfig } from './config.service';
import { getChalkLogger } from './chalk.service';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { htmlToMarkdown } from './markdown.service';
import { isDev } from './dev.service';
import { fetchChallenge, fetchChallengeDev } from '../api/challenge.api';
import { scrapeDescription } from './scrapping.service';

export { handleGenerateDay };

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

  const response = isDev()
    ? await fetchChallengeDev()
    : await fetchChallenge(dayNumber, config.year);

  if (!response) {
    return;
  }

  const html = await response.text();
  const challengeDescription = scrapeDescription(html, dayNumber);
  if (!challengeDescription) {
    return;
  }

  const markdown = htmlToMarkdown(challengeDescription);

  _saveDay(markdown, config.year, dayNumber);

  console.log(
    chalk.green(`✅ Challenge ${dayNumber} for year ${config.year} generated successfully.`),
  );
};

const _saveDay = (descriptionMarkdown: string, year: string | number, day: number): void => {
  const dayFormatted = String(day).padStart(2, '0');
  const folderName = dayFormatted;
  const folderPath = join(process.cwd(), folderName);
  const fileName = `${dayFormatted}.md`;
  const filePath = join(folderPath, fileName);

  // Create folder if it doesn't exist
  mkdirSync(folderPath, { recursive: true });

  writeFileSync(filePath, descriptionMarkdown);
};
