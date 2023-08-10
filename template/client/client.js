import { AsyncAPIDocument } from '@asyncapi/parser';
import React from 'react';
import Models from './models/model';
import Services from './services/services';

/**
 * @typedef TemplateParameters
 * @type {object}
 */

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * @param {{asyncapi: AsyncAPIDocument, params?: TemplateParameters}} _
 */
export default function Client({ asyncapi, params }) {
    return [
        <Models />,
        <Services />
    ];
}