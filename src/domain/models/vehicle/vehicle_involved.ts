import { z } from 'zod'

export type TVehicleInvolved = z.infer<typeof VehicleInvolvedSchema>

// agregar verificar!!!!!!!
// agregar verificar!!!!!!!
// agregar verificar!!!!!!!
// agregar verificar!!!!!!!

export const VehicleInvolvedSchema = z.object({
    id: z.string(),
    serviceId: z.string(),
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
