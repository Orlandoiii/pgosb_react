import { MissionApi, MissionFromApi, MissionFront, MissionToApi } from "./mission";

import { useCollection } from "../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../ui/optimized/hooks/useHttpActions";

export function useMissionCollection(): [collection: MissionFront[], actions: HttpActions<MissionFront, MissionApi>, updateCollection: () => void] {
    const [vehicles, actions, updateVehicles] = useCollection({
        endpointCompound: 'mission',
        fromApiMapper: MissionFromApi,
        toApiMapper: MissionToApi,
        type: 'ALL'
    })

    return [vehicles, actions, updateVehicles]
}

export function useMissionActions(){
    return  useHttpActions({ 
        endpointCompound: 'mission',
        fromApiMapper: MissionFromApi,
        toApiMapper: MissionToApi,
    })
}