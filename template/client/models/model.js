import { File, Text } from '@asyncapi/generator-react-sdk';
import { AsyncAPIDocument } from '@asyncapi/parser';
import React from 'react';
import { TypeScriptGenerator, FormatHelpers, ConstrainedUnionModel } from '@asyncapi/modelina';
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
                preset: CustomTypescriptPresetModel(params)
            }
        ],
        processorOptions: {
            interpreter: {
                ignoreAdditionalProperties: true
            }
        },
        typeMapping: {
            Array({ constrainedModel }) {
                let arrayType = constrainedModel.valueModel.type;
                if (constrainedModel.valueModel instanceof ConstrainedUnionModel) {
                    if (constrainedModel.valueModel.union.find(model => model.type === 'any') && constrainedModel.valueModel.union.length > 1) {
                        var nonAnyModel = constrainedModel.valueModel.union.filter(model => model.type !== 'any')[0];
                        arrayType = `${nonAnyModel.type}`;
                    } else {
                        arrayType = `(${arrayType})`;
                    }
                }
                return `${arrayType}[]`;
            }
        }
    });

    const generatedModels = await typescriptGenerator.generateCompleteModels(asyncapi, {moduleSystem: 'ESM'});
    const files = [];
    generatedModels.forEach(generatedModel => {
        const modelFileName = `${FormatHelpers.toPascalCase(generatedModel.modelName)}.ts`;
        files.push(<File name={modelFileName}>{generatedModel.result}</File>);
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
