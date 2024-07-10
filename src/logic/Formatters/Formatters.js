import { parse } from 'date-fns';

const dateFormat = "yyyy-MM-dd";
const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"

export function parseDatetimeInternal(str, format) {
    try {
        return parse(str, format, new Date());
    } catch (error) {
        return null; // Return null for invalid dates
    }
}


export function parseDate(str) {
    if (str == null)
        return null;

    if (typeof (str) !== "string") {
        throw new Error("el tipo no es string");
    }

    return parseDatetimeInternal(str, dateFormat)
}

export function parseDatetime(str) {
    if (str == null)
        return null;

    if (typeof (str) !== "string") {
        throw new Error("el tipo no es string");
    }

    return parseDatetimeInternal(str, dateTimeFormat)
}


export function parseBool(str) {
    if (str == null)
        return null;


    if (typeof (str) === "boolean") {
        return str
    }

    if (typeof (str) !== "string") {
        throw new Error("el tipo no es string y tampoco bool");
    }

    const lowerStr = str.toLowerCase();

    return lowerStr === "true" ? true : lowerStr === "false" ? false : null;
}


export function parseIntSafe(str) {

    if (str == null)
        return null;

    if (typeof (str) === "number") {
        return str;
    }

    if (typeof (str) !== "string") {
        throw new Error("el tipo no es string y tampoco entero");
    }

    const num = parseInt(str, 10); // Use base 10 to avoid octal interpretation

    return isNaN(num) ? null : num;
}


export function parseFloatSafe(str) {

    if (str == null)
        return null;


    if (typeof (str) === "number") {
        return str;
    }

    if (typeof (str) !== "string") {
        throw new Error("el tipo no es string y tampoco float");
    }

    const num = parseFloat(str);

    return isNaN(num) ? null : num;
}


export function parseString(str) {
    
    if (str == null)
        return null;

    if (typeof (str) !== "string") {
        throw new Error("el tipo no es string");
    }

    return str; // Simply return the input string
}


export function ConvertValue(value, type) {
    switch (type) {
        case "array":
            return value;
        case "bool":
            return
    }
} 