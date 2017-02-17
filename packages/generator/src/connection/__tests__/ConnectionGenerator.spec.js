import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';
import fs from 'fs-extra';

import {
  getFileContent,
  getFixturePath,
} from '../../../test/helpers';

import { getConfigDir } from '../../utils';

const connectionGenerator = path.join(__dirname, '..');

it('generate a connection', async () => {
  const folder = await helper.run(connectionGenerator)
    .withArguments('Example')
    .toPromise();

  const destinationDir = getConfigDir('connection');

  assert.file([
    `${destinationDir}/ExampleConnection.js`,
  ]);

  const files = {
    connection: getFileContent(`${folder}/${destinationDir}/ExampleConnection.js`),
  };

  expect(files).toMatchSnapshot();
});

it('generate a connection with schema', async () => {
  const folder = await helper.run(connectionGenerator)
    .inTmpDir(dir =>
      fs.copySync(
        getFixturePath('Post'),
        path.join(dir, 'src/model/Post.js'),
      ),
    )
    .withArguments('Post Post')
    .toPromise();

  const destinationDir = getConfigDir('connection');

  assert.file([
    `${destinationDir}/PostConnection.js`,
  ]);

  const files = {
    connection: getFileContent(`${folder}/${destinationDir}/PostConnection.js`),
  };

  expect(files).toMatchSnapshot();
});

it('should always import connectionDefinitions', async () => {
  await helper.run(connectionGenerator)
    .withArguments('Example')
    .toPromise();

  const destinationDir = getConfigDir('connection');
  const connectionFile = `${destinationDir}/ExampleConnection.js`;

  assert.fileContent(
    connectionFile, 'import { connectionDefinitions } from \'graphql-relay\';',
  );
});
