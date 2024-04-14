# Webpack Embedding Plugin

The Webpack Embedding Plugin is a custom webpack plugin that generates embeddings of type `Number[]` for specified file types in your codebase. These embeddings can be used to create a Retrieval Augmented Generation (RAG) system with private Language Models (LLMs) for enhanced code understanding and generation tasks.

## Features

- Generates embeddings of type `Number[]` for specified file types (default: `.ts` and `.tsx`)
- Caches embeddings to avoid redundant generation
- Writes the generated embeddings to a configurable JSON file (default: `embeddings.json`) in the output directory
- Supports custom embedding functions for generating embeddings
- Enables building a codebase RAG system with private LLMs

## Installation

To install the Webpack Embedding Plugin, you can include it in your project's dependencies using npm or yarn:

```bash
npm install webpack-embedding-plugin
```

or

```bash
yarn add webpack-embedding-plugin
```

## Usage

To use the Webpack Embedding Plugin in your webpack configuration, you need to require the plugin and add it to the `plugins` array:

```javascript
const WebpackEmbeddingPlugin = require('webpack-embedding-plugin');

module.exports = {
  // ...
  plugins: [
    new WebpackEmbeddingPlugin({
      embedFn: yourEmbeddingFunction,
      fileExtensions: ['.ts', '.tsx'],
      outputPath: 'path/to/embeddings.json',
    }),
  ],
};
```

### Options

The Webpack Embedding Plugin accepts the following options:

- `embedFn` (required): A function that generates embeddings for a given file content and name. It should return a promise that resolves to the generated embedding of type `Number[]`.
- `fileExtensions` (optional): An array of file extensions to generate embeddings for. Default: `['.ts', '.tsx']`.
- `outputPath` (optional): The path to the output JSON file relative to the webpack output directory. Default: `'embeddings.json'`.

## Codebase RAG System

The generated embeddings can be used to build a codebase Retrieval Augmented Generation (RAG) system with private Language Models (LLMs). RAG is a technique that combines information retrieval with language model generation to enhance the understanding and generation capabilities of LLMs for code-related tasks.

By generating embeddings for your codebase files, you can create a vector database that represents the semantic meaning of your code. When querying the private LLM, you can retrieve relevant code snippets based on their embedding similarity to the query. The retrieved code snippets can then be used as additional context for the LLM to generate more accurate and contextually relevant code completions, suggestions, or responses.

To build a codebase RAG system with the generated embeddings:

1. Use the Webpack Embedding Plugin to generate embeddings for your codebase files.
2. Store the generated embeddings in a vector database or search engine that supports similarity search (e.g., Faiss, Elasticsearch, Milvus).
3. When querying the private LLM for code-related tasks, retrieve relevant code snippets from the vector database based on the similarity of the query embedding to the stored embeddings.
4. Provide the retrieved code snippets as additional context to the private LLM to generate more accurate and contextually relevant responses.

By leveraging the power of embeddings and RAG, you can enhance the performance and capabilities of your private LLMs for code understanding and generation tasks.

## License

The Webpack Embedding Plugin is open-source software licensed under the [MIT License](LICENSE).
