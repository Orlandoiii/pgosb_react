import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'

export const MissionSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    alias: z.string().default(''),
    createdAt: zodEmptyOrGreaterThan(0),
    numServices: zodEmptyOrGreaterThan(0),
    numFirefighters: zodEmptyOrGreaterThan(0),
    numVehicles: zodEmptyOrGreaterThan(0),
    code: zodEmptyOrGreaterThan(0),
})

export const ApiMissionSchema = z.object({
    id: z.string().default(''),
    alias: z.string().default(''),
    created_at: zodEmptyOrGreaterThan(0),
    num_services: zodEmptyOrGreaterThan(0),
    num_firefighters: zodEmptyOrGreaterThan(0),
    num_vehicles: zodEmptyOrGreaterThan(0),
    code: zodEmptyOrGreaterThan(0),
})

export type TMission = z.infer<typeof MissionSchema>
export type TApiMission = z.infer<typeof ApiMissionSchema>

function fromApiInternal(data: TApiMission): TMission {
    return {
        id: data.id,
        numServices: data.num_services,
        numFirefighters: data.num_firefighters,
        numVehicles: data.num_vehicles,
        alias: data.alias,
        createdAt: data.created_at,
        code: data.code,
    }
}

function toApiInternal(data: TMission): TApiMission {
    return {
        id: data.id,
        num_services: data.numServices,
        num_firefighters: data.numFirefighters,
        num_vehicles: data.numVehicles,
        alias: data.alias,
        created_at: data.createdAt,
        code: data.code,
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
