import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const MissionSchema = z.object({
    id: z.number(),
    antaresId: z.string(),
    createdAt: z.string(),
})

export const ApiMissionSchema = z.object({
    id: z.number(),
    antares_id: z.string(),
    created_at: z.string(),
})

export type TMission = z.infer<typeof MissionSchema>
export type TApiMission = z.infer<typeof ApiMissionSchema>

function fromApiInternal(data: TApiMission): TMission {
    return {
        id: data.id,
        antaresId: data.antares_id,
        createdAt: data.created_at,
    }
}

function toApiInternal(data: TMission): TApiMission {
    return {
        id: data.id,
        antares_id: data.antaresId,
        created_at: data.createdAt,
    }
}

export const FromApi = (data: TApiMission) =>
    mapEntity<TApiMission, TMission>(
        data,
        ApiMissionSchema,
        MissionSchema,
        fromApiInternal
    )

export const ToApi = (data: TMission) =>
    mapEntity<TMission, TApiMission>(
        data,
        MissionSchema,
        ApiMissionSchema,
        toApiInternal
    )

export const missionService = new CreateCRUD<TMission>(
    'mission',
    ToApi,
    FromApi
)
