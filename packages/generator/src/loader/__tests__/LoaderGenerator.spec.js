import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import { getFileContent } from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const loaderGenerator = helper.run(path.join(__dirname, '..'));

it('generate a loader', async () => {
  const folder = await loaderGenerator.withArguments('Example').toPromise();

  const destinationDir = getConfigDir('loader');

  assert.file([
    `${destinationDir}/ExampleLoader.js`,
  ]);

  const files = {
    loader: getFileContent(`${folder}/${destinationDir}/ExampleLoader.js`),
  };

  expect(files).toMatchSnapshot();
});
