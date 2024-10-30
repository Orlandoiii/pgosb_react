import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionFirefighterApiSchema = z.object({
    id: z.string(),
    name: z.string(),
    user_name: z.string(),
    rank: z.string(),
    personal_code: z.string(),
    legal_id: z.string(),
    service_role: z.string(),
})

export const MissionFirefighterFrontSchema = z.object({
    id: z.string(),
    name: z.string(),
    userName: z.string(),
    rank: z.string(),
    personalCode: z.string(),
    legalId: z.string(),
    serviceRole: z.string(),
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
        legalId: data.legal_id,
        serviceRole: data.service_role,
    }
}

function toApiInternal(data: MissionFirefighterFront): MissionFirefighterApi {
    return {
        id: data.id,
        name: data.name,
        user_name: data.userName,
        rank: data.rank,
        personal_code: data.personalCode,
        legal_id: data.legalId,
        service_role: data.serviceRole,
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