import { File } from '@asyncapi/generator-react-sdk';
import { AsyncAPIDocument } from '@asyncapi/parser';
import React from 'react';
import { TypeScriptGenerator, FormatHelpers, TS_COMMON_PRESET, ConstrainedEnumModel } from '@asyncapi/modelina';
import { RenderEnum } from '../../../components/renderEnum';

/**
 * @typedef TemplateParameters
 * @type {object}
 */

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * @param {{asyncapi: AsyncAPIDocument, params?: TemplateParameters}} _
 */
export default async function Models({ asyncapi, params }) {
    const typescriptGenerator = new TypeScriptGenerator({
        modelType: 'class',
        presets: [
            {
            preset: TS_COMMON_PRESET,
            options: {
                marshalling: true
            }
            }
        ]
    });

    const generatedModels = await typescriptGenerator.generateCompleteModels(asyncapi, {moduleSystem: 'ESM'});
    const files = [];
    generatedModels.forEach(generatedModel => {
        const modelFileName = `${FormatHelpers.toPascalCase(generatedModel.modelName)}.ts`;
        if (generatedModel.model instanceof ConstrainedEnumModel) {
            files.push(<File name={modelFileName}>{RenderEnum(generatedModel.model, params.initializeEnum)}</File>);
        } else {
            files.push(<File name={modelFileName}>{generatedModel.result}</File>);
        }
    });
    
    return files;
}
