const fs = require('fs');
const path = require('path');
const prettier = require("prettier");

const formatAllOutputFiles = function(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(async (file) => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        formatAllOutputFiles(filePath);
      } else {
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
    });
  };

/**
 * Format all source files with indentations and new lines
 */
module.exports = {
    'generate:after': (generator) => {
        let pathToDir = path.resolve(generator.targetDir, '');
        formatAllOutputFiles(pathToDir);
    }
};