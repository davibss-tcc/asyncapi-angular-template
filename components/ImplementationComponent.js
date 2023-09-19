import { File, Text } from "@asyncapi/generator-react-sdk";
import { sanitizeString } from "../util/sanitizeString";

export default function ImplementationComponent(asyncapi) {

    const channels = asyncapi.channels().collections;
    const fileEntries = [];

    for (let channel of channels) {
        var channelName = sanitizeString(channel.id());
        var fileName = `${channelName}-mqtt-service`;
        fileEntries.push([`${channelName}Service`, fileName, channelName]);
    }

    return (
        <File name="client_implementation.ts">
            <Text>
          {`
${fileEntries.map(fileEntry => `import { ${fileEntry[0]} } from '../services/${fileEntry[1]}';`).join("\n")}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientImplementationService {

  ${fileEntries.map(fileEntry => `private ${fileEntry[0]}: ${fileEntry[0]}`).join("\n")}

  constructor () {
    this.subscribeToAllServices();
  }

  subscribeToAllServices() {
    ${fileEntries.map(fileEntry => {
      const subscribeName = `subscribe${fileEntry[2]}`;
      return `this.${fileEntry[0]}.${subscribeName}((message) => {
        const parsedObject = JSON.parse(message.payload.toString());
        // TODO: Implement your code here
        console.log(parsedObject);
      })`
    }).join("\n")}
  }

  unsubscribeToAllServices() {
    ${fileEntries.map(fileEntry => `this.${fileEntry[0]}.unsubscribeAll()`).join("\n")}
  }
}
          `}
            </Text>
        </File>
    );
}