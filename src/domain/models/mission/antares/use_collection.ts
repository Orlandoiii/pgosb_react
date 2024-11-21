import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions } from "../../../../ui/optimized/hooks/useHttpActions";
import { TApiAntares } from "../../antares/antares";

export function useAntaresCollection(): [collection: TApiAntares[], actions: HttpActions<TApiAntares, TApiAntares>, updateCollection: () => void] {
    const [antares, actions, updateAntares] = useCollection<TApiAntares, TApiAntares>({
        endpointCompound: 'mission/antares',
        type: 'ALL'
    })

    return [antares, actions, updateAntares]
}