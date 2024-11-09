import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionUnitApiSchema = z.object({
    id: z.string().optional().default(''),
    plate: z.string().optional().default(''),
    station: z.string().optional().default(''),
    unit_type: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
})

export const MissionUnitFrontSchema = z.object({
    id: z.string().optional().default(''),
    plate: z.string().optional().default(''),
    station: z.string().optional().default(''),
    unitType: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
})

export type MissionUnitApi = z.infer<typeof MissionUnitApiSchema>
export type MissionUnitFront = z.infer<typeof MissionUnitFrontSchema>



function fromApiInternal(data: MissionUnitApi): MissionUnitFront {
    return {
        id: data.id,
        plate: data.plate,
        station: data.station,
        unitType: data.unit_type,
        alias: data.alias,
        missionId: data.mission_id,
    }
}

function toApiInternal(data: MissionUnitFront): MissionUnitApi {
    return {
        id: data.id,
        plate: data.plate,
        station: data.station,
        unit_type: data.unitType,
        alias: data.alias,
        mission_id: data.missionId,
    }
}

export const MissionUnitFromApi = (
    data: MissionUnitApi
): ResultErr<MissionUnitFront> =>
    mapEntity<MissionUnitApi, MissionUnitFront>(
        data,
        MissionUnitApiSchema as any,
        MissionUnitFrontSchema as any,
        fromApiInternal
    )
export const MissionUnitToApi = (
    data: MissionUnitFront
): ResultErr<MissionUnitApi> =>
    mapEntity<MissionUnitFront, MissionUnitApi>(
        data,
        MissionUnitFrontSchema as any,
        MissionUnitApiSchema as any,
        toApiInternal
    )

export const MissionUnitNameConverter: { [K in keyof MissionUnitFront]?: string } = {
    plate: 'Placa',
    station: 'Estación',
    unitType: 'Tipo',
    alias: 'Alias'
}