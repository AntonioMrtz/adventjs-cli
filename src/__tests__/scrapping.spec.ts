/* eslint-disable quotes */
import { getChallengeUrl } from '../api/challenge.api';
import { getChallengeDataFromJson } from '../services/scrapping.service';

describe('Scrapping Service', () => {
  it('01 - TypeScript', async () => {
    const url = getChallengeUrl(1, 2024);
    const challengeData = await getChallengeDataFromJson(url, 1);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('prepareGifts');
    expect(functionData?.functionCode).toContain(
      'function prepareGifts(gifts: number[]): number[] {\n  // Code here\n  return []\n}',
    );
  });

  it('02 - TypeScript', async () => {
    const url = getChallengeUrl(2, 2024);
    const challengeData = await getChallengeDataFromJson(url, 2);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('createFrame');
    expect(functionData?.functionCode).toContain(
      "function createFrame(names: string[]): string {\n  // Code here\n  return '*'\n}",
    );
  });

  it('03 - TypeScript', async () => {
    const url = getChallengeUrl(3, 2024);
    const challengeData = await getChallengeDataFromJson(url, 3);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('organizeInventory');
    expect(functionData?.functionCode).toContain(
      'function organizeInventory(inventory: Inventory): object {\n  // Code here\n  return {}\n}',
    );
  });

  it('04 - TypeScript', async () => {
    const url = getChallengeUrl(4, 2024);
    const challengeData = await getChallengeDataFromJson(url, 4);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('createXmasTree');
    expect(functionData?.functionCode).toContain(
      "function createXmasTree(height: number, ornament: string): string {\n  /* Code here */\n  return ''\n}",
    );
  });

  it('05 - TypeScript', async () => {
    const url = getChallengeUrl(5, 2024);
    const challengeData = await getChallengeDataFromJson(url, 5);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('organizeShoes');
    expect(functionData?.functionCode).toContain(
      'function organizeShoes(shoes: Shoe[]): number[] {\n  return []\n}',
    );
  });

  it('06 - TypeScript', async () => {
    const url = getChallengeUrl(6, 2024);
    const challengeData = await getChallengeDataFromJson(url, 6);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('inBox');
    expect(functionData?.functionCode).toContain(
      'function inBox(box: string[]): boolean {\n  return false\n}',
    );
  });

  it('07 - TypeScript', async () => {
    const url = getChallengeUrl(7, 2024);
    const challengeData = await getChallengeDataFromJson(url, 7);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('fixPackages');
    expect(functionData?.functionCode).toContain(
      "function fixPackages(packages: string): string {\n  // Code here\n  return ''\n}",
    );
  });

  it('08 - TypeScript', async () => {
    const url = getChallengeUrl(8, 2024);
    const challengeData = await getChallengeDataFromJson(url, 8);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('drawRace');
    expect(functionData?.functionCode).toContain(
      "function drawRace(indices: number[], length: number): string {\n  // Code here\n  return ''\n}",
    );
  });

  it('09 - TypeScript', async () => {
    const url = getChallengeUrl(9, 2024);
    const challengeData = await getChallengeDataFromJson(url, 9);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('moveTrain');
    // Normalize whitespace, invisible characters, and semicolons for robust comparison
    const received = functionData?.functionCode
      .replace(/[\s·]+/g, ' ')
      .replace(/;/g, '')
      .trim();
    const expected = [
      'type Board = string[]',
      "type Movement = 'U' | 'D' | 'R' | 'L'",
      "type Result = 'none' | 'crash' | 'eat'",
      'function moveTrain(board: Board, mov: Movement): Result {',
      '  // Code here',
      "  return 'none'",
      '}',
    ]
      .join(' ')
      .replace(/[\s·]+/g, ' ')
      .replace(/;/g, '')
      .trim();
    expect(received).toContain(expected);
  });

  it('10 - TypeScript', async () => {
    const url = getChallengeUrl(10, 2024);
    const challengeData = await getChallengeDataFromJson(url, 10);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('compile');
    expect(functionData?.functionCode).toContain(
      'function compile (instructions: string[]): number {\n  // Code here\n  return 0\n}',
    );
  });

  it('11 - TypeScript', async () => {
    const url = getChallengeUrl(11, 2024);
    const challengeData = await getChallengeDataFromJson(url, 11);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('decodeFilename');
    expect(functionData?.functionCode).toContain(
      "function decodeFilename(filename: string): string {\n    // Code here\n    return ''\n  }",
    );
  });

  it('12 - TypeScript', async () => {
    const url = getChallengeUrl(12, 2024);
    const challengeData = await getChallengeDataFromJson(url, 12);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('calculatePrice');
    expect(functionData?.functionCode).toContain(
      'function calculatePrice(ornaments: string): number {\n  // Code here\n  return 0\n}',
    );
  });

  it('13 - TypeScript', async () => {
    const url = getChallengeUrl(13, 2024);
    const challengeData = await getChallengeDataFromJson(url, 13);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('isRobotBack');
    expect(functionData?.functionCode).toContain(
      'function isRobotBack(moves: string): true | [number, number] {\n  // Code here\n  return true\n}',
    );
  });

  it('14 - TypeScript', async () => {
    const url = getChallengeUrl(14, 2024);
    const challengeData = await getChallengeDataFromJson(url, 14);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('minMovesToStables');
    expect(functionData?.functionCode).toContain(
      'function minMovesToStables(reindeer: number[], stables: number[]): number {\n  // Code here\n  return 0\n}',
    );
  });

  it('15 - TypeScript', async () => {
    const url = getChallengeUrl(15, 2024);
    const challengeData = await getChallengeDataFromJson(url, 15);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('drawTable');
    expect(functionData?.functionCode).toContain(
      "function drawTable(data: Array<Record<string, string | number>>): string {\n  // Code here\n  return ''\n}",
    );
  });

  it('16 - TypeScript', async () => {
    const url = getChallengeUrl(16, 2024);
    const challengeData = await getChallengeDataFromJson(url, 16);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('removeSnow');
    expect(functionData?.functionCode).toContain(
      "function removeSnow(s: string): string {\n  // Code here\n  return '';\n}",
    );
  });

  it('17 - TypeScript', async () => {
    const url = getChallengeUrl(17, 2024);
    const challengeData = await getChallengeDataFromJson(url, 17);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('detectBombs');
    expect(functionData?.functionCode).toContain(
      'function detectBombs(grid: boolean[][]): number[][] {\n  // Code here\n  return []\n}',
    );
  });

  it('18 - TypeScript', async () => {
    const url = getChallengeUrl(18, 2024);
    const challengeData = await getChallengeDataFromJson(url, 18);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('findInAgenda');
    expect(functionData?.functionCode).toContain(
      'function findInAgenda(agenda: string, phone: string): { name: string; address: string } | null {\n// Code here\nreturn null\n  }',
    );
  });

  it('19 - TypeScript', async () => {
    const url = getChallengeUrl(19, 2024);
    const challengeData = await getChallengeDataFromJson(url, 19);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('distributeWeight');
    // Normalize semicolons for robust comparison
    const code = functionData?.functionCode.replace(/;/g, '');
    expect(code).toContain(
      "function distributeWeight(weight: number): string {\n  // Code here\n  return ''\n}",
    );
  });

  it('20 - TypeScript', async () => {
    const url = getChallengeUrl(20, 2024);
    const challengeData = await getChallengeDataFromJson(url, 20);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('fixGiftList');
    expect(functionData?.functionCode).toContain(
      'function fixGiftList(received: string[], expected: string[]): { missing: Record<string, number>, extra: Record<string, number> } {\n  // Escribe tu código aquí\n  return {\n    missing: {},\n    extra: {}\n  }\n}',
    );
  });

  it('21 - TypeScript', async () => {
    const url = getChallengeUrl(21, 2024);
    const challengeData = await getChallengeDataFromJson(url, 21);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('treeHeight');
    expect(functionData?.functionCode).toContain(
      'function treeHeight(tree: { value: string; left: any; right: any } | null): number {\n  // Write your code here\n  return 0\n}',
    );
  });

  it('22 - TypeScript', async () => {
    const url = getChallengeUrl(22, 2024);
    const challengeData = await getChallengeDataFromJson(url, 22);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('generateGiftSets');
    expect(functionData?.functionCode).toContain(
      'function generateGiftSets(gifts: string[]): string[][] {\n  // Code here\n  return []\n}',
    );
  });

  it('23 - TypeScript', async () => {
    const url = getChallengeUrl(23, 2024);
    const challengeData = await getChallengeDataFromJson(url, 23);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('findMissingNumbers');
    expect(functionData?.functionCode).toContain(
      'function findMissingNumbers(nums: number[]): number[] {\n  // Code here\n  return []\n}',
    );
  });

  it('24 - TypeScript', async () => {
    const url = getChallengeUrl(24, 2024);
    const challengeData = await getChallengeDataFromJson(url, 24);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('isTreesSynchronized');
    expect(functionData?.functionCode).toContain(
      "function isTreesSynchronized(\n  tree1: { value: string; left?: any; right?: any } | undefined,\n  tree2: { value: string; left?: any; right?: any } | undefined\n): [boolean, string] {\n  // Code here\n  return [false, '']\n}",
    );
  });

  it('25 - TypeScript', async () => {
    const url = getChallengeUrl(25, 2024);
    const challengeData = await getChallengeDataFromJson(url, 25);
    const functionData = challengeData?.functionData;
    const description = challengeData?.description;
    expect(description).toBeDefined();
    expect(functionData).toBeDefined();
    expect(functionData?.functionName).toBe('execute');
    expect(functionData?.functionCode).toContain(
      'function execute(code: string): number {\n  // Code here\n  return 0\n}',
    );
  });
});
