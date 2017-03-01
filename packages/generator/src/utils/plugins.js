/*
 * babel-generator -> generate code from AST
 * babel-template -> write code with placeholders so you can replace then, e.g.:
 * ------------------------------------------------
 * const buildRequire = template(`
 *   var IMPORT_NAME = require(SOURCE);
 * `);
 *
 * const ast = buildRequire({
 *   IMPORT_NAME: t.identifier("myModule"),
 *   SOURCE: t.stringLiteral("my-module")
 * });
 * (https://github.com/thejameskyle/babel-handbook/blob/master/translations/pt-BR/plugin-handbook.md#babel-template)
 * ------------------------------------------------
 */


import template from 'babel-template';
import traverse from 'babel-traverse';
import * as t from 'babel-types';
import generate from 'babel-generator';

import reqFrom from 'req-from';

const babylon = require('babylon');

import templates from '../templates';

import { types } from 'recast';

import { rootPath, getCreateGraphQLConfig } from '../utils';

const config = getCreateGraphQLConfig();

const plugins = config.plugins.map(plugin => reqFrom(rootPath, plugin).default);

export const getFieldsFromPlugins = () => {
  let fields = [];
  plugins.forEach((plugin) => {
    const pluginFields = plugin.getFields({
      fields,
    });

    fields = [
      ...fields,
      ...pluginFields,
    ];
  });

  return fields.reduce((prev, curr) => ({
    ...prev,
    ...curr,
  }), {});
};

const parseTemplateToAST = (template) => {
  console.info('Parsing template to AST');

  return babylon.parse(template, {
    sourceType: 'module',
  });
};

// The idea is pretty simple:
// Have a default template ~~(not using EJS with Yeoman)~~ using Yeoman :/
// that will parsed into AST and then used on `babel-traverse`;
// Have a `vistor` on plugins that will be passed to `babel-traverse`.

// TODO: receive type of file being created
const traversePlugins = () => {
  let ast = getDefaultTemplateAST('type');

  console.info('Parsing plugins `visitor`');

  plugins.forEach((plugin) => {
    if (!plugin.visitor) {
      return null;
    }

    traverse(ast, plugin.visitor);
  });
console.log('ast:', ast);
  return ast;
};

export const runPlugins = () => {
  console.info('Running plugins');

  const ast = traversePlugins();

  console.info('AST after traversing plugins', ast);

  console.log('code', generate(ast).code);
};
