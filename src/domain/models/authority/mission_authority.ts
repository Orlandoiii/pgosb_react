import { z } from "zod"
import { mapEntity } from "../../../services/mapper"
import { ResultErr } from "../../abstractions/types/resulterr"
import { CRUD } from "../../../utilities/crud"

export const ApiMissionAuthoritySchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    institution_id: z.string().optional().default(''),
})



export type ApiMissionAuthorityType = z.infer<typeof ApiMissionAuthoritySchema>



export const MissionAuthorityFromToApi = (data: ApiMissionAuthorityType): ResultErr<ApiMissionAuthorityType> =>
    mapEntity<ApiMissionAuthorityType, ApiMissionAuthorityType>(
        data,
        ApiMissionAuthoritySchema as any,
        ApiMissionAuthoritySchema as any,
        (data: ApiMissionAuthorityType) => data
    )







export const ApiMissionAuthoritySummarySchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    services: z.string().optional().default(''),
    vehicles: z.string().optional().default(''),
    people: z.string().optional().default(''),
    type: z.string().optional().default(''),
})

export type ApiMissionAuthoritySummaryType = z.infer<typeof ApiMissionAuthoritySummarySchema>

export const MissionAuthoritySummaryFromToApi = (data: ApiMissionAuthoritySummaryType): ResultErr<ApiMissionAuthoritySummaryType> =>
    mapEntity<ApiMissionAuthoritySummaryType, ApiMissionAuthoritySummaryType>(
        data,
        ApiMissionAuthoritySummarySchema as any,
        ApiMissionAuthoritySummarySchema as any,
        (data: ApiMissionAuthoritySummaryType) => data
    )


export const missionAuthorityCrud = new CRUD<ApiMissionAuthorityType>(
    'mission/authority',
    MissionAuthorityFromToApi,
    MissionAuthorityFromToApi
)

export const MissionAuthoritySummaryNameConverter: {
    [K in keyof ApiMissionAuthoritySummaryType]?: string
} = {
    type: 'Tipo',
    alias: 'Alias',
    mission_id: 'Id de Misión',
    //services: 'N° Servicios',
    vehicles: 'N° Vehículos',
    people: 'N° Functionarios',
}
