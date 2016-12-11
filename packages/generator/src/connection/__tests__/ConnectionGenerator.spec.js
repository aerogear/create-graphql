import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

import { getFileContent } from '../../../test/helpers';

import { getConfigDir } from '../../utils';

beforeEach(async () => {
  await helper.run(path.join(__dirname, '..'))
    .withArguments('Example')
    .toPromise();
});

const destinationDir = getConfigDir('connection');
const connectionFile = `${destinationDir}/ExampleConnection.js`;

it('generate a connection', async () => {
  assert.file([
    `${destinationDir}/ExampleConnection.js`,
  ]);

  const files = {
    connection: getFileContent(connectionFile),
  };

  expect(files).toMatchSnapshot();
});

it('should always import connectionDefinitions', () => {
  assert.fileContent(
    connectionFile, 'import { connectionDefinitions } from \'graphql-relay\';'
  );
});