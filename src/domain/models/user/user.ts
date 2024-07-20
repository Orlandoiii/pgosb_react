import { z } from "zod";
import { MartialStatusTypes } from "../../abstractions/enums/martial_status_type";
import { Genders } from "../../abstractions/enums/genders";


export const UserSchemaBasicData = z.object({
    id: z.number().optional(),
    user_name: z.string().optional(),
    email: z.string().email().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    legal_id: z.string().optional(),
    phone: z.string().optional(),
    zip_code: z.string().optional(),
    marital_status: z.nativeEnum(MartialStatusTypes),
    birth_date: z.string().optional(),
    gender: z.nativeEnum(Genders).optional(),
    user_system: z.boolean().optional(),

})

export type UserSchemaBasicDataType = z.infer<typeof UserSchemaBasicData>


export const CharacteristicsSchema = z.object({
    skills: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    height: z.string().nullable().optional(),
    weight: z.string().nullable().optional(),
    blood_type: z.string().optional(),
    shirt_size: z.string().optional(),
    pant_size: z.string().optional(),
    shoe_size: z.string().nullable().optional(),
})

export type CharacteristicsSchemaType = z.infer<typeof CharacteristicsSchema>


export const UserIntutionalDataSchema = z.object({

    code: z.string().optional(),
    rol: z.string().optional(),
    rank: z.string().optional(),
    institution: z.string().optional(),
    division: z.string().optional(),
    profesion: z.string().optional(),

});


const UserSchema = z.object({



});


