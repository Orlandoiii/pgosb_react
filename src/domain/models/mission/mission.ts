import { number, z } from 'zod'

export type TMission = z.infer<typeof MissionSchema>

export const MissionSchema = z.object({
    id: z.string(),
	antares_id: z.string(),
	created_at: z.string(),
})