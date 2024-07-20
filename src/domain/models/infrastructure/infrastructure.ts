import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const InfrastructureSchema = z.object({
    id: z.number(),
    serviceId: z.number(),
    buildType: z.string(),
    buildOccupation: z.string(),
    buildArea: z.string(),
    buildAccess: z.string(),
    levels: z.number(),
    people: z.number(),
    goodsType: z.string(),
    buildRoof: z.string(),
    buildWall: z.string(),
    buildFloor: z.string(),
    buildRoomType: z.string(),
    observations: z.string(),
})

export const ApiInfrastructureSchema = z.object({
    id: z.number(),
    service_id: z.number(),
    build_type: z.string(),
    build_occupation: z.string(),
    build_area: z.string(),
    build_access: z.string(),
    levels: z.number(),
    people: z.number(),
    goods_type: z.string(),
    build_roof: z.string(),
    build_wall: z.string(),
    build_floor: z.string(),
    build_room_type: z.string(),
    observations: z.string(),
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
        id: data.id,
        service_id: data.serviceId,
        build_type: data.buildType,
        build_occupation: data.buildOccupation,
        build_area: data.buildArea,
        build_access: data.buildAccess,
        levels: data.levels,
        people: data.people,
        goods_type: data.goodsType,
        build_roof: data.buildRoof,
        build_wall: data.buildWall,
        build_floor: data.buildFloor,
        build_room_type: data.buildRoomType,
        observations: data.observations,
    }
}

export const FromApi = (data: TApiInfrastructure) =>
    mapEntity<TApiInfrastructure, TInfrastructure>(
        data,
        ApiInfrastructureSchema,
        InfrastructureSchema,
        fromApiInternal
    )

export const ToApi = (data: TInfrastructure) =>
    mapEntity<TInfrastructure, TApiInfrastructure>(
        data,
        InfrastructureSchema,
        ApiInfrastructureSchema,
        toApiInternal
    )

export const infrastructureService = new CreateCRUD<TInfrastructure>(
    'mission/infrastructure',
    ToApi,
    FromApi
)
