import 'reify/repl';
import 'babel-polyfill';
import REPL from 'repl';
import replPromised from 'repl-promised';
import history from 'repl.history';
import *  as babel from 'babel-core';
import vm from "vm";

function preprocess(input) {
  const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
  const asyncWrapper = (code, binder) => {
    let assign = binder ? `global.${binder} = ` : '';
    return `(function(){ async function _wrap() { return ${assign}${code} } return _wrap();})()`;
  };

  // match & transform
  const match = input.match(awaitMatcher);
  if (match) {
    input = `${asyncWrapper(match[2], match[1])}`;
  }
  return input;
}

const _eval = function (code, filename) {
  code = code.trim();
  if (!code) return undefined;

  code = babel.transform(preprocess(code), {
    filename: filename,
    presets: ['es2015', 'stage-0'],
    // presets: program.presets,
    // plugins: (program.plugins || []).concat([replPlugin])
  }).code;

  return vm.runInThisContext(code, {
    filename: filename,
  });
};

function replEval(code, context, filename, callback) {
  let err;
  let result;

  try {
    if (code[0] === "(" && code[code.length - 1] === ")") {
      code = code.slice(1, -1); // remove "(" and ")"
    }

    result = _eval(code, filename);
  } catch (e) {
    err = e;
  }

  callback(err, result);
}

(async () => {
  try {
    const repl = REPL.start({
      prompt: 'create-graphql > ',
      // eval: replEval,
    });

    // _eval = repl.eval;
    // repl.eval = myEval;

    history(repl, `${process.env.HOME}/.node_history`);

    replPromised.promisify(repl);
  } catch (error) {
    console.error('Unable to connect to database');
    process.exit(1);
  }
})();

