import { z } from 'zod'

export const StationSchemaBasicData = z.object({
    id: z.string().optional(),
    institution: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    code: z.string().optional(),
    abbreviation: z.string().optional(),
})

export const LocationStationSchema = z.object({
    sector: z.string().optional(),
    community: z.string().optional(),
    street: z.string().optional(),
    beach: z.string().optional(),
    address: z.string().optional(),
})

export type LocationStationSchemaType = z.infer<typeof LocationStationSchema>

export type StationSchemaBasicDataType = z.infer<typeof StationSchemaBasicData>
