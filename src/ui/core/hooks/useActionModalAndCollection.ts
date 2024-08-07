import { useCallback, useEffect, useMemo, useState } from 'react'

import { CreateElementFunction } from '../overlay/models/overlay_item'
import { ActionModal } from '../../../utilities/action_modal'
import { useActionModal } from './useActionModal'
import { CRUD } from '../../../utilities/crud'

export function useActionModalAndCollection<T, P>(
    modal: CreateElementFunction<P>,
    crud: CRUD<T>,
    baseProps: P,
    groupId: string
): [ActionModal<T, P>, T[]] {
    const [collection, setCollection] = useState<T[]>([])

    const memoizedSetCollection = useCallback((newCollection: T[]) => {
        setCollection(prevCollection => {
            if (JSON.stringify(prevCollection) !== JSON.stringify(newCollection)) {
                return newCollection;
            }
            return prevCollection;
        });
    }, []);

    const actionModal = useActionModal(
        modal,
        crud,
        baseProps,
        groupId,
        memoizedSetCollection
    )

    useEffect(() => {
        const getCollection = async () => {
            const requestResult = await crud.getGroup(groupId)
            if (requestResult.success && requestResult.result)
                memoizedSetCollection(requestResult.result)
        }
        getCollection()
    },[groupId])

    return [actionModal, collection]
}
