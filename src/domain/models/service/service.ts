import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'

export const ServiceSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    missionId: zodEmptyOrGreaterThan(0),
    antaresId: zodEmptyOrGreaterThan(0),
    stationId: zodEmptyOrGreaterThan(0),
    locationId: z.string(),
    centerId: z.string(),
    units: z.array(z.string()).default([]),
    firefighter: z.array(z.string()).default([]),
    summary: zodEmptyOrGreaterThan(0),
    unharmed: zodEmptyOrGreaterThan(0),
    injured: zodEmptyOrGreaterThan(0),
    transported: zodEmptyOrGreaterThan(0),
    deceased: zodEmptyOrGreaterThan(0),
    description: zodEmptyOrGreaterThan(3),
})

export const ApiServiceSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    mission_id: zodEmptyOrGreaterThan(0),
    antares_id: zodEmptyOrGreaterThan(0),
    station_id: z.string(),
    location_id: z.string(),
    center_id: z.string(),
    units: z.array(z.string()).default([]),
    bombers: z.array(z.string()).default([]),
    summary: z.string(),
    unharmed: z.string(),
    injured: z.string(),
    transported: z.string(),
    deceased: z.string(),
    description: zodEmptyOrGreaterThan(0),
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
