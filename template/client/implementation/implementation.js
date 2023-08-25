import { AsyncAPIDocument } from '@asyncapi/parser';
import { File, Text } from '@asyncapi/generator-react-sdk';
import { fileExists } from '../../../util/fileUtil';
import ImplementationComponent from '../../../components/ImplementationComponent';

/**
 * @typedef TemplateParameters
 * @type {object}
 */

/**
 * Return the correct channel functions for the test client on whether a channel is `pubSub` or `requestReply`
 * @param {{asyncapi: AsyncAPIDocument, params?: TemplateParameters}} _
 */
export default function Implementation({ asyncapi, params }) {
  var generateFile = [];

  const implementationFilePath = `${params.outputDir}/client/implementation/implementation.ts`;
  const implementationFileExists = fileExists(implementationFilePath);
  if (!implementationFileExists) {
    generateFile = ImplementationComponent(asyncapi);
  }

  return generateFile;
}