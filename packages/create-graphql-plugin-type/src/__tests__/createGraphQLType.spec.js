import path from 'path';
import typePlugin from '../index';

it('should generate a type template from fields', async () => {
  const fields = [
    {
      name: 'name',
      description: 'user name',
      required: true,
      originalType: 'String',
      resolve: 'obj.name',
      type: 'GraphQLString',
      flowType: 'string',
    },
    {
      name: 'password',
      description: 'hashed user password',
      required: false,
      originalType: 'String',
      resolve: 'obj.password',
      type: 'GraphQLString',
      flowType: 'string',
    },
    {
      name: 'email',
      description: 'user email',
      required: false,
      originalType: 'String',
      resolve: 'obj.email',
      type: 'GraphQLString',
      flowType: 'string',
    },
    {
      name: 'active',
      required: false,
      originalType: 'Boolean',
      resolve: 'obj.active',
      type: 'GraphQLBoolean',
      flowType: 'boolean',
    },
  ];

  const typeName = 'Example';
  const plugin = typePlugin({ name: typeName });
  const templates = plugin.generateTemplates({ fields });

  expect(templates).toMatchSnapshot();
});
