import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const ServiceSchema = z.object({
    id: z.string().default(""),
    missionId: z.string().default(""),
    antaresId: z.string().default(""),
    units: z.array(z.number().default(0)).default([]),
    firefighter: z.array(z.number().default(0)).default([]),
    summary: z.string().default(''),
    description: z.string().default(''),
})

export const ApiServiceSchema = z.object({
    id: z.string().default(""),
    mission_id: z.string().default(""),
    antares_id: z.string().default(""),
    units: z.array(z.number().default(0)).default([]),
    bombers: z.array(z.number().default(0)).default([]),
    summary: z.string().default(''),
    description: z.string().default(''),
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
        ApiServiceSchema as any,
        ServiceSchema as any,
        fromApiInternal
    )

export const ToApi = (data: TService) =>
    mapEntity<TService, TApiService>(
        data,
        ServiceSchema as any,
        ApiServiceSchema as any,
        toApiInternal
    )

export const serviceService = new CreateCRUD<TService>(
    'mission/service',
    ToApi,
    FromApi
)
