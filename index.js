const fs = require('fs');
const path = require('path');
const os = require('os');

class EmbeddingPlugin {
  constructor(options) {
    this.options = {
      embedFn: options.embedFn,
      fileExtensions: options.fileExtensions || ['.ts', '.tsx'],
      outputPath: options.outputPath || 'embeddings.json',
      debug: options.debug || false,
    };
    try {
      this.embeddings = JSON.parse(fs.readFileSync(this.options.outputPath, 'utf-8'));
    } catch (ex) {  
      this.embeddings = {};
    }
  }

  apply(compiler) {
    const { embedFn, fileExtensions, outputPath, debug } = this.options;
    const tempPath = path.join(os.tmpdir(), 'embeddings.json');

    compiler.hooks.normalModuleFactory.tap('EmbeddingPlugin', (factory) => {
      factory.hooks.afterResolve.tap('EmbeddingPlugin', (resolveData) => {
        const moduleData = resolveData.createData.module;
        if (moduleData && moduleData.resource && fileExtensions.includes(path.extname(moduleData.resource))) {
          resolveData.createData.embedFile = moduleData.resource;
          if (debug) {
            console.log(`[EmbeddingPlugin] Embedding file set for: ${moduleData.resource}`);
          }
        }
      });
    });

    compiler.hooks.compilation.tap('EmbeddingPlugin', (compilation) => {
      const embeddingsToAdd = {};
      compilation.hooks.succeedModule.tap('EmbeddingPlugin', (moduleData) => {
        if (moduleData && moduleData.resource && fileExtensions.includes(path.extname(moduleData.resource))) {
          const cache = compilation.getCache('EmbeddingPlugin');
          const name = path.relative(compiler.context, moduleData.resource);

          if (!this.embeddings[name]) {
            const generateEmbedding = async () => {
              const cachedEmbedding = await cache.getPromise(`embedding-${name}`);

              if (cachedEmbedding) {
                if (debug) {
                  console.log(`[EmbeddingPlugin] Using cached embedding for: ${name}`);
                }
                embeddingsToAdd[name] = await cachedEmbedding;
              } else {
                if (debug) {
                  console.log(`[EmbeddingPlugin] Generating new embedding for: ${name}`);
                }
                const content = fs.readFileSync(moduleData.resource, 'utf-8');
                const embedding = await embedFn(content, name);
                await cache.storePromise(`embedding-${name}`, null, embedding);
                embeddingsToAdd[name] = embedding;
                if (debug) {
                  console.log(`[EmbeddingPlugin] Embedding generated and cached for: ${name}`);
                }
              }
            };

            compilation.fileDependencies.add(moduleData.resource);
            compilation.hooks.buildModule.tap('EmbeddingPlugin', generateEmbedding);
          }
        }
      });

      compilation.hooks.finishModules.tap('EmbeddingPlugin', () => {
        // Write embeddings to the temporary file if embeddingsToAdd has properties added
        if (Object.keys(embeddingsToAdd).length > 0) {
          // Merge the embeddings to add into this.embeddings
          Object.assign(this.embeddings, embeddingsToAdd);
          fs.writeFileSync(tempPath, JSON.stringify(this.embeddings, null, 2));
          if (debug) {
            console.log(`[EmbeddingPlugin] Embeddings written to temporary file: ${tempPath}`);
          }
        }
      });
    });

    // Move the temporary file to the final output path after the build is done
    compiler.hooks.done.tap('EmbeddingPlugin', () => {
      try {
        fs.renameSync(tempPath, outputPath);
        if (debug) {
          console.log(`[EmbeddingPlugin] Embeddings moved to: ${outputPath}`);
        }
      } catch (ex) {

      }
    });
  }
}

module.exports = EmbeddingPlugin;