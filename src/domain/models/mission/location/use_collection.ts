import { MissionLocationApi, MissionLocationFromApi, MissionLocationFront, MissionLocationToApi } from "./mission_location";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionLocationCollection(id?: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionLocationFront[], actions: HttpActions<MissionLocationFront, MissionLocationApi>, updateCollection: () => void] {
    const [locations, actions, updateLocations] = useCollection({
        endpointCompound: 'mission/location',
        fromApiMapper: MissionLocationFromApi,
        toApiMapper: MissionLocationToApi,
        type: type,
        id: id ?? ""
    })

    return [locations, actions, updateLocations]
}

export function useMissionLocationActions(){
    return  useHttpActions({ 
        endpointCompound: 'mission/location',
        fromApiMapper: MissionLocationFromApi,
        toApiMapper: MissionLocationToApi,
    })
}