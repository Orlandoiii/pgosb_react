import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'

export const ServiceSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    missionId: zodEmptyOrGreaterThan(0),
    antaresId: zodEmptyOrGreaterThan(0),
    units: z.array(z.number().default(0)).default([]),
    firefighter: z.array(z.number().default(0)).default([]),
    summary: zodEmptyOrGreaterThan(3),
    description: zodEmptyOrGreaterThan(3),
})

export const ApiServiceSchema = z.object({
    id: z.string().default(''),
    mission_id: z.string().default(''),
    antares_id: z.string().default(''),
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

export const FromApi = (data: TApiService): ResultErr<TService> =>
    mapEntity<TApiService, TService>(
        data,
        ApiServiceSchema as any,
        ServiceSchema as any,
        fromApiInternal
    )

export const ToApi = (data: TService): ResultErr<TApiService> =>
    mapEntity<TService, TApiService>(
        data,
        ServiceSchema as any,
        ApiServiceSchema as any,
        toApiInternal
    )

export const serviceCrud = new CRUD<TService>('mission/service', ToApi, FromApi)

export const serviceNameConverter: { [K in keyof TService]?: string } = {
    id: 'Id',
    antaresId: 'Antares',
    firefighter: 'Bomberos',
    units: 'Unidades',
}
