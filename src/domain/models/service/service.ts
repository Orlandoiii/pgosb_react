import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'

export const ServiceSchema = z.object({
    id: z.string().optional(),
    missionId: z.string().optional(),
    antaresId: z.string().optional(),
    stationId: z.string().optional(),
    locationId: z.string().optional(),
    centerId: z.string().optional(),
    units: z.array(z.string()).default([]).optional(),
    firefighter: z.array(z.string()).default([]).optional(),
    summary: z.string().optional(),
    unharmed: z.string().optional(),
    injured: z.string().optional(),
    transported: z.string().optional(),
    deceased: z.string().optional(),
    description: z.string().optional(),
})

export const ApiServiceSchema = z.object({
    id: z.string().optional(),
    mission_id: z.string().optional(),
    antares_id: z.string().optional(),
    station_id: z.string().optional(),
    location_id: z.string().optional(),
    center_id: z.string().optional(),
    units: z.array(z.string()).default([]).optional(),
    bombers: z.array(z.string()).default([]).optional(),
    summary: z.string().optional(),
    unharmed: z.string().optional(),
    injured: z.string().optional(),
    transported: z.string().optional(),
    deceased: z.string().optional(),
    description: z.string().optional(),
})

export type TService = z.infer<typeof ServiceSchema>
export type TApiService = z.infer<typeof ApiServiceSchema>

function fromApiInternal(data: TApiService): TService {
    return {
        id: data.id,
        missionId: data.mission_id,
        antaresId: data.antares_id,
        stationId: data.station_id,
        centerId: data.center_id,
        locationId: data.location_id,
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
        station_id: data.stationId,
        center_id: data.centerId,
        location_id: data.locationId,
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
