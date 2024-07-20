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


export const UbicationSchema = z.object({

    state_id: z.string().optional(),
    municipality_id: z.string().optional(),
    parish_id: z.string().optional(),
    coordinates: z.string().optional(),
    sector: z.string().optional(),
    community: z.string().optional(),
    street: z.string().optional(),
    address: z.string().optional(),

})

export type CharacteristicsSchemaType = z.infer<typeof UbicationSchema>


export const UserIntutionalDataSchema = z.object({

    code: z.string().optional(),

});


const UserSchema = z.object({

   

});


