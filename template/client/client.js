import { AsyncAPIDocument } from '@asyncapi/parser';
import React from 'react';
import Models from './models/model';
import Services from './services/services';
import Environment from './environments/environment';
import Implementation from './implementation/implementation.ts';

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
        <Environment />,
        <Models />,
        <Services />,
        <Implementation />
    ];
}