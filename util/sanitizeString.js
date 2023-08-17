export function sanitizeString(textToBeSanitized) {
    var sanitizedText = textToBeSanitized;
    sanitizedText = sanitizedText.replace("/", "_");
    sanitizedText = sanitizedText.replace("\\", "_");
    return sanitizedText;
}
