## How to contribute

1. Fork this repository;
2. Clone the forked version of create-graphql:
  ```sh
  git clone git@github.com:<your_username>/create-graphql.git
  ```

3. Install [lerna/lerna](https://github.com/lerna/lerna)
  ```sh
  yarn global add lerna@prerelease # With NPM: `npm install --global lerna@prerelease`
  ```

4. Install the main package dependencies
  ```sh
  yarn # With NPM: `npm install`
  ```

5. Bootstrap all packages
  ```sh
  lerna bootstrap
  ```
  This will install all dependencies of all `subpackages` and link them properly

6. Link the `generator` package
  ```sh
  cd packages/generator && yarn link # With NPM: `npm link`
  ```

7. Watch all packages (create-graphql and generator)
  ```sh
  yarn watch # With NPM: `npm run watch`
  ```

8. Create a new branch
  ```sh
  git checkout -b feature/more_awesomeness
  ```

9. Make your changes
10. Run the CLI with your changes
  ```sh
  node packages/create-graphql/dist --help
  ```

11. Commit your changes and push your branch
  ```sh
  git add .
  git commit -m 'more awesome for create-graphql'
  git push origin feature/more_awesomeness
  ```

12. Open your Pull Request
13. Have your Pull Request merged! 😎
