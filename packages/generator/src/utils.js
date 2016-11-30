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
    parser: require('babylon'),
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
      configOpt === options.directory,
    );

    return (options.withRootPath) ?
      `${rootPath}/${config.directories.source}/${config.directories[directory]}` :
      `${config.directories.source}/${config.directories[directory]}`;
  }

  return config;
};

/**
 * Get the `.graphqlrc` config file
 * @param options {object} What to retrieve from the config file
 * @returns {*}
 */
export const getCreateGraphQLConfig = (options) => {
  try {
    return parseConfigFile(`${rootPath}/.graphqlrc`, options);
  } catch (err) {
    const defaultFilePath = path.resolve(`${__dirname}/graphqlrc.json`);

    return parseConfigFile(defaultFilePath, options);
  }
};

export const getRelativeConfigDir = (from, to) => {
  const fromDir = getCreateGraphQLConfig({
    directory: from,
  });

  const toDir = getCreateGraphQLConfig({
    directory: to,
  });

  return path.relative(fromDir, toDir);
};

export const getMongooseModelSchema = (model) => {
  const modelDir = getCreateGraphQLConfig({
    directory: 'model',
  });

  const modelPath = path.resolve(`${modelDir}/${model}.js`);

  const modelCode = getModelCode(modelPath);

  return getSchemaDefinition(modelCode);
};
