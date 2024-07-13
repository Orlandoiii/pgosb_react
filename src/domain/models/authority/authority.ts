import { IdDocument, IdDocumentValidator } from '../id_document/id_document'
import { z } from 'zod'

export class Authority {
    idDocument: IdDocument
    type: string
    firstName: string
    lastName: string
    position: string
    idPlate: string
    vehicles: string
    auxiliaryQuantity: number
    vehicleQuantity: number
}

export const AuthorityValidator = z.object({
    idDocument: IdDocumentValidator,
    type: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    position: z.string(),
    idPlate: z.string(),
    vehicles: z.string(),
    auxiliaryQuantity: z.number(),
    vehicleQuantity: z.number(),
})
