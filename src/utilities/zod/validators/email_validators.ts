import { z } from 'zod'

import { zodEmptyOr } from '../empty_string'

export function zodPhoneNumber(): any {
    return zodEmptyOr(z.string().email('El correo no es valido'))
}
