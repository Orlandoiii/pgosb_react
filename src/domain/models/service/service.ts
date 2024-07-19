import { z } from 'zod'

export type TService = z.infer<typeof ServiceSchema>

export const ServiceSchema = z.object({
    id: z.string(),
	mission_id: z.string(),
	antares_id: z.number(),
	units: z.number(),
	firefighter: z.number(),
	summary: z.string(),
	description: z.string(),
})