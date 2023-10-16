/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
}

module.exports = {
    'generate:before': async (generator) => {
        if (generator.templateParams.onlySourceFiles !== "true") {
            const angularAppName = 'angular-asyncapi-client';
            const options = {
                cliArgs: [
                    'new',
                    '--force',
                    '--defaults',
                    '--interactive',
                    'false',
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
                const result = await execShellCommand(`ng ${options.cliArgs.join(" ")}`);
                const result_dependencies = await execShellCommand(`add-dependencies ${angularAppName}/package.json ngx-mqtt`);
                console.log('Angular app generated successfully');
                generator.targetDir = `${generator.targetDir}/${angularAppName}/src/app`;
            } catch(e) {
                console.log('some error has occurred while generating angular code');
            }
            process.chdir(process.env.PWD);
        }
    }
};