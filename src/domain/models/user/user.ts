import { z } from 'zod'
import { MartialStatusTypes } from '../../abstractions/enums/martial_status_type'
import { Genders } from '../../abstractions/enums/genders'
import { ResultErr } from '../../abstractions/types/resulterr'

export const UserSchemaBasicData = z
    .object({
        id: z.string().optional(),

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
            .refine((value) => { return !value || !value.toUpperCase().startsWith('V') || (value.toUpperCase().startsWith('V') && value.length >= 8) }, { message: 'Debe tener 7 o más caracteres' })
            .refine((value) => { return !value || !value.toUpperCase().startsWith('V') || (value.toUpperCase().startsWith('V') && value.length <= 11) }, { message: 'Debe tener 10 o menos caracteres' })
            .refine((value) => { return !value || !value.toUpperCase().startsWith('E') || (value.toUpperCase().startsWith('E') && value.length == 10) }, { message: 'Debe tener 9 caracteres' })
            .refine((value) => { return !value || !value.toUpperCase().startsWith('P') || (value.toUpperCase().startsWith('P') && value.length == 15) }, { message: 'Debe tener 14 caracteres' })
            .or(z.string().length(0)),
        phone: z.string().refine((value) => {
            if (!value || value.length == 0)
                return true

            if (value.startsWith('0') && value.length !== 11 || !value.startsWith('0') && value.length !== 10) {
                return false;
            }
            return true
        }, {
            message: 'Número de teléfono invalido',
        }),
        // zip_code: z
        //     .string()
        //     .length(4, 'Debe tener 4 caracteres')
        //     .or(z.string().length(0)),
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

    })


export type UserSchemaBasicDataType = z.infer<typeof UserSchemaBasicData>

export const CharacteristicsSchema = z.object({
    // skills: z
    //     .array(z.string().min(3, 'Debe ser mayor o igual a 3 caracteres'))
    //     .optional(),
    // allergies: z
    //     .array(z.string().min(3, 'Debe ser mayor o igual a 3 caracteres'))
    //     .optional(),
    height: z
        .string()
        .refine(
            (value) => {

                let numberValue = 0;
                if (value)
                    numberValue = Number(value)

                return !value || numberValue >= 0.30
            },
            { message: 'Debe ser mayor o igual a 0.30' }
        )
        .refine(
            (value) => {
                return !value || Number(value) <= 2.50
            },
            { message: 'Debe ser menor o igual a 2.50' }
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

    user_name: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),

    personal_code: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    role: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    rank: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    station: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    division: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),
    profession: z
        .string()
        .min(3, 'Debe ser mayor o igual a 3 caracteres')
        .or(z.string().length(0)),

    user_system: z.boolean().default(false).optional(),

    status_user: z.string().default("INACTIVO").optional(),
})


export type UserSimple = {
    id: string
    name: string
    user_name: string
    rank: string
    personal_code: string
    legal_id: string
    service_role: string
}

export const userNameConverter: { [K in keyof UserSimple]?: string } = {
    // id: 'Id',
    name: 'Nombre',
    // user_name: 'Usuario',
    rank: 'Rango',
    personal_code: 'Equipo',
    legal_id: 'Documento',
    service_role: 'Rol',
}

export const UserSimpleFromApi = (
    data: UserSimple
): ResultErr<UserSimple> => {
    return { success: true, result: data, error: '' }
}

export const UserSimpleToApi = (
    data: UserSimple
): ResultErr<UserSimple> => {
    return { success: true, result: data, error: '' }
}

