<p align="center">
  <img src="https://github.com/lucasbento/create-graphql/raw/master/content/logo.png">
</p>

<h1 align="center">Create GraphQL</h1>

<p align="center">
  Create production-ready GraphQL servers
</p>
<p align="center">
  <a href="https://circleci.com/gh/lucasbento/create-graphql"><img src="https://circleci.com/gh/lucasbento/create-graphql.svg?style=shield&circle-token=27caedb86b7343a4057ea165584b8b846b3037f4"></a>
  <a href="https://codecov.io/gh/lucasbento/create-graphql"><img src="https://codecov.io/gh/lucasbento/create-graphql/branch/master/graph/badge.svg?token=IfbNvREYGx"></a>
  <a href="https://github.com/airbnb/javascript"><img src="https://img.shields.io/badge/code%20style-airbnb-blue.svg"></a>
  <a href="https://github.com/lucasbento/create-graphql/issues"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat"></a>
</p>

## Install

```sh
npm install --global create-graphql
```

## Usage

It can generate:

- [x] Mutations (create and edit);
- [x] Types;
- [x] Connections;
- [x] Loaders;
- [x] Tests (with [Jest](https://github.com/facebook/jest));
- [x] Generate from a [Mongoose](https://github.com/Automattic/mongoose) schema (with `--schema` option).

### Examples

- Generate a type, the file name will be automatically suffixed with `Type`:
  ```sh
  create-graphql generate --type Awesome # create `AwesomeType`.
  ```

- Generate mutations, the files names will be automatically suffixed with `Mutation`:
  ```sh
  create-graphql generate --mutation Awesome # create `AwesomeAddMutation` & `AwesomeEditMutation`.
  ```

- Generate mutations based on a Mongoose schema:
  ```sh
  create-graphql generate --mutation Awesome --schema Awesome
  ```
  Which will look for `Awesome` Mongoose schema file in `./src/model` and generate the mutations fields based on it.

🔥 **Tip**: You may use aliases commands to create multiple files in one single command:

```sh
create-graphql -tm Awesome --schema Awesome
# Will create a GraphQL type and mutation based on `Awesome` schema.
```

> 😎 Mutations and types will be automatically generated with tests.

### Options

#### `init` - Create a brand-new GraphQL server

```sh
create-graphql init AwesomeProject
```

<p align="center">
  <img src="https://github.com/lucasbento/create-graphql/raw/master/content/create-graphql-init.gif">
</p>

Provides an easy way to create a GraphQL server based on [@sibelius/graphql-dataloader-boilerplate](https://github.com/sibelius/graphql-dataloader-boilerplate) which is a production-ready server.

> We are currently using the same boilerplate on three applications running on production at [@entria](https://github.com/entria).

#### `generate`

##### `-t`, `--type` - Create a GraphQL type

The following command will generate the file `AwesomeType` under the folder `./src/type`:

```sh
create-graphql --type Awesome
```

<details>
 <summary>`./src/type/AwesomeType.js`</summary>
 ```js
import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'AwesomeType',
  description: 'Represents AwesomeType',
  fields: () => ({
    example: {
      type: GraphQLString,
      description: 'My example field',
      resolve: obj => obj.example,
    },
  }),
});
 ```
</details>

Using the `--schema` option with a Mongoose schema, the type would be generated like this:

<details>
 <summary>`./src/model/Comment.js`</summary>
 ```js
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  content: {
    type: String,
    description: 'Comment content in the original language',
    required: true,
  },
  user: {
    type: ObjectId,
    ref: 'User',
    indexed: true,
    description: 'User that created this comment',
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
    description: 'Object that owns of this product. References to Product, Posts or other comment.',
  },
}, {
  collection: 'comment',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

export default mongoose.model('Comment', Schema);
```
</details>

<details>
 <summary>`./src/type/CommentType.js`</summary>
 ```js
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'CommentType',
  description: 'Represents CommentType',
  fields: () => ({
    content: {
      type: GraphQLString,
      description: 'Comment content in the original language',
      resolve: obj => obj.content,
    },
    user: {
      type: GraphQLID,
      description: 'User that created this comment',
      resolve: obj => obj.user,
    },
    owner: {
      type: GraphQLID,
      description: 'Object that owns of this product. References to Product, Posts or other comment.',
      resolve: obj => obj.owner,
    },
  }),
});
```
</details>

<p>&nbsp;</p>

##### `-m`, `--mutation` - Create GraphQL mutations

The following command will generate the files `AwesomeAddMutation` & `AwesomeEditMutation` under the folder `./src/mutation`:

```sh
create-graphql --mutation Awesome
```

<details>
 <summary>`./src/mutation/AwesomeAddMutation.js`</summary>
 ```js
import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  mutationWithClientMutationId,
  toGlobalId,
} from 'graphql-relay';

import AwesomeLoader from '../loader/AwesomeLoader';
import AwesomeConnection from '../connection/AwesomeConnection';

export default mutationWithClientMutationId({
  name: 'AwesomeAdd',
  inputFields: {
    example: {
      type: GraphQLString,
      description: 'My example field',
    },
  },
  mutateAndGetPayload: async ({ example }) => {
    // TODO: mutation logic

    return {
      // id: id, // ID of the newly created row
      error: null,
    };
  },
  outputFields: {
    awesomeEdge: {
      type: AwesomeConnection.edgeType,
      resolve: async({ id }, args, { user }) => {
        // TODO: load new edge from loader

        const awesome = await AwesomeLoader.load(
          user, id
        );

        // Returns null if no node was loaded
        if (!awesome) {
          return null;
        }

        return {
          cursor: toGlobalId('awesome', awesome),
          node: awesome,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
 ```
</details>

<details>
 <summary>`./src/mutation/AwesomeEditMutation.js`</summary>
 ```js
import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  mutationWithClientMutationId,
  toGlobalId,
} from 'graphql-relay';

import AwesomeType from '../type/AwesomeType';
import AwesomeLoader from '../loader/AwesomeLoader';
import AwesomeConnection from '../connection/AwesomeConnection';

export default mutationWithClientMutationId({
  name: 'AwesomeEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    example: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ id, example }) => {
    // TODO: mutation logic

    return {
      id: id,
      error: null,
    };
  },
  outputFields: {
    awesomeEdge: {
      type: AwesomeConnection.edgeType,
      resolve: async({ id }, args, { user }) => {
        // TODO: load new edge from loader

        const awesome = await AwesomeLoader.load(
          user, id
        );

        // Returns null if no node was loaded
        if (!awesome) {
          return null;
        }

        return {
          cursor: toGlobalId('awesome', awesome),
          node: awesome,
        };
      },
    },
    awesome: {
      type: AwesomeType,
      resolve: async ({ user, id }) => {
        if (!user || !id) {
          return null;
        }

        return await AwesomeLoader.load(user, id);
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
 ```
</details>

Using the `--schema` option with a Mongoose schema, the mutations would be generated like this:

<details>
 <summary>`./src/model/Comment.js`</summary>
 ```js
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  content: {
    type: String,
    description: 'Comment content in the original language',
    required: true,
  },
  user: {
    type: ObjectId,
    ref: 'User',
    indexed: true,
    description: 'User that created this comment',
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
    description: 'Object that owns of this product. References to Product, Posts or other comment.',
  },
}, {
  collection: 'comment',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

export default mongoose.model('Comment', Schema);
```
</details>

<details>
  <summary>`./src/mutation/CommentAddMutation.js`</summary>
```js
import {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLNonNull,
  GraphQLNonNull,
} from 'graphql';
import {
  mutationWithClientMutationId,
  toGlobalId,
} from 'graphql-relay';

import CommentLoader from '../loader/CommentLoader';
import CommentConnection from '../connection/CommentConnection';

export default mutationWithClientMutationId({
  name: 'CommentAdd',
  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user: {
      type: new GraphQLNonNull(GraphQLID),
    },
    owner: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ example }) => {
    // TODO: mutation logic

    return {
      // id: id, // ID of the newly created row
      error: null,
    };
  },
  outputFields: {
    commentEdge: {
      type: CommentConnection.edgeType,
      resolve: async({ id }, args, { user }) => {
        // TODO: load new edge from loader

        const comment = await CommentLoader.load(
          user, id
        );

        // Returns null if no node was loaded
        if (!comment) {
          return null;
        }

        return {
          cursor: toGlobalId('comment', comment),
          node: comment,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
```
</details>

<details>
  <summary>`./src/mutation/CommentEditMutation.js`</summary>
```js
import {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';
import {
  mutationWithClientMutationId,
  toGlobalId,
} from 'graphql-relay';

import CommentType from '../type/CommentType';
import CommentLoader from '../loader/CommentLoader';
import CommentConnection from '../connection/CommentConnection';

export default mutationWithClientMutationId({
  name: 'CommentEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user: {
      type: new GraphQLNonNull(GraphQLID),
    },
    owner: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ id, example }) => {
    // TODO: mutation logic

    return {
      id: id,
      error: null,
    };
  },
  outputFields: {
    commentEdge: {
      type: CommentConnection.edgeType,
      resolve: async({ id }, args, { user }) => {
        // TODO: load new edge from loader

        const comment = await CommentLoader.load(
          user, id
        );

        // Returns null if no node was loaded
        if (!comment) {
          return null;
        }

        return {
          cursor: toGlobalId('comment', comment),
          node: comment,
        };
      },
    },
    comment: {
      type: CommentType,
      resolve: async ({ user, id }) => {
        if (!user || !id) {
          return null;
        }

        return await CommentLoader.load(user, id);
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
```
</details>

<p>&nbsp;</p>

##### `-c`, `--connection` - Create a Relay connection

The following command will generate the file `AwesomeConnection` importing `AwesomeType` under the folder `./src/connection`:

```sh
create-graphql --connection Awesome
```

<details>
 <summary>`./src/connection/AwesomeConnection.js`</summary>
 ```js
import { connectionDefinitions } from 'graphql-relay';

import AwesomeType from '../type/AwesomeType';

export default connectionDefinitions({
  name: 'Awesome',
  nodeType: AwesomeType,
});
 ```
</details>

<p>&nbsp;</p>

##### `-l`, `--loader` - Create a GraphQL loader

The following command will generate the file `AwesomeLoader` importing `AwesomeConnection` under the folder `./src/loader`:

```sh
create-graphql --loader Awesome
```

<details>
 <summary>`./src/loader/AwesomeLoader.js`</summary>
 ```js
import DataLoader from 'dataloader';
import ConnectionFromMongoCursor from '../connection/ConnectionFromMongoCursor';
import AwesomeModel from '../model/Awesome';

type AwesomeType = {
  id: string,
  exampleField: string,
}

export default class Awesome {
  id: string;
  exampleField: string;

  static AwesomeLoader = new DataLoader(
    ids => Promise.all(
      ids.map(id =>
        AwesomeModel.findOne({ _id: id })
      ),
    ),
  );

  constructor(data: AwesomeType) {
    this.id = data.id;
    this.exampleField = data.exampleField;
  }

  static viewerCanSee(viewer, data) {
    // TODO: handle security

    return true;
  }

  static async load(viewer, id) {
    const data = await Awesome.AwesomeLoader.load(id);

    return Awesome.viewerCanSee(viewer, data) ? new Awesome(data) : null;
  }

  static clearCache(id) {
    return Awesome.AwesomeLoader.clear(id);
  }

  static async loadAwesome(viewer, args) {
    // TODO: load multiple rows

    const Awesome = [];

    return ConnectionFromMongoCursor.connectionFromMongoCursor(
      viewer, Awesome, args, Awesome.load
    );
  }

}
 ```
</details>

<p>&nbsp;</p>

#### `-`, `--help` - Output all the available commands

## Configuration file

You may customize the folders that the generated files will be created on by using a `.graphqlrc` file on the root folder with the following content:

```json
{
  "directories": {
    "source": "src",
    "connection": "graphql/connection",
    "loader": "graphql/loader",
    "model": "models/models",
    "mutation": "graphql/mutation",
    "type": "graphql/type"
  }
}
```

## How to contribute

1. Fork this repo
2. Clone forked version of create-graphql
```
git clone git@github.com:<your_username>/create-graphql.git
```
3. Install [lerna/lerna](https://github.com/lerna/lerna)
```
npm install --global lerna@prerelease
```
4. Install main package dependency
```
yarn
```
or
```
npm i
```
5. Bootstrap all packages
```
lerna bootstrap
```
This will install all dependencies of all `subpackages` and link them properly
6. Link `generator` package
```
cd packages/generator
npm link
```
7. Watch all packages (create-graphql, generator)
```
npm run watch
```
8. Create a new branch
```
git checkout -b feature/more_awesomeness
```
9. Make your changes
10. Run the CLI with your changes
```
node packages/create-graphql/dist --help
```
11. Commit your changes and push your branch
```
git add .
git commit -m 'more awesome for create-graphql'
git push origin feature/more_awesomeness
```
12. Open your Pull Request

## Feedback?

Open an [issue](https://github.com/lucasbento/create-graphql/issues/new), I will be glad to discuss your suggestions!

## License

MIT © [Lucas Bento](http://github.com/lucasbento)
