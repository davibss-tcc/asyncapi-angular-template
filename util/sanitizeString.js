/**
 * 
 * @param {string} textToBeSanitized 
 * @returns string
 */
export function sanitizeString(textToBeSanitized) {
    var sanitizedText = textToBeSanitized;
    sanitizedText = sanitizedText.replace("/", "_");
    sanitizedText = sanitizedText.replace("\\", "_");
    return sanitizedText;
}

/**
 * 
 * @param {string} textToBeSanitized 
 * @returns string
 */
export function sanitizeStringWithSlash(textToBeSanitized) {
    var sanitizedText = textToBeSanitized;
    sanitizedText = sanitizedText.replace("\\", "_");
    return sanitizedText;
}
