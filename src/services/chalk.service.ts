import chalk from 'chalk';

export { getChalkLogger };

const getChalkLogger = (): typeof chalk => {
  return chalk;
};
