import { z } from "zod";

export const UnitSchemaBasicData = z.object({
    id: z.string().optional(),
    

    unity_type: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),

    station: z.string().optional(),


    motor_serial: z.string().optional(),
    vehicle_serial: z.string().optional(),
    fuel_type: z.string().optional(),

    alias: z.string().optional(),
    color: z.string().optional(),
    plate: z.string().optional(),
    year: z.string().optional(),

})

export type UserSchemaBasicDataType = z.infer<typeof UnitSchemaBasicData>


export const CharacteristicsSchema = z.object({


    unity_condition: z.string().optional(),

    capacity: z.string().optional(),
    details: z.string().optional(),
    water_capacity: z.string().optional(),
    observations: z.string().optional(),

})

export type CharacteristicsSchemaType = z.infer<typeof CharacteristicsSchema>


export const UserIntutionalDataSchema = z.object({
    code: z.string().optional(),


});


const UserSchema = z.object({

   

});


