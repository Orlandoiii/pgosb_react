import { MissionFirefighterApi, MissionFirefighterFromApi, MissionFirefighterFront, MissionFirefighterToApi } from "./mission_firefighter";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionFirefighterCollection(id: string, type: 'ALL' | 'GROUP' | 'SIMPLE' = 'GROUP', endpoint: string = 'mission/firefighter'): [collection: MissionFirefighterFront[], actions: HttpActions<MissionFirefighterFront, MissionFirefighterApi>, updateCollection: () => void] {
    const [firefighters, actions, updateFirefighters] = useCollection({
        endpointCompound: endpoint,
        fromApiMapper: MissionFirefighterFromApi,
        toApiMapper: MissionFirefighterToApi,
        type: type,
        id: id ?? ""
    })

    return [firefighters, actions, updateFirefighters]
}