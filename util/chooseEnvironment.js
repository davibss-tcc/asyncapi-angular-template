import { capitalizeString } from "./stringUtil";

export function chooseEnvironment(servers, params) {
    let choosedEnvironment = "";

    let index = 0;
    for (let server of servers) {
        const protocol = server.protocol();
        const serverName = server.id();
        const sanitizedProtocol = protocol.replace("-", "_");
        const environmentConstant = `${sanitizedProtocol}${capitalizeString(serverName)}Environment`;

        if (protocol === params.protocol) {
            choosedEnvironment = environmentConstant;
        }
        if (choosedEnvironment === "" && index === servers.length - 1) {
            choosedEnvironment = environmentConstant;
        }
        index+=1;
    }
    
    return choosedEnvironment;
}