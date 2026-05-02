import {
  HUSKY_DEV_DEPENDENCIES,
  REQUIRED_DEV_DEPENDENCIES,
  TEST_DEV_DEPENDENCIES,
} from '../schema/dependencies.schema';

export { getDevDependencies };

const getDevDependencies = (options: {
  husky: boolean;
  tests: boolean;
  gitProject: boolean;
}): string[] => {
  const dependencies: string[] = [...REQUIRED_DEV_DEPENDENCIES];

  if (options.husky && options.gitProject) {
    dependencies.push(...HUSKY_DEV_DEPENDENCIES);
  }

  if (options.tests) {
    dependencies.push(...TEST_DEV_DEPENDENCIES);
  }

  return dependencies;
};
