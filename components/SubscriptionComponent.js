import { Channel } from "@asyncapi/parser";
import { File, Text } from '@asyncapi/generator-react-sdk';


/**
 * 
 * @param {Channel} channel 
 */
export default function SubscriptionComponent({ channel }) {
    return (
        <Text>
{`
subscribe() {}
`}
        </Text>
    );
}