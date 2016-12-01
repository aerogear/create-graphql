import { Base } from 'yeoman-generator';
import {
  getMongooseModelSchema,
  getCreateGraphQLConfig,
  getRelativeConfigDir,
} from '../utils';

class MutationGenerator extends Base {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    this.argument('model', {
      type: Object,
      required: false,
    });

    this.destinationDir = getCreateGraphQLConfig({
      directory: 'mutation',
    });
  }

  _mutationPath(name) {
    return `${this.destinationDir}/${name}Mutation.js`;
  }

  _camelCase(text) {
    return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) {
        return '';
      }

      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  _generateMutationTest({ name, mutationName, template, schema }) {
    const templatePath = this.templatePath(`test/${template}`);

    const destinationPath = this.destinationPath(`${this.destinationDir}/__tests__/${mutationName}Mutation.spec.js`);

    const templateVars = {
      name,
      camelCaseName: this._camelCase(name),
      mutationName,
      schema,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  generateMutation() {
    const schema = this.model ?
      getMongooseModelSchema(this.model, 'mutation')
      : null;

    if (schema) {
      // Add GraphQLID as a dependency to import if it's not listed yet
      if (schema.dependencies.indexOf('GraphQLID') === -1) {
        schema.dependencies.unshift('GraphQLID');
      }

      // Remove GraphQLString dependency from import if it exists,
      // it's already hard-coded on the template
      if (schema.dependencies.indexOf('GraphQLString') !== -1) {
        schema.dependencies.unshift('GraphQLString');
      }

      // Map through the fields checking if any of them is required, if so, use GraphQLNonNull
      schema.fields = schema.fields.map((field) => {
        if (!field.required) {
          return field;
        }

        // Add `GraphQLNonNull` to dependencies import if it hasn't been added yet
        if (schema.dependencies.indexOf('GraphQLNonNull') === -1) {
          schema.dependencies.push('GraphQLNonNull');
        }

        return {
          ...field,
          type: `new GraphQLNonNull(${field.type})`,
        };
      });
    }

    const name = `${this.name.charAt(0).toUpperCase()}${this.name.slice(1)}`;

    const mutations = {
      add: {
        fileName: `${name}Add`,
        template: {
          withSchema: 'MutationAddWithSchema.js.template',
          regular: 'MutationAdd.js.template',
        },
      },
      edit: {
        fileName: `${name}Edit`,
        template: {
          withSchema: 'MutationEditWithSchema.js.template',
          regular: 'MutationEdit.js.template',
        },
      },
    };

    const templateType = schema ? 'withSchema' : 'regular';
    const relativeModelDir = getRelativeConfigDir('mutation', 'model');
    const relativeTypeDir = getRelativeConfigDir('mutation', 'type');
    const relativeLoaderDir = getRelativeConfigDir('mutation', 'loader');
    const relativeConnectionDir = getRelativeConfigDir('mutation', 'connection');

    const templateVars = {
      name,
      rawName: this._camelCase(this.name),
      schema,
      relativeModelDir,
      relativeTypeDir,
      relativeLoaderDir,
      relativeConnectionDir,
    };

    Object.keys(mutations).forEach((mutationType) => {
      const { template, fileName } = mutations[mutationType];

      this.fs.copyTpl(
        this.templatePath(template[templateType]), this._mutationPath(fileName), templateVars,
      );

      this._generateMutationTest({
        name,
        mutationName: fileName,
        template: template[templateType],
        schema,
      });
    });
  }

  end() {
    this.log('🔥 Mutation created!');
  }
}

module.exports = MutationGenerator;
