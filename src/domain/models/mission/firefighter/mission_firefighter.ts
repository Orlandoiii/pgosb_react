import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionFirefighterApiSchema = z.object({
    id: z.string().optional().default(''),
    name: z.string().optional().default(''),
    user_name: z.string().optional().default(''),
    rank: z.string().optional().default(''),
    personal_code: z.string().optional().default(''),
    legal_id: z.string().optional().default(''),
    user_id: z.string().optional().default(''),
    service_role: z.string().optional().optional().default(''),
    mission_id: z.string().optional().optional().default(''),
})

export const MissionFirefighterFrontSchema = z.object({
    id: z.string().optional().default(''),
    name: z.string().optional().default(''),
    userName: z.string().optional().default(''),
    rank: z.string().optional().default(''),
    personalCode: z.string().optional().default(''),
    legalId: z.string().optional().default(''),
    userId: z.string().optional().default(''),
    serviceRole: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
})

export type MissionFirefighterApi = z.infer<typeof MissionFirefighterApiSchema>
export type MissionFirefighterFront = z.infer<typeof MissionFirefighterFrontSchema>



function fromApiInternal(data: MissionFirefighterApi): MissionFirefighterFront {
    return {
        id: data.id,
        name: data.name,
        userName: data.user_name,
        rank: data.rank,
        personalCode: data.personal_code,
        userId: data.user_id,
        legalId: data.legal_id,
        serviceRole: data.service_role,
        missionId: data.mission_id,
    }
}

function toApiInternal(data: MissionFirefighterFront): MissionFirefighterApi {
    return {
        id: data.id,
        name: data.name,
        user_name: data.userName,
        rank: data.rank,
        personal_code: data.personalCode,
        user_id: data.userId,
        legal_id: data.legalId,
        service_role: data.serviceRole,
        mission_id: data.missionId,
    }
}

export const MissionFirefighterFromApi = (
    data: MissionFirefighterApi
): ResultErr<MissionFirefighterFront> =>
    mapEntity<MissionFirefighterApi, MissionFirefighterFront>(
        data,
        MissionFirefighterApiSchema as any,
        MissionFirefighterFrontSchema as any,
        fromApiInternal
    )
export const MissionFirefighterToApi = (
    data: MissionFirefighterFront
): ResultErr<MissionFirefighterApi> =>
    mapEntity<MissionFirefighterFront, MissionFirefighterApi>(
        data,
        MissionFirefighterFrontSchema as any,
        MissionFirefighterApiSchema as any,
        toApiInternal
    )

export const MissionFirefighterNameConverter: {
    [K in keyof MissionFirefighterFront]?: string
} = {
        name: 'Nombre',
        rank: 'Rango',
        personalCode: 'Equipo',
        legalId: 'Documento',
        serviceRole: 'Rol',
}