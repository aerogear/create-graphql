import * as t from 'babel-types';

export default {
  getFields: (args) => {
    const {
      config, // The content of `.graphqlrc`, will be the default if it doesn't exist
      type, // The type of file that will be generated, may be ['type', 'mutation', 'loader']
    } = args;

    console.log('Running getFields function with args: ', args);

    const fields = [{
      name: 'myFieldFromDatabase',
      resolvesTo: 'myObj => myObj.myFieldFromDatabase',
    }, {
      name: 'myOtherFieldsFromDb',
      resolvesTo: 'myObj => myObj.myOtherFieldsFromDb',
    }];

    return fields;
  },
  getFiles: (args) => {
    const {
      config, // The content of `.graphqlrc`, will be the default if it doesn't exist
      name, // Name of the file
      type, // The type of file that will be generated, may be ['type', 'mutation', 'loader', 'connection']
      fields, // The fields of the schema
    } = args;

    const files = [{
      name: `${name}Type`,

    }];

    return {}; // Return what?
  },
  visitor: {
    BinaryExpression(path) {
      console.log(path.node.operator);
      if (path.node.operator !== "===") {
        return;
      }

      path.node.left = t.identifier("sebmck");
      path.node.right = t.identifier("dork");
    }
  },
};
