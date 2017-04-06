import path from 'path';
import core from '../index';

/**
 * Get a fixture path
 * @param name {string} Name of the file of the fixture
 * @returns {string} The path of the fixture
 */
const getFixturePath = name => path.join(__dirname, `../../fixtures/${name}`);

it('should call getFields of first plugin, and generateTemplate from the second one', async () => {
  const testName = 'mongoose-type';
  const testPath = getFixturePath(testName);

  const opts = {
    plugins: ['mongoose', 'type'],
    name: 'User',
    schema: 'User',
  };

  const templates = await core(testPath, opts);

  expect(templates).toMatchSnapshot();
});
