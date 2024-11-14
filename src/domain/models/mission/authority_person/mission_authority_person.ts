import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionAuthorityPersonApiSchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    institution_id: z.string().optional().default(''),
    type: z.string().optional().default(''),
})

export const MissionAuthorityPersonFrontSchema = z.object({
    id: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    institutionId: z.string().optional().default(''),
    type: z.string().optional().default(''),
})


export type MissionAuthorityPersonApi = z.infer<typeof MissionAuthorityPersonApiSchema>
export type MissionAuthorityPersonFront = z.infer<typeof MissionAuthorityPersonFrontSchema>



function fromApiInternal(data: MissionAuthorityPersonApi): MissionAuthorityPersonFront {
    return {
        id: data.id,
        missionId: data.mission_id,
        alias: data.alias,
        institutionId: data.institution_id,
        type: data.type
    }
}

function toApiInternal(data: MissionAuthorityPersonFront): MissionAuthorityPersonApi {
    return {
        id: data.id,
        mission_id: data.missionId,
        alias: data.alias,
        institution_id: data.institutionId,
        type: data.type
    }
}

export const MissionAuthorityPersonFromApi = (
    data: MissionAuthorityPersonApi
): ResultErr<MissionAuthorityPersonFront> =>
    mapEntity<MissionAuthorityPersonApi, MissionAuthorityPersonFront>(
        data,
        MissionAuthorityPersonApiSchema as any,
        MissionAuthorityPersonFrontSchema as any,
        fromApiInternal
    )
export const MissionAuthorityPersonToApi = (
    data: MissionAuthorityPersonFront
): ResultErr<MissionAuthorityPersonApi> =>
    mapEntity<MissionAuthorityPersonFront, MissionAuthorityPersonApi>(
        data,
        MissionAuthorityPersonFrontSchema as any,
        MissionAuthorityPersonApiSchema as any,
        toApiInternal
    )

export const MissionAuthorityNameConverter: {
    [K in keyof MissionAuthorityPersonFront]?: string
} = {
    type: 'Tipo',
    alias: 'Alias',
    missionId: 'Id de Misión',
    // vehicles: 'N° Vehículos',
    // people: 'N° Functionarios',
}