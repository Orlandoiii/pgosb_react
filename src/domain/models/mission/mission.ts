import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'

export const MissionSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    code: zodEmptyOrGreaterThan(0),
    createdAt: zodEmptyOrGreaterThan(0),
})

export const ApiMissionSchema = z.object({
    id: z.string().default(''),
    code: z.string().default(''),
    created_at: zodEmptyOrGreaterThan(0),
})

export type TMission = z.infer<typeof MissionSchema>
export type TApiMission = z.infer<typeof ApiMissionSchema>

function fromApiInternal(data: TApiMission): TMission {
    return {
        id: data.id,
        code: data.code,
        createdAt: data.created_at,
    }
}

function toApiInternal(data: TMission): TApiMission {
    return {
        id: data.id,
        code: data.code,
        created_at: data.createdAt,
    }
}

export const MissionFromApi = (data: TApiMission): ResultErr<TMission> =>
    mapEntity<TApiMission, TMission>(
        data,
        ApiMissionSchema as any,
        MissionSchema as any,
        fromApiInternal
    )

export const MissionToApi = (data: TMission): ResultErr<TApiMission> =>
    mapEntity<TMission, TApiMission>(
        data,
        MissionSchema as any,
        ApiMissionSchema as any,
        toApiInternal
    )

export const missionCrud = new CRUD<TMission>(
    'mission',
    MissionToApi,
    MissionFromApi
)
