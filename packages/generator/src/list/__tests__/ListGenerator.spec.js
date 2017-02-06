import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import {
  getFileContent,
} from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const listGenerator = path.join(__dirname, '..');

it('generate list files', async () => {
  const folder = await helper.run(listGenerator)
    .withArguments('Example')
    .toPromise();

  const destinationDir = getConfigDir('list');

  assert.file([
    `${destinationDir}/ExampleList.js`,
  ]);

  const files = {
    list: getFileContent(`${folder}/${destinationDir}/ExampleList.js`),
  };

  expect(files).toMatchSnapshot();
});
