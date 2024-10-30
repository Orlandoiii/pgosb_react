import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionAuthorityApiSchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    services: z.string().optional().default(''),
    vehicles: z.string().optional().default(''),
    people: z.string().optional().default(''),
    type: z.string().optional().default(''),
})

export const MissionAuthorityFrontSchema = z.object({
    id: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    services: z.string().optional().default(''),
    vehicles: z.string().optional().default(''),
    people: z.string().optional().default(''),
    type: z.string().optional().default(''),
})

export type MissionAuthorityApi = z.infer<typeof MissionAuthorityApiSchema>
export type MissionAuthorityFront = z.infer<typeof MissionAuthorityFrontSchema>



function fromApiInternal(data: MissionAuthorityApi): MissionAuthorityFront {
    return {
        id: data.id,
        missionId: data.mission_id,
        alias: data.alias,
        services: data.services,
        vehicles: data.vehicles,
        people: data.people,
        type: data.type,
    }
}

function toApiInternal(data: MissionAuthorityFront): MissionAuthorityApi {
    return {
        id: data.id,
        mission_id: data.missionId,
        alias: data.alias,
        services: data.services,
        vehicles: data.vehicles,
        people: data.people,
        type: data.type,
    }
}

export const MissionAuthorityFromApi = (
    data: MissionAuthorityApi
): ResultErr<MissionAuthorityFront> =>
    mapEntity<MissionAuthorityApi, MissionAuthorityFront>(
        data,
        MissionAuthorityApiSchema as any,
        MissionAuthorityFrontSchema as any,
        fromApiInternal
    )
export const MissionAuthorityToApi = (
    data: MissionAuthorityFront
): ResultErr<MissionAuthorityApi> =>
    mapEntity<MissionAuthorityFront, MissionAuthorityApi>(
        data,
        MissionAuthorityFrontSchema as any,
        MissionAuthorityApiSchema as any,
        toApiInternal
    )

export const MissionAuthorityNameConverter: {
    [K in keyof MissionAuthorityFront]?: string
} = {
    type: 'Tipo',
    alias: 'Alias',
    missionId: 'Id de Misión',
    vehicles: 'N° Vehículos',
    people: 'N° Functionarios',
}