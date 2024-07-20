import { z } from "zod";

export const StationSchemaBasicData = z.object({

    institution: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    phones:  z.array(z.string()).optional(),
    code: z.string().optional(),
    abbreviation: z.string().optional(),
    regions: z.string().optional(),


})

export type StationSchemaBasicDataType = z.infer<typeof StationSchemaBasicData>




