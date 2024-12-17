import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'

export const RelevantServiceDetail =
z.object({
    id:z.string().optional().default(''),
    region_area:z.string().optional().default(''),
    mission_code:z.string().optional().default(''),
    service_id:z.string().optional().default(''),
    service_description:z.string().optional().default(''),
    service_date:z.string().optional().default(''),
    unharmed:z.string().optional().default(''),
    injured:z.string().optional().default(''),
    transported:z.string().optional().default(''),
    deceased:z.string().optional().default(''),
    antares: z.array(z.object({
        id: z.string().optional().default(''),
        type: z.string().optional().default(''),
        antaresDescription: z.string().optional().default('')
    })).optional().default([]),
    units:z.array(z.string()).optional().default([]),
    firefighters:z.array(z.object({
        rank: z.string().optional().default(''),
        name: z.string().optional().default(''),
        document: z.string().optional().default(''),
        role: z.string().optional().default(''),
        team: z.string().optional().default('')
    })).optional().default([]),
    operative_area_name:z.array(z.string()).optional().default([]),
    people:z.array(z.object({
        condition: z.string().optional().default(''),
        name: z.string().optional().default(''),
        gender: z.string().optional().default(''),
        age: z.string().optional().default(''),
        document: z.string().optional().default(''),
        phone: z.string().optional().default(''),
        person_condition: z.string().optional().default(''),
        unit: z.string().optional().default(''),
        address: z.string().optional().default(''),
        building: z.string().optional().default(''),
        vehicle: z.string().optional().default('')
    })).optional().default([]),
    infrastructures:z.array(z.object({
        type: z.string().optional().default(''),
        floor: z.string().optional().default(''),
        occupation: z.string().optional().default(''),
        levels: z.string().optional().default('')
    })).optional().default([]),
   
    vehicles:z.array(z.object({
        plate: z.string().optional().default(''),
        make: z.string().optional().default(''),
        model: z.string().optional().default(''),
        year: z.string().optional().default(''),
        color: z.string().optional().default(''),
        vehicle_type: z.string().optional().default(''),
        motor_serial: z.string().optional().default('')
    })).optional().default([]),
    service_locations:z.array(z.object({
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default(''),
        address: z.string().optional().default('')
    })).optional().default([]),
    service_stations:z.array(z.object({
        name: z.string().optional().default(''),
        abbreviation: z.string().optional().default(''),
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default('')
    })).optional().default([]),
    centers:z.array(z.object({
        name: z.string().optional().default(''),
        abbreviation: z.string().optional().default(''),
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default('')
    })).optional().default([]),
    is_important:z.boolean().optional().default(false),
});



export const ApiRelevantServiceDetail = z.object({
    id:z.string().optional().default(''),
    region_area:z.string().optional().default(''),
    mission_code:z.string().optional().default(''),
    service_id:z.string().optional().default(''),
    service_description:z.string().optional().default(''),
    service_date:z.string().optional().default(''),
    unharmed:z.string().optional().default(''),
    injured:z.string().optional().default(''),
    transported:z.string().optional().default(''),
    deceased:z.string().optional().default(''),
    antares: z.array(z.object({
        id: z.string().optional().default(''),
        type: z.string().optional().default(''),
        antaresDescription: z.string().optional().default('')
    })).optional().default([]),
    units:z.array(z.string()).optional().default([]),
    firefighters:z.array(z.object({
        rank: z.string().optional().default(''),
        name: z.string().optional().default(''),
        document: z.string().optional().default(''),
        role: z.string().optional().default(''),
        team: z.string().optional().default('')
    })).optional().default([]),
    operative_area_name:z.array(z.string()).optional().default([]),
    people:z.array(z.object({
        condition: z.string().optional().default(''),
        name: z.string().optional().default(''),
        gender: z.string().optional().default(''),
        age: z.string().optional().default(''),
        document: z.string().optional().default(''),
        phone: z.string().optional().default(''),
        person_condition: z.string().optional().default(''),
        unit: z.string().optional().default(''),
        address: z.string().optional().default(''),
        building: z.string().optional().default(''),
        vehicle: z.string().optional().default('')
    })).optional().default([]),
    infrastructures:z.array(z.object({
        type: z.string().optional().default(''),
        floor: z.string().optional().default(''),
        occupation: z.string().optional().default(''),
        levels: z.string().optional().default('')
    })).optional().default([]),
   
    vehicles:z.array(z.object({
        plate: z.string().optional().default(''),
        make: z.string().optional().default(''),
        model: z.string().optional().default(''),
        year: z.string().optional().default(''),
        color: z.string().optional().default(''),
        vehicle_type: z.string().optional().default(''),
        motor_serial: z.string().optional().default('')
    })).optional().default([]),
    service_locations:z.array(z.object({
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default(''),
        address: z.string().optional().default('')
    })).optional().default([]),
    service_stations:z.array(z.object({
        name: z.string().optional().default(''),
        abbreviation: z.string().optional().default(''),
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default('')
    })).optional().default([]),
    centers:z.array(z.object({
        name: z.string().optional().default(''),
        abbreviation: z.string().optional().default(''),
        state: z.string().optional().default(''),
        municipality: z.string().optional().default(''),
        parish: z.string().optional().default(''),
        sector: z.string().optional().default(''),
        urb: z.string().optional().default('')
    })).optional().default([]),
    is_important:z.boolean().optional().default(false),
});

export type TRelevantServiceDetail = z.infer<typeof RelevantServiceDetail>
export type TApiRelevantServiceDetail = z.infer<typeof ApiRelevantServiceDetail>

function fromApiInternal(data: TApiRelevantServiceDetail): TRelevantServiceDetail {
    return data
}

function toApiInternal(data: TRelevantServiceDetail): TApiRelevantServiceDetail {
    return data
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