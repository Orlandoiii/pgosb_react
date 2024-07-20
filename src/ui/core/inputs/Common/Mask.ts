import { IMask } from "react-imask";


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
    mask: "D000000000000",
    definitions: {
        D: {
            mask: IMask.MaskedEnum,
            enum: allowedLetters,
        }
    },
    lazy: false,
    //overwrite: true,
    prepare: function (str) {
        return str.toUpperCase();
    },
};


