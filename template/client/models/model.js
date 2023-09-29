import { File, Text } from '@asyncapi/generator-react-sdk';
import { AsyncAPIDocument, Schema } from '@asyncapi/parser';
import React from 'react';
import { TypeScriptGenerator, FormatHelpers, TS_COMMON_PRESET, ConstrainedEnumModel } from '@asyncapi/modelina';
import { EnumComponent } from '../../../components/EnumComponent';
import CustomTypescriptPresetModel from '../../../components/model/CustomTypescriptPresetModel';

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
                preset: CustomTypescriptPresetModel()
            }
        ],
        processorOptions: {
            interpreter: {
                ignoreAdditionalProperties: true
            }
        }
    });

    const generatedModels = await typescriptGenerator.generateCompleteModels(asyncapi, {moduleSystem: 'ESM'});
    const files = [];
    generatedModels.forEach(generatedModel => {
        const modelFileName = `${FormatHelpers.toPascalCase(generatedModel.modelName)}.ts`;
        if (generatedModel.model instanceof ConstrainedEnumModel) {
            files.push(<File name={modelFileName}>{EnumComponent(generatedModel.model, params.initializeEnum)}</File>);
        } else {
            files.push(<File name={modelFileName}>{generatedModel.result}</File>);
        }
    });

    files.push((
    <File name='index.ts'>
        <Text>
{`
${generatedModels.map(generatedModel => {
    const modelFileName = `${FormatHelpers.toPascalCase(generatedModel.modelName)}`;
    return (
`import ${modelFileName} from \'./${modelFileName}\';`
    );
}).join("\n")}

export {
    ${generatedModels.map(generatedModel => `${FormatHelpers.toPascalCase(generatedModel.modelName)}`)}
}
`}
        </Text>
    </File>
    ));
    
    return files;
}
