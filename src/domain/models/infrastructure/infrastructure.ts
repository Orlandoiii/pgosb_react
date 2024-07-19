import { z } from 'zod'

import { Goods } from '../../abstractions/enums/goods'


export const InfrastructureValidator = z.object({
    id: z.string(),
    service_id: z.string(),
    build_type: z.string(),
    build_occupation: z.string(),
    build_area: z.string(),
    build_access: z.string(),
    levels: z.string(),
    people: z.string(),
    goods_type: z.string(),
    build_roof: z.string(),
    build_wall: z.string(),
    build_floor: z.string(),
    build_room_type: z.string(),
    observations: z.string(),
})

export type TInfrastructure = z.infer<typeof InfrastructureValidator>