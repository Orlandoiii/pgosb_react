import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'
import { zodPhoneNumber } from '../../../utilities/zod/validators/phone_validators'
import { zodIdDocument } from '../../../utilities/zod/validators/document_validators'

export const PersonInvolvedSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    unitId: zodEmptyOrGreaterThan(0),
    serviceId: zodEmptyOrGreaterThan(0),
    vehicleId: zodEmptyOrGreaterThan(0),
    infrastructureId: zodEmptyOrGreaterThan(0),
    condition: zodEmptyOrGreaterThan(3),
    observations: zodEmptyOrGreaterThan(3),

    firstName: zodEmptyOrGreaterThan(3),
    lastName: zodEmptyOrGreaterThan(3),
    age: zodEmptyOrGreaterThan(3),
    gender: zodEmptyOrGreaterThan(3),

    idDocument: zodIdDocument(),
    phoneNumber: zodPhoneNumber(),

    state: zodEmptyOrGreaterThan(3),
    municipality: zodEmptyOrGreaterThan(3),
    parish: zodEmptyOrGreaterThan(3),
    description: zodEmptyOrGreaterThan(3),

    employmentStatus: zodEmptyOrGreaterThan(3),
    pathology: zodEmptyOrGreaterThan(3),
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
        unitId: data.unit_id,
        infrastructureId: data.infrastructure_id,
        vehicleId: data.vehicle_id,
        condition: data.condition,
        observations: data.observations,
        firstName: data.first_name,
        lastName: data.last_name,
        age: Number(data.age),
        gender: data.gender,
        idDocument: data.legal_id,
        phoneNumber: data.phone,
        state: data.state,
        municipality: data.municipality,
        parish: data.parish,
        description: data.description,
        employmentStatus: data.employment,
        pathology: data.pathology,
    }
}

function toApiInternal(data: TPersonInvolved): TApiPersonInvolved {
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
        phone: data.phoneNumber,
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

export const PersonFromApi = (
    data: TApiPersonInvolved
): ResultErr<TPersonInvolved> =>
    mapEntity<TApiPersonInvolved, TPersonInvolved>(
        data,
        ApiPersonInvolvedSchema as any,
        PersonInvolvedSchema as any,
        fromApiInternal
    )

export const PersonToApi = (
    data: TPersonInvolved
): ResultErr<TApiPersonInvolved> =>
    mapEntity<TPersonInvolved, TApiPersonInvolved>(
        data,
        PersonInvolvedSchema as any,
        ApiPersonInvolvedSchema as any,
        toApiInternal
    )

export const personCrud = new CRUD<TPersonInvolved>(
    'mission/person',
    PersonToApi,
    PersonFromApi
)

export const personNameConverter: { [K in keyof TPersonInvolved]?: string } = {
    id: 'Id',
    idDocument: 'Documento',
    firstName: 'Nombre',
    lastName: 'Apellido',
    gender: 'Sexo',
    age: 'Edad',
}
