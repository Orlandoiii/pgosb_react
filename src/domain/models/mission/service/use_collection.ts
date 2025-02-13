import { MissionServiceApi, MissionServiceFromApi, MissionServiceFront, MissionServiceToApi } from "./mission_service";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionServiceCollection(id: string, type: 'ALL' | 'GROUP' = 'GROUP',endpoint: string = 'mission/service'): [collection: MissionServiceFront[], actions: HttpActions<MissionServiceFront, MissionServiceApi>, updateCollection: () => void] {
    const [services, actions, updateServices] = useCollection({
        endpointCompound: endpoint,
        fromApiMapper: MissionServiceFromApi,
        toApiMapper: MissionServiceToApi,
        type: type,
        id: id ?? ""
    })

    return [services, actions, updateServices]
}

export function useMissionServiceActions(endpoint: string = 'mission/service') {
    return useHttpActions({
        endpointCompound: endpoint,
        fromApiMapper: MissionServiceFromApi,
        toApiMapper: MissionServiceToApi,
    })
}