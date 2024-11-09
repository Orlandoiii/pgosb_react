import { ApiHealthCareCenterType } from "../../healthcare_center/healthcare_center";
import { useCollection } from "../../../../ui/optimized/hooks/useCollection";
import { HttpActions } from "../../../../ui/optimized/hooks/useHttpActions";

export function useHealthCareCenterCollection(): [collection: ApiHealthCareCenterType[], actions: HttpActions<ApiHealthCareCenterType, ApiHealthCareCenterType>, updateCollection: () => void] {
    const [healtCareCenters, actions, updateHealtCareCenters] = useCollection<ApiHealthCareCenterType, ApiHealthCareCenterType>({
        endpointCompound: 'center',
        type: 'ALL'
    })

    return [healtCareCenters, actions, updateHealtCareCenters]
}