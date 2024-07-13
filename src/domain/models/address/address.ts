import { z } from 'zod'

export class Address {
    state: string
    municipality: string
    parish: string
    description: string
}

export const AddressValidator = z.object({
    state: z.string(),
    municipality: z.string(),
    parish: z.string(),
    description: z.string(),
})
