# ![Create-GraphQL Logo](/media/logo.png)

<h1 align="center">Create GraphQL</h1>
<p align="center">
  Create production-ready GraphQL servers
</p>

<p align="center">
  <a href="https://travis-ci.org/lucasbento/create-graphql"><img src="https://travis-ci.org/lucasbento/create-graphql.svg?branch=master"></a>
  <a href="https://ci.appveyor.com/project/lucasbento/create-graphql/branch/master"><img src="https://ci.appveyor.com/api/projects/status/cpxul2ofnyf6ypy8/branch/master?svg=true"></a>
  <a href="https://codecov.io/gh/lucasbento/create-graphql"><img src="https://img.shields.io/codecov/c/github/lucasbento/create-graphql.svg"></a>
  <a href="https://github.com/airbnb/javascript"><img src="https://img.shields.io/badge/code%20style-airbnb-blue.svg"></a>
  <a href="https://github.com/lucasbento/create-graphql/issues"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat"></a>
</p>



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

And can generate single files for [Mutation](docs/Commands.md#--mutation--m), [Type](docs/Commands.md#--type--t) and [others](docs/Commands.md#generate--g):
```sh
create-graphql generate --mutation Story
```
This generates a `StoryAddMutation` and `StoryEditMutation`

> See more usage examples in the [docs](docs)

## Contributing
If you want to contribute, see the [Contributing guidelines](CONTRIBUTING.md) before and feel free to send your contributions.

## Feedbacks

We love the feedbacks. It's help us to continue grow and improve. Give your feedbacks by open an [issue](https://github.com/lucasbento/create-graphql/issues/new). We will be glad to discuss your suggestions!

## License

MIT © [Lucas Bento](http://github.com/lucasbento)
