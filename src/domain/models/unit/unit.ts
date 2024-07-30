import { z } from 'zod'

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
                return !value || value.length >= 8
            },
            { message: 'Debe ser igual o mayor a 8 caracteres' }
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
                return !value || value.length >= 14
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
                return !value || value.length >= 4
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
                return !value || value.length >= 6
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
    capacity: z
        .string()
        .optional(),

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
                return !value || value == "" || Number(value) <= 10000
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
