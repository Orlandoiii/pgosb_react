import { MissionPersonApi, MissionPersonFromApi, MissionPersonFront, MissionPersonToApi } from "./mission_person";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionPersonCollection(id: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionPersonFront[], actions: HttpActions<MissionPersonFront, MissionPersonApi>, updateCollection: () => void] {
    const [people, actions, updatePeople] = useCollection({
        endpointCompound: 'mission/person',
        fromApiMapper: MissionPersonFromApi,
        toApiMapper: MissionPersonToApi,
        type: type,
        id: id ?? ""
    })

    return [people, actions, updatePeople]
}