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



export const missionAuthorityCrud = new CRUD<ApiMissionAuthorityType>(
    'mission/authority',
    MissionAuthorityFromToApi,
    MissionAuthorityFromToApi
)





