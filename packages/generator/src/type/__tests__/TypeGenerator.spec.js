import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import { getFileContent } from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const typeGenerator = helper.run(path.join(__dirname, '..'));

it('generate a type', async () => {
  const folder = await typeGenerator.withArguments('Example').toPromise();

  const destinationDir = getConfigDir('type');
  const destinationTestDir = getConfigDir('type_test');

  assert.file([
    `${destinationDir}/ExampleType.js`, `${destinationTestDir}/ExampleType.spec.js`,
  ]);

  const files = {
    type: getFileContent(`${folder}/${destinationDir}/ExampleType.js`),
    typeTest: getFileContent(`${folder}/${destinationTestDir}/ExampleType.spec.js`),
  };

  expect(files).toMatchSnapshot();
});
