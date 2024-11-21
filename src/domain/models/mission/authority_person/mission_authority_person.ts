import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionAuthorityPersonApiSchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    authority_id: z.string().optional().default(''),
    name: z.string().optional().default(''),
    last_name: z.string().optional().default(''),
    legal_id: z.string().optional().default(''),
    identification_number: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    gender: z.string().optional().default(''),
    observations: z.string().optional().default(''),
})

export const MissionAuthorityPersonFrontSchema = z.object({
    id: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
    authorityId: z.string().optional().default(''),
    name: z.string().optional().default(''),
    lastName: z.string().optional().default(''),
    legalId: z.string().optional().default(''),
    identificationNumber: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    gender: z.string().optional().default(''),
    observations: z.string().optional().default(''),
})


export type MissionAuthorityPersonApi = z.infer<typeof MissionAuthorityPersonApiSchema>
export type MissionAuthorityPersonFront = z.infer<typeof MissionAuthorityPersonFrontSchema>



function fromApiInternal(data: MissionAuthorityPersonApi): MissionAuthorityPersonFront {
    return {
        id: data.id,
        missionId: data.mission_id,
        authorityId: data.authority_id,
        name: data.name,
        lastName: data.last_name,
        legalId: data.legal_id,
        identificationNumber: data.identification_number,
        phone: data.phone,
        gender: data.gender,
        observations: data.observations,
    }
}

function toApiInternal(data: MissionAuthorityPersonFront): MissionAuthorityPersonApi {
    return {
        id: data.id,
        mission_id: data.missionId,
        authority_id: data.authorityId,
        name: data.name,
        last_name: data.lastName,
        legal_id: data.legalId,
        identification_number: data.identificationNumber,
        phone: data.phone,
        gender: data.gender,
        observations: data.observations,
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

export const MissionAuthorityPersonNameConverter: {
    [K in keyof MissionAuthorityPersonFront]?: string
} = {
    name: "Nombre",
    lastName: "Apellido",
    identificationNumber: "N° Identificación",
    legalId: "Doc Identidad",
    phone: "Teléfono",
    gender: "Genero"
}