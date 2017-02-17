import path from 'path';
import fs from 'fs';
import recast from 'recast';
import pkgDir from 'pkg-dir';
import merge from 'lodash.merge';

const { visit } = recast.types;

const rootPath = pkgDir.sync('.') || '.';

/**
 * Uppercase the first letter of a text
 * @param text {string}
 * @returns {string}
 */
export const uppercaseFirstLetter = text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

const parseFieldToGraphQL = (field, ref) => {
  const graphQLField = {
    name: field.name,
    description: field.description,
    required: !!field.required,
    originalType: field.type,
    resolve: `obj.${field.name}`,
  };

  const name = uppercaseFirstLetter(field.name);
  const typeFileName = `${name}Type`;
  const loaderFileName = `${name}Loader`;

  switch (field.type) {
    case 'Number':
      return {
        ...graphQLField,
        type: 'GraphQLInt',
        flowType: 'number',
      };
    case 'Boolean':
      return {
        ...graphQLField,
        type: 'GraphQLBoolean',
        flowType: 'boolean',
      };
    case 'ObjectId':
      if (ref) {
        return {
          ...graphQLField,
          type: typeFileName,
          flowType: 'string',
          resolve: `await ${loaderFileName}.load(user, obj.${field.name})`,
          resolveArgs: 'async (obj, args, { user })',
          graphqlType: typeFileName,
          graphqlLoader: loaderFileName,
        };
      }

      return {
        ...graphQLField,
        type: 'GraphQLID',
        flowType: 'string',
      };
    case 'Date':
      return {
        ...graphQLField,
        type: 'GraphQLString',
        flowType: 'string',
        resolve: `obj.${field.name}.toISOString()`,
      };
    default:
      return {
        ...graphQLField,
        type: 'GraphQLString',
        flowType: 'string',
      };
  }
};

const parseGraphQLSchema = (mongooseFields, ref) => {
  const dependencies = [];
  const typeDependencies = [];
  const loaderDependencies = [];

  const fields = Object.keys(mongooseFields).map((name) => {
    const field = parseFieldToGraphQL(mongooseFields[name], ref);

    if (field.graphqlType) {
      if (typeDependencies.indexOf(field.graphqlType) === -1) {
        typeDependencies.push(field.graphqlType);
      }

      if (loaderDependencies.indexOf(field.graphqlLoader) === -1) {
        loaderDependencies.push(field.graphqlLoader);
      }
    } else if (dependencies.indexOf(field.type) === -1) {
      dependencies.push(field.type);
    }

    return field;
  });

  return {
    fields,
    dependencies,
    typeDependencies,
    loaderDependencies,
  };
};

/**
 * Parse the _options_ argument of a Mongoose model and check if it has a `timestamps` entry,
 * parse its content if it does
 * @param nodes {Array} The _options_ argument of `new mongoose.Schema()`
 * @returns {Array} The parsed value of timestamps with the provided field name
 */
const getSchemaTimestampsFromAst = (nodes) => {
  const timestampFields = [];

  nodes.forEach((node) => {
    if (node.key.name === 'timestamps') {
      node.value.properties.forEach((timestampProperty) => {
        const fieldName = timestampProperty.value.value;

        timestampFields[fieldName] = {
          name: fieldName,
          type: 'Date',
        };
      });
    }
  });

  return timestampFields;
};

const getSchemaFieldsFromAst = (node, withTimestamps) => {
  const astSchemaFields = node.arguments[0].properties;

  const fields = [];
  astSchemaFields.forEach((field) => {
    const name = field.key.name;

    const fieldDefinition = {};

    if (field.value.type === 'ArrayExpression') {
      return;
    }

    field.value.properties.forEach(({ key, value }) => {
      fieldDefinition[key.name] = value.name || value.value;
    });

    fields[name] = {
      name,
      ...fieldDefinition,
    };
  });

  if (withTimestamps) {
    const astSchemaTimestamp = getSchemaTimestampsFromAst(node.arguments[1].properties);

    return {
      ...fields,
      ...astSchemaTimestamp,
    };
  }

  return fields;
};

const getSchemaDefinition = (modelCode, withTimestamps, ref) => {
  const ast = recast.parse(modelCode, {
    parser: {
      parse: source => require('babylon').parse(source, { // eslint-disable-line global-require
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
        fields = getSchemaFieldsFromAst(node, withTimestamps);

        this.abort();
      }

      return this.traverse(expressionPath);
    },
  });

  return parseGraphQLSchema(fields, ref);
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

  const config = parseConfigFile(defaultFilePath);

  try {
    // Check if there is a `.graphqlrc` file in the root path
    const customConfig = parseConfigFile(`${rootPath}/.graphqlrc`);

    merge(config, customConfig);

    // If it does, extend default config with it, so if the custom config has a missing line
    // it won't throw errors
    return config;
  } catch (err) {
    // Return the default config if the custom doesn't exist
    return config;
  }
};

/**
 * Get a directory from the configuration file
 * @param directory {string} The name of the directory, e.g. 'source'/'mutation'
 * @returns {string} The directory path
 */
export const getConfigDir = directory => getCreateGraphQLConfig().directories[directory];

/**
 * Get the relative path directory between two directories specified on the config file
 * @param from {string} The calling directory of the script
 * @param to {[string]} The destination directories
 * @returns {string} The relative path, e.g. '../../src'
 */
export const getRelativeConfigDir = (from, to) => {
  const config = getCreateGraphQLConfig().directories;

  return to.reduce((directories, dir) => {
    const relativePath = path.posix.relative(config[from], config[dir]);

    return {
      ...directories,
      [dir]: relativePath === '' ? '.' : relativePath,
    };
  }, {});
};

/**
 * Get the Mongoose model schema code
 * @param modelPath {string} The path of the Mongoose model
 * @returns {string} The code of the Mongoose model
 */
const getModelCode = modelPath => fs.readFileSync(modelPath, 'utf8');

export const getMongooseModelSchema = ({
  model,
  withTimestamps = false,
  ref = false,
}) => {
  const modelDir = getCreateGraphQLConfig().directories.model;

  const modelPath = path.resolve(`${modelDir}/${model}.js`);

  const modelCode = getModelCode(modelPath);

  return getSchemaDefinition(modelCode, withTimestamps, ref);
};

/**
 * Camel cases text
 * @param text {string} Text to be camel-cased
 * @returns {string} Camel-cased text
 */
export const camelCaseText = text =>
  text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return '';
    }

    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
