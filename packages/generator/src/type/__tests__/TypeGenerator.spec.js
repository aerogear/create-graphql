import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';
import fs from 'fs-extra';

import {
  getFileContent,
  getFixturePath,
} from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const typeGenerator = path.join(__dirname, '..');

it('generate a type', async () => {
  const folder = await helper.run(typeGenerator)
    .withArguments('Example')
    .toPromise();

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

it('generate a type with schema', async () => {
  const folder = await helper.run(typeGenerator)
    .inTmpDir(dir =>
      fs.copySync(
        getFixturePath('Post'),
        path.join(dir, 'src/model/Post.js'),
      ),
    )
    .withArguments('Post Post')
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

it('generate a type with schema and without timestamps', async () => {
  const folder = await helper.run(typeGenerator)
    .inTmpDir(dir =>
      fs.copySync(
        getFixturePath('User'),
        path.join(dir, 'src/model/User.js'),
      ),
    )
    .withArguments('User User')
    .toPromise();

  const destinationDir = getConfigDir('type');
  const destinationTestDir = getConfigDir('type_test');

  assert.file([
    `${destinationDir}/UserType.js`, `${destinationTestDir}/UserType.spec.js`,
  ]);

  const files = {
    type: getFileContent(`${folder}/${destinationDir}/UserType.js`),
    typeTest: getFileContent(`${folder}/${destinationTestDir}/UserType.spec.js`),
  };

  expect(files).toMatchSnapshot();
});
