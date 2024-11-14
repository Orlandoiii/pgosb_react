import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionAuthorityVehicleApiSchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    institution_id: z.string().optional().default(''),
    type: z.string().optional().default(''),
})

export const MissionAuthorityVehicleFrontSchema = z.object({
    id: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    institutionId: z.string().optional().default(''),
    type: z.string().optional().default(''),
})


export type MissionAuthorityVehicleApi = z.infer<typeof MissionAuthorityVehicleApiSchema>
export type MissionAuthorityVehicleFront = z.infer<typeof MissionAuthorityVehicleFrontSchema>



function fromApiInternal(data: MissionAuthorityVehicleApi): MissionAuthorityVehicleFront {
    return {
        id: data.id,
        missionId: data.mission_id,
        alias: data.alias,
        institutionId: data.institution_id,
        type: data.type
    }
}

function toApiInternal(data: MissionAuthorityVehicleFront): MissionAuthorityVehicleApi {
    return {
        id: data.id,
        mission_id: data.missionId,
        alias: data.alias,
        institution_id: data.institutionId,
        type: data.type
    }
}

export const MissionAuthorityVehicleFromApi = (
    data: MissionAuthorityVehicleApi
): ResultErr<MissionAuthorityVehicleFront> =>
    mapEntity<MissionAuthorityVehicleApi, MissionAuthorityVehicleFront>(
        data,
        MissionAuthorityVehicleApiSchema as any,
        MissionAuthorityVehicleFrontSchema as any,
        fromApiInternal
    )
export const MissionAuthorityVehicleToApi = (
    data: MissionAuthorityVehicleFront
): ResultErr<MissionAuthorityVehicleApi> =>
    mapEntity<MissionAuthorityVehicleFront, MissionAuthorityVehicleApi>(
        data,
        MissionAuthorityVehicleFrontSchema as any,
        MissionAuthorityVehicleApiSchema as any,
        toApiInternal
    )

export const MissionAuthorityNameConverter: {
    [K in keyof MissionAuthorityVehicleFront]?: string
} = {
    type: 'Tipo',
    alias: 'Alias',
    missionId: 'Id de Misión',
    // vehicles: 'N° Vehículos',
    // people: 'N° Functionarios',
}