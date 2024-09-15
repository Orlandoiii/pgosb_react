import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'

export const RelevantServiceDetail =
    z.object({
        regionAreaId: z.string().optional().default(''),
        regionAreaName: z.string().optional().default(''),
        stations: z.array(z.object({
            abbreviation: z.string().optional().default(''),
            name: z.string().optional().default(''),
            location: z.object({
                state: z.string().optional().default(''),
                municipality: z.string().optional().default(''),
                parish: z.string().optional().default(''),
                sector: z.string().optional().default(''),
                urb: z.string().optional().default('')
            }),
            services: z.array(z.object({
                antaresId: z.string().optional().default(''),
                antaresType: z.string().optional().default(''),
                antaresDescription: z.string().optional().default(''),
                missionCode: z.string().optional().default(''),
                serviceId: z.string().optional().default(''),
                serviceDescription: z.string().optional().default(''),
                serviceDate: z.string().optional().default(''),
                unharmed: z.string().optional().default(''),
                injured: z.string().optional().default(''),
                transported: z.string().optional().default(''),
                deceased: z.string().optional().default(''),
                operativeAreas: z.array(z.string()).optional().default([]),
                location: z.object({
                    state: z.string().optional().default(''),
                    municipality: z.string().optional().default(''),
                    parish: z.string().optional().default(''),
                    sector: z.string().optional().default(''),
                    urb: z.string().optional().default(''),
                    address: z.string().optional().default('')
                }).optional(),
                careCenter: z.array(z.object({
                    name: z.string().optional().default(''),
                    abbreviation: z.string().optional().default(''),
                    location: z.object({
                        state: z.string().optional().default(''),
                        municipality: z.string().optional().default(''),
                        parish: z.string().optional().default(''),
                        sector: z.string().optional().default(''),
                        urb: z.string().optional().default('')
                    })
                })).optional().default([]),

                units: z.array(z.string()).optional().default([]),

                firefighters: z.array(z.object({
                    rank: z.string().optional().default(''),
                    name: z.string().optional().default(''),
                    document: z.string().optional().default(''),
                    role: z.string().optional().default(''),
                    team: z.string().optional().default('')
                })).optional().default([]),

                vehicles: z.array(z.object({
                    plate: z.string().optional().default(''),
                    make: z.string().optional().default(''),
                    model: z.string().optional().default(''),
                    year: z.string().optional().default(''),
                    color: z.string().optional().default(''),
                    type: z.string().optional().default(''),
                    serial: z.string().optional().default('')
                })).optional().default([]),

                infrastructures: z.array(z.object({
                    type: z.string().optional().default(''),
                    floor: z.string().optional().default(''),
                    occupation: z.string().optional().default(''),
                    levels: z.string().optional().default('')
                })).optional().default([]),

                people: z.array(z.object({
                    condition: z.string().optional().default(''),
                    name: z.string().optional().default(''),
                    gender: z.string().optional().default(''),
                    age: z.string().optional().default(''),
                    document: z.string().optional().default(''),
                    phone: z.string().optional().default(''),
                    personCondition: z.string().optional().default(''),
                    unit: z.string().optional().default(''),
                    address: z.string().optional().default('')
                })).optional().default([]),
            }))
        }))
    })



export const ApiRelevantServiceDetail = z.object({
    id: z.string().optional().default(''),
    region_area: z.string().optional().default(''),
    mission_code: z.string().optional().default(''),
    service_id: z.string().optional().default(''),
    operative_area_name: z.array(z.string()).optional().default([]),
    service_description: z.string().optional().default(''),
    service_date: z.string().optional().default(''),
    antares_id: z.string().optional().default(''),
    antares_type: z.string().optional().default(''),
    unharmed: z.string().optional().default(''),
    injured: z.string().optional().default(''),
    transported: z.string().optional().default(''),
    deceased: z.string().optional().default(''),
    antares_description: z.string().optional().default(''),
    units: z.array(z.string()).optional().default([]),
    firefighters: z.array(z.object({
        rank: z.string().optional().default(''),
        name: z.string().optional().default(''),
        document: z.string().optional().default(''),
        role: z.string().optional().default(''),
        team: z.string().optional().default('')
    })).optional().default([]),
    people: z.array(z.object({
        condition: z.string().optional().default(''),
        name: z.string().optional().default(''),
        gender: z.string().optional().default(''),
        age: z.string().optional().default(''),
        document: z.string().optional().default(''),
        phone: z.string().optional().default(''),
        person_condition: z.string().optional().default(''),
        unit: z.string().optional().default(''),
        address: z.string().optional().default('')
    })).optional().default([]),
    infrastructures: z.array(z.object({
        type: z.string().optional().default(''),
        floor: z.string().optional().default(''),
        occupation: z.string().optional().default(''),
        levels: z.string().optional().default('')
    })).optional().default([]),
    vehicles: z.array(z.object({
        plate: z.string().optional().default(''),
        make: z.string().optional().default(''),
        model: z.string().optional().default(''),
        year: z.string().optional().default(''),
        color: z.string().optional().default(''),
        type: z.string().optional().default(''),
        serial: z.string().optional().default('')
    })).optional().default([]),
    service_locations: z.array(z.object({
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default(''),
        address: z.string().optional().default('')
    })).optional().default([]),
    service_stations: z.array(z.object({
        name: z.string().optional().default(''),
        abbreviation: z.string().optional().default(''),
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default('')
    })).optional().default([]),
    centers: z.array(z.object({
        name: z.string().optional().default(''),
        abbreviation: z.string().optional().default(''),
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default('')
    })).optional().default([])
});

export type TRelevantServiceDetail = z.infer<typeof RelevantServiceDetail>
export type TApiRelevantServiceDetail = z.infer<typeof ApiRelevantServiceDetail>

function fromApiInternal(data: TApiRelevantServiceDetail): TRelevantServiceDetail {
    return {
        regionAreaId: data.id,
        regionAreaName: data.region_area,
        stations: (data.service_stations || []).map(station => ({
            abbreviation: station.abbreviation || '',
            name: station.name || '',
            location: {
                state: station.state || '',
                municipality: station.municipality || '',
                parish: station.parish || '',
                sector: station.sector || '',
                urb: station.urb || '',
            },
            services: [{
                missionCode: data.mission_code || '',
                serviceId: data.service_id || '',
                serviceDescription: data.service_description || '',
                serviceDate: data.service_date || '',
                antaresId: data.antares_id || '',
                antaresType: data.antares_type || '',
                antaresDescription: data.antares_description || '',
                unharmed: data.unharmed || '',
                injured: data.injured || '',
                transported: data.transported || '',
                deceased: data.deceased || '',
                location: data.service_locations[0] || undefined,
                operativeAreas: data.operative_area_name || [],
                careCenter: (data.centers || []).map(center => ({
                    name: center.name || '',
                    abbreviation: center.abbreviation || '',
                    location: {
                        state: center.state || '',
                        municipality: center.municipality || '',
                        parish: center.parish || '',
                        sector: center.sector || '',
                        urb: center.urb || '',
                    }
                })),
                units: data.units || [],
                firefighters: data.firefighters || [],
                vehicles: data.vehicles || [],
                infrastructures: data.infrastructures || [],
                people: (data.people || []).map(person => ({
                    ...person,
                    personCondition: person.person_condition || '',
                })),
            }]
        }))
    }
}

function toApiInternal(data: TRelevantServiceDetail): TApiRelevantServiceDetail {
    const firstStation = data.stations[0] || {};
    const firstService = firstStation.services?.[0] || {};

    return {
        id: data.regionAreaId,
        region_area: data.regionAreaName,
        mission_code: firstService.missionCode,
        service_id: firstService.serviceId,
        operative_area_name: firstService.operativeAreas,
        service_description: firstService.serviceDescription,
        service_date: firstService.serviceDate,
        antares_id: firstService.antaresId,
        antares_type: firstService.antaresType,
        antares_description: firstService.antaresDescription,
        unharmed: firstService.unharmed || '',
        injured: firstService.injured || '',
        transported: firstService.transported || '',
        deceased: firstService.deceased || '',
        units: firstService.units || [],
        firefighters: firstService.firefighters || [],
        people: (firstService.people || []).map(person => ({
            ...person,
            person_condition: person.personCondition,
        })),
        infrastructures: firstService.infrastructures || [],
        vehicles: firstService.vehicles || [],
        service_locations: firstService.location ? [firstService.location] : [],
        service_stations: data.stations.map(station => ({
            name: station.name,
            abbreviation: station.abbreviation,
            ...station.location,
        })),
        centers: firstService.careCenter?.map(center => ({
            name: center.name,
            abbreviation: center.abbreviation,
            ...center.location,
        })) || [],
    }
}

export const RelevantServiceFromApi = (data: TApiRelevantServiceDetail): ResultErr<TRelevantServiceDetail> =>
    mapEntity<TApiRelevantServiceDetail, TRelevantServiceDetail>(
        data,
        RelevantServiceDetail as any,
        RelevantServiceDetail as any,
        fromApiInternal
    )

export const RelevantServiceToApi = (data: TRelevantServiceDetail): ResultErr<TApiRelevantServiceDetail> =>
    mapEntity<TRelevantServiceDetail, TApiRelevantServiceDetail>(
        data,
        RelevantServiceDetail as any,
        RelevantServiceDetail as any,
        toApiInternal
    )

export const relevantServiceCrud = new CRUD<TRelevantServiceDetail>(
    'mission/service',
    RelevantServiceToApi,
    RelevantServiceFromApi
)