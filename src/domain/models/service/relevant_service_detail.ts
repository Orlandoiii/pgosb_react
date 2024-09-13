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
        stations: [{
            abbreviation: data.service_stations[0]?.abbreviation || '',
            name: data.service_stations[0]?.name || '',
            location: {
                state: data.service_stations[0]?.state || '',
                municipality: data.service_stations[0]?.municipality || '',
                parish: data.service_stations[0]?.parish || '',
                sector: data.service_stations[0]?.sector || '',
                urb: data.service_stations[0]?.urb || '',
            },
            services: [{
                missionCode: data.mission_code,
                serviceId: data.service_id,
                serviceDescription: data.service_description,
                serviceDate: data.service_date,
                antaresId : data.antares_id,
                antaresType : data.antares_type,
                antaresDescription : data.antares_description,
                location: data.service_locations[0] || undefined,
                operativeAreas: data.operative_area_name,
                careCenter: data.centers.length > 0 ? [{
                    name: data.centers[0].name,
                    abbreviation: data.centers[0].abbreviation,
                    location: {
                        state: data.centers[0].state,
                        municipality: data.centers[0].municipality,
                        parish: data.centers[0].parish,
                        sector: data.centers[0].sector,
                        urb: data.centers[0].urb,
                    }
                }] : [],
                units: data.units,
                firefighters: data.firefighters,
                vehicles: data.vehicles,
                infrastructures: data.infrastructures,
                people: data.people.map(person => ({
                    ...person,
                    personCondition: person.person_condition,
                })),
            }]
        }]
    }
}

function toApiInternal(data: TRelevantServiceDetail): TApiRelevantServiceDetail {
    const firstRegion = data[0] || {};
    const firstStation = firstRegion.stations?.[0] || {};
    const firstService = firstStation.services?.[0] || {};

    return {
        id: firstRegion.regionAreaId,
        region_area: firstRegion.regionAreaName,
        mission_code: firstService.missionCode,
        service_id: firstService.serviceId,
        operative_area_name: firstStation.name,
        service_description: firstService.serviceDescription,
        service_date: firstService.serviceDate,
        antares_id: firstService.antaresId,
        antares_type: firstService.antaresType,
        antares_description: firstService.antaresDescription,
        units: firstService.units || [],
        firefighters: firstService.firefighters || [],
        people: (firstService.people || []).map(person => ({
            ...person,
            person_condition: person.personCondition,
        })),
        infrastructures: firstService.infrastructures || [],
        vehicles: firstService.vehicles || [],
        service_locations: firstService.location ? [firstService.location] : [],
        service_stations: [{
            name: firstStation.name,
            abbreviation: firstStation.abbreviation,
            ...firstStation.location,
        }],
        centers: firstService.careCenter?.map(center => ({
            name: center.name,
            abbreviation: center.abbreviation,
            ...center.location,
        })) || [],
    }
}


export const ServiceFromApi = (data: TApiRelevantServiceDetail): ResultErr<TRelevantServiceDetail> =>
    mapEntity<TApiRelevantServiceDetail, TRelevantServiceDetail>(
        data,
        RelevantServiceDetail as any,
        RelevantServiceDetail as any,
        fromApiInternal
    )

export const ServiceToApi = (data: TRelevantServiceDetail): ResultErr<TApiRelevantServiceDetail> =>
    mapEntity<TRelevantServiceDetail, TApiRelevantServiceDetail>(
        data,
        RelevantServiceDetail as any,
        RelevantServiceDetail as any,
        toApiInternal
    )

export const serviceCrud = new CRUD<TRelevantServiceDetail>(
    'mission/service',
    ServiceToApi,
    ServiceFromApi
)