import path from 'path';
import fs from 'fs';
import recast from 'recast';
import pkgDir from 'pkg-dir';

const { visit } = recast.types;

const rootPath = pkgDir.sync('.') || '.';

const getModelCode = modelPath => fs.readFileSync(modelPath, 'utf8');

const parseFieldToGraphQL = (field) => {
  const graphQLField = {
    name: field.name,
    description: field.description,
    required: !!field.required,
  };

  switch (field.type) {
    case 'Number':
      return {
        type: 'GraphQLInt',
        flowType: 'number',
        ...graphQLField,
      };
    case 'Boolean':
      return {
        type: 'GraphQLBoolean',
        flowType: 'boolean',
        ...graphQLField,
      };
    case 'ObjectId': {
      return {
        type: 'GraphQLID',
        flowType: 'string',
        ...graphQLField,
      };
    }
    default:
      return {
        type: 'GraphQLString',
        flowType: 'string',
        ...graphQLField,
      };
  }
};

const parseGraphQLSchema = (mongooseFields) => {
  const dependencies = [];
  const fields = Object.keys(mongooseFields).map((name) => {
    const field = parseFieldToGraphQL(mongooseFields[name]);

    if (dependencies.indexOf(field.type) === -1) {
      dependencies.push(field.type);
    }

    return field;
  });

  return {
    fields,
    dependencies,
  };
};

const getSchemaFieldsFromAst = (node) => {
  const astSchemaFields = node.arguments[0].properties;

  const fields = [];
  astSchemaFields.forEach((field) => {
    const name = field.key.name;
    const fieldDefinition = {};

    if (field.value.type === 'ArrayExpression') {
      return;
    }

    field.value.properties.forEach(({ key, value }) => {
      const fieldName = key.name;

      fieldDefinition[fieldName] = value.name || value.value;
    });

    fields[name] = {
      name,
      ...fieldDefinition,
    };
  });

  return fields;
};

const getSchemaDefinition = (modelCode) => {
  const ast = recast.parse(modelCode, {
    parser: {
      parse: source => require('babylon').parse(source, {
        sourceType: 'module',
        plugins: [
          'asyncFunctions',
          'asyncGenerators',
          'classConstructorCall',
          'classProperties',
          'flow',
          'objectRestSpread',
          'trailingFunctionCommas',
        ],
      }),
    },
  });

  let fields = null;

  visit(ast, {
    visitExpression: function visitExpression(expressionPath) { // eslint-disable-line object-shorthand
      const { node } = expressionPath;

      if (
        node.type === 'NewExpression' &&
        node.callee.object.name === 'mongoose' &&
        node.callee.property.name === 'Schema'
      ) {
        fields = getSchemaFieldsFromAst(node);

        this.abort();
      }

      return this.traverse(expressionPath);
    },
  });

  return parseGraphQLSchema(fields);
};

/**
 * Parse `.graphqlrc` config file and retrieve its contents
 * @param filePath {string} The path of the config file
 * @returns {*}
 */
const parseConfigFile = (filePath) => {
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const directories = Object.keys(config.directories).reduce((data, directory) => {
    if (directory === 'source') {
      return {
        ...data,
        [directory]: `${rootPath}/${config.directories[directory]}`,
      };
    }

    return {
      ...data,
      [directory]: `${config.directories.source}/${config.directories[directory]}`,
    };
  }, {});

  return {
    ...config,
    directories: {
      ...config.directories,
      ...directories,
    },
  };
};

/**
 * Get the `.graphqlrc` config file
 * @returns {object} The content of the config
 */
export const getCreateGraphQLConfig = () => {
  // Use default config
  const defaultFilePath = path.resolve(`${__dirname}/graphqlrc.json`);

  const defaultConfig = parseConfigFile(defaultFilePath);

  try {
    // Check if there is a `.graphqlrc` file in the root path
    const customConfig = parseConfigFile(`${rootPath}/.graphqlrc`);

    // If it does, extend default config with it, so if the custom config has a missing line
    // it won't throw errors
    return {
      ...defaultConfig,
      ...customConfig,
    };
  } catch (err) {
    // Return the default config if the custom doesn't exist
    return defaultConfig;
  }
};

/**
 * Get a directory from the configuration file
 * @param directory {string} The name of the directory, e.g. 'source'/'mutation'
 * @returns {string} The directory path
 */
export const getConfigDir = (directory) => getCreateGraphQLConfig().directories[directory];

/**
 * Get the relative path directory between two directories specified on the config file
 * @param from {string} The calling directory of the script
 * @param to {[string]} The destination directories
 * @returns {string} The relative path, e.g. '../../src'
 */
export const getRelativeConfigDir = (from, to) => {
  const config = getCreateGraphQLConfig().directories;

  return to.reduce((directories, dir) => {
    const relativePath = path.relative(config[from], config[dir]);

    return {
      ...directories,
      [dir]: relativePath,
    };
  }, {});
};

export const getMongooseModelSchema = (model) => {
  const modelDir = getCreateGraphQLConfig().directories.model;

  const modelPath = path.resolve(`${modelDir}/${model}.js`);

  const modelCode = getModelCode(modelPath);

  return getSchemaDefinition(modelCode);
};

/**
 * Camel cases text
 * @param text {string} Text to be camel-cased
 * @returns {string} Camel-cased text
 */
export const camelCaseText = (text) => {
  return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return '';
    }

    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

/**
 * Uppercase the first letter of a text
 * @param text {string}
 * @returns {string}
 */
export const uppercaseFirstLetter = text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;