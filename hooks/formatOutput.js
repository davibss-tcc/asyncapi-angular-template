const fs = require('fs');
const path = require('path');
const prettier = require("prettier");
const archiver = require('archiver');
const { rimraf } = require('rimraf');

const formatAllOutputFiles = function(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach(async (file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      formatAllOutputFiles(filePath);
    } else {
      if (filePath.endsWith(".ts") && !filePath.endsWith("node_modules")) {
        const text = await fs.readFile(filePath, {encoding: "utf-8"} , async (err, data) => {
          const formatted = await prettier.format(data, {
              "semi": true,
              "singleQuote": true,
              "printWidth": 80,
              "tabWidth": 2,
              "bracketSpacing": true,
              "parser": "typescript"
          });
          fs.writeFileSync(filePath, formatted);
        });
      }
    } 
  });
};

const removeUnnecessaryFiles = function(dirPath, zipFileName) {
  rimraf.sync(dirPath, {
    preserveRoot: false,
    filter: (filePath, ent) => {
      const isRootDir = filePath === dirPath;
      const isZipFile = filePath === path.join(dirPath, zipFileName);
      return !isRootDir && !isZipFile;
    }
  });
}

const zipFiles = async function(dirPath) {
  const zipFileName = '/asyncapi_angular_client.zip';
  const output = fs.createWriteStream(path.join(dirPath, zipFileName));

  const archive = archiver('zip', {
    zlib: { level: 9 },
    forceLocalTime: true
  });

  output.on('close', () => {
    console.log('Zip file is ready.');
    removeUnnecessaryFiles(dirPath, zipFileName);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.glob("**/!(*.zip)", { cwd: dirPath, dot: true })

  await archive.finalize();
}

/**
 * Format all source files with indentations and new lines
 */
module.exports = {
    'generate:after': async (generator) => {
        /** @type string */
        let pathToDir = path.resolve(generator.targetDir);
        if (generator.templateParams.onlySourceFiles === "false") {
          pathToDir = path.join(path.sep, ...pathToDir.split("/").slice(0,-3));
        }
        formatAllOutputFiles(path.join(pathToDir, 'angular-asyncapi-client', 'src'));
        if (generator.templateParams.zip === "true") {
          await zipFiles(pathToDir);
        }
    }
};