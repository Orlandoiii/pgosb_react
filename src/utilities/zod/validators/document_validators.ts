import { z } from 'zod'

import { zodEmptyOr } from '../empty_string'

export function zodIdDocument(): any {
    return zodEmptyOr(
        z
            .string()
            .refine(
                (value) => {
                    return (
                        !value ||
                        !value.toUpperCase().startsWith('V') ||
                        (value.toUpperCase().startsWith('V') &&
                            value.length >= 8)
                    )
                },
                { message: 'Debe tener 7 o más caracteres' }
            )
            .refine(
                (value) => {
                    return (
                        !value ||
                        !value.toUpperCase().startsWith('V') ||
                        (value.toUpperCase().startsWith('V') &&
                            value.length <= 11)
                    )
                },
                { message: 'Debe tener 10 o menos caracteres' }
            )
            .refine(
                (value) => {
                    return (
                        !value ||
                        !value.toUpperCase().startsWith('E') ||
                        (value.toUpperCase().startsWith('E') &&
                            value.length == 10)
                    )
                },
                { message: 'Debe tener 9 caracteres' }
            )
            .refine(
                (value) => {
                    return (
                        !value ||
                        !value.toUpperCase().startsWith('P') ||
                        (value.toUpperCase().startsWith('P') &&
                            value.length == 15)
                    )
                },
                { message: 'Debe tener 14 caracteres' }
            )
    )
}
