const angular = require('@angular/cli');
const run = angular.default;

module.exports = {
    'generate:before': async (generator) => {
        if (generator.templateParams.onlySourceFiles !== "true") {
            const angularAppName = 'angular-asyncapi-client';
            const options = {
                cliArgs: [
                    'new',
                    '--force',
                    angularAppName,
                    '--skip-install',
                    '--skip-tests',
                    '--style',
                    'css',
                    '--routing',
                    '-g'
                ]
            };
            process.chdir(generator.targetDir);
            try {
                const result = await run(options);
                console.log('angular app successfully generated, code: ' + result);
                generator.targetDir = `${generator.targetDir}/${angularAppName}/src/app`;
            } catch {
                console.log('some error has occurred while generating angular code');
            }
            process.chdir(process.env.PWD);
        }
    }
};