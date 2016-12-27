import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';
import fs from 'fs-extra';

import {
  getFileContent,
  getFixturePath,
} from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const mutationGenerator = path.join(__dirname, '..');

it('generate mutation files', async () => {
  const folder = await helper.run(mutationGenerator)
    .withArguments('Example')
    .toPromise();

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

it('generate mutation files with schema', async () => {
  const folder = await helper.run(mutationGenerator)
    .inTmpDir(dir =>
      fs.copySync(
        getFixturePath('Post'),
        path.join(dir, 'src/model/Post.js'),
      ),
    )
    .withArguments('Post Post')
    .toPromise();

  const destinationDir = getConfigDir('mutation');
  const destinationTestDir = getConfigDir('mutation_test');

  assert.file([
    `${destinationDir}/PostAddMutation.js`, `${destinationDir}/PostEditMutation.js`,
  ]);

  const files = {
    add: getFileContent(`${folder}/${destinationDir}/PostAddMutation.js`),
    edit: getFileContent(`${folder}/${destinationDir}/PostEditMutation.js`),
    addTest: getFileContent(`${folder}/${destinationTestDir}/PostAddMutation.spec.js`),
    editTest: getFileContent(`${folder}/${destinationTestDir}/PostEditMutation.spec.js`),
  };

  expect(files).toMatchSnapshot();
});
