# EmbeddingPlugin

The `EmbeddingPlugin` is a custom webpack plugin that generates embeddings of type `Number[]` for specified file types and caches them for efficient retrieval during the build process.

## Features

- Generates embeddings of type `Number[]` for specified file types (default: `.ts` and `.tsx`)
- Caches embeddings to avoid redundant generation
- Writes the generated embeddings to a configurable JSON file (default: `embeddings.json`) in the output directory
- Supports custom embedding functions for generating embeddings

## Installation

To install the `EmbeddingPlugin`, you can include it in your project's dependencies using npm or yarn:

```bash
npm install embedding-plugin
```

or

```bash
yarn add embedding-plugin
```

## Usage

To use the `EmbeddingPlugin` in your webpack configuration, you need to require the plugin and add it to the `plugins` array:

```javascript
const EmbeddingPlugin = require('embedding-plugin');

module.exports = {
  // ...
  plugins: [
    new EmbeddingPlugin({
      embedFn: yourEmbeddingFunction,
      fileExtensions: ['.ts', '.tsx'],
      outputPath: 'path/to/embeddings.json',
    }),
  ],
};
```

### Options

The `EmbeddingPlugin` accepts the following options:

- `embedFn` (required): A function that generates embeddings for a given file content and name. It should return a promise that resolves to the generated embedding of type `Number[]`.
- `fileExtensions` (optional): An array of file extensions to generate embeddings for. Default: `['.ts', '.tsx']`.
- `outputPath` (optional): The path to the output JSON file relative to the webpack output directory. Default: `'embeddings.json'`.

## Embedding Function

The `embedFn` option is a function that you need to provide to generate embeddings for your files. It should have the following signature:

```typescript
function embedFn(content: string, name: string): Promise<Number[]>;
```

The `embedFn` receives the file content and name as arguments and should return a promise that resolves to the generated embedding of type `Number[]`.

Here's an example of a simple embedding function that generates a random embedding of length 5:

```javascript
function yourEmbeddingFunction(content, name) {
  const embedding = Array.from({ length: 5 }, () => Math.random());
  return Promise.resolve(embedding);
}
```

## Output

The `EmbeddingPlugin` generates a JSON file at the specified `outputPath` (default: `embeddings.json`) in the webpack output directory. The JSON file contains the generated embeddings for each processed file, with the file paths as keys and the embeddings as values.

Example output:

```json
{
  "src/file1.ts": [0.123, 0.456, 0.789, 0.987, 0.654],
  "src/file2.tsx": [0.321, 0.654, 0.987, 0.123, 0.456]
}
```

## Caching

The `EmbeddingPlugin` caches the generated embeddings to avoid redundant generation during subsequent builds. The cache is stored using webpack's caching mechanism and is automatically invalidated when the corresponding files change.

## License

The `EmbeddingPlugin` is open-source software licensed under the [MIT License](LICENSE).
