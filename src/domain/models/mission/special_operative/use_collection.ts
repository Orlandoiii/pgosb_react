import { useCollection } from '../../../../ui/optimized/hooks/useCollection'

export function useSpecialOperativeCollection(): [collection: string[]] {
    const [collection] = useCollection<string, string>({
        endpointCompound: 'mission/special-operations',
        type: 'ALL',
    })

    return [collection]
}
