import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'

export const InfrastructureSchema = z.object({
    id: z.string().default(''),
    serviceId: z.string().default(''),
    buildType: z.string().default(''),
    buildOccupation: z.string().default(''),
    buildArea: z.string().default(''),
    buildAccess: z.string().default(''),
    levels: z.string().default(''),
    people: z.string().default(''),
    goodsType: z.string().default(''),
    buildRoof: z.string().default(''),
    buildWall: z.string().default(''),
    buildFloor: z.string().default(''),
    buildRoomType: z.string().default(''),
    observations: z.string().default(''),
})

export const ApiInfrastructureSchema = z.object({
    id: z.string().default(''),
    service_id: z.string().default(''),
    build_type: z.string().default(''),
    build_occupation: z.string().default(''),
    build_area: z.string().default(''),
    build_access: z.string().default(''),
    levels: z.string().default(''),
    people: z.string().default(''),
    goods_type: z.string().default(''),
    build_roof: z.string().default(''),
    build_wall: z.string().default(''),
    build_floor: z.string().default(''),
    build_room_type: z.string().default(''),
    observations: z.string().default(''),
})

export type TInfrastructure = z.infer<typeof InfrastructureSchema>
export type TApiInfrastructure = z.infer<typeof ApiInfrastructureSchema>

function fromApiInternal(data: TApiInfrastructure): TInfrastructure {
    return {
        id: data.id,
        serviceId: data.service_id,
        buildType: data.build_type,
        buildOccupation: data.build_occupation,
        buildArea: data.build_area,
        buildAccess: data.build_access,
        levels: data.levels,
        people: data.people,
        goodsType: data.goods_type,
        buildRoof: data.build_roof,
        buildWall: data.build_wall,
        buildFloor: data.build_floor,
        buildRoomType: data.build_room_type,
        observations: data.observations,
    }
}

function toApiInternal(data: TInfrastructure): TApiInfrastructure {
    return {
        id: String(data.id),
        service_id: data.serviceId,
        build_type: data.buildType,
        build_occupation: data.buildOccupation,
        build_area: data.buildArea,
        build_access: data.buildAccess,
        levels: String(data.levels),
        people: String(data.people),
        goods_type: data.goodsType,
        build_roof: data.buildRoof,
        build_wall: data.buildWall,
        build_floor: data.buildFloor,
        build_room_type: data.buildRoomType,
        observations: data.observations,
    }
}

export const InfrastructureFromApi = (
    data: TApiInfrastructure
): ResultErr<TInfrastructure> =>
    mapEntity<TApiInfrastructure, TInfrastructure>(
        data,
        ApiInfrastructureSchema as any,
        InfrastructureSchema as any,
        fromApiInternal
    )

export const InfrastructureToApi = (
    data: TInfrastructure
): ResultErr<TApiInfrastructure> =>
    mapEntity<TInfrastructure, TApiInfrastructure>(
        data,
        InfrastructureSchema as any,
        ApiInfrastructureSchema as any,
        toApiInternal
    )

export const infrastructureCrud = new CRUD<TInfrastructure>(
    'mission/infrastructure',
    InfrastructureToApi,
    InfrastructureFromApi
)

export const infrastructureNameConverter: {
    [K in keyof TInfrastructure]?: string
} = {
    id: 'Id',
    buildType: 'Tipo',
    buildOccupation: 'Ocupacion',
    buildArea: 'Area',
    goodsType: 'Tipo de bien',
    people: 'Personas',
    levels: 'Niveles',
}
