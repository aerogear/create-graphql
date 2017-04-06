import fs from 'fs';
import path from 'path';
import merge from 'lodash.merge';
import * as babel from "babel-core";
import trimEnd from "lodash/trimEnd";

/**
 * Parse `.graphqlrc` config file and retrieve its contents
 * @param filePath {string} The path of the config file
 * @returns {*}
 */
const parseConfigFile = (filePath, rootPath) => {
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const directories = Object.keys(config.paths.directories).reduce((data, directory) => {
    if (directory === 'source') {
      return {
        ...data,
        [directory]: `${rootPath}/${config.paths.directories[directory]}`,
      };
    }

    return {
      ...data,
      [directory]: `${config.paths.directories[directory]}`,
      // [directory]: `${config.paths.directories.source}/${config.paths.directories[directory]}`,
    };
  }, {});

  return {
    ...config.paths,
    directories: {
      ...config.paths.directories,
      ...directories,
    },
  };
};

/**
 * Get the `.graphqlrc` config file
 * @returns {object} The content of the config
 */
export const getCreateGraphQLConfig = (rootPath) => {
  // Use default config
  const defaultFilePath = path.resolve(`${__dirname}/graphqlrc.json`);

  const config = parseConfigFile(defaultFilePath, rootPath);

  try {
    // Check if there is a `.graphqlrc` file in the root path
    const customConfig = parseConfigFile(`${rootPath}/.graphqlrc`, rootPath);

    merge(config, customConfig);

    // If it does, extend default config with it, so if the custom config has a missing line
    // it won't throw errors
    return config;
  } catch (err) {
    // Return the default config if the custom doesn't exist
    return config;
  }
};

function wrapPackagesArray(type, names, optionsDir) {
  return (names || []).map(function (val) {
    if (typeof val === 'string') val = [val];

    // relative path (outside of monorepo)
    if (val[0][0] === '.') {

      if (!optionsDir) {
        throw new Error('Please provide an options.json in test dir when using a ' +
          'relative plugin path.');
      }

      val[0] = path.resolve(optionsDir, val[0]);
    }
    // check node_modules/create-graphql-x-y
    else {
      val[0] = __dirname + '/../../create-graphql-' + type + '-' + val[0];
    }

    return val;
  });
}

export function readFile(filename) {
  if (fs.existsSync(filename)) {
    let file = trimEnd(fs.readFileSync(filename, "utf8"));
    file = file.replace(/\r\n/g, "\n");
    return file;
  } else {
    return "";
  }
}

function loadPlugin(pluginName) {
  console.log('pluginName: ', pluginName);
  // TODO - it should resolve inside node_modules as well
  const pluginPath = `../../create-graphql-plugin-${pluginName}/dist`;

  // check if plugin exist
  require.resolve(pluginPath);

  return require(pluginPath).default;
}

export default async function (rootPath, opts) {
  // const filePath = `${rootPath}/.graphqlrc`;
  const {
    name,
    schema,
  } = opts;

  const config = getCreateGraphQLConfig(rootPath);

  console.log('config: ', config);

  const schemaPath = path.join(config.directories.source, config.directories.model, `${schema}.js`);

  console.log('schemaPath: ', schemaPath);

  const pluginOpts = {
    schemaPath,
    name,
  };

  const plugins = opts.plugins.map((pluginName) => loadPlugin(pluginName)(pluginOpts));

  console.log('plugins: ', plugins);

  let fields = [];
  // getFields plugins
  for (const plugin of plugins) {
    if (plugin.getFields) {
      const result = plugin.getFields({}); // pass plugin specific options

      console.log('result: ', result);

      fields = [
        ...fields,
        ...result,
      ];
    }
  }

  console.log('fields: ', fields);

  const templates = [];
  // generateTemplates
  for (const plugin of plugins) {
    if (plugin.generateTemplates) {
      const result = plugin.generateTemplates({ fields }); // pass plugin specific options

      console.log('result: ', result);

      templates.push(result);
    }
  }

  console.log('templates: ', templates);

  return templates;
};

