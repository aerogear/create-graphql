import { getRelativeConfigDir } from '../utils';

it('should get the correct relative path', () => {
  const relativeMutationTypePath = getRelativeConfigDir('mutation', 'type');
  const relativeConnectionMutationTestPath = getRelativeConfigDir('connection', 'mutation_test');

  expect(relativeMutationTypePath).toBe('../type');
  expect(relativeConnectionMutationTestPath).toBe('../mutation/__tests__');
});
