import { IMask } from "react-imask";
import logger from "../../../../logic/Logger/logger";


function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

function parseDate(str) {
    const [day, month, year] = str.split("-");
    return new Date(year, month - 1, day);
};


export const dateMask = {

    mask: "d-m-Y",
    blocks: {
        d: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 31,
            maxLength: 2,
        },
        m: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2,
        },
        Y: {
            mask: IMask.MaskedRange,
            from: 1900,
            to: new Date().getFullYear() + 1,
        },
    },
    parse: parseDate,
    format: formatDate
    // lazy: false,
    // overwrite: true,
};




const allowedLetters = ["V", "E", "G", "J"];

export const documentIdMask = {
    mask: /^V[0-9]{0,10}$|^E[0-9]{0,9}$|^P[0-1A-Z]{0,14}$/,
    definitions: {
        D: {
            mask: IMask.MaskedEnum,
            enum: allowedLetters,
        }
    },
    lazy: false,
    overwrite: true,
    prepare: function (str) {
        return str.toUpperCase();
    },
};

export const numberMask = {
    mask: /^[1-9][0-9]{0,9}$/,
    definitions: {
        D: {
            mask: IMask.MaskedEnum,
            enum: allowedLetters,
        }
    },
    lazy: false,
    overwrite: true,
    prepare: function (str) {
        return str.toUpperCase();
    },
};


export const heightMask = {
    mask: "0.00",
    definitions: {
        D: {
            mask: IMask.MaskedEnum,
            enum: allowedLetters,
        }
    },
    lazy: false,
    overwrite: true,
    prepare: function (str) {
        return str.toUpperCase();
    },
};


export const nameMask = {
    mask: /^[A-Za-z]{1,32}$/,
    prepareChar: function (str, masked) {
        //logger.log("MASK PREPARE:", str, masked);
        if (masked._value.length == 0)
            return str.toUpperCase();

        return str;
    },
}


export const addressMask = {
    mask: /^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*-?$/
}

