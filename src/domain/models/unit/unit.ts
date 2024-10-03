import { z } from 'zod'
import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'

export const UnitSchemaBasicData = z.object({
    id: z.string().optional(),

    unit_type: z
        .string({
            required_error: 'El tipo de unidad es requerida',
        })
        .optional(),

    // make: z
    //     .string({
    //         required_error: 'La marca de la unidad es requerida',
    //     })
    //     .optional(),

    // model: z.string({
    //     required_error: 'El modelo de la unidad es obligatorio',
    // }),

    // station: z.string({
    //     required_error: 'El modelo de la unidad es obligatorio',
    // }),

    motor_serial: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || value.length >= 2
            },
            { message: 'Debe ser igual o mayor a 2 caracteres' }
        )
        .refine(
            (value) => {
                return value!.length <= 16
            },
            { message: 'Debe ser menor o igual a 16 caracteres' }
        ),

    vehicle_serial: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || value.length >= 2
            },
            { message: 'Debe ser igual o mayor a 14 caracteres' }
        )
        .refine(
            (value) => {
                return value!.length <= 17
            },
            { message: 'Debe ser menor o igual a 17 caracteres' }
        ),

    fuel_type: z.string().optional(),

    alias: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || value.length >= 2
            },
            { message: 'Debe ser igual o mayor a 4 caracteres' }
        )
        .refine(
            (value) => {
                return value!.length <= 17
            },
            { message: 'Debe ser menor o igual a 17 caracteres' }
        ),

    color: z.string().optional(),

    plate: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || value.length >= 2
            },
            { message: 'Debe ser igual o mayor a 6 caracteres' }
        )
        .refine(
            (value) => {
                return value!.length <= 7
            },
            { message: 'Debe ser menor o igual a 7 caracteres' }
        ),

    //PENDIENTE POR MEJORAR, SE DEBE VALIDAR QUE EL VALOR SEA MAYOR A 1950 y MENOR AL AÑO ACTUAL 2025
    year: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || Number(value) > 1950
            },
            { message: 'Debe ser mayor a 1950' }
        )
        .refine((value) => {
            return (
                !value || Number(value) < new Date().getFullYear(),
                {
                    message: `Debe ser menor o igual a ${new Date().getFullYear()}`,
                }
            )
        }),
})
export type UnitSchemaBasicDataType = z.infer<typeof UnitSchemaBasicData>

export const UnitCharacteristicsSchema = z.object({
    purpose: z.string().optional(),

    //PEOPLE CAPACITY
    capacity: z.string().optional(),

    hurt_capacity: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || Number(value) < 100
            },
            { message: 'Debe ser menor a 100' }
        ),
    doors: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || Number(value) < 100
            },
            { message: 'Debe ser menor a 100' }
        ),
    performance: z.string().optional(),

    load_capacity: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || Number(value) < 100
            },
            { message: 'Debe ser menor a 100' }
        ),
    water_capacity: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || value == '' || Number(value) <= 10000
            },
            { message: 'Debe ser menor o igual a 10.000' }
        ),
    init_kilometer: z
        .string()
        .optional()
        .refine(
            (value) => {
                return !value || Number(value) < 100
            },
            { message: 'Debe ser menor a 100' }
        ),

    // details: z.array(z.string()).optional(),
    unit_condition: z.string().optional(),

    observations: z.string().optional(),
})

export type UnitCharacteristicsSchemaType = z.infer<
    typeof UnitCharacteristicsSchema
>

function fromApiInternal(
    data: UnitCharacteristicsSchemaType
): UnitCharacteristicsSchemaType {
    return data
}

function toApiInternal(
    data: UnitCharacteristicsSchemaType
): UnitCharacteristicsSchemaType {
    return data
}

export const InitFromApi = (
    data: UnitCharacteristicsSchemaType
): ResultErr<UnitCharacteristicsSchemaType> =>
    mapEntity<UnitCharacteristicsSchemaType, UnitCharacteristicsSchemaType>(
        data,
        UnitCharacteristicsSchema as any,
        UnitCharacteristicsSchema as any,
        fromApiInternal
    )

export const InfrastructureToApi = (
    data: UnitCharacteristicsSchemaType
): ResultErr<UnitCharacteristicsSchemaType> =>
    mapEntity<UnitCharacteristicsSchemaType, UnitCharacteristicsSchemaType>(
        data,
        UnitCharacteristicsSchema as any,
        UnitCharacteristicsSchema as any,
        toApiInternal
    )

export type UnitSimple = {
    id: string,
	plate: string,
	station: string,
	unit_type: string,
	alias: string,
}

export const unitNameConverter: { [K in keyof UnitSimple]?: string } = {
    // id: 'Id',
    plate: 'Placa',
    station: 'Estación',
    unit_type: 'Tipo',
    alias: 'Alias'
}

export const UnitSimpleFromApi = (data: UnitSimple): ResultErr<UnitSimple> => {
    return { success: true, result: data, error: '' }
}

export const UnitSimpleToApi = (data: UnitSimple): ResultErr<UnitSimple> => {
    return { success: true, result: data, error: '' }
}
