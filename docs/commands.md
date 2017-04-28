# Commands
> List of available commands

- #### **[`init`](#init--i)**
- #### **[`generate`](#generate--g)**
  - [`--type`](#--type--t)
  - [`--mutation`](#--mutation--m)
  - [`--loader`](#--loader--l)
  - [`--connection`](#--connection--c)
- #### **[`help`](#--help--h)**
- #### **[`version`](#--version--V)**

## `init`, `-i`
Provides an easy way to create a GraphQL server based on [@entria/graphql-dataloader-boilerplate](https://github.com/entria/graphql-dataloader-boilerplate) which is a production-ready server

> We are currently using the same boilerplate on three applications running on production at **[@entria](https://github.com/entria)**

```sh
create-graphql init GraphQLProject
```
Creates a new GraphQL project. The project contains the following structure:
```
├── /data/                   # GraphQL generated schema
├── /repl/                   # Read-Eval-Print-Loop (REPL) configuration
├── /scripts/                # Generate GraphQL schema script
├── /src/                    # Source code of GraphQL Server
│   ├── /connection/         # Connections types (Relay)
│   ├── /interface/          # NodeInterface (Relay)
│   ├── /loader/             # Loaders of the models using DataLoader
│   ├── /model/              # Models definition (Mongoose, SQL, Google DataStore)
│   ├── /mutation/           # Mutations definition
├── /test/                   # Test helpers
```

## `generate`, `-g`
Generates the files by passing these options:

- [`--type`](#--type--t)
- [`--mutation`](#--mutation--m)
- [`--loader`](#--loader--l)
- [`--connection`](#--connection--c)

#### `--type`, `-t`
Creates a type file and it's name will be automatically suffixed with `Type`

```sh
create-graphql generate --type Story
```

Generates `StoryType` file under the path `./src/type`

#### `--mutation`
Creates mutations, the files names will be automatically suffixed with `Mutation`

```sh
create-graphql generate --mutation Story
```
Generates `StoryAddMutation` and `StoryEditMutation` under the path `./src/mutation`

**Hint:** To generates mutations based on a [Mongoose](https://github.com/Automattic/mongoose) schema, use `--schema` option

```sh
create-graphql generate --mutation Story --schema Story
```

Which will look for `Story` Mongoose schema file in `./src/model` and generate the mutations fields based on it

**Hint**: you may use aliases commands to create multiple files in one single command:
```sh
create-graphql generate -tm Story --schema Story
```
Will create a GraphQL *type* and *mutation* based on `Story` schema and automatically generated tests using [Jest](https://github.com/facebook/jest)

#### `--loader`, `-l`
Creates a GraphQL loader, the files names will be automatically suffixed with `Loader`

```sh
create-graphql --loader Story
```

Generates a `StoryLoader` file importing `StoryConnection` under the path `./src/loader`

#### `--connection`, `-c`
Creates a Relay connection, the files names will be automatically suffixed with `Connection`

```sh
create-graphql --connection Story
```

Generates a `StoryConnection` importing `StoryType` under the path `./src/connection`

#### `--help`, `-h`
Output usage information with all available commands

#### `--version`, `-V`
Output the current version

If yout need, you can update **Create-GraphQL** with:
```sh
yarn global upgrade create-graphql # Also works with NPM as `npm update --global create-graphql`
```
