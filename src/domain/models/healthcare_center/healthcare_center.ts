import { z } from 'zod'

export const HealthCareCenterSchemaBasicData = z.object({

  id:
    z.string()
      .optional(),
  name:
    z.string()
      .optional(),
  description:
    z.string()
      .optional(),
  phones: z.array(z.string()).optional(),
  abbreviation: z.string().optional(),
  region_id: z.string().optional(),



})

// export const LocationHealthCareCenterSchema = z.object({

//   state: z.string().optional(),
//   municipality: z.string().optional(),
//   parish: z.string().optional(),
//   sector: z.string().optional(),
//   urb: z.string().optional(),
//   street: z.string().optional(),
//   address: z.string().optional()

// })

// export type LocationStationSchemaType = z.infer<typeof LocationStationSchema>

export type HealthCareCenterSchemaBasicDataType = z.infer<typeof HealthCareCenterSchemaBasicData>
