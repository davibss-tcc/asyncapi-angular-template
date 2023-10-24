import { File, Text } from '@asyncapi/generator-react-sdk';
import { sanitizeString } from '../util/sanitizeString';

function renderEmptyPublish() {
    return `
        // PUBLISH OPERATION NOT FOUND IN THIS CHANNEL, GENERATING EMPTY PUBLISH
        override unsafePublish(payload: any): void {}
    `;
}

function renderEmptySubscribe() {
    return `
        // SUBSCRIBE OPERATION NOT FOUND IN THIS CHANNEL, GENERATING EMPTY SUBSCRIBE
        override subscribe(callback: (message: IMqttMessage) => void): void {}
    `;
}

function getRequiredSchemas(channel) {
    var operations = channel.operations().collections;
    var messages = operations.flatMap(operation => operation.messages().collections);
    var requiredSchemas = messages.map(message => message.payload().id());
    var importSchemas  = [...new Set(requiredSchemas)].join(", ");
    return importSchemas;
}

export default function MQTTServiceComponent({ servers, channel, params }) {
    var channelName = sanitizeString(channel.id());
    
    var fileName = `${channelName}-mqtt-service.ts`;

    var requiredSchemas = getRequiredSchemas(channel);

    var subscribeOperation = undefined;
    var publishOperation = undefined;

    var allOperations = channel.messages().collections.flatMap(m => m.operations().collections);
    for (let operation of allOperations) {
        if (operation.action() === 'publish') {
            publishOperation = operation;
        } else if (operation.action() === 'subscribe') {
            subscribeOperation = operation;
        }
    }

    var topicImportConstant = `${channelName.toUpperCase()}_TOPIC`;

    return (
<File name={fileName}>
    <Text>
{`\
import { Injectable } from '@angular/core';
import { ${requiredSchemas} } from '../models';
import { ${topicImportConstant} } from './topics';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root'
})
export class ${channelName}Service extends BaseService<${requiredSchemas}> {
    constructor() {
        super();
        this.topic = ${topicImportConstant};
    }

    ${!publishOperation ? renderEmptyPublish() : ""}
    ${!subscribeOperation ? renderEmptySubscribe() : ""}
}
`
}</Text>
</File>
);
}
