import helper from 'yeoman-test';
import assert from 'yeoman-assert';
import path from 'path';

jest.mock('utils');

import { getCreateGraphQLConfig } from 'utils';

beforeEach(async() => {
  return await helper.run(
    path.join(__dirname, '..')
  )
    .withArguments(['Example'])
    .toPromise();
});

const destinationDir = getCreateGraphQLConfig({
  directory: 'connection',
});

it('generate a connection file', () => {
  assert.file([`${destinationDir}/ExampleConnection.js`]);
});

it('should always import connectionDefinitions', () => {
  assert.fileContent(
    `${destinationDir}/ExampleConnection.js`, 'import { connectionDefinitions } from \'graphql-relay\';'
  );
});