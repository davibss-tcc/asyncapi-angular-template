import { ConstrainedObjectModel, TypeScriptPreset } from "@asyncapi/modelina";
import { ConstrainedEnumModel } from "@asyncapi/modelina";
import { extractFirstEnumFromModel } from "../../util/enumUtil";

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
        return JSON.stringify(this);
    }`;
}

/**
 * 
 * @param {string[]} properties 
 * @returns string
 */
function renderToJsonString(model, properties) {
    return `\
    public toJSON() {
        return {
            ${
                Object.entries(model.properties).map(([propertyName, property]) => {
                    if (property.property.ref instanceof ConstrainedObjectModel) {
                        return `${propertyName}: this.${propertyName}?.toJSON()`;
                    }
                    return `${propertyName}: this.${propertyName}`;
                })
                .concat("publisher_id: this.publisher_id")
                .join(",\n")
            }
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
    public static from_json(value: any): ${modelName} {
        let result: ${modelName} = new ${modelName}();

        try {
                ${
                    Object.entries(model.properties).map(([propertyName, property]) => {
                        if (property.property.ref instanceof ConstrainedObjectModel) {
                            return `result.${propertyName} = ${property.property.type}.from_json(value["${propertyName}"]);`;
                        }
                        return `result.${propertyName} = value["${propertyName}"];`;
                    })
                    .concat("result.publisher_id = value['publisher_id'];")
                    .join("\n")
                }
        } catch(_){}

        return result;
    }
    `;
}

/**
 * 
 * @returns {TypeScriptPreset}
 */
export default function CustomTypescriptPresetModel(params) {
    return {
        enum: {
            item({content,inputModel,item,model,options,renderer}) {
                let result = "";
                let constant = item.value.slice(1,-1);
                const index = model.values.map(i => i.value).findIndex(value => value === item.value);
                const initializeEnum = params.initializeEnum === "true";
                if (constant.search("=")) {
                    const [constantName, constantInitialize] = constant.split("=");
                    result = `${constantName} = ${initializeEnum ? index + 1 : constantInitialize},`
                } else {
                    result = `${constant}${initializeEnum ? ` = ${index}`: ""}`
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
                            let firstEnum = extractFirstEnumFromModel(model.properties[propertyName].property.ref);
                            let defaultEnum = `${propertyType}.${firstEnum}`;
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