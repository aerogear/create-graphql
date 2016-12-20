import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';
import fs from 'fs-extra';

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

it('generate a type with Schema', async () => {
  const folder = await typeGenerator
    .inTmpDir((dir) => {
      fs.copySync(path.join(__dirname, '../fixtures/Post.js'), path.join(dir, 'src/model/Post.js'));
    })
    .withArguments('Post --schema Post')
    .toPromise();

  const destinationDir = getConfigDir('type');
  const destinationTestDir = getConfigDir('type_test');

  assert.file([
    `${destinationDir}/PostType.js`, `${destinationTestDir}/PostType.spec.js`,
  ]);

  const files = {
    type: getFileContent(`${folder}/${destinationDir}/PostType.js`),
    typeTest: getFileContent(`${folder}/${destinationTestDir}/PostType.spec.js`),
  };

  expect(files).toMatchSnapshot();
});
