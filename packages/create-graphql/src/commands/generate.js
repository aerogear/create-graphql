import spawn from 'cross-spawn-promise';

function parseOptions(opts) {
  const availableOptions = ['type', 'loader', 'connection', 'mutation'];

  // Check if any commands was provided
  const anyCommandsProvided = Object.keys(opts).some(option =>
    availableOptions.indexOf(option) !== -1,
  );

  let options = opts;

  // If not, use the default options
  if (!anyCommandsProvided) {
    options = {
      type: true,
      loader: true,
      connection: true,
      mutation: true,
      ...options,
    };
  }

  const {
    type,
    loader,
    connection,
    mutation,
    schema,
  } = options;

  return {
    type: type || false,
    loader: loader || false,
    connection: connection || false,
    mutation: mutation || false,
    schema: schema || false,
  };
}

function generate(name, options) {
  // Parse all arguments
  const parsedOptions = parseOptions(options);
  // Get only the chose arguments
  const chosenOptions = Object.keys(parsedOptions).filter(opt => !!parsedOptions[opt]);

  // Check if schema argument has been passed
  const schemaIndex = chosenOptions.indexOf('schema');
  chosenOptions.forEach(async (option) => {
    const payload = [`graphql:${option}`, name];

    // If argument schema exists
    if (schemaIndex !== -1) {
      // Remove the next running option because the schema must be used along with this command
      chosenOptions.splice(schemaIndex, 1);

      // Push schema to the arguments to send to yeoman
      payload.push(parsedOptions.schema);
    }

    await spawn('yo', payload, {
      shell: true,
      stdio: 'inherit',
    });
  });
}

export default generate;
