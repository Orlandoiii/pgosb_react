import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const MissionSchema = z.object({
    id: z.number().default(0),
    code: z.string().default(''),
    createdAt: z.string().default(''),
})

export const ApiMissionSchema = z.object({
    id: z.number().default(0),
    code: z.string().default(''),
    created_at: z.string().default(''),
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

export const FromApi = (data: TApiMission) =>
    mapEntity<TApiMission, TMission>(
        data,
        ApiMissionSchema as any,
        MissionSchema as any,
        fromApiInternal
    )

export const ToApi = (data: TMission) =>
    mapEntity<TMission, TApiMission>(
        data,
        MissionSchema as any,
        ApiMissionSchema as any,
        toApiInternal
    )

export const missionService = new CreateCRUD<TMission>(
    'mission',
    ToApi,
    FromApi
)
