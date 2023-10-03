export function capitalizeString(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function firstLower(lower){
    return lower && lower[0].toLowerCase() + lower.slice(1) || lower;
}