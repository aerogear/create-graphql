import path from 'path';
import mongoosePlugin from '../index';

/**
 * Get a fixture path
 * @param name {string} Name of the file of the fixture
 * @returns {string} The path of the fixture
 */
const getFixturePath = name => path.join(__dirname, `../../fixtures/${name}.js`);

it('should generate list of fields', async () => {
  const model = 'User';

  const modelPath = getFixturePath(model);
  const plugin = mongoosePlugin({ modelPath });
  const fields = plugin.getFields();

  expect(fields).toMatchSnapshot();
});
