import { getRelativeConfigDir } from '../utils';

it('should get the correct relative path', () => {
  const relativePath = getRelativeConfigDir('mutation', ['type', 'mutation_test']);

  expect(relativePath).toMatchSnapshot();
});
