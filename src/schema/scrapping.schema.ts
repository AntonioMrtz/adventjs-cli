export { FunctionData, ChallengeData, Language };

interface FunctionData {
  functionName: string;
  functionCode: string;
}

interface ChallengeData {
  description: string;
  functionData: FunctionData;
}

enum Language {
  TS = 'ts',
  PY = 'py',
}
