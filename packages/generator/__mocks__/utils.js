import path from 'path';
import fs from 'fs';

/**
 * Parse `.graphqlrc` config file and retrieve its contents
 * @param filePath {string} The path of the config file
 * @param options {object} What to retrieve from the config file
 * @returns {*}
 */
const parseConfigFile = (filePath, opts) => {
  const options = {
    withRootPath: true, // Whether this should return with `rootPath` or not
    ...opts,
  };

  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (options.directory) {
    const directory = Object.keys(config.directories).filter(configOpt =>
      configOpt === options.directory
    );

    return `${config.directories.source}/${config.directories[directory]}`;
  }

  return config;
};

/**
 * Get the `.graphqlrc` config file
 * @param options {object} What to retrieve from the config file
 * @returns {*}
 */
export const getCreateGraphQLConfig = (options) => {
  return parseConfigFile(`${__dirname}/../src/graphqlrc.json`, options);
};