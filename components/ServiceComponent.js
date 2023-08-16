import { File, Text } from '@asyncapi/generator-react-sdk';
import { Channel } from "@asyncapi/parser";
import SubscriptionComponent from './SubscriptionComponent';
import PublishComponent from './PublishComponent';

function getSanitizedChannel(channel) {
    var channelName = channel.id();
    channelName = channelName.replace("/", "_");
    channelName = channelName.replace("\\", "_");
    return channelName;
}

function getRequiredSchemas(channel) {
    var operations = channel.operations().collections;
    var messages = operations.flatMap(operation => operation.messages().collections);
    var requiredSchemas = messages.map(message => message.payload().id());
    var importSchemas  = [...new Set(requiredSchemas)].join(", ");
    return importSchemas;
}

export default function ServiceComponent({ channel }) {
    var channelName = getSanitizedChannel(channel);
    
    var fileName = `${channelName}-mqtt-service.ts`;

    var requiredSchemas = getRequiredSchemas(channel);

    return (
<File name={fileName}>
    <Text>
{`
import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject, Subscription } from 'rxjs';
import { ${requiredSchemas} } from '../models';
import { environment } from '../environments/environment.development';

@Injectable({
providedIn: 'root'
})
export class ${channelName}Service {

    private _mqttService: MqttService;
    private client: any;

    private MQTT_SERVICE_OPTIONS = {
        hostname: environment.broker.hostname,
        port: environment.broker.port,
        clean: environment.broker.clean,
        connectTimeout: environment.broker.connectTimeout,
        reconnectPeriod: environment.broker.reconnectPeriod,
        clientId: "Angular client" + new Date().toLocaleString()
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
    <SubscriptionComponent channel={channel} />
    <PublishComponent channel={channel} />
    <Text>{`
}
    `}</Text>
</File>
);
}
