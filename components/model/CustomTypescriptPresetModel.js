import { ConstrainedObjectModel, TypeScriptPreset } from "@asyncapi/modelina";
import { ConstrainedEnumModel } from "@asyncapi/modelina";

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
        return JSON.stringify(this.to_json());
    }`;
}

/**
 * 
 * @param {string[]} properties 
 * @returns string
 */
function renderToJsonString(model, properties) {
    return `\
    public to_json() {
        return {
            ${Object.entries(model.properties).map(([propertyName, property]) => {
                if (property.property.ref instanceof ConstrainedObjectModel) {
                    return `${propertyName}: this.${propertyName}?.to_json()`;
                }
                return `${propertyName}: this.${propertyName}`;
            }).join(",\n")}
        };
    }
    `;
}

/**
 * @param {ConstrainedObjectModel} model
 * @param {string[]} properties 
 * @returns string
 */
function renderFromJsonString(model, properties) {
    const modelName = model.name;
    return `
    public static from_json(value: Object): ${modelName} | undefined {
        let result: ${modelName} = new ${modelName}();

        try {
                ${Object.entries(model.properties).map(([propertyName, property]) => {
                if (property.property.ref instanceof ConstrainedObjectModel) {
                    return `result.${propertyName} = ${property.property.type}.from_json(value["${propertyName}"]);`;
                }
                return `result.${propertyName} = value["${propertyName}"];`;
            }).join("\n")}
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
        enum: {
            item({content,inputModel,item,model,options,renderer}) {
                let result = "";
                let constant = item.value.slice(1,-1);
                if (constant.search("=")) {
                    const [constantName, constantInitialize] = constant.split("=");
                    result = `${constantName} = ${constantInitialize},`
                } else {
                    result = `${constant}`
                }
                return result;
            }
        },
        class: {
            ctor({model, content}) {
                let properties = Object.entries(model.properties)
                    .map(([propertyName, property]) => [propertyName, property.property.type, property.required]);
                properties.push(["publisher_id", "string", false]);

                let renderedArguments = properties.map(
                    ([propertyName, propertyType, required]) => {
                        let requiredArgument = `${propertyName}: ${propertyType}`;
                        let nonRequiredArgument = `${propertyName}?: ${propertyType}`;
                        if (model.properties[propertyName] && model.properties[propertyName].property.ref instanceof ConstrainedEnumModel) {
                            let defaultEnum = `${propertyType}[Object.keys(${propertyType})[0]]`;
                            requiredArgument = `${propertyName}: ${propertyType} = ${defaultEnum}`;
                        }
                        return required ? requiredArgument : nonRequiredArgument;
                    }
                ).join(", ");    

                return `
                constructor(${renderedArguments}) {
                    ${properties.map(([propertyName, propertyType]) => `this._${propertyName} = ${propertyName}`).join("\n")}
                }
                `;
            },
            additionalContent({content, model}) {
                let properties = Object.keys(model.properties);
                properties.push("publisher_id");
                return `\
                    ${content}
                    ${renderPublisherId()}

                    ${renderToJsonString(model, properties)}
                    ${renderFromJsonString(model, properties)}
                    ${renderToString()}
                `;
            }
        }
    }
}