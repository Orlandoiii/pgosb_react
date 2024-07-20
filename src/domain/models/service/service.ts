import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const ServiceSchema = z.object({
    id: z.number(),
    missionId: z.number(),
    antaresId: z.number(),
    units: z.array(z.number()),
    firefighter: z.array(z.number()),
    summary: z.string(),
    description: z.string(),
})

export const ApiServiceSchema = z.object({
    id: z.number(),
    mission_id: z.number(),
    antares_id: z.number(),
    units: z.array(z.number()),
    bombers: z.array(z.number()),
    summary: z.string(),
    description: z.string(),
})

export type TService = z.infer<typeof ServiceSchema>
export type TApiService = z.infer<typeof ApiServiceSchema>

function fromApiInternal(data: TApiService): TService {
    return {
        id: data.id,
        missionId: data.mission_id,
        antaresId: data.antares_id,
        units: data.units,
        firefighter: data.bombers,
        summary: data.summary,
        description: data.description,
    }
}

function toApiInternal(data: TService): TApiService {
    return {
        id: data.id,
        mission_id: data.missionId,
        antares_id: data.antaresId,
        units: data.units,
        bombers: data.firefighter,
        summary: data.summary,
        description: data.description,
    }
}

export const FromApi = (data: TApiService) =>
    mapEntity<TApiService, TService>(
        data,
        ApiServiceSchema,
        ServiceSchema,
        fromApiInternal
    )

export const ToApi = (data: TService) =>
    mapEntity<TService, TApiService>(
        data,
        ServiceSchema,
        ApiServiceSchema,
        toApiInternal
    )

export const serviceService = new CreateCRUD<TService>(
    'mission/service',
    ToApi,
    FromApi
)
