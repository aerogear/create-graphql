import { Base } from 'yeoman-generator';
import {
  getMongooseModelSchema,
  getConfigDir,
  getRelativeConfigDir,
  camelCaseText,
  uppercaseFirstLetter,
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

    this.destinationDir = getConfigDir('mutation');
  }

  _mutationPath(name) {
    return `${this.destinationDir}/${name}Mutation.js`;
  }

  _parseSchema(schema) {
    // Remove `GraphQLString` & `GraphQLID` dependencies from import if it exists,
    // it's already hard-coded on the template
    const dependencies = schema.dependencies.filter(dep => ['GraphQLID', 'GraphQLString'].indexOf(dep) === -1);

    // Map through the fields checking if any of them is required, if so, use `GraphQLNonNull`
    const fields = schema.fields.map((field) => {
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

    return {
      ...schema,
      fields,
      dependencies,
    };
  }

  _getConfigDirectories() {
    return getRelativeConfigDir('mutation', ['model', 'type', 'loader', 'connection']);
  }

  generateMutation() {
    let schema = null;
    if (this.model) {
      const modelSchema = getMongooseModelSchema(this.model, 'mutation');
      schema = this._parseSchema(modelSchema);
    }

    const name = uppercaseFirstLetter(this.name);

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
    const directories = this._getConfigDirectories();

    const templateVars = {
      name,
      camelCaseName: camelCaseText(this.name),
      schema,
      directories,
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

  _generateMutationTest({ name, mutationName, template, schema }) {
    const templatePath = this.templatePath(`test/${template}`);

    const destinationPath = this.destinationPath(`${this.destinationDir}/__tests__/${mutationName}Mutation.spec.js`);

    const directories = this._getConfigDirectories();

    const templateVars = {
      name,
      camelCaseName: camelCaseText(name),
      mutationName,
      schema,
      directories,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Mutation created!');
  }
}

module.exports = MutationGenerator;
