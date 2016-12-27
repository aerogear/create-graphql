import { Base } from 'yeoman-generator';
import {
  getMongooseModelSchema,
  getConfigDir,
  uppercaseFirstLetter,
} from '../utils';

class TypeGenerator extends Base {
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

    this.destinationDir = getConfigDir('type');
  }

  generateType() {
    let schema = this.model ?
      getMongooseModelSchema(this.model, true)
      : null;

    if (schema) {
      schema = this._parseSchemaResolvers(schema);
    }

    const name = uppercaseFirstLetter(this.name);
    const typeFileName = `${name}Type`;

    const templatePath = schema ?
      this.templatePath('TypeWithSchema.js.template')
      : this.templatePath('Type.js.template');

    const destinationPath = this.destinationPath(`${this.destinationDir}/${typeFileName}.js`);
    const templateVars = {
      name,
      schema,
    };

    this._generateTypeTest({
      name,
      schema,
    });

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  /**
   * Parse schema resolvers checking if the fields need different resolvers.
   * @param schema {Array} The parsed Mongoose schema
   * @returns {Array} The parsed schema with resolvers
   */
  _parseSchemaResolvers(schema) {
    const fields = schema.fields.map((field) => {
      if (field.originalType === 'Date') {
        return {
          ...field,
          resolve: `obj.${field.name}.toISOString()`,
        };
      }

      return {
        ...field,
        resolve: `obj.${field.name}`,
      };
    });

    return {
      ...schema,
      fields,
    };
  }

  _generateTypeTest({ name, schema }) {
    const templatePath = this.templatePath('test/Type.js.template');

    const destinationPath = this.destinationPath(`${this.destinationDir}/__tests__/${name}Type.spec.js`);

    const templateVars = {
      name,
      schema,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Type created!');
  }
}

module.exports = TypeGenerator;
