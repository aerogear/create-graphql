import { Base } from 'yeoman-generator';
import {
  getMongooseModelSchema,
  getCreateGraphQLConfig,
  getRelativeConfigDir,
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

    this.destinationDir = getCreateGraphQLConfig({
      directory: 'loader',
    });
  }

  generateLoader() {
    const schema = this.model ?
      getMongooseModelSchema(this.model)
      : null;

    const name = `${this.name.charAt(0).toUpperCase()}${this.name.slice(1)}`;

    const templatePath = schema ?
      this.templatePath('LoaderWithSchema.js.template')
      : this.templatePath('Loader.js.template');

    const modelRelativeDir = getRelativeConfigDir('loader', 'model');
    const connectionRelativeDir = getRelativeConfigDir('loader', 'connection');

    const destinationPath = this.destinationPath(`${this.destinationDir}/${name}Loader.js`);
    const templateVars = {
      name,
      rawName: this.name,
      schema,
      modelRelativeDir,
      connectionRelativeDir,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Loader created!');
  }
}

module.exports = LoaderGenerator;
