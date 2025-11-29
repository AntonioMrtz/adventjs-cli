interface ConfigSchema {
  year: string;
  tests: boolean;
  vscode: boolean;
  dependencies: boolean;
  // Indicates if running from root folder. If not we're running from adventjs-* folder
  runningFromRoot: boolean;
}
export { ConfigSchema };
