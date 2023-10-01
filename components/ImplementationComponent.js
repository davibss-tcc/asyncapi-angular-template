import { File, Text } from "@asyncapi/generator-react-sdk";
import { sanitizeString } from "../util/sanitizeString";
import { Channel } from "@asyncapi/parser";

export default function ImplementationComponent(asyncapi) {

    const channels = asyncapi
      .channels().all()
      .filter(channel => channel.operations().all().find(op => op.isSend()));
    const fileEntries = [];

    for (let channel of channels) {
        var channelName = sanitizeString(channel.id());
        var fileName = `${channelName}-mqtt-service`;
        fileEntries.push([`${channelName}Service`, fileName, channelName, channel]);
    }

    const subscribeOperations = channels.flatMap(channel => channel.operations()).filter(op => op.isSend());
    const subscribeOperationsObjects = subscribeOperations.map(op => op.messages().all()[0].payload().id());

    return (
        <File name="client_implementation.ts">
            <Text>
          {`
${fileEntries.map(fileEntry => `import { ${fileEntry[0]} } from '../services/${fileEntry[1]}';`).join("\n")}
import { Injectable } from '@angular/core';
${subscribeOperationsObjects.map(obj => {
  return `import { ${obj} } from '../models';`
}).join("\n")}

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
      /** @type {Channel} */
      let channel = fileEntry[3];
      const subscribeMessageObject = channel.operations().all().filter(operation => operation.isSend())[0].messages().all()[0].payload().id();
      return `this.${fileEntry[0]}.${subscribeName}((message) => {
        const subscribeMessage = ${subscribeMessageObject}.from_json(JSON.parse(message.payload.toString()));
        // TODO: Implement your code here
        console.log(subscribeMessage.toString());
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