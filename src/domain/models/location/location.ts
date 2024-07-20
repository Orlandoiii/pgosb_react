import { z } from "zod";

export const LocationSchema = z.object({
    // state: z.string().optional(),
    // municipality: z.string().optional(),
    // parish: z.string().optional(),
    sector: z.string().optional(),
    community: z.string().optional(),
    street: z.string().optional(),
    beach: z.string().optional(),
    address: z.string().optional(),

})


export type LocationSchemaType = z.infer<typeof LocationSchema>




