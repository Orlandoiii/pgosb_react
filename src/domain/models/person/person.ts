import { z } from 'zod'

import { PhoneNumberValidator } from '../phone_number/phone_number'
import { IdDocumentValidator } from '../id_document/id_document'
import { AddressValidator } from '../address/address'
import { Genders } from '../../abstractions/enums/genders'

export type TPerson = z.infer<typeof PersonSchema>

export const PersonSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number().positive(),
    gender: z.enum([Genders.Male, Genders.Female]),
    idDocument: IdDocumentValidator,
    phoneNumber: PhoneNumberValidator,
    address: AddressValidator,
    employmentStatus: z.string(),
    pathology: z.string(),
})
