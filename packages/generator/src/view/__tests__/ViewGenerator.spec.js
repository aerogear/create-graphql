import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import {
  getFileContent,
} from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const viewGenerator = path.join(__dirname, '..');

it('generate view files', async () => {
  const folder = await helper.run(viewGenerator)
    .withArguments('Example')
    .toPromise();

  const destinationDir = getConfigDir('view');

  assert.file([
    `${destinationDir}/ExampleView.js`,
  ]);

  const files = {
    view: getFileContent(`${folder}/${destinationDir}/ExampleView.js`),
  };

  expect(files).toMatchSnapshot();
});
