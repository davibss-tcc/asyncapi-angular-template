import { File, Text } from '@asyncapi/generator-react-sdk';
import SubscriptionComponent from './SubscriptionComponent';
import PublishComponent from './PublishComponent';
import { sanitizeString } from '../util/sanitizeString';
import { chooseEnvironment } from '../util/chooseEnvironment';

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

    // var choosedEnvironment = chooseEnvironment(servers, params);
    var choosedEnvironment = "environment";

    return (
<File name={fileName}>
    <Text>
{`
import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject, Subscription } from 'rxjs';
import { ${requiredSchemas} } from '../models';
import { environment } from './../environments/environment';

@Injectable({
providedIn: 'root'
})
export class ${channelName}Service {

    private _mqttService: MqttService;
    private client: any;

    private subscription${channelName}: Subscription | undefined;

    private MQTT_SERVICE_OPTIONS = {
        hostname: ${choosedEnvironment}.broker.hostname,
        port: ${choosedEnvironment}.broker.port,
        clean: ${choosedEnvironment}.broker.clean,
        connectTimeout: ${choosedEnvironment}.broker.connectTimeout,
        reconnectPeriod: ${choosedEnvironment}.broker.reconnectPeriod,
        clientId: ${choosedEnvironment}.clientInfo.clientId
    }

    constructor () {
        this._mqttService = new MqttService(this.MQTT_SERVICE_OPTIONS);
        this.client = this._mqttService;
    }

    createConnection() {
        try {
        this.client?.connect();
        } catch (error) {
        console.log('mqtt.connect error', error);
        }
        this.client?.onConnect.subscribe(() => {
        console.log('Connection succeeded!');
        });
        this.client?.onError.subscribe((error: any) => {
        console.log('Connection failed', error);
        });
        this.client?.onMessage.subscribe((packet: any) => {
        console.log(\`Received message \${packet.payload} from topic \${packet.topic}\`)
        })
    }
`}
    </Text>
    <SubscriptionComponent channel={channel} operation={subscribeOperation} />
    <PublishComponent channel={channel} operation={publishOperation} />
    <Text>{`
}
    `}</Text>
</File>
);
}
