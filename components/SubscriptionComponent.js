import { Channel } from "@asyncapi/parser";
import { File, Text } from '@asyncapi/generator-react-sdk';
import { sanitizeString } from '../util/sanitizeString';

/**
 * 
 * @param {{channel: Channel}} _ 
 */
export default function SubscriptionComponent({ channel }) {

    const channelName = sanitizeString(channel.id());

    return (
        <Text>
{`
subscribeAll(callback: (message: IMqttMessage) => void) {
    this.subscribe${sanitizeString(channelName)}(callback);    
}

unsubscribeAll() {
    this.unsubscribe${sanitizeString(channelName)}();
}

subscribe${sanitizeString(channelName)}(callback: (message: IMqttMessage) => void, options?: {topic?: string}) {
    const topicName = options?.topic ?? "${channel.id()}";

    this.subscription${channelName} = this.client?.observe(topicName, {qos: 0})
        .subscribe(callback);
}

unsubscribe${sanitizeString(channelName)}() {
    this.subscription${channelName}?.unsubscribe();
}
`}
        </Text>
    );
}