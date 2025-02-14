import { z } from 'zod'

import { ResultErr } from '../../../abstractions/types/resulterr'
import { mapEntity } from '../../../../services/mapper'

export const MissionLocationApiSchema = z.object({
    id: z.string().optional(),
    alias: z.string().optional(),
    state_id: z.string().optional(),
    state: z.string().optional(),
    mission_id: z.string().optional(),
    municipality_id: z.string().optional(),
    municipality: z.string().optional(),
    parish_id: z.string().optional(),
    parish: z.string().optional(),
    sector_id: z.string().optional(),
    sector: z.string().optional(),
    urb_id: z.string().optional(),
    urb: z.string().optional(),
    address: z.string().optional(),
    street: z.string().optional(),
    beach: z.string().optional(),
})

export const MissionLocationFrontSchema = z.object({
    id: z.string().optional(),
    alias: z.string().optional(),
    stateId: z.string().optional(),
    state: z.string().optional(),
    missionId: z.string().optional(),
    municipalityId: z.string().optional(),
    municipality: z.string().optional(),
    parishId: z.string().optional(),
    parish: z.string().optional(),
    sectorId: z.string().optional(),
    sector: z.string().optional(),
    urbId: z.string().optional(),
    urb: z.string().optional(),
    address: z.string().optional(),
    street: z.string().optional(),
    beach: z.string().optional(),
})

export type MissionLocationApi = z.infer<typeof MissionLocationApiSchema>
export type MissionLocationFront = z.infer<typeof MissionLocationFrontSchema>

const FromApiInternal = (data: MissionLocationApi): MissionLocationFront => {
    return {
        id: data.id,
        alias: data.alias,
        stateId: data.state_id,
        state: data.state,
        missionId: data.mission_id,
        municipalityId: data.municipality_id,
        municipality: data.municipality,
        parishId: data.parish_id,
        parish: data.parish,
        sectorId: data.sector_id,
        sector: data.sector,
        urbId: data.urb_id,
        urb: data.urb,
        address: data.address,
        street: data.street,
        beach: data.beach,
    }
}

const ToApiInternal = (data: MissionLocationFront): MissionLocationApi => {
    return {
        id: data.id,
        alias: data.alias,
        state_id: data.stateId,
        state: data.state,
        mission_id: data.missionId,
        municipality_id: data.municipalityId,
        municipality: data.municipality,
        parish_id: data.parishId,
        parish: data.parish,
        sector_id: data.sectorId,
        sector: data.sector,
        urb_id: data.urbId,
        urb: data.urb,
        address: data.address,
        street: data.street,
        beach: data.beach,
    }
}

export const MissionLocationFromApi = (
    data: MissionLocationApi
): ResultErr<MissionLocationFront> =>
    mapEntity<MissionLocationApi, MissionLocationFront>(
        data,
        MissionLocationApiSchema as any,
        MissionLocationFrontSchema as any,
        FromApiInternal
    )
export const MissionLocationToApi = (
    data: MissionLocationFront
): ResultErr<MissionLocationApi> =>
    mapEntity<MissionLocationFront, MissionLocationApi>(
        data,
        MissionLocationFrontSchema as any,
        MissionLocationApiSchema as any,
        ToApiInternal
    )

export const MissionLocationNameConverter: {
    [K in keyof MissionLocationFront]?: string
} = {
    alias: 'Alias',
    state: 'Estado',
    municipality: 'Municipio',
    parish: 'Parroquia',
    sector: 'Sector',
}
