import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';
import fs from 'fs-extra';

import {
  getFileContent,
  getFixturePath,
} from '../../../test/helpers';
import { getConfigDir } from '../../utils';

const loaderGenerator = path.join(__dirname, '..');

it('generate a loader', async () => {
  const folder = await helper.run(loaderGenerator)
    .withArguments('Example')
    .toPromise();

  const destinationDir = getConfigDir('loader');

  assert.file([
    `${destinationDir}/ExampleLoader.js`,
  ]);

  const files = {
    loader: getFileContent(`${folder}/${destinationDir}/ExampleLoader.js`),
  };

  expect(files).toMatchSnapshot();
});

it('generate a loader with schema', async () => {
  const folder = await helper.run(loaderGenerator)
    .inTmpDir(dir =>
      fs.copySync(
        getFixturePath('Post'),
        path.join(dir, 'src/model/Post.js'),
      ),
    )
    .withArguments('Post Post')
    .toPromise();

  const destinationDir = getConfigDir('loader');

  assert.file([
    `${destinationDir}/PostLoader.js`,
  ]);

  const files = {
    loader: getFileContent(`${folder}/${destinationDir}/PostLoader.js`),
  };

  expect(files).toMatchSnapshot();
});

it('generate a loader with schema and without timestamps', async () => {
  const folder = await helper.run(loaderGenerator)
    .inTmpDir(dir =>
      fs.copySync(
        getFixturePath('User'),
        path.join(dir, 'src/model/User.js'),
      ),
    )
    .withArguments('User User')
    .toPromise();

  const destinationDir = getConfigDir('loader');

  assert.file([
    `${destinationDir}/UserLoader.js`,
  ]);

  const files = {
    loader: getFileContent(`${folder}/${destinationDir}/UserLoader.js`),
  };

  expect(files).toMatchSnapshot();
});
