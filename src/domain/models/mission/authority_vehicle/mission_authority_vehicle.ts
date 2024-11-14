import { z } from "zod"

import { ResultErr } from "../../../abstractions/types/resulterr"
import { mapEntity } from "../../../../services/mapper"

export const MissionAuthorityVehicleApiSchema = z.object({
    id: z.string().optional().default(''),
    mission_id: z.string().optional().default(''),
    authority_id: z.string().optional().default(''),
    type: z.string().optional().default(''),
    make: z.string().optional().default(''),
    model: z.string().optional().default(''),
    plate: z.string().optional().default(''),
    year: z.string().optional().default(''),
    color: z.string().optional().default(''),
    description: z.string().optional().default(''),
})

export const MissionAuthorityVehicleFrontSchema = z.object({
    id: z.string().optional().default(''),
    missionId: z.string().optional().default(''),
    authorityId: z.string().optional().default(''),
    type: z.string().optional().default(''),
    make: z.string().optional().default(''),
    model: z.string().optional().default(''),
    plate: z.string().optional().default(''),
    year: z.string().optional().default(''),
    color: z.string().optional().default(''),
    description: z.string().optional().default(''),
})


export type MissionAuthorityVehicleApi = z.infer<typeof MissionAuthorityVehicleApiSchema>
export type MissionAuthorityVehicleFront = z.infer<typeof MissionAuthorityVehicleFrontSchema>



function fromApiInternal(data: MissionAuthorityVehicleApi): MissionAuthorityVehicleFront {
    return {
        id: data.id ,
        missionId: data.mission_id ,
        authorityId: data.authority_id ,
        type: data.type ,
        make: data.make ,
        model: data.model ,
        plate: data.plate ,
        year: data.year ,
        color: data.color ,
        description: data.description 
    }
}

function toApiInternal(data: MissionAuthorityVehicleFront): MissionAuthorityVehicleApi {
    return {
        id: data.id ,
        mission_id: data.missionId ,
        authority_id: data.authorityId ,
        type: data.type ,
        make: data.make ,
        model: data.model ,
        plate: data.plate ,
        year: data.year ,
        color: data.color ,
        description: data.description 
    }
}

export const MissionAuthorityVehicleFromApi = (
    data: MissionAuthorityVehicleApi
): ResultErr<MissionAuthorityVehicleFront> =>
    mapEntity<MissionAuthorityVehicleApi, MissionAuthorityVehicleFront>(
        data,
        MissionAuthorityVehicleApiSchema as any,
        MissionAuthorityVehicleFrontSchema as any,
        fromApiInternal
    )
export const MissionAuthorityVehicleToApi = (
    data: MissionAuthorityVehicleFront
): ResultErr<MissionAuthorityVehicleApi> =>
    mapEntity<MissionAuthorityVehicleFront, MissionAuthorityVehicleApi>(
        data,
        MissionAuthorityVehicleFrontSchema as any,
        MissionAuthorityVehicleApiSchema as any,
        toApiInternal
    )

export const MissionAuthorityNameConverter: {
    [K in keyof MissionAuthorityVehicleFront]?: string
} = {
    type: "Tipo",
    make: "Marca",
    model: "Modelo",
    plate: "Placa",
    year: "Año",
    color: "Color"
}