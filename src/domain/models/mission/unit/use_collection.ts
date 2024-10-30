import { MissionUnitApi, MissionUnitFromApi, MissionUnitFront, MissionUnitToApi } from "./mission_unit";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionUnitCollection(id: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionUnitFront[], actions: HttpActions<MissionUnitFront, MissionUnitApi>, updateCollection: () => void] {
    const [units, actions, updateUnits] = useCollection({
        endpointCompound: 'mission/unit',
        fromApiMapper: MissionUnitFromApi,
        toApiMapper: MissionUnitToApi,
        type: type,
        id: id ?? ""
    })

    return [units, actions, updateUnits]
}