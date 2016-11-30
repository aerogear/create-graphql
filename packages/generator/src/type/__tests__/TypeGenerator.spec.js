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

it('generate a type file', async () => {
  const destinationDir = getCreateGraphQLConfig({
    directory: 'type',
  });

  assert.file([`${destinationDir}/ExampleType.js`]);
});
