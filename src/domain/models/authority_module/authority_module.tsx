import { z } from 'zod'


export const AuthorityModuleSchema = z
    .object({
        id: z.string().optional(),
        name: z.string().min(3, 'Debe ser mayor o igual a 3 caracteres'),
        abbreviation: z.string().min(3, 'Debe ser mayor o igual a 3 caracteres'),
        government: z.string().min(3, 'Debe ser mayor o igual a 3 caracteres'),
    })


export type AuthorityModuleSchemaType = z.infer<typeof AuthorityModuleSchema>
