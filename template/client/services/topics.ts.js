import { AsyncAPIDocumentInterface } from "@asyncapi/parser/cjs";
import { File } from '@asyncapi/generator-react-sdk';
import { sanitizeString } from "../../../util/sanitizeString";

/**
 * 
 * @param {{asyncapi: AsyncAPIDocumentInterface}} _ 
 * @returns 
 */
export default function Topics({ asyncapi }) {

    const channelsNames = asyncapi.channels().all().map(channel => sanitizeString(channel.id()));
    return (
<File name="topics.ts">
{`\
    ${channelsNames.map(channelName => {
        return `export const ${channelName.toUpperCase()}_TOPIC = "${channelName}"`;
    }).join("\n")}

    export const ALL_TOPICS = [${channelsNames.map(channelName => `${channelName.toUpperCase()}_TOPIC`).join(",")}]
`}
</File>
    );
}