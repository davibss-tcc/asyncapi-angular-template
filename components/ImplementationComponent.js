import { File, Text } from "@asyncapi/generator-react-sdk";
import { sanitizeString } from "../util/sanitizeString";
import { AsyncAPIDocument } from "@asyncapi/parser/cjs/models/v2/asyncapi";
import { ChannelInterface } from "@asyncapi/parser/cjs/models";

/**
 * @typedef {Object} ServiceVariable
 * @property {string} variableName
 * @property {string} fileName
 * @property {ChannelInterface} channel
 * @property {string} channelSanitizedName
 * @property {string} serviceObject
 */

/**
 * 
 * @param {AsyncAPIDocument} asyncapi 
 * @returns {any}
 */
export default function ImplementationComponent(asyncapi) {

    const channels = asyncapi
      .channels().all()
      .filter(channel => channel.operations().all().find(op => op.isSend()));
    
    /**
     * @type {ServiceVariable[]}
     */
    const services = [];

    for (let channel of channels) {
        var channelName = sanitizeString(channel.id());
        var fileName = `${channelName}-mqtt-service`;
        services.push({
          variableName: `${channelName}Service`,
          fileName: fileName,
          channelSanitizedName: channelName,
          channel: channel,
          serviceObject: channel.operations().all().filter(op => op.isSend()).flatMap(op => op.messages().all())[0].payload().id()
        });
        // fileEntries.push([`${channelName}Service`, fileName, channelName, channel]);
    }

    const subscribeOperations = channels.flatMap(channel => channel.operations()).filter(op => op.isSend());
    const subscribeOperationsObjects = subscribeOperations.map(op => op.messages().all()[0].payload().id());

    return (
<File name="client_implementation.ts">
  <Text>
{`\
import { Injectable, Type } from '@angular/core';
${services.map(service => `import { ${service.variableName} } from '../services/${service.fileName}';`).join("\n")}
${subscribeOperationsObjects.map(obj => `import { ${obj} } from '../models';`).join("\n")}
import { Subject } from 'rxjs';
import { BaseService } from '../services/base-service';
import { ${services.map(s => `${s.channelSanitizedName.toUpperCase()}_TOPIC`).join(",") }} from '../services/topics';

export interface TopicMappingInterface {
  topic: string;
  topicObject: Type<MetaInfoObject | CommandObject | MovedObject>;
  topicService: BaseService<any>;
}

@Injectable({
  providedIn: 'root'
})
export class ClientImplementationService {

  ${services.map(service => `${service.channelSanitizedName}Subject: Subject<any> = new Subject<${service.serviceObject}>;`).join("\n")}

  TOPICS_MAPPING: TopicMappingInterface[] = [
    ${services
      .map(service => `{ 
            topic: ${service.channelSanitizedName.toUpperCase()}_TOPIC, 
            topicObject: ${service.serviceObject}, 
            topicService: this.${service.variableName}}`
      ).join(",")
    }
  ];

  constructor (
    ${services.map(service => `private ${service.variableName}: ${service.variableName}`).join(",")}
  ) {
    try {
      this.subscribeToAllServices();
    } catch(err) {
      console.log('Some low level problem when trying to subscribe in broker');
    }
  }

  ${renderAreServicesConnectedToBroker(services)}

  ${renderSubscribeToAllServices(services)}

  ${renderUnsubscribeToAllServices(services)}
}
`}
  </Text>
</File>
    );
}

/**
 * 
 * @param {ServiceVariable[]} services 
 * @returns 
 */
function renderAreServicesConnectedToBroker(services) {
  return `
    areServicesConnectedToBroker(){
      try{
        return ${services.map(service => `!this.${service.variableName}.client?.state.closed`).join(" && ")};
      } catch(exception){
        return false;
      }
    }
  `;
}

/**
 * 
 * @param {ServiceVariable} service
 * @returns 
 */
function renderPublishAtSubscription(service) {
  return `\
    if (subscribeMessage.publisher_id === undefined || subscribeMessage.publisher_id !== this.${service.variableName}.MQTT_SERVICE_OPTIONS.clientId) {
      subscribeMessage.publisher_id = this.${service.variableName}.MQTT_SERVICE_OPTIONS.clientId;
      this.${service.channelSanitizedName}Subject.next(subscribeMessage);
    }`;
}

/**
 * 
 * @param {ServiceVariable[]} services
 * @returns 
 */
function renderUnsubscribeToAllServices(services) {
  return `\
    unsubscribeToAllServices() {
      ${services.map(service => `this.${service.variableName}.unsubscribe()`).join("\n")}
    }\
  `;
}

/**
 * 
 * @param {ServiceVariable[]} services
 * @returns 
 */
function renderSubscribeToAllServices(services) {
  return `\
  subscribeToAllServices() {
    ${services.map(service => {
      const subscribeMessageObject = service.channel.operations()
        .all().filter(operation => operation.isSend())[0]
        .messages().all()[0]
        .payload().id();

      // const publishOperation = channel.operations().all().filter(operation => operation.isReceive())[0];

      return `this.${service.variableName}.subscribe((message) => {
        const subscribeMessage = ${subscribeMessageObject}.from_json(JSON.parse(message.payload.toString()));
        console.log("Handled message: " + subscribeMessage.toString());
        ${renderPublishAtSubscription(service)}
      })`;
    }).join("\n\n")}
  }`;
}