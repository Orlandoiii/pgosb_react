import { z } from "zod";

export const StationSchemaBasicData = z.object({

    institution: 
    z.string()
    .optional().refine((value) => {
        return !value || value.length >= 5;
      }, { message: 'Debe ser igual o mayor a 5 caracteres' })
      .refine((value) => {
        return value!.length <= 100;
      }, { message: 'Debe ser menor o igual a 100 caracteres' }),

    name: 
    z.string()
    .optional().refine((value) => {
        return !value || value.length >= 5;
      }, { message: 'Debe ser igual o mayor a 5 caracteres' })
      .refine((value) => {
        return value!.length <= 100;
      }, { message: 'Debe ser menor o igual a 140 caracteres' }),

    description: 
    z.string()
    .optional().refine((value) => {
        return !value || value.length >= 5;
      }, { message: 'Debe ser igual o mayor a 5 caracteres' })
      .refine((value) => {
        return value!.length <= 100;
      }, { message: 'Debe ser menor o igual a 240 caracteres' }),

    phones:  z.array(z.number()).optional(),
    code: z.number().optional(),
    abbreviation: z.string().optional(),
    regions: z.string().optional(),


})

export type StationSchemaBasicDataType = z.infer<typeof StationSchemaBasicData>




