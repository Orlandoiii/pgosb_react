import { useMemo } from 'react'

import { CreateElementFunction } from '../overlay/models/overlay_item'
import { ActionModal } from '../../../utilities/action_modal'
import { CRUD } from '../../../utilities/crud'

export function useActionModal<T, P>(
    modal: CreateElementFunction<P>,
    crud: CRUD<T>,
    baseProps: P,
    groupId: string,
    collectionChanged?: (data: T[]) => void
): ActionModal<T, P> {
    const actionModal = useMemo(
        () =>
            new ActionModal(modal, crud, baseProps, groupId, collectionChanged),
        [modal, baseProps, crud, groupId, collectionChanged]
    )

    return actionModal
}
