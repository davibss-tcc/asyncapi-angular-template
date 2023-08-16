import { AsyncAPIDocument, Channel } from '@asyncapi/parser';
import React from 'react';
import ServiceComponent from '../../../components/ServiceComponent';
import { File, Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef TemplateParameters
 * @type {object}
 */

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * @param {{asyncapi: AsyncAPIDocument, params?: TemplateParameters}} _
 */
export default function Services({ asyncapi, params }) {
    /**
     * @type {Channel[]}
     */
    const channels = asyncapi.channels().collections;

    var generatedFiles = [];
    for (let channel of channels) {
        generatedFiles.push(ServiceComponent({channel: channel}));
    }

    return generatedFiles;
}