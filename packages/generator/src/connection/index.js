import Generator from 'yeoman-generator';
import {
  getConfigDir,
  getRelativeConfigDir,
  uppercaseFirstLetter,
} from '../utils';

class ConnectionGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    this.destinationDir = getConfigDir('connection');
  }

  generateConnection() {
    const name = uppercaseFirstLetter(this.options.name);

    const directories = getRelativeConfigDir('connection', ['type']);

    const templatePath = this.templatePath('Connection.js.template');
    const destinationPath = this.destinationPath(`${this.destinationDir}/${name}Connection.js`);
    const templateVars = {
      name,
      directories,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Connection created!');
  }
}

module.exports = ConnectionGenerator;
