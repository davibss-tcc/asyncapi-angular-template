import { capitalizeString } from "../util/stringUtil";

export function ImportServerComponent(servers) {
    return servers.map((server) => {
        const protocol = server.protocol();
        const serverName = server.id();
        const sanitizedProtocol = protocol.replace("-", "_");
        const environmentConstant = `${sanitizedProtocol}${capitalizeString(serverName)}Environment`;
            
        return `import { ${environmentConstant} } from '../environments/${`environment.${protocol}.${serverName}`}'`;
    });
}