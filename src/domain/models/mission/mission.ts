import { number, z } from 'zod'

export type TMission = z.infer<typeof MissionSchema>

export const MissionSchema = z.object({
    id: z.string(),
	mission_id: z.string(),
	antares: z.string(),
	units: z.array(z.number().int()),
	bombers: z.array(z.number().int()),
	summary: z.string(),
	description: z.string(),
})