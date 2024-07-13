import { z } from 'zod'

import { DocumentTypes } from '../../abstractions/enums/document_types'

export class IdDocument {
    type: DocumentTypes
    id: string
}

export const IdDocumentValidator = z.object({
    type: z.enum([
        DocumentTypes.V,
        DocumentTypes.E,
        DocumentTypes.J,
        DocumentTypes.P,
        DocumentTypes.G,
    ]),
    id: z.string(),
})


const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.number().int(),
  });