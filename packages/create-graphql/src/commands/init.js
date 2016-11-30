import spawn from 'cross-spawn';

function create(project) {
  const spawnOptions = ['graphql', project];

  spawn('yo', spawnOptions, { shell: true, stdio: 'inherit' });
}

export default create;
