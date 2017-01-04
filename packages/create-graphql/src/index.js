import 'babel-polyfill';

import program from 'commander';

import pkg from '../package.json';
import {
  init,
  generate,
  frontend,
} from './commands';
import { verifyYeoman } from './utils';

program
  .version(pkg.version);

program
  .command('init <project>')
  .alias('i')
  .description('Create a new GraphQL project')
  .action(async (project) => {
    await verifyYeoman();

    init(project);
  });

program
  .command('generate <name>')
  .alias('g')
  .option('-t, --type', 'Generate a new Type')
  .option('-l, --loader', 'Generate a new Loader')
  .option('-c, --connection', 'Generate a new Connection')
  .option('-m, --mutation', 'Generate a new Mutation')
  .option('--schema <modelPath>', 'Generate from a Mongoose Schema')
  .description('Generate a new file (Type, Loader, Mutation, etc)')
  .action(async (name, options) => {
    await verifyYeoman();

    generate(name, options);
  });

program
  .command('frontend <name>')
  .alias('f')
  .option('-a, --add', 'Generate a new Add Form screen')
  .option('-e, --edit', 'Generate a new Edit Form screen')
  .option('-l, --list', 'Generate a new List screen')
  .option('-v, --view', 'Generate a new View for an ObjectType')
  .option('--schema <schema.json Path>', 'Generate from a schema.json')
  .description('Generate a new frontend file (Add, Edit, List, View)')
  .action(async (name, options) => {
    await verifyYeoman();

    frontend(name, options);
  });

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.help();
}
