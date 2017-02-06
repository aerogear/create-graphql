import Generator from 'yeoman-generator';
import {
  getMongooseModelSchema,
  getConfigDir,
  uppercaseFirstLetter,
  getRelativeConfigDir,
} from '../utils';

class TypeGenerator extends Generator {
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
    const schema = this.options.model ?
      getMongooseModelSchema({
        model: this.options.model,
        withTimestamps: true,
        ref: true,
      })
      : null;

    const directories = this._getConfigDirectories();

    const name = uppercaseFirstLetter(this.options.name);
    const typeFileName = `${name}Type`;

    const templatePath = schema ?
      this.templatePath('TypeWithSchema.js.template')
      : this.templatePath('Type.js.template');

    const destinationPath = this.destinationPath(`${this.destinationDir}/${typeFileName}.js`);
    const templateVars = {
      name,
      schema,
      directories,
    };

    this._generateTypeTest({
      name,
      schema,
    });

    // TODO: generate types and loaders that do not exist yet

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  _getConfigDirectories() {
    return getRelativeConfigDir('type', ['model', 'type', 'loader', 'connection', 'interface']);
  }

  _generateTypeTest({ name, schema }) {
    const templatePath = this.templatePath('test/Type.js.template');

    const destinationPath = this.destinationPath(`${this.destinationDir}/__tests__/${name}Type.spec.js`);

    const directories = this._getConfigDirectories();

    const templateVars = {
      name,
      schema,
      directories,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Type created!');
  }
}

module.exports = TypeGenerator;
