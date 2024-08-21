import { z } from "zod";

export enum MartialStatusTypes {
    Single = 'SOLTERO(A)',
    Married = 'CASADO(A)',
    Divorced = 'DIVORCIADO(A)',
    Widow = 'VIUDO(A)',
    Concubine = 'CONCUBINO(A)',
}


export const MartialStatusListTypes =
    [
        'SOLTERO(A)',
        'CASADO(A)',
        'DIVORCIADO(A)',
        'VIUDO(A)',
        'CONCUBINO(A)'
    ]

