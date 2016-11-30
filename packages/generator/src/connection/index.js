import { Base } from 'yeoman-generator';
import {
  getCreateGraphQLConfig,
  getRelativeConfigDir,
} from '../utils';

class ConnectionGenerator extends Base {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    this.destinationDir = getCreateGraphQLConfig({
      directory: 'connection',
    });
  }

  generateConnection() {
    const name = `${this.name.charAt(0).toUpperCase()}${this.name.slice(1)}`;

    const relativeTypeDir = getRelativeConfigDir('connection', 'type');

    const templatePath = this.templatePath('Connection.js.template');
    const destinationPath = this.destinationPath(`${this.destinationDir}/${name}Connection.js`);
    const templateVars = {
      name,
      relativeTypeDir,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Connection created!');
  }
}

module.exports = ConnectionGenerator;
