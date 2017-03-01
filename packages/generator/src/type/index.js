import Generator from 'yeoman-generator';
import path from 'path';
import {
  getConfigDir,
  uppercaseFirstLetter,
  getRelativeConfigDir,
} from '../utils';

import { getFieldsFromPlugins, runPlugins } from '../utils/plugins';

class TypeGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    this.destinationDir = getConfigDir('type');
    this.directories = this._getConfigDirectories();

    // TODO: add default fields if there are no fields returned from plugins
    this.fields = getFieldsFromPlugins();
  }

  /**
   * Get the relative path of the directories that _may_ be used by
   * the Type template
   */
  _getConfigDirectories() {
    return getRelativeConfigDir('type', ['model', 'type', 'loader', 'connection', 'interface']);
  }

  generateType() {
    const name = uppercaseFirstLetter(this.options.name);
    const typeFileName = `${name}Type`;

    const templatePath = this.templatePath('Type.js.template');

    const destinationPath = this.destinationPath(
      path.join(this.destinationDir, `${typeFileName}.js`)
    );
    const templateVars = {
      name,
      fields: this.fields,
      directories: this.directories,
    };

    // TODO: put these tests on a separated plugin
    // this._generateTypeTest({
    //   name,
    //   schema,
    // });

    // TODO: generate types and loaders that do not exist yet

    // TODO: only copy after templates are parsed through plugin's visitors
    // this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  // _generateTypeTest({ name, schema }) {
  //   const templatePath = this.templatePath('test/Type.js.template');
  //
  //   const destinationPath = this.destinationPath(`${this.destinationDir}/__tests__/${name}Type.spec.js`);
  //
  //   const directories = this._getConfigDirectories();
  //
  //   const templateVars = {
  //     name,
  //     schema,
  //     directories,
  //   };
  //
  //   this.fs.copyTpl(templatePath, destinationPath, templateVars);
  // }

  end() {
    this.log('🔥 Type created!');
  }
}

module.exports = TypeGenerator;
