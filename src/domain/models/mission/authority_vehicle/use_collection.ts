import { MissionAuthorityVehicleApi, MissionAuthorityVehicleFromApi, MissionAuthorityVehicleFront, MissionAuthorityVehicleToApi } from "./mission_authority_vehicle";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionAuthorityVehicleCollection(id?: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionAuthorityVehicleFront[], actions: HttpActions<MissionAuthorityVehicleFront, MissionAuthorityVehicleApi>, updateCollection: () => void] {
    const [autorities, actions, updateAuthorityVehicle] = useCollection({
        endpointCompound: 'mission/authority',
        fromApiMapper: MissionAuthorityVehicleFromApi,
        toApiMapper: MissionAuthorityVehicleToApi,
        type: type,
        id: id ?? ""
    })

    return [autorities, actions, updateAuthorityVehicle]
}

export function useMissionAuthorityVehicleActions(){
    return  useHttpActions({ 
        endpointCompound: 'mission/authority',
        fromApiMapper: MissionAuthorityVehicleFromApi,
        toApiMapper: MissionAuthorityVehicleToApi,
    })
}