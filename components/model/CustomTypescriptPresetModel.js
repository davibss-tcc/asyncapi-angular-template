import { TypeScriptPreset } from "@asyncapi/modelina";

function renderPublisherId() {
    return `\
    private _publisher_id?: string;

    get publisher_id(): string | undefined {
        return this._publisher_id;
    }

    set publisher_id(publisher_id: string | undefined) {
        this._publisher_id = publisher_id;
    }`;
}

function renderToString() {
    return `
    public toString() {
        return this.to_json_string();
    }`;
}

/**
 * 
 * @param {string[]} properties 
 * @returns string
 */
function renderToJsonString(properties) {
    return `\
    public to_json_string() {
        return JSON.stringify({
            ${properties.map(property => `${property}: this.${property}?.toString() ?? undefined`).join(",\n")}
        });
    }
    `;
}

/**
 * 
 * @param {string[]} properties 
 * @returns string
 */
function renderFromJsonString(modelName, properties) {
    return `
    public from_json_string(value: string): ${modelName} | undefined {
        let result: ${modelName} | undefined = undefined;

        try {
            let json_obj = JSON.parse(value);
            result = new ${modelName}(
                ${properties.map(property => `json_obj.${property}`).join(",\n")}
            );
        } catch(_){}

        return result;
    }
    `;
}

/**
 * 
 * @returns {TypeScriptPreset}
 */
export default function CustomTypescriptPresetModel() {
    return {
        class: {
            ctor({model, content}) {
                let properties = Object.keys(model.properties);
                properties.push("publisher_id");
                return `
                constructor(${properties.map(property => `${property}: any`).join(", ")}) {
                    ${properties.map(property => `this._${property} = ${property}`).join("\n")}
                }
                `;
            },
            additionalContent({content, model}) {
                let properties = Object.keys(model.properties);
                properties.push("publisher_id");
                return `\
                    ${content}
                    ${renderPublisherId()}
                    ${renderToJsonString(properties)}
                    ${renderFromJsonString(model.name, properties)}
                    ${renderToString()}
                `;
            }
        }
    }
}