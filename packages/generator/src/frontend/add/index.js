import Generator from 'yeoman-generator';
import pluralize from 'pluralize';
import {
  getMongooseModelSchema,
  getConfigDir,
  getRelativeConfigDir,
  camelCaseText,
  uppercaseFirstLetter,
} from '../../utils';

class AddGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    // TODO read schema.json

    this.destinationDir = getConfigDir('add');
  }

  _getConfigDirectories() {
    return getRelativeConfigDir('loader', ['model', 'connection']);
  }

  generateList() {
    // const schema = this.options.model ?
    //   getMongooseModelSchema(this.options.model, true)
    //   : null;

    const name = uppercaseFirstLetter(this.options.name);

    const templatePath = this.templatePath('Add.js.template');

    // const templatePath = schema ?
    //   this.templatePath('LoaderWithSchema.js.template')
    //   : this.templatePath('Loader.js.template');
    //
    // const directories = this._getConfigDirectories();

    const pluralName = pluralize(this.options.name);

    const destinationPath = this.destinationPath(`${this.destinationDir}/${name}Add.js`);
    const templateVars = {
      name,
      rawName: this.options.name,
      camelCaseName: camelCaseText(name),
      pluralName,
      pluralCamelCaseName: camelCaseText(pluralName),
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Add created!');
  }
}

module.exports = AddGenerator;
