import { AsyncAPIDocument } from '@asyncapi/parser';
import React from 'react';
import Client from './client/client';

/**
 * @typedef TemplateParameters
 * @type {object}
 */

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * @param {{asyncapi: AsyncAPIDocument, params?: TemplateParameters}} _
 */
export default function ({ asyncapi, params }) {
  return (
    <Client asyncapi={asyncapi} params={params} />
  );
}