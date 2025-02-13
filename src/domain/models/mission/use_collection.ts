import { MissionApi, MissionFromApi, MissionFront, MissionToApi } from "./mission";

import { useCollection } from "../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../ui/optimized/hooks/useHttpActions";

export function useMissionCollection(endpoint: string = 'mission'): [collection: MissionFront[], actions: HttpActions<MissionFront, MissionApi>, updateCollection: () => void] {
    const [vehicles, actions, updateVehicles] = useCollection({
        endpointCompound: endpoint,
        fromApiMapper: MissionFromApi,
        toApiMapper: MissionToApi,
        type: 'ALL'
    })

    return [vehicles, actions, updateVehicles]
}

export function useMissionActions(endpoint: string = 'mission'){
    return  useHttpActions({ 
        endpointCompound: endpoint,
        fromApiMapper: MissionFromApi,
        toApiMapper: MissionToApi,
    })
}
