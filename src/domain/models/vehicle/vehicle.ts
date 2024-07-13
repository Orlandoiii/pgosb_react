import { z, ZodSchema,  ZodObject} from 'zod'

export type TVehicle = z.infer<typeof VehicleSchema>

export const VehicleSchema = z.object({
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