import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'
export const MissionSchema = z.object({
    id: z.string().optional().default(''),
    createdAt: z.string().optional().default(''),
    code: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    operativeAreas: z.array(z.string()).default([]).optional().default([]),
    summary: z.string().optional().default(''),
    description: z.string().optional().default(''),
    unharmed: z.string().optional().default(''),
    injured: z.string().optional().default(''),
    transported: z.string().optional().default(''),
    deceased: z.string().optional().default(''),
    stationId: z.string().optional().default(''),
    locationId: z.string().optional().default(''),
    manualMissionDate: z.string().optional().default(''),
    isImportant: z.boolean().optional().default(false),
    centerId: z.string().optional().default(''),
    sendingUserId: z.string().optional().default(''),
    receivingUserId: z.string().optional().default(''),
    location_destinyId: z.string().optional().default(''),
    level: z.string().optional().default(''),
    peaceQuadrant: z.string().optional().default(''),
    cancelReason: z.string().optional().default(''),
    pendingForData: z.boolean().optional().default(true),
})

export const ApiMissionSchema = z.object({
    id: z.string().optional().default(''),
    created_at: z.string().optional().default(''),
    code: z.string().optional().default(''),
    alias: z.string().optional().default(''),
    operative_areas: z.array(z.string()).default([]).optional().default([]),
    summary: z.string().optional().default(''),
    description: z.string().optional().default(''),
    unharmed: z.string().optional().default(''),
    injured: z.string().optional().default(''),
    transported: z.string().optional().default(''),
    deceased: z.string().optional().default(''),
    station_id: z.string().optional().default(''),
    location_id: z.string().optional().default(''),
    manual_mission_date: z.string().optional().default(''),
    is_important: z.boolean().optional().default(false),
    center_id: z.string().optional().default(''),
    sending_user_id: z.string().optional().default(''),
    receiving_user_id: z.string().optional().default(''),
    location_destiny_id: z.string().optional().default(''),
    level: z.string().optional().default(''),
    peace_quadrant: z.string().optional().default(''),
    cancel_reason: z.string().optional().default(''),
    pending_for_data: z.boolean().optional().default(true),
})

export type TMission = z.infer<typeof MissionSchema>
export type TApiMission = z.infer<typeof ApiMissionSchema>

function fromApiInternal(data: TApiMission): TMission {
    return {
        id: data.id,
        code: data.code,
        alias: data.alias,
        createdAt: data.created_at,
        operativeAreas: data.operative_areas,
        summary: data.summary,
        description: data.description,
        unharmed: data.unharmed,
        injured: data.injured,
        transported: data.transported,
        deceased: data.deceased,
        stationId: data.station_id,
        locationId: data.location_id,
        manualMissionDate: data.manual_mission_date,
        isImportant: data.is_important,
        centerId: data.center_id,
        sendingUserId: data.sending_user_id,
        receivingUserId: data.receiving_user_id,
        location_destinyId: data.location_destiny_id,
        level: data.level,
        peaceQuadrant: data.peace_quadrant,
        cancelReason: data.cancel_reason,
        pendingForData: data.pending_for_data,
    }
}

function toApiInternal(data: TMission): TApiMission {
    return {
        id: data.id,
        code: data.code,
        alias: data.alias,
        created_at: data.createdAt,
        operative_areas: data.operativeAreas,
        summary: data.summary,
        description: data.description,
        unharmed: data.unharmed,
        injured: data.injured,
        transported: data.transported,
        deceased: data.deceased,
        station_id: data.stationId,
        location_id: data.locationId,
        manual_mission_date: data.manualMissionDate,
        is_important: data.isImportant,
        center_id: data.centerId,
        sending_user_id: data.sendingUserId,
        receiving_user_id: data.receivingUserId,
        location_destiny_id: data.location_destinyId,
        level: data.level,
        peace_quadrant: data.peaceQuadrant,
        cancel_reason: data.cancelReason,
        pending_for_data: data.pendingForData,
    }
}

export const MissionFromApi = (data: TApiMission): ResultErr<TMission> =>
    mapEntity<TApiMission, TMission>(
        data,
        ApiMissionSchema as any,
        MissionSchema as any,
        fromApiInternal
    )

export const MissionToApi = (data: TMission): ResultErr<TApiMission> =>
    mapEntity<TMission, TApiMission>(
        data,
        MissionSchema as any,
        ApiMissionSchema as any,
        toApiInternal
    )

export const missionCrud = new CRUD<TMission>(
    'mission',
    MissionToApi,
    MissionFromApi
)


