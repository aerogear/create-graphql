import { Base } from 'yeoman-generator';
import {
  getMongooseModelSchema,
  getCreateGraphQLConfig,
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

    this.destinationDir = getCreateGraphQLConfig({
      directory: 'type',
    });
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

  generateType() {
    const schema = this.model ?
      getMongooseModelSchema(this.model)
      : null;

    const name = `${this.name.charAt(0).toUpperCase()}${this.name.slice(1)}`;
    const typeFileName = `${name}Type`;

    const templatePath = schema ?
      this.templatePath('TypeWithSchema.js.template')
      : this.templatePath('Type.js.template');

    const destinationPath = this.destinationPath(`${this.destinationDir}/${typeFileName}.js`);
    const templateVars = {
      name: typeFileName,
      schema,
    };

    this._generateTypeTest({
      name,
      schema,
    });

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Type created!');
  }
}

module.exports = TypeGenerator;
