import { z } from "zod"
import { CRUD } from "../../../utilities/crud"
import { mapEntity } from "../../../services/mapper"
import { ResultErr } from "../../abstractions/types/resulterr"

export const ApiMissionAuthorityVehicleSchema = z.object({
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

export type ApiMissionAuthorityVehicleType = z.infer<typeof ApiMissionAuthorityVehicleSchema>

export const MissionAuthorityVehicleFromToApi = (data: ApiMissionAuthorityVehicleType): ResultErr<ApiMissionAuthorityVehicleType> =>
    mapEntity<ApiMissionAuthorityVehicleType, ApiMissionAuthorityVehicleType>(
        data,
        ApiMissionAuthorityVehicleSchema as any,
        ApiMissionAuthorityVehicleSchema as any,
        (data: ApiMissionAuthorityVehicleType) => data
    )

export const missionAuthorityVehicleCrud = new CRUD<ApiMissionAuthorityVehicleType>(
    'mission/authority/vehicle',
    MissionAuthorityVehicleFromToApi,
    MissionAuthorityVehicleFromToApi
)

export const MissionAuthorityVehicleNameConverter: {
    [K in keyof ApiMissionAuthorityVehicleType]?: string
} = {
    type: "Tipo",
    make: "Marca",
    model: "Modelo",
    plate: "Placa",
    year: "Año",
    color: "Color"
}