import { MissionAuthorityPersonApi, MissionAuthorityPersonFromApi, MissionAuthorityPersonFront, MissionAuthorityPersonToApi } from "./mission_authority_person";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionAuthorityPersonCollection(id?: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionAuthorityPersonFront[], actions: HttpActions<MissionAuthorityPersonFront, MissionAuthorityPersonApi>, updateCollection: () => void] {
    const [autorities, actions, updateAuthorityPerson] = useCollection({
        endpointCompound: 'mission/authority',
        fromApiMapper: MissionAuthorityPersonFromApi,
        toApiMapper: MissionAuthorityPersonToApi,
        type: type,
        id: id ?? ""
    })

    return [autorities, actions, updateAuthorityPerson]
}

export function useMissionAuthorityPersonActions(){
    return  useHttpActions({ 
        endpointCompound: 'mission/authority',
        fromApiMapper: MissionAuthorityPersonFromApi,
        toApiMapper: MissionAuthorityPersonToApi,
    })
}