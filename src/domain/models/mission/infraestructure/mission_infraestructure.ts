import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionInfraestructureApiSchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    build_type: z.string().optional().default(''),
    build_occupation: z.string().optional().default(''),
    build_area: z.string().optional().default(''),
    build_access: z.string().optional().default(''),
    levels: z.string().optional().default(''),
    people: z.string().optional().default(''),
    goods_type: z.string().optional().default(''),
    build_roof: z.string().optional().default(''),
    build_wall: z.string().optional().default(''),
    build_floor: z.string().optional().default(''),
    build_room_type: z.string().optional().default(''),
    observations: z.string().optional().default(''),
})

export const MissionInfraestructureFrontSchema = z.object({
    id: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
    buildType: z.string().optional().default(''),
    buildOccupation: z.string().optional().default(''),
    buildArea: z.string().optional().default(''),
    buildAccess: z.string().optional().default(''),
    levels: z.string().optional().default(''),
    people: z.string().optional().default(''),
    goodsType: z.string().optional().default(''),
    buildRoof: z.string().optional().default(''),
    buildWall: z.string().optional().default(''),
    buildFloor: z.string().optional().default(''),
    buildRoomType: z.string().optional().default(''),
    observations: z.string().optional().default(''),
})

export type MissionInfraestructureApi = z.infer<typeof MissionInfraestructureApiSchema>
export type MissionInfraestructureFront = z.infer<typeof MissionInfraestructureFrontSchema>



function fromApiInternal(data: MissionInfraestructureApi): MissionInfraestructureFront {
    return {
        id: data.id,
        missionId: data.mission_id,
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

function toApiInternal(data: MissionInfraestructureFront): MissionInfraestructureApi {
    return {
        id: String(data.id),
        mission_id: data.missionId,
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

export const MissionInfraestructureFromApi = (
    data: MissionInfraestructureApi
): ResultErr<MissionInfraestructureFront> =>
    mapEntity<MissionInfraestructureApi, MissionInfraestructureFront>(
        data,
        MissionInfraestructureApiSchema as any,
        MissionInfraestructureFrontSchema as any,
        fromApiInternal
    )
export const MissionInfraestructureToApi = (
    data: MissionInfraestructureFront
): ResultErr<MissionInfraestructureApi> =>
    mapEntity<MissionInfraestructureFront, MissionInfraestructureApi>(
        data,
        MissionInfraestructureFrontSchema as any,
        MissionInfraestructureApiSchema as any,
        toApiInternal
    )

export const MissionInfraestructureNameConverter: { [K in keyof MissionInfraestructureFront]?: string } = {
    id: 'Id',
    buildType: 'Tipo',
    buildOccupation: 'Ocupacion',
    buildArea: 'Area',
    goodsType: 'Tipo de bien',
    people: 'Personas',
    levels: 'Niveles',
}