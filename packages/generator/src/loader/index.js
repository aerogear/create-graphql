import { Base } from 'yeoman-generator';
import {
  getMongooseModelSchema,
  getConfigDir,
  getRelativeConfigDir,
  uppercaseFirstLetter,
} from '../utils';

class LoaderGenerator extends Base {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    this.argument('model', {
      type: String,
      required: false,
    });

    this.destinationDir = getConfigDir('loader');
  }

  _getConfigDirectories() {
    return getRelativeConfigDir('loader', ['model', 'connection']);
  }

  generateLoader() {
    const schema = this.model ?
      getMongooseModelSchema(this.model)
      : null;

    const name = uppercaseFirstLetter(this.name);

    const templatePath = schema ?
      this.templatePath('LoaderWithSchema.js.template')
      : this.templatePath('Loader.js.template');

    const directories = this._getConfigDirectories();

    const destinationPath = this.destinationPath(`${this.destinationDir}/${name}Loader.js`);
    const templateVars = {
      name,
      rawName: this.name,
      schema,
      directories,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Loader created!');
  }
}

module.exports = LoaderGenerator;
