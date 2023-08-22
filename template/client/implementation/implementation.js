import { AsyncAPIDocument } from '@asyncapi/parser';
import { File, Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef TemplateParameters
 * @type {object}
 */

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * @param {{asyncapi: AsyncAPIDocument, params?: TemplateParameters}} _
 */
export default function Implementation({ asyncapi, params }) {

  return (
    <File name="implementation.ts">
      <Text>teste</Text>
    </File>
  );
}