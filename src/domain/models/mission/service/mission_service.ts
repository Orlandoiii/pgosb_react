import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionServiceApiSchema = z.object({
    id: z.string().optional(),
    mission_id: z.string().optional(),
    antares_id: z.string().optional(),
    station_id: z.string().optional(),
    location_id: z.string().optional(),
    location_destiny_id: z.string().optional(),
    center_id: z.string().optional(),
    units: z.array(z.string()).default([]).optional(),
    bombers: z.array(z.string()).default([]).optional(),
    summary: z.string().optional(),
    unharmed: z.string().optional(),
    injured: z.string().optional(),
    transported: z.string().optional(),
    deceased: z.string().optional(),
    description: z.string().optional(),
    service_date: z.string().optional(),
    manual_service_date: z.string().optional(),
    is_important: z.boolean(),
    operative_areas: z.array(z.string()).default([]).optional(),
    level: z.string().optional().default(''),
    peace_quadrant: z.string().optional().default(''),
    cancel_reason: z.string().optional().default(''),
    pending_for_data: z.boolean().optional().default(true),
})

export const MissionServiceFrontSchema = z.object({
    id: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
    antaresId: z.string().optional().default(''),
    stationId: z.string().optional().default(''),
    locationId: z.string().optional().default(''),
    locationDestinyId: z.string().optional(),
    centerId: z.string().optional().default(''),
    units: z.array(z.string()).default([]).optional().default([]),
    firefighter: z.array(z.string()).default([]).optional().default([]),
    summary: z.string().optional().default(''),
    unharmed: z.string().optional().default(''),
    injured: z.string().optional().default(''),
    transported: z.string().optional().default(''),
    deceased: z.string().optional().default(''),
    description: z.string().optional().default(''),
    serviceDate: z.string().optional().default(''),
    manualServiceDate: z.string().optional().default(''),
    isImportant: z.boolean().optional().default(false),
    operativeAreas: z.any(),
    level: z.string().optional().default(''),
    peaceQuadrant: z.string().optional().default(''),
    cancelReason: z.string().optional().default(''),
    pendingForData: z.boolean().optional().default(true),
})

export type MissionServiceApi = z.infer<typeof MissionServiceApiSchema>
export type MissionServiceFront = z.infer<typeof MissionServiceFrontSchema>



function fromApiInternal(data: MissionServiceApi): MissionServiceFront {
    return {
        id: data.id ?? "",
        missionId: data.mission_id ?? "",
        antaresId: data.antares_id ?? "",
        stationId: data.station_id ?? "",
        centerId: data.center_id ?? "",
        locationId: data.location_id ?? "",
        locationDestinyId: data.location_destiny_id ?? "",
        units: data.units ?? [],
        firefighter: data.bombers ?? [],
        summary: data.summary ?? "",
        unharmed: data.unharmed ?? "",
        injured: data.injured ?? "",
        transported: data.transported ?? "",
        deceased: data.deceased ?? "",
        description: data.description ?? "",
        serviceDate: data.service_date ?? "",
        manualServiceDate: data.manual_service_date ?? "",
        isImportant: data.is_important ?? false,
        operativeAreas: data.operative_areas ?? [],
        level: data.level,
        peaceQuadrant: data.peace_quadrant ?? "",
        cancelReason: data.cancel_reason,
        pendingForData: data.pending_for_data,
    }
}

function toApiInternal(data: MissionServiceFront): MissionServiceApi {
    return {
        id: data.id,
        mission_id: data.missionId,
        antares_id: data.antaresId,
        station_id: data.stationId,
        center_id: data.centerId,
        location_id: data.locationId,
        location_destiny_id: data.locationDestinyId,
        units: data.units,
        bombers: data.firefighter,
        summary: data.summary,
        unharmed: data.unharmed,
        injured: data.injured,
        transported: data.transported,
        deceased: data.deceased,
        description: data.description,
        service_date: data.serviceDate,
        manual_service_date: data.manualServiceDate,
        is_important: data.isImportant ?? false,
        operative_areas: data.operativeAreas,
        level: data.level,
        peace_quadrant: data.peaceQuadrant,
        cancel_reason: data.cancelReason,
        pending_for_data: data.pendingForData,
    }
}

export const MissionServiceFromApi = (
    data: MissionServiceApi
): ResultErr<MissionServiceFront> =>
    mapEntity<MissionServiceApi, MissionServiceFront>(
        data,
        MissionServiceApiSchema as any,
        MissionServiceFrontSchema as any,
        fromApiInternal
    )
export const MissionServiceToApi = (
    data: MissionServiceFront
): ResultErr<MissionServiceApi> =>
    mapEntity<MissionServiceFront, MissionServiceApi>(
        data,
        MissionServiceFrontSchema as any,
        MissionServiceApiSchema as any,
        toApiInternal
    )

export const MissionServiceNameConverter: { [K in keyof MissionServiceFront]?: string } = {
    id: 'Código',
    antaresId: 'Antares',
    isImportant: "Relevante",
    firefighter: 'Bomberos',
    units: 'Unidades',
    unharmed: "Ilesos",
    injured: "Lesionados",
    transported: "Transportados",
    deceased: "Fallecidos",
}