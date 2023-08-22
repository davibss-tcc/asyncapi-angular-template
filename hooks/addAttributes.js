module.exports = {
    'generate:before': (generator) => {
        const asyncapi = generator.asyncapi;
        Object.defineProperty(generator.templateParams, "outputDir", {
            enumerable: true,
            get() {
              return generator.targetDir;
            }
        });

    }
};