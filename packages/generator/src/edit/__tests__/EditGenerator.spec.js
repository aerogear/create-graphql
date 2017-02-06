import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import {
  getFileContent,
} from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const editGenerator = path.join(__dirname, '..');

it('generate edit and edit mutation files', async () => {
  const folder = await helper.run(editGenerator)
    .withArguments('Example')
    .toPromise();

  const destinationDir = getConfigDir('edit');

  assert.file([
    `${destinationDir}/ExampleEdit.js`, `${destinationDir}/ExampleEditMutation.js`,
  ]);

  const files = {
    edit: getFileContent(`${folder}/${destinationDir}/ExampleEdit.js`),
    editMutation: getFileContent(`${folder}/${destinationDir}/ExampleEditMutation.js`),
  };

  expect(files).toMatchSnapshot();
});
