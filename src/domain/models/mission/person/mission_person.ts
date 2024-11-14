import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionPersonApiSchema = z.object({
    id: z.string().default(''),
    mission_id: z.string().default(''),
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
    address: z.string().default(''),
    pathology: z.string().default(''),
    observations: z.string().default(''),
    condition: z.string().default(''),
})

export const MissionPersonFrontSchema = z.object({
    id: z.string().default(''),
    unitId: z.string().default(''),
    missionId: z.string().default(''),
    vehicleId: z.string().default(''),
    infrastructureId: z.string().default(''),
    condition: z.string().default(''),
    observations: z.string().default(''),
    firstName: z.string().default(''),
    lastName: z.string().default(''),
    age: z.string().default(''),
    gender: z.string().default(''),
    idDocument: z.string().default(''),
    phoneNumber: z.string().default(''),
    state: z.string().default(''),
    municipality: z.string().default(''),
    parish: z.string().default(''),
    address: z.string().default(''),
    employmentStatus: z.string().default(''),
    pathology: z.string().default(''),
})

export type MissionPersonApi = z.infer<typeof MissionPersonApiSchema>
export type MissionPersonFront = z.infer<typeof MissionPersonFrontSchema>



function fromApiInternal(data: MissionPersonApi): MissionPersonFront {
    return {
        id: data.id,
        missionId: data.mission_id,
        unitId: data.unit_id,
        infrastructureId: data.infrastructure_id,
        vehicleId: data.vehicle_id,
        condition: data.condition,
        observations: data.observations,
        firstName: data.first_name,
        lastName: data.last_name,
        age: data.age,
        gender: data.gender,
        idDocument: data.legal_id,
        phoneNumber: data.phone,
        state: data.state,
        municipality: data.municipality,
        parish: data.parish,
        address: data.address,
        employmentStatus: data.employment,
        pathology: data.pathology,
    }
}

function toApiInternal(data: MissionPersonFront): MissionPersonApi {
    return {
        id: data.id,
        mission_id: data.missionId,
        unit_id: data.unitId,
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
        address: data.address,
        pathology: data.pathology,
        observations: data.observations,
        condition: data.condition,
    }
}

export const MissionPersonFromApi = (
    data: MissionPersonApi
): ResultErr<MissionPersonFront> =>
    mapEntity<MissionPersonApi, MissionPersonFront>(
        data,
        MissionPersonApiSchema as any,
        MissionPersonFrontSchema as any,
        fromApiInternal
    )
export const MissionPersonToApi = (
    data: MissionPersonFront
): ResultErr<MissionPersonApi> =>
    mapEntity<MissionPersonFront, MissionPersonApi>(
        data,
        MissionPersonFrontSchema as any,
        MissionPersonApiSchema as any,
        toApiInternal
    )

export const MissionPersonNameConverter: { [K in keyof MissionPersonFront]?: string } = {
    id: 'Id',
    idDocument: 'Documento',
    firstName: 'Nombre',
    lastName: 'Apellido',
    gender: 'Sexo',
    age: 'Edad',
}