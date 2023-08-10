import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @param {ConstrainedEnumModel} model
 * @param {string} generateInitialize
 * @returns 
 */
export function RenderEnum(model, generateInitialize) {
    const enumName = model.name;
    const enumConstants = model.values.map(value => value.value.slice(1,-1))

    /**
     * 
     * @param {string} constant 
     * @param {number} index 
     */
    function renderConstant(constant, index) {
        if (generateInitialize === "true") {
            if (constant.search("=")) {
                const [constantName, constantInitialize] = constant.split("=");
                return `${constantName} = ${constantInitialize}`
            } else {
                return `${constantName} = ${index}`
            }
        } else {
            if (constant.search("=")) {
                return constant.split("=")[0];
            } else {
                return constant;
            }
        }
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