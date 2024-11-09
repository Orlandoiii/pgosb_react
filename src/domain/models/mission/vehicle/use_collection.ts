import { MissionVehicleApi, MissionVehicleFromApi, MissionVehicleFront, MissionVehicleToApi } from "./mission_vehicle";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionVehicleCollection(id: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionVehicleFront[], actions: HttpActions<MissionVehicleFront, MissionVehicleApi>, updateCollection: () => void] {
    const [vehicles, actions, updateVehicles] = useCollection({
        endpointCompound: 'mission/vehicle',
        fromApiMapper: MissionVehicleFromApi,
        toApiMapper: MissionVehicleToApi,
        type: type,
        id: id ?? ""
    })

    return [vehicles, actions, updateVehicles]
}

export function useMissionVehicleActions(){
    return  useHttpActions({ 
        endpointCompound: 'mission/vehicle',
        fromApiMapper: MissionVehicleFromApi,
        toApiMapper: MissionVehicleToApi,
    })
}