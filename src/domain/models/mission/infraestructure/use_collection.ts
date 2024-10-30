import { MissionInfraestructureApi, MissionInfraestructureFromApi, MissionInfraestructureFront, MissionInfraestructureToApi } from "./mission_infraestructure";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionInfraestructureCollection(id: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionInfraestructureFront[], actions: HttpActions<MissionInfraestructureFront, MissionInfraestructureApi>, updateCollection: () => void] {
    const [infraestructures, actions, updateInfraestructures] = useCollection({
        endpointCompound: 'mission/infrastructure',
        fromApiMapper: MissionInfraestructureFromApi,
        toApiMapper: MissionInfraestructureToApi,
        type: type,
        id: id ?? ""
    })

    return [infraestructures, actions, updateInfraestructures]
}