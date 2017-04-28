# ![Create-GraphQL Logo](/media/logo.png)

# Create-GraphQL
> Create production-ready GraphQL servers

[![Build Status](https://travis-ci.org/lucasbento/create-graphql.svg?branch=master)](https://travis-ci.org/lucasbento/create-graphql) [![Build Status](https://ci.appveyor.com/api/projects/status/cpxul2ofnyf6ypy8/branch/master?svg=true)](https://ci.appveyor.com/project/lucasbento/create-graphql/branch/master) [![Build Status](https://img.shields.io/codecov/c/github/lucasbento/create-graphql.svg)](https://codecov.io/gh/lucasbento/create-graphql) [![Build Status](https://img.shields.io/badge/code%20style-airbnb-blue.svg)](https://github.com/airbnb/javascript) [![Build Status](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/lucasbento/create-graphql/issues)


## About
**[Create-GraphQL](https://github.com/lucasbento/create-graphql)** is a command-line utility to build production-ready servers with GraphQL and also generate *Mutations*, *Types* and more into existent projects

Check out the post *[Announcing Create-GraphQL](https://medium.com/entria/announcing-create-graphql-17bdd81b9f96)* on **[Entria](https://medium.com/entria)** medium

## Install

#### With Yarn:
```sh
yarn global add create-graphql
```

#### With NPM:
```sh
npm install --global create-graphql
```

## Usage
You can create a brand new GraphQL project:
```sh
create-graphql init GraphQLProject
```

And can generate single files for [Mutation](docs/commands.md#--mutation--m), [Type](docs/commands.md#--type--t) and [others](docs/commands.md#generate--g):
```sh
create-graphql generate --mutation Story
```
This generates a `StoryAddMutation` and `StoryEditMutation`

> See more usage examples in the [docs](docs)

## Contributing
If you want to contribute, see the [Contributing guidelines]() before and feel free to send your contributions.

## Feedbacks

We love the feedbacks. It's help us to continue grow and improve **[Create-GraphQL]()**. Give your feedbacks by open an [issue](https://github.com/lucasbento/create-graphql/issues/new). We will be glad to discuss your suggestions!

## License

MIT © [Lucas Bento](http://github.com/lucasbento)
