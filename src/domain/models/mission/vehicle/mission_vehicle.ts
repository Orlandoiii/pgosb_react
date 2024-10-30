import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionVehicleApiSchema = z.object({
    id: z.string().default(''),
    mission_id: z.string().default(''),
    vehicle_condition: z.string().default(''),
    make: z.string().default(''),
    model: z.string().default(''),
    year: z.string().default(''),
    plate: z.string().default(''),
    color: z.string().default(''),
    vehicle_type: z.string().default(''),
    motor_serial: z.string().default(''),
    vehicle_verified: z.boolean().default(false),
})

export const MissionVehicleFrontSchema = z.object({
    id: z.string().default(''),
    missionId: z.string().default(''),
    brand: z.string().default(''),
    model: z.string().default(''),
    color: z.string().default(''),
    licensePlate: z.string().default(''),
    year: z.string().default(''),
    condition: z.string().default(''),
    motorSerial: z.string().default(''),
    type: z.string().default(''),
    verified: z.boolean().default(false),
})

export type MissionVehicleApi = z.infer<typeof MissionVehicleApiSchema>
export type MissionVehicleFront = z.infer<typeof MissionVehicleFrontSchema>



function fromApiInternal(data: MissionVehicleApi): MissionVehicleFront {
    return {
        id: data.id,
        missionId: data.mission_id,
        condition: data.vehicle_condition,
        brand: data.make,
        model: data.model,
        year: data.year,
        licensePlate: data.plate,
        color: data.color,
        type: data.vehicle_type,
        motorSerial: data.motor_serial,
        verified: data.vehicle_verified,
    }
}

function toApiInternal(data: MissionVehicleFront): MissionVehicleApi {
    return {
        id: data.id,
        mission_id: data.missionId,
        vehicle_condition: data.condition,
        make: data.brand,
        model: data.model,
        year: data.year,
        plate: data.licensePlate,
        color: data.color,
        vehicle_type: data.type,
        motor_serial: data.motorSerial,
        vehicle_verified: data.verified,
    }
}

export const MissionVehicleFromApi = (
    data: MissionVehicleApi
): ResultErr<MissionVehicleFront> =>
    mapEntity<MissionVehicleApi, MissionVehicleFront>(
        data,
        MissionVehicleApiSchema as any,
        MissionVehicleFrontSchema as any,
        fromApiInternal
    )
export const MissionVehicleToApi = (
    data: MissionVehicleFront
): ResultErr<MissionVehicleApi> =>
    mapEntity<MissionVehicleFront, MissionVehicleApi>(
        data,
        MissionVehicleFrontSchema as any,
        MissionVehicleApiSchema as any,
        toApiInternal
    )

export const MissionVehicleNameConverter: { [K in keyof MissionVehicleFront]?: string } = {
    id: 'Id',
    type: 'Tipo',
    brand: 'Marca',
    model: 'Modelo',
    color: 'Colors',
    year: 'Año',
    licensePlate: 'Placa',
}