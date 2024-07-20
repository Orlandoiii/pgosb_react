import { z } from 'zod'
import { MartialStatusTypes } from '../../abstractions/enums/martial_status_type'
import { Genders } from '../../abstractions/enums/genders'

export const UserSchemaBasicData = z
    .object({
        id: z.string().optional(),
        user_name: z
            .string()
            .min(3, 'Debe ser mayor o igual a 3 caracteres')
            .or(z.string().length(0)),
        email: z
            .string()
            .email('El correo no es valido')
            .or(z.string().length(0)),
        first_name: z
            .string()
            .min(2, 'Debe ser mayor o igual a 2 caracteres')
            .or(z.string().length(0)),
        last_name: z
            .string()
            .min(2, 'Debe ser mayor o igual a 2 caracteres')
            .or(z.string().length(0)),
        legal_id: z
            .string()
            .min(6, 'Debe ser mayor o igual a 6 caracteres')
            .or(z.string().length(0)),
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
        zip_code: z
            .string()
            .length(4, 'Debe tener 4 caracteres')
            .or(z.string().length(0)),
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
        user_system: z.boolean().default(false).optional(),
    })
    .refine(
        (value) => {
            return (
                (value.user_system && value.user_name.length >= 3) ||
                !value.user_system
            )
        },
        {
            path: ['user_name'],
            message: 'Debe ser mayor o igual a 3 caracteres',
        }
    )

export type UserSchemaBasicDataType = z.infer<typeof UserSchemaBasicData>

export const CharacteristicsSchema = z.object({
    skills: z
        .array(z.string().min(3, 'Debe ser mayor o igual a 3 caracteres'))
        .optional(),
    allergies: z
        .array(z.string().min(3, 'Debe ser mayor o igual a 3 caracteres'))
        .optional(),
    height: z
        .string()
        .refine(
            (value) => {
                return !value || Number(value) >= 30
            },
            { message: 'Debe ser mayor o igual a 30' }
        )
        .refine(
            (value) => {
                return !value || Number(value) <= 240
            },
            { message: 'Debe ser menor o igual a 240' }
        )
        .optional(),
    weight: z
        .string()
        .refine(
            (value) => {
                return !value || Number(value) >= 30
            },
            { message: 'Debe ser mayor o igual a 30' }
        )
        .refine(
            (value) => {
                return !value || Number(value) <= 250
            },
            { message: 'Debe ser menor o igual a 250' }
        )
        .optional(),
    blood_type: z.string().optional(),
    shirt_size: z.string().optional(),
    pant_size: z.string().optional(),
    shoe_size: z.string().nullable().optional(),
})

export type CharacteristicsSchemaType = z.infer<typeof CharacteristicsSchema>

export const UserIntutionalDataSchema = z.object({
    code: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    rol: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    rank: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    institution: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    division: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    profesion: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
})

const UserSchema = z.object({})
