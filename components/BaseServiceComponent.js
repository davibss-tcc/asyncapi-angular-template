import { File, Text } from '@asyncapi/generator-react-sdk';

export default function BaseServiceComponent() {
    return (
<File name="base-service.ts">
    <Text>
{`\
import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export abstract class BaseService<T>{
  private _mqttService: MqttService;
  private _client: MqttService;
  private _topic: string;
  private _subscription: Subscription | undefined;

  MQTT_SERVICE_OPTIONS = {
    hostname: environment.broker.hostname,
    port: environment.broker.port,
    clean: environment.broker.clean,
    connectTimeout: environment.broker.connectTimeout,
    reconnectPeriod: environment.broker.reconnectPeriod,
    clientId: crypto.randomUUID(),
  };

  constructor() {
    this._mqttService = new MqttService(this.MQTT_SERVICE_OPTIONS);
    this._client = this._mqttService;
    this._topic = '';
  }

  get client(){
    return this._client;
  }

  get subscription(){
    return this._subscription;
  }

  set subscription(subscription: Subscription | undefined) {
    this._subscription = subscription;
  }

  get topic(){
    return this._topic;
  }

  set topic(topic:string){
    this._topic = topic;
  }

  createConnection() {
    try {
      this._client?.connect();
    } catch (error) {
      console.log('mqtt.connect error', error);
    }
    this._client?.onConnect.subscribe(() => {
      console.log('Connection succeeded!');
    });
    this._client?.onError.subscribe((error: any) => {
      console.log('Connection failed', error);
    });
    this._client?.onMessage.subscribe((packet: any) => {
      console.log(
        \`Received message \${packet.payload} from topic \${packet.topic}\`
      );
    });
  }

  subscribe(callback: (message: IMqttMessage) => void): void{
    this.subscription = this.client
      ?.observe(this.topic, { qos: 0 })
      .subscribe(callback);
  }

  unsubscribe(): void{
    this.subscription?.unsubscribe();
  }

  unsafePublish(payload: T): void{
    const stringfiedPayload = JSON.stringify(payload);
    this.client.unsafePublish(this.topic, stringfiedPayload, { qos: 0 });
  }

}
`}
    </Text>
</File>
    );
}