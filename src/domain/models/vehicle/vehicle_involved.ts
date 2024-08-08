import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'
import { zodEmptyOrGreaterThan } from '../../../utilities/zod/empty_string'

export const VehicleInvolvedSchema = z.object({
    id: zodEmptyOrGreaterThan(0),
    serviceId: zodEmptyOrGreaterThan(0),
    brand: zodEmptyOrGreaterThan(3),
    model: zodEmptyOrGreaterThan(3),
    color: zodEmptyOrGreaterThan(3),
    licensePlate: zodEmptyOrGreaterThan(5),
    year: z.coerce.string().default(''),
    condition: zodEmptyOrGreaterThan(3),
    motorSerial: zodEmptyOrGreaterThan(8),
    type: zodEmptyOrGreaterThan(3),
    verified: z.boolean().default(false),
})

export const ApiVehicleInvolvedSchema = z.object({
    id: z.string().default(''),
    service_id: z.string().default(''),
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

export const FromApi = (
    data: TApiVehicleInvolved
): ResultErr<TVehicleInvolved> =>
    mapEntity<TApiVehicleInvolved, TVehicleInvolved>(
        data,
        ApiVehicleInvolvedSchema as any,
        VehicleInvolvedSchema as any,
        fromApiInternal
    )
export const ToApi = (data: TVehicleInvolved): ResultErr<TApiVehicleInvolved> =>
    mapEntity<TVehicleInvolved, TApiVehicleInvolved>(
        data,
        VehicleInvolvedSchema as any,
        ApiVehicleInvolvedSchema as any,
        toApiInternal
    )

export const vehicleCrud = new CRUD<TVehicleInvolved>(
    'mission/vehicle',
    ToApi,
    FromApi
)

export const vehicleNameConverter: { [K in keyof TVehicleInvolved]?: string } =
    {
        id: 'Id',
        type: 'Tipo',
        brand: 'Marca',
        model: 'Modelo',
        color: 'Colors',
        year: 'Año',
        licensePlate: 'Placa',
    }
