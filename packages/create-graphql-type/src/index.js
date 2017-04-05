import template from 'babel-template';
import generate from 'babel-generator';
import * as t from 'babel-types';

// TODO - improve usage of babel-template
// import {
//   GraphQLObjectType,
//   GraphQLString,
// } from 'graphql';
const typeTemplate = template(`
  export default new GraphQLObjectType({
    name: NAME,
    description: 'Represents NAME',
    fields: () => ({
      id: globalIdField('NAME'),
      example: {
         type: GraphQLString,
         description: 'My example field',
         resolve: obj => obj.example,
      },
    }),
    interfaces: () => [NodeInterface],
  });
`, {
  sourceType: 'module',
});

/**
 * Create GraphQL plugin object
 type PluginObject = {
  getFields?: Function; // Return a list of fields based on database schema
  generateTemplates?: Function; // Return list of templates to be generated
 }

 TODO - improve this structure
 */
export default function ({ name }) {
  return {
    generateTemplates: ({ fields }) => {
      const ast = typeTemplate({
        NAME: t.stringLiteral(name),
      });

      const gen = generate(ast);

      return gen.code;
    },
  };
}

