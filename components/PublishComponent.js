import { Channel, Operation } from "@asyncapi/parser";
import { File, Text } from '@asyncapi/generator-react-sdk';
import { sanitizeString } from '../util/sanitizeString';

/**
 * 
 * @param {{channel: Channel, operation: Operation}} _ 
 */
export default function PublishComponent({ channel, operation }) {
    var channelName = sanitizeString(channel.id());
    const payloadType = operation.messages()[0].payload().id();

    return (
        <Text>
{`
unsafePublish${channelName}(payload: ${payloadType}, options?: {topic?: string}) {
    const topicName = options?.topic ?? "${channel.id()}";
    const stringfiedPayload = JSON.stringify(payload.to_json());

    this.client.unsafePublish(topicName, stringfiedPayload, {qos: 0});
}
`}
        </Text>
    );
}