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
    const schema = this.model ?
      getMongooseModelSchema(this.model)
      : null;

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
