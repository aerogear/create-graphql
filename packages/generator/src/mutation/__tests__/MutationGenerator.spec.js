import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';
import fs from 'fs';

import { getConfigDir } from '../../utils';

const mutationGenerator = helper.run(path.join(__dirname, '..'));

it('generate a mutation file', async () => {
  const folder = await mutationGenerator.withArguments('Example').toPromise();

  const destinationDir = getConfigDir('mutation');

  assert.file([
    `${destinationDir}/ExampleAddMutation.js`, `${destinationDir}/ExampleEditMutation.js`,
  ]);

  const addMutationContent = fs.readFileSync(`${folder}/${destinationDir}/ExampleAddMutation.js`, 'utf8');
  const editMutationContent = fs.readFileSync(`${folder}/${destinationDir}/ExampleEditMutation.js`, 'utf8');

  expect(addMutationContent).toMatchSnapshot();
  expect(editMutationContent).toMatchSnapshot();
});
