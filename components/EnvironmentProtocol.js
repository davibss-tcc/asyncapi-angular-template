import { File } from '@asyncapi/generator-react-sdk';
import { Server } from '@asyncapi/parser';
import * as crypto from "crypto";


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
clientInfo: {
    clientId: crypto.randomUUID()
},
broker: {
    url: '${server.url()}',
    hostname: '${server.url()}',
    port: 8080,
    clean: true,
    connectOnCreate: true,
    connectTimeout: 4000,
    reconnectPeriod: 3900
}
}\
`}
</File>
    );
}