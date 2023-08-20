import { AsyncAPIDocument } from "@asyncapi/parser";
import { File } from '@asyncapi/generator-react-sdk';
import { capitalizeString } from '../../../util/stringUtil';

/**
 * 
 * @param {{asyncapi: AsyncAPIDocument}} _ 
 * @returns 
 */
export default function Environment({ asyncapi }) {
    const servers = asyncapi.servers().collections;

    const generatedFiles = servers.map(server => {
        const protocol = server.protocol();
        const serverName = server.id();

        const sanitizedProtocol = protocol.replace("-", "_");

        const environmentConstant = `${sanitizedProtocol}${capitalizeString(serverName)}Environment`;

        return (
            <File name={`environment.${protocol}.${serverName}.ts`}>
{`
export const ${environmentConstant} = {
    broker: {
        url: '${server.url()}',
        hostname: '${server.url()}',
        port: 1883,
        clean: true,
        connectTimeout: 400,
        reconnectPeriod: 390
    }
}
`}
            </File>
        )
    });

    return generatedFiles;
}