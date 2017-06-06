# Configuration

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
