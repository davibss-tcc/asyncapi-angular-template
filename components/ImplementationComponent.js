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
{`\
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
${fileEntries.map(fileEntry => `import { ${fileEntry[0]} } from '../services/${fileEntry[1]}';`).join("\n")}

${subscribeOperationsObjects.map(obj => {
  return `import { ${obj} } from '../models';`
}).join("\n")}

@Injectable({
  providedIn: 'root'
})
export class ClientImplementationService {
  constructor (
    ${fileEntries.map(fileEntry => `private ${fileEntry[0]}: ${fileEntry[0]}`).join(",")}
  ) {
    this.subscribeToAllServices();
  }

  ${renderSubscribeToAllServices(fileEntries)}

  ${renderUnsubscribeToAllServices(fileEntries)}
}
`}
  </Text>
</File>
    );
}

function renderPublishAtSubscription(publishOperation, fileEntry) {
  return publishOperation ? `\
    if (subscribeMessage.publisher_id === undefined || subscribeMessage.publisher_id !== this.${fileEntry[0]}.MQTT_SERVICE_OPTIONS.clientId) {
      subscribeMessage.publisher_id = this.${fileEntry[0]}.MQTT_SERVICE_OPTIONS.clientId;
      this.${fileEntry[0]}.unsafePublish${fileEntry[2]}(subscribeMessage);
    }` : "";
}

function renderUnsubscribeToAllServices(fileEntries) {
  return `\
    unsubscribeToAllServices() {
      ${fileEntries.map(fileEntry => `this.${fileEntry[0]}.unsubscribeAll()`).join("\n")}
    }\
  `;
}

function renderSubscribeToAllServices(fileEntries) {
  return `\
  subscribeToAllServices() {
    ${fileEntries.map(fileEntry => {
      const subscribeName = `subscribe${fileEntry[2]}`;

      /** @type {Channel} */
      let channel = fileEntry[3];

      const subscribeMessageObject = channel.operations()
        .all().filter(operation => operation.isSend())[0].messages().all()[0].payload().id();

      
      const publishOperation = channel.operations().all().filter(operation => operation.isReceive())[0];

      return `this.${fileEntry[0]}.${subscribeName}((message) => {
        const subscribeMessage = ${subscribeMessageObject}.from_json(JSON.parse(message.payload.toString()));
        console.log("Handled message: " + subscribeMessage.toString());
        ${renderPublishAtSubscription(publishOperation, fileEntry)}
        // TODO: Implement your code here
      })`
    }).join("\n\n")}
  }`;
}