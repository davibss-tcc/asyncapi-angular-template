import { File } from '@asyncapi/generator-react-sdk';
import { Server } from '@asyncapi/parser';

/**
 * 
 * @param {string} protocol 
 * @param {string} serverName 
 * @param {string} environmentConstant 
 * @param {Server} server 
 * @returns 
 */
export function EnvironmentProtocol(target, environmentConstant, server) {

    var targetSubstring = "";

    if (target !== "") {
        targetSubstring = `.${target}`;
    }

    return (
<File name={`environment${targetSubstring}.ts`}>
{`\
export const ${environmentConstant} = {
broker: {
    url: '${server.url()}',
    hostname: '${server.url()}',
    port: 8080,
    clean: true,
    connectTimeout: 400,
    reconnectPeriod: 390
}
}\
`}
</File>
    );
}