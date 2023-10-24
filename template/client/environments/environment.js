import { AsyncAPIDocument, Server } from "@asyncapi/parser";
import { File } from '@asyncapi/generator-react-sdk';
import { capitalizeString } from '../../../util/stringUtil';
import { EnvironmentProtocol } from "../../../components/EnvironmentProtocol";

/**
 * 
 * @param {{asyncapi: AsyncAPIDocument}} _ 
 * @returns 
 */
export default function Environment({ asyncapi }) {
    /**
     * @type {Server[]}
     */
    const servers = asyncapi.servers().collections;
    
    let generatedFiles = [];
    // generatedFiles = servers.map(server => {
    //     const protocol = server.protocol();
    //     const serverName = server.id();
    //     const sanitizedProtocol = protocol.replace("-", "_");
    //     const environmentConstant = "environment";
    //     const target = `${protocol}-${serverName}`;
    //     return EnvironmentProtocol(target, environmentConstant, server);        
    // });

    const prodServer = {
        url: () => servers.length > 0 ? servers[0].url() : "localhost"
    }
    const devServer = {
        url: () => "localhost"
    }
    generatedFiles.push(EnvironmentProtocol("", "environment", devServer));
    generatedFiles.push(EnvironmentProtocol("development", "environment", devServer));

    return generatedFiles;
}