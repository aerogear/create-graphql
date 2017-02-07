import Generator from 'yeoman-generator';
import shell from 'shelljs';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs';

import logo from '../graphql-logo';

const tic = chalk.green('✓');
const tac = chalk.red('✗');

class AppGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    this.dir = path.resolve(this.options.name);
  }

  initializing() {
    this.spinner = ora();

    this._printGraphQLLogo();
  }

  cloneStarterCode() {
    this.spinner.start();

    this._validateDirectory();

    this.spinner.text = 'Creating a new GraphQL project...';

    const repository = 'https://github.com/entria/graphql-dataloader-boilerplate.git';

    const done = this.async();
    const command = 'git';
    const commandOpts = ['clone', repository, this.dir];

    this.spawnCommand(command, commandOpts, { stdio: 'ignore' })
      .on('close', () => {
        this.spinner.stop();

        this.log(`${tic} GraphQL project ${this.options.name} created.`);

        done();
      });
  }

  _printGraphQLLogo() {
    this.log(chalk.magenta(logo));
  }

  _validateDirectory() {
    try {
      fs.lstatSync(this.dir).isDirectory();

      this._logAndExit(
        `${tac} Directory "${this.options.name}" already exists,
        please enter a new directory name or delete "${this.options.name}"!`,
      );

      return false;
    } catch (err) {
      return true;
    }
  }

  installModules() {
    shell.cd(this.dir);

    this.spinner.start();

    this.spinner.text = 'Installing dependencies...';

    const done = this.async();
    let command = 'yarn';
    let args = [];

    if (!shell.which('yarn')) {
      command = 'npm';
      args = ['install'];
    }

    this.spawnCommand(command, args, { stdio: 'ignore' })
      .on('close', () => {
        this.spinner.stop();

        this.log(`${tic} Dependencies installed! 😎`);

        done();
      });
  }

  _cleanDir() {
    shell.cd(this.dir);

    shell.rm('-rf', '.git');
  }

  _logAndExit(message) {
    this.spinner.stop();

    this.log(message);

    process.exit(1);
  }

  end() {
    this._cleanDir();

    this.log(`${tic} Your new project with GraphQL has been created! 🔥`);
  }

}

module.exports = AppGenerator;
