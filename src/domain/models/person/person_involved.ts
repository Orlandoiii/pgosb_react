import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'

export const PersonInvolvedSchema = z.object({
    id: z.string().default(''),
    unitId: z.coerce.number().default(0),
    serviceId: z.coerce.string().default(''),
    vehicleId: z.coerce.number().default(0),
    infrastructureId: z.coerce.number().default(0),
    condition: z.string().default(''),
    observations: z.string().default(''),

    firstName: z.string().default(''),
    lastName: z.string().default(''),
    age: z.coerce.number().positive().default(0),
    gender: z.string().default(''),

    idDocumentType: z.string().default(''),
    idDocument: z.string().default(''),

    phoneNumberAreaCode: z
        .string()
        .length(4, 'Debe tener 4 caracteres')
        .default(''),
    phoneNumber: z.string().length(9, 'Debe tener 9 caracteres').default(''),

    state: z.string().default(''),
    municipality: z.string().default(''),
    parish: z.string().default(''),
    description: z.string().default(''),

    employmentStatus: z.string().default(''),
    pathology: z.string().default(''),
})

export const ApiPersonInvolvedSchema = z.object({
    id: z.string().default(''),
    service_id: z.string().default(''),
    unit_id: z.string().default(''),
    infrastructure_id: z.string().default(''),
    vehicle_id: z.string().default(''),
    first_name: z.string().default(''),
    last_name: z.string().default(''),
    age: z.string().default(''),
    gender: z.string().default(''),
    legal_id: z.string().default(''),
    phone: z.string().default(''),
    employment: z.string().default(''),
    state: z.string().default(''),
    municipality: z.string().default(''),
    parish: z.string().default(''),
    description: z.string().default(''),
    pathology: z.string().default(''),
    observations: z.string().default(''),
    condition: z.string().default(''),
})

export type TPersonInvolved = z.infer<typeof PersonInvolvedSchema>
export type TApiPersonInvolved = z.infer<typeof ApiPersonInvolvedSchema>

function fromApiInternal(data: TApiPersonInvolved): TPersonInvolved {
    return {
        id: data.id,
        serviceId: data.service_id,
        unitId: Number(data.unit_id),
        infrastructureId: Number(data.infrastructure_id),
        vehicleId: Number(data.vehicle_id),
        condition: data.condition,
        observations: data.observations,
        firstName: data.first_name,
        lastName: data.last_name,
        age: Number(data.age),
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
        unit_id: String(data.unitId),
        infrastructure_id: String(data.infrastructureId),
        vehicle_id: String(data.vehicleId),
        first_name: data.firstName,
        last_name: data.lastName,
        age: String(data.age),
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

export const FromApi = (data: TApiPersonInvolved): ResultErr<TPersonInvolved> =>
    mapEntity<TApiPersonInvolved, TPersonInvolved>(
        data,
        ApiPersonInvolvedSchema as any,
        PersonInvolvedSchema as any,
        fromApiInternal
    )

export const ToApi = (data: TPersonInvolved): ResultErr<TApiPersonInvolved> =>
    mapEntity<TPersonInvolved, TApiPersonInvolved>(
        data,
        PersonInvolvedSchema as any,
        ApiPersonInvolvedSchema as any,
        toApiInternal
    )

export const personCrud = new CRUD<TPersonInvolved>(
    'mission/person',
    ToApi,
    FromApi
)
