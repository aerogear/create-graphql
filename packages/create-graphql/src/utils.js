import shell from 'shelljs';
import chalk from 'chalk';
import ora from 'ora';
import spawn from 'cross-spawn-promise';

const tic = chalk.green('✓');
const tac = chalk.red('✗');

const installYeoman = async () => {
  const spinner = ora('Installing Yeoman...');

  spinner.start();

  const command = 'npm';
  const args = ['install', '-g', 'yo'];
  const options = {
    shell: true,
    stdio: false,
  };

  try {
    await spawn(command, args, options);

    spinner.stop();

    console.log(`${tic} Yeoman installed!`);
  } catch (error) {
    spinner.stop();

    console.error(`${tac} There was an error while trying to install Yeoman:`, error);
  }
};

export const verifyYeoman = async () => { // eslint-disable-line import/prefer-default-export
  if (!shell.which('yo')) {
    console.error(`${tac} GraphQL CLI requires Yeoman to be installed.`);

    await installYeoman();
  }

  return true;
};
