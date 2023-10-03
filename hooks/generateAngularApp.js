const angular = require('@angular/cli');
const run = angular.default;

module.exports = {
    'generate:before': (generator) => {
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
            run(options)
            .then(() => {
                console.log('angular app successfully generated');
                generator.targetDir = `${generator.targetDir}/${angularAppName}/src/app`;
            })
            .catch(() => {
                console.log('some error has occurred while generating angular code');
            });
        }
    }
};