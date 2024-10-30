import { useCallback, useEffect, useState } from "react"

import { ResultErr } from "../../../domain/abstractions/types/resulterr"
import { HttpActions, useHttpActions } from "./useHttpActions"

type CollectionTypes = 'ALL' | 'SUMMARY' | 'SIMPLE' | 'GROUP' | 'NONE'
interface BaseProps<F, T> {
    endpointCompound: string
    type?: CollectionTypes
    fromApiMapper?: (any) => ResultErr<F>
    toApiMapper?: (any) => ResultErr<T>
    onInsert?: () => void
    onUpdate?: () => void
    onDelete?: () => void
}

interface CollectionGroupProps<F, T> extends BaseProps<F, T> {
    type: 'GROUP'
    id: string
}

interface CollectionProps<F, T> extends BaseProps<F, T> {
    type: 'SIMPLE' | 'SUMMARY' | 'ALL' | 'NONE'
    id?: string
}

export function useCollection<F, T>({ endpointCompound, fromApiMapper, toApiMapper, type, id, onInsert, onUpdate, onDelete }: CollectionGroupProps<F, T> | CollectionProps<F, T>): [F[], HttpActions<F, T>, () => void] {
    const actions = useHttpActions({ endpointCompound, fromApiMapper, toApiMapper })
    const [collection, setCollection] = useState<F[]>([])

    const updateCollection = useCallback(async () => {
        if (type == 'NONE') return

        let response!: ResultErr<F[]>

        if (type == 'ALL') response = await actions.getAll()
        else if (type == 'SUMMARY') response = await actions.getSummary()
        else if (type == 'SIMPLE') response = await actions.getAllSimple()
        else if (type == 'GROUP') response = await actions.getGroup(id)

        if (response.success && response.result)
            setCollection(response.result)
    }, [actions, type, id])

    useEffect(() => {
        updateCollection()
    }, [])

    const insertFrontInternal = useCallback(async (data: F) => {
        const result = await actions.insertFront(data)

        if (result.success) {
            updateCollection()
            onInsert?.()
        }
        return result
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const insertApiInternal = useCallback(async (data: T) => {
        const result = await actions.insertApi(data)

        if (result.success) {
            updateCollection()
            onInsert?.()
        }
        return result
    }, [endpointCompound, fromApiMapper, toApiMapper])



    const updateFrontInternal = useCallback(async (data: F) => {
        const result = await actions.updateFront(data)

        if (result.success) {
            updateCollection()
            onUpdate?.()
        }
        return result
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const updateApiInternal = useCallback(async (data: T) => {
        const result = await actions.updateApi(data)

        if (result.success) {
            updateCollection()
            onUpdate?.()
        }
        return result
    }, [endpointCompound, fromApiMapper, toApiMapper])



    const removeInternal = useCallback(async (id: string) => {
        const result = await actions.remove(id)

        if (result.success) {
            updateCollection()
            onDelete?.()
        }
        return result
    }, [endpointCompound, fromApiMapper, toApiMapper])

    return [collection, {
        ...actions,

        insertFront: insertFrontInternal,
        insertApi: insertApiInternal,

        updateFront: updateFrontInternal,
        updateApi: updateApiInternal,

        remove: removeInternal
    }, 
    updateCollection]
}
