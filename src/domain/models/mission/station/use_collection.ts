import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions } from "../../../../ui/optimized/hooks/useHttpActions";
import { ApiStationType } from "../../stations/station";

export function useStationCollection(): [collection: ApiStationType[], actions: HttpActions<ApiStationType, ApiStationType>, updateCollection: () => void] {
    const [stations, actions, updateStations] = useCollection<ApiStationType, ApiStationType>({
        endpointCompound: 'station',
        type: 'ALL'
    })

    return [stations, actions, updateStations]
}