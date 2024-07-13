import { z } from 'zod'

export class PhoneNumber {
    areaCode: string
    number: string
}

export const PhoneNumberValidator = z.object({
    areaCode: z.string().length(4, 'Debe tener 4 caracteres'),
    number: z.string().length(9, 'Debe tener 9 caracteres'),
})
