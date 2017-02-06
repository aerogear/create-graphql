import Generator from 'yeoman-generator';
import pluralize from 'pluralize';
import {
  getConfigDir,
  getRelativeConfigDir,
  camelCaseText,
  uppercaseFirstLetter,
} from '../utils';

class EditGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    // TODO read schema.json
    this.destinationDir = getConfigDir('edit');
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
      edit: {
        filename: `${name}Edit.js`,
        template: 'Edit.js.template',
      },
      editMutation: {
        filename: `${name}EditMutation.js`,
        template: 'EditMutation.js.template',
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
    this.log('🔥 Edit created!');
  }
}

module.exports = EditGenerator;
