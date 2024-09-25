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

export const ApiHealthCareCenterSchema = z.object({
  id: z.string().optional().default(''),
  name: z.string().optional().default(''),
  description: z.string().optional().default(''),
  abbreviation: z.string().optional().default(''),
  phones: z.array(z.string()).optional().default([]),
  region_id: z.string().optional().default(''),

  state_id: z.string().optional().default(''),
  state: z.string().optional().default(''),

  municipality_id: z.string().optional().default(''),
  municipality: z.string().optional().default(''),

  parish_id: z.string().optional().default(''),
  parish: z.string().optional().default(''),

  sector_id: z.string().optional().default(''),
  sector: z.string().optional().default(''),

  urb_id: z.string().optional().default(''),
  urb: z.string().optional().default(''),

  street: z.string().optional().default(''),

  address: z.string().optional().default(''),
})

export type ApiHealthCareCenterType = z.infer<typeof ApiHealthCareCenterSchema>
