import { MissionLocationApi, MissionLocationFromApi, MissionLocationFront, MissionLocationToApi } from "./mission_location";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionLocationCollection(id?: string, type: 'ALL' | 'GROUP' = 'GROUP',endpoint: string = 'mission/location'): [collection: MissionLocationFront[], actions: HttpActions<MissionLocationFront, MissionLocationApi>, updateCollection: () => void] {
    const [locations, actions, updateLocations] = useCollection({
        endpointCompound: endpoint,
        fromApiMapper: MissionLocationFromApi,
        toApiMapper: MissionLocationToApi,
        type: type,
        id: id ?? ""
    })

    return [locations, actions, updateLocations]
}

export function useMissionLocationActions(endpoint: string = 'mission/location'){
    return  useHttpActions({ 
        endpointCompound: endpoint,
        fromApiMapper: MissionLocationFromApi,
        toApiMapper: MissionLocationToApi,
    })
}