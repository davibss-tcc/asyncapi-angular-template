import { TypeScriptPreset } from "@asyncapi/modelina";

/**
 * 
 * @returns {TypeScriptPreset}
 */
export default function CustomTypescriptPresetModel() {
    return {
        class: {
            additionalContent({content, model}) {
                return `\
                ${content}
                private _publisher_id?: string;

                get publisher_id(): string | undefined {
                    return this._publisher_id;
                }
                set publisher_id(publisher_id: string | undefined) {
                    this._publisher_id = publisher_id;
                }
                `
            }
        }
    }
}