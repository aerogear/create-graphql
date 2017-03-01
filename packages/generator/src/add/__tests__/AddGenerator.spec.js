import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import {
  getFileContent,
} from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const addGenerator = path.join(__dirname, '..');

it('generate add and add mutation files', async () => {
  const folder = await helper.run(addGenerator)
    .withArguments('Example')
    .toPromise();

  const destinationDir = getConfigDir('add');

  assert.file([
    `${destinationDir}/ExampleAdd.js`, `${destinationDir}/ExampleAddMutation.js`,
  ]);

  const files = {
    add: getFileContent(`${folder}/${destinationDir}/ExampleAdd.js`),
    addMutation: getFileContent(`${folder}/${destinationDir}/ExampleAddMutation.js`),
  };

  expect(files).toMatchSnapshot();
});
