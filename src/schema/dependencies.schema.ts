const _coreDependencies = ['adventjs-cli'] as const;
const TEST_DEV_DEPENDENCIES = ['vitest'] as const;
const HUSKY_DEV_DEPENDENCIES = ['husky'] as const;
const _prettierDevDependencies = ['prettier'] as const;
const _eslintDevDependencies = [
  '@eslint/js',
  'eslint',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
] as const;
const _typescriptDevDependencies = ['typescript', 'tsx'] as const;

const REQUIRED_DEV_DEPENDENCIES = [
  ..._coreDependencies,
  ..._prettierDevDependencies,
  ..._eslintDevDependencies,
  ..._typescriptDevDependencies,
] as const;

export { REQUIRED_DEV_DEPENDENCIES, TEST_DEV_DEPENDENCIES, HUSKY_DEV_DEPENDENCIES };
