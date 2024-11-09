import { MissionAuthorityApi, MissionAuthorityFromApi, MissionAuthorityFront, MissionAuthorityToApi } from "./mission_authority";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions, useHttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useMissionAuthorityCollection(id?: string, type: 'ALL' | 'GROUP' = 'GROUP'): [collection: MissionAuthorityFront[], actions: HttpActions<MissionAuthorityFront, MissionAuthorityApi>, updateCollection: () => void] {
    const [autorities, actions, updateAuthorities] = useCollection({
        endpointCompound: 'mission/authority',
        fromApiMapper: MissionAuthorityFromApi,
        toApiMapper: MissionAuthorityToApi,
        type: type,
        id: id ?? ""
    })

    return [autorities, actions, updateAuthorities]
}

export function useMissionAuthorityActions(){
    return  useHttpActions({ 
        endpointCompound: 'mission/authority',
        fromApiMapper: MissionAuthorityFromApi,
        toApiMapper: MissionAuthorityToApi,
    })
}