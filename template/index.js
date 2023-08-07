import { File, Text } from '@asyncapi/generator-react-sdk';
import { AsyncAPIDocument } from '@asyncapi/parser';
import React from 'react';

/**
 * @typedef TemplateParameters
 * @type {object}
 */

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * @param {{asyncapi: AsyncAPIDocument, params?: TemplateParameters}} _
 */
export default function ({ asyncapi, params }) {

  return [
    <File name='index.ts'>
      <Text newLines={2}>
        Teste
      </Text>
    </File>
  ]
}