import { ChannelInterface, OperationInterface } from "@asyncapi/parser/cjs";
import { File, Text } from '@asyncapi/generator-react-sdk';
import { sanitizeString } from '../util/sanitizeString';

/**
 * 
 * @param {{channel: ChannelInterface, operation: OperationInterface}} _ 
 */
export default function PublishComponent({ channel, operation }) {
    var channelName = sanitizeString(channel.id());
    const payloadType = operation.messages()[0].payload().id();

    return (
        <Text>
{`
unsafePublish${channelName}(payload: ${payloadType}) {
    const topicName = ${channelName.toUpperCase()}_TOPIC;
    const stringfiedPayload = JSON.stringify(payload);

    this.client.unsafePublish(topicName, stringfiedPayload, {qos: 0});
}
`}
        </Text>
    );
}