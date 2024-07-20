import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const VehicleInvolvedSchema = z.object({
    id: z.number(),
    serviceId: z.number(),
    brand: z.string(),
    model: z.string(),
    color: z.string(),
    licensePlate: z.string(),
    year: z.date(),
    condition: z.string(),
    motorSerial: z.string(),
    type: z.string(),
    verified: z.boolean(),
})

export const ApiVehicleInvolvedSchema = z.object({
    id: z.number(),
    service_id: z.number(),
    vehicle_condition: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.date(),
    plate: z.string(),
    color: z.string(),
    vehicle_type: z.string(),
    motor_serial: z.string(),
    vehicle_verified: z.boolean(),
})

export type TVehicleInvolved = z.infer<typeof VehicleInvolvedSchema>
export type TApiVehicleInvolved = z.infer<typeof ApiVehicleInvolvedSchema>

function fromApiInternal(data: TApiVehicleInvolved): TVehicleInvolved {
    return {
        id: data.id,
        serviceId: data.service_id,
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

function toApiInternal(data: TVehicleInvolved): TApiVehicleInvolved {
    return {
        id: data.id,
        service_id: data.serviceId,
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

export const FromApi = (data: TApiVehicleInvolved) =>
    mapEntity<TApiVehicleInvolved, TVehicleInvolved>(
        data,
        ApiVehicleInvolvedSchema,
        VehicleInvolvedSchema,
        fromApiInternal
    )
export const ToApi = (data: TVehicleInvolved) =>
    mapEntity<TVehicleInvolved, TApiVehicleInvolved>(
        data,
        VehicleInvolvedSchema,
        ApiVehicleInvolvedSchema,
        toApiInternal
    )

export const vehicleService = new CreateCRUD<TVehicleInvolved>(
    'mission/vehicle',
    ToApi,
    FromApi
)
