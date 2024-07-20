import { z } from 'zod'
import { MartialStatusTypes } from '../../abstractions/enums/martial_status_type'
import { Genders } from '../../abstractions/enums/genders'

export const UserSchemaBasicData = z.object({
    id: z.number().optional(),
    user_name: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .optional(),
    email: z.string().email('El correo no es valido').optional(),
    first_name: z.string().min(2, 'Debe tener 2 o más caracteres'),
    last_name: z.string().min(2, 'Debe tener 2 o más caracteres'),
    legal_id: z
        .string()
        .min(6, 'Debe ser mayor o igual a 6 caracteres')
        .optional(),
    phone: z
        .string()
        .refine(
            (value) => {
                return !value || !value.startsWith('0')
            },
            { message: 'No debe iniciar con 0' }
        )
        .refine(
            (value) => {
                return !value || value.length != 12
            },
            { message: 'Debe tener 12 caracteres' }
        )
        .optional(),
    zip_code: z.string().length(4, 'Debe tener 4 caracteres').optional(),
    marital_status: z.nativeEnum(MartialStatusTypes),
    birth_date: z
        .string()
        .refine(
            (value) => {
                return (
                    !value ||
                    (value.length == 10 &&
                        Number(value.split('-')[2] ?? '0') > 1940)
                )
            },
            { message: 'El año debe ser mayor a 1940' }
        )
        .optional(),
    gender: z.nativeEnum(Genders).optional(),
    user_system: z.boolean().optional(),
}).refine((value) => {
    return value.user_system && (value.user_name?.length ?? 0) < 3
}, {message: "Debe ser mayor o igual a 3 caracteres"})

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
})

const UserSchema = z.object({})
