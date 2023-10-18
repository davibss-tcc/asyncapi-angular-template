import { ChannelInterface } from "@asyncapi/parser/cjs";
import { File, Text } from '@asyncapi/generator-react-sdk';
import { sanitizeString } from '../util/sanitizeString';

/**
 * 
 * @param {{channel: ChannelInterface}} _ 
 */
export default function SubscriptionComponent({ channel }) {

    const channelName = sanitizeString(channel.id());

    return (
        <Text>
{`
subscribe${sanitizeString(channelName)}(callback: (message: IMqttMessage) => void) {
    const topicName = ${channelName.toUpperCase()}_TOPIC;

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