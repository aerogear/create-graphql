import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import { getFileContent } from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const mutationGenerator = helper.run(path.join(__dirname, '..'));

it('generate a mutation file', async () => {
  const folder = await mutationGenerator.withArguments('Example').toPromise();

  const destinationDir = getConfigDir('mutation');
  const destinationTestDir = getConfigDir('mutation_test');

  assert.file([
    `${destinationDir}/ExampleAddMutation.js`, `${destinationDir}/ExampleEditMutation.js`,
  ]);

  const files = {
    add: getFileContent(`${folder}/${destinationDir}/ExampleAddMutation.js`),
    edit: getFileContent(`${folder}/${destinationDir}/ExampleEditMutation.js`),
    addTest: getFileContent(`${folder}/${destinationTestDir}/ExampleAddMutation.spec.js`),
    editTest: getFileContent(`${folder}/${destinationTestDir}/ExampleEditMutation.spec.js`),
  };

  expect(files).toMatchSnapshot();
});
