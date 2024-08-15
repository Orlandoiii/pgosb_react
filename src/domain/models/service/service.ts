import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'

export const ServiceSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    missionId: zodEmptyOrGreaterThan(0),
    antaresId: zodEmptyOrGreaterThan(0),
    units: z.array(z.string()).default([]),
    firefighter: z.array(z.string()).default([]),
    summary: zodEmptyOrGreaterThan(3),
    unharmed: zodEmptyOrGreaterThan(3),
    injured: zodEmptyOrGreaterThan(3),
    transported: zodEmptyOrGreaterThan(3),
    deceased: zodEmptyOrGreaterThan(3),
    description: zodEmptyOrGreaterThan(3),
})

export const ApiServiceSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    mission_id: zodEmptyOrGreaterThan(0),
    antares_id: zodEmptyOrGreaterThan(0),
    units: z.array(z.string()).default([]),
    bombers: z.array(z.string()).default([]),
    summary: zodEmptyOrGreaterThan(0),
    unharmed: zodEmptyOrGreaterThan(3),
    injured: zodEmptyOrGreaterThan(3),
    transported: zodEmptyOrGreaterThan(3),
    deceased: zodEmptyOrGreaterThan(3),
    description: zodEmptyOrGreaterThan(0),
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
        unharmed: data.unharmed,
        injured: data.injured,
        transported: data.transported,
        deceased: data.deceased,
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
        unharmed: data.unharmed,
        injured: data.injured,
        transported: data.transported,
        deceased: data.deceased,
        description: data.description,
    }
}

export const ServiceFromApi = (data: TApiService): ResultErr<TService> =>
    mapEntity<TApiService, TService>(
        data,
        ApiServiceSchema as any,
        ServiceSchema as any,
        fromApiInternal
    )

export const ServiceToApi = (data: TService): ResultErr<TApiService> =>
    mapEntity<TService, TApiService>(
        data,
        ServiceSchema as any,
        ApiServiceSchema as any,
        toApiInternal
    )

export const serviceCrud = new CRUD<TService>(
    'mission/service',
    ServiceToApi,
    ServiceFromApi
)

export const serviceNameConverter: { [K in keyof TService]?: string } = {
    id: 'Id',
    antaresId: 'Antares',
    firefighter: 'Bomberos',
    units: 'Unidades',
}
