import { z } from 'zod'

import { Goods } from '../../abstractions/enums/goods'

export class Infrastructure {
    tipo: string
    ocupacion: string
    area: string
    acceso: string
    clima: string
    pisos: string
    habitaciones: string
    paredes: string
    piso: string
    techo: string
    menores: string
    adultos: string
    trabajadores: string
    id_edificacion: string
    bienes: Goods
    valor_mueble: string
    perdidas_mueble: string
    valor_inmueble: string
    perdidas_inmueble: string
    habitacion: string
    bano: string
    sala: string
    comedor: string
    cocina: string
    sala_comedor: string
    garaje: string
    oficina: string
    ambiente: string
    observaciones: string
}

export const InfrastructureValidator = z.object({
    tipo: z.string(),
    ocupacion: z.string(),
    area: z.string(),
    acceso: z.string(),
    clima: z.string(),
    pisos: z.string(),
    habitaciones: z.string(),
    paredes: z.string(),
    piso: z.string(),
    techo: z.string(),
    menores: z.string(),
    adultos: z.string(),
    trabajadores: z.string(),
    id_edificacion: z.string(),
    bienes: z.enum([Goods.Private, Goods.Public]),
    valor_mueble: z.string(),
    perdidas_mueble: z.string(),
    valor_inmueble: z.string(),
    perdidas_inmueble: z.string(),
    habitacion: z.string(),
    bano: z.string(),
    sala: z.string(),
    comedor: z.string(),
    cocina: z.string(),
    sala_comedor: z.string(),
    garaje: z.string(),
    oficina: z.string(),
    ambiente: z.string(),
    observaciones: z.string(),
})


