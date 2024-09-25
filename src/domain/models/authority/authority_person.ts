import { z } from "zod"

import { ResultErr } from "../../abstractions/types/resulterr"
import { mapEntity } from "../../../services/mapper"
import { CRUD } from "../../../utilities/crud"

export const ApiMissionAuthorityPersonSchema = z.object({
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

export type ApiMissionAuthorityPersonType = z.infer<typeof ApiMissionAuthorityPersonSchema>

export const MissionAuthorityPersonFromToApi = (data: ApiMissionAuthorityPersonType): ResultErr<ApiMissionAuthorityPersonType> =>
    mapEntity<ApiMissionAuthorityPersonType, ApiMissionAuthorityPersonType>(
        data,
        ApiMissionAuthorityPersonSchema as any,
        ApiMissionAuthorityPersonSchema as any,
        (data: ApiMissionAuthorityPersonType) => data
    )

export const missionAuthorityPersonCrud = new CRUD<ApiMissionAuthorityPersonType>(
    'mission/authority/person',
    MissionAuthorityPersonFromToApi,
    MissionAuthorityPersonFromToApi
)

export const MissionAuthorityPersonNameConverter: {
    [K in keyof ApiMissionAuthorityPersonType]?: string
} = {
    name: "Nombre",
    last_name: "Apellido",
    identification_number: "N° Identificación",
    legal_id: "Doc Identidad",
    phone: "Teléfono",
    gender: "Genero"
}