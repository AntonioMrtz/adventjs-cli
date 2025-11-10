export { formatDayNumber };

const formatDayNumber = (day: string): string => {
  return day.padStart(2, '0');
};
