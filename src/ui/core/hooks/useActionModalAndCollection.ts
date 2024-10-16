import { useCallback, useEffect, useMemo, useState } from 'react'

import { CreateElementFunction } from '../overlay/models/overlay_item'
import { ActionModal } from '../../../utilities/action_modal'
import { useActionModal } from './useActionModal'
import { CRUD } from '../../../utilities/crud'
import { modalService } from '../overlay/overlay_service'

export function useActionModalAndCollection<T, P>(
    modal: CreateElementFunction<P>,
    crud: CRUD<T>,
    baseProps: P,
    groupId: string,
): [ActionModal<T, P>, T[], React.Dispatch<React.SetStateAction<T[]>>] {
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
    }, [groupId])

    return [actionModal, collection, setCollection]
}


export function useCollectionActions<T, P>(
    crud: CRUD<T>,
    groupId: string,
): [T[], {
    insert: (data: T) => void,
    update: (data: T) => void,
    remove: (id: string) => void
}] {
    const [collection, setCollection] = useState<T[]>([])

    const memoizedSetCollection = useCallback((newCollection: T[]) => {
        setCollection(prevCollection => {
            if (JSON.stringify(prevCollection) !== JSON.stringify(newCollection)) {
                return newCollection;
            }
            return prevCollection;
        });
    }, []);

    const getCollection = async () => {
        const requestResult = await crud.getGroup(groupId)
        if (requestResult.success && requestResult.result)
            memoizedSetCollection(requestResult.result)
    }

    useEffect(() => {
        getCollection()
    }, [groupId])

    async function insertIntoCollection(data: T) {
        const result = await crud.insert(data)
        if (result.success) getCollection();
        else {
            modalService.toastError("No se pudo agregar el registro");
            console.log("No se pudo agregar el registro", result.error);
        }
    }

    async function updateIntoCollection(data: T) {
        const result = await crud.update(data)
        if (result.success) getCollection();
        else {
            modalService.toastError("No se pudo actualizar el registro");
            console.log("No se pudo actualizar el registro", result.error);
        }
    }

    async function removeFromCollection(id: string) {
        const result = await crud.remove(id)
        if (result.success) getCollection();
        else {
            modalService.toastError("No se pudo eliminar el registro");
            console.log("No se pudo eliminar el registro", result.error);
        }
    }

    return [collection, {
        insert: insertIntoCollection,
        update: updateIntoCollection,
        remove: removeFromCollection
    }]
}
