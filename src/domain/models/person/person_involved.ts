import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const PersonInvolvedSchema = z.object({
    id: z.coerce.number(),
    unitId: z.coerce.number(),
    serviceId: z.coerce.number(),
    vehicleId: z.coerce.number(),
    infrastructureId: z.coerce.number(),
    condition: z.string(),
    observations: z.string(),

    firstName: z.string(),
    lastName: z.string(),
    age: z.coerce.number().positive(),
    gender: z.string(),

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

export const ApiPersonInvolvedSchema = z.object({
    id: z.number(),
    service_id: z.number(),
    unit_id: z.number(),
    infrastructure_id: z.number(),
    vehicle_id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    age: z.number().positive(),
    gender: z.string(),
    legal_id: z.string(),
    phone: z.string(),
    employment: z.string(),
    state: z.string(),
    municipality: z.string(),
    parish: z.string(),
    description: z.string(),
    pathology: z.string(),
    observations: z.string(),
    condition: z.string(),
})

export type TPersonInvolved = z.infer<typeof PersonInvolvedSchema>
export type TApiPersonInvolved = z.infer<typeof ApiPersonInvolvedSchema>

function fromApiInternal(data: TApiPersonInvolved): TPersonInvolved {
    return {
        id: data.id,
        serviceId: data.service_id,
        unitId: data.unit_id,
        infrastructureId: data.infrastructure_id,
        vehicleId: data.vehicle_id,
        condition: data.condition,
        observations: data.observations,
        firstName: data.first_name,
        lastName: data.last_name,
        age: data.age,
        gender: data.gender,
        idDocumentType: data.legal_id.slice(0, 1),
        idDocument: data.legal_id.slice(1),
        phoneNumberAreaCode: data.phone?.slice(0, 4),
        phoneNumber: data.phone?.slice(4),
        state: data.state,
        municipality: data.municipality,
        parish: data.parish,
        description: data.description,
        employmentStatus: data.employment,
        pathology: data.pathology,
    }
}

function toApiInternal(data: TPersonInvolved): TApiPersonInvolved {
    const phoneNumber = data.phoneNumberAreaCode
        ? `${data.phoneNumberAreaCode}${data.phoneNumber}`
        : data.phoneNumber
    return {
        id: data.id,
        service_id: data.serviceId,
        unit_id: data.unitId,
        infrastructure_id: data.infrastructureId,
        vehicle_id: data.vehicleId,
        first_name: data.firstName,
        last_name: data.lastName,
        age: data.age,
        gender: data.gender,
        legal_id: data.idDocument,
        phone: phoneNumber,
        employment: data.employmentStatus,
        state: data.state,
        municipality: data.municipality,
        parish: data.parish,
        description: data.description,
        pathology: data.pathology,
        observations: data.observations,
        condition: data.condition,
    }
}

export const FromApi = (data: TApiPersonInvolved) =>
    mapEntity<TApiPersonInvolved, TPersonInvolved>(
        data,
        ApiPersonInvolvedSchema,
        PersonInvolvedSchema,
        fromApiInternal
    )

export const ToApi = (data: TPersonInvolved) =>
    mapEntity<TPersonInvolved, TApiPersonInvolved>(
        data,
        PersonInvolvedSchema,
        ApiPersonInvolvedSchema,
        toApiInternal
    )

export const personService = new CreateCRUD<TPersonInvolved>(
    'mission/person',
    ToApi,
    FromApi
)
