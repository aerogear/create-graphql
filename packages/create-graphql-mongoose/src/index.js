import fs from 'fs';
import recast from 'recast';

const { visit } = recast.types;

/**
 * Uppercase the first letter of a text
 * @param text {string}
 * @returns {string}
 */
export const uppercaseFirstLetter = text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

/**
 * Generate GraphQL spec from mongoose field
 * @param field
 * @param ref
 * @returns {*}
 */
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

/**
 * Parse mongoose fields to generate GraphQL types
 * @param mongooseFields
 * @param ref
 * @returns {{fields: Array, dependencies: Array, typeDependencies: Array, loaderDependencies: Array}}
 */
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

/**
 * Use AST to parse mongoose schema to extract fields
 * @param node
 * @param withTimestamps
 * @returns {*}
 */
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

/**
 * Use recast to parse mongoose schema code
 * @param modelCode
 * @param withTimestamps
 * @param ref
 * @returns {{fields, dependencies, typeDependencies, loaderDependencies}}
 */
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
 * Read model file to get model code
 * @param modelPath
 */
const getModelCode = modelPath => fs.readFileSync(modelPath, 'utf8');

/**
 * Create GraphQL plugin object
 type PluginObject = {
  getFields?: Function; // Return a list of fields based on database schema
 }

 TODO - improve this structure
 */
export default function ({ modelPath }) {
  return {
    getFields: ({ withTimestamps = false, ref = false } = {}) => {
      const modelCode = getModelCode(modelPath);

      const schemaDefinitions = getSchemaDefinition(modelCode, withTimestamps, ref);

      return schemaDefinitions.fields;
    },
  };
}

