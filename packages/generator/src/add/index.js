import Generator from 'yeoman-generator';
import pluralize from 'pluralize';
import {
  getConfigDir,
  getRelativeConfigDir,
  camelCaseText,
  uppercaseFirstLetter,
} from '../utils';

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

    // const templatePath = schema ?
    //   this.templatePath('LoaderWithSchema.js.template')
    //   : this.templatePath('Loader.js.template');
    //
    // const directories = this._getConfigDirectories();

    const pluralName = pluralize(this.options.name);

    const templateVars = {
      name,
      rawName: this.options.name,
      camelCaseName: camelCaseText(name),
      pluralName,
      pluralCamelCaseName: camelCaseText(pluralName),
    };

    const files = {
      add: {
        filename: `${name}Add.js`,
        template: 'Add.js.template',
      },
      addMutation: {
        filename: `${name}AddMutation.js`,
        template: 'AddMutation.js.template',
      },
    };

    Object.keys(files).forEach((file) => {
      const { filename, template } = files[file];

      this.fs.copyTpl(
        this.templatePath(template), `${this.destinationDir}/${filename}`, templateVars,
      );
    });
  }

  end() {
    this.log('🔥 Add created!');
  }
}

module.exports = AddGenerator;
