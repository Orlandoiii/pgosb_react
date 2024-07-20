import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const VehicleInvolvedSchema = z.object({
    id: z.number().default(0),
    serviceId: z.number().default(0),
    brand: z.string().default(''),
    model: z.string().default(''),
    color: z.string().default(''),
    licensePlate: z.string().default(''),
    year: z.date().default(new Date()),
    condition: z.string().default(''),
    motorSerial: z.string().default(''),
    type: z.string().default(''),
    verified: z.boolean().default(false),
})

export const ApiVehicleInvolvedSchema = z.object({
    id: z.number().default(0),
    service_id: z.number().default(0),
    vehicle_condition: z.string().default(''),
    make: z.string().default(''),
    model: z.string().default(''),
    year: z.date().default(new Date()),
    plate: z.string().default(''),
    color: z.string().default(''),
    vehicle_type: z.string().default(''),
    motor_serial: z.string().default(''),
    vehicle_verified: z.boolean().default(false),
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
        ApiVehicleInvolvedSchema as any,
        VehicleInvolvedSchema as any, 
        fromApiInternal
    )
export const ToApi = (data: TVehicleInvolved) =>
    mapEntity<TVehicleInvolved, TApiVehicleInvolved>(
        data,
        VehicleInvolvedSchema as any,
        ApiVehicleInvolvedSchema as any,
        toApiInternal
    )

export const vehicleService = new CreateCRUD<TVehicleInvolved>(
    'mission/vehicle',
    ToApi,
    FromApi
)
