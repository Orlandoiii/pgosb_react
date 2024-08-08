import { z } from 'zod'

import { zodEmptyOr } from '../empty_string'

export function zodPhoneNumber(): any {
    return zodEmptyOr(
        z
            .string()
            .refine(
                (value) => {
                    return !value || !value.startsWith('0')
                },
                { message: 'No debe iniciar con 0' }
            )
            .refine(
                (value) => {
                    return !value || value.length != 12
                },
                { message: 'Debe tener 12 caracteres' }
            )
    )
}
