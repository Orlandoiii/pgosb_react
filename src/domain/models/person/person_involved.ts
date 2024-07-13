import { z } from 'zod'

import { DocumentTypes } from '../../abstractions/enums/document_types'
import { Genders } from '../../abstractions/enums/genders'

export type TPersonInvolved = z.infer<typeof PersonInvolvedSchema>

export const PersonInvolvedSchema = z.object({
    id: z.string(),
    unitId: z.string(),
    serviceId: z.string(),
    vehicleId: z.string(),
    infrastructureId: z.string(),
    condition: z.string(),
    observations: z.string(),

    firstName: z.string(),
    lastName: z.string(),
    age: z.number().positive(),
    gender: z.string(),

    // idDocumentType: z.enum([
    //     DocumentTypes.V,
    //     DocumentTypes.E,
    //     DocumentTypes.J,
    //     DocumentTypes.P,
    //     DocumentTypes.G,
    // ]),

    idDocumentType: z.string(),
    idDocument: z.string(),

    phoneNumberAreaCode: z.string().length(4, 'Debe tener 4 caracteres'),
    phoneNumber: z.string().length(9, 'Debe tener 9 caracteres'),

    state: z.string(),
    municipality: z.string(),
    parish: z.string(),
    description: z.string(),
    
    employmentStatus: z.string(),
    pathology: z.string(),
})
