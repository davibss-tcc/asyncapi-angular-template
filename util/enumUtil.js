import { ConstrainedEnumModel } from "@asyncapi/modelina";

/**
 * 
 * @param {ConstrainedEnumModel} constrainedEnumModel 
 */
export function extractFirstEnumFromModel(constrainedEnumModel) {
    let result = "";
    const enumValues = constrainedEnumModel.values;
    /** @type {string} */
    const firstValue = enumValues[0].value;
    const sanitizedString = firstValue.replace(new RegExp("\"", 'g'), "");
    if (sanitizedString.includes("=")) {
        result = sanitizedString.split("=")[0];
    } else {
        result = sanitizedString;
    }
    return result.trim();
}