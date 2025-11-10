import { config } from 'dotenv';

export { isDev, loadEnv };

/**
 * Load environment variables from .env file
 */
const loadEnv = (): void => {
  config({ quiet: true });
};

/**
 * Check if running in dev mode
 * Priority:
 * 1. process.env.DEV (set via .env or command line)
 * 2. process.argv contains --dev flag
 * @returns true if in dev mode
 */
const isDev = (): boolean => {
  loadEnv();

  // Check .env file
  if (process.env.DEV === 'true' || process.env.DEV === '1') {
    return true;
  }

  // Check command line arguments
  if (process.argv.includes('--dev')) {
    return true;
  }

  return false;
};
