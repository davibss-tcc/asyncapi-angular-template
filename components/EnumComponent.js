import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @param {ConstrainedEnumModel} model
 * @param {string} generateInitialize
 * @returns 
 */
export function EnumComponent(model, generateInitialize) {
    const enumName = model.name;
    const enumConstants = model.values.map(value => value.value.slice(1,-1))

    /**
     * 
     * @param {string} constant 
     * @param {number} index 
     */
    function renderConstant(constant, index) {
        let result = "";
        if (generateInitialize === "true") {
            if (constant.search("=")) {
                const [constantName, constantInitialize] = constant.split("=");
                result = `${constantName} = ${constantInitialize}`
            } else {
                result = `${constantName} = ${index}`
            }
        } else {
            if (constant.search("=")) {
                result = constant.split("=")[0];
            } else {
                result = constant;
            }
        }
        return result;
    }

    return (
        <Text newLines={2}>
        {`
enum ${enumName} {
    ${enumConstants.map((constant, index) => (
    `${renderConstant(constant, index)}\n`
    ))}
}
export default ${enumName};
        `}
        </Text>
    )
}