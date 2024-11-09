import { useCallback } from "react"

import { get, getAll, getAllSimple, getById, getGroup, getSummary, insert, remove, update } from "../../../services/http"
import { ResultErr } from "../../../domain/abstractions/types/resulterr"

interface Props<F, T> {
    endpointCompound: string
    fromApiMapper?: (data: T) => ResultErr<F>
    toApiMapper?: (data: F) => ResultErr<T>
}

export interface HttpActions<F, T> {
    getAll: () => Promise<ResultErr<F[]>>
    getSummary: () => Promise<ResultErr<F[]>>
    getAllSimple: () => Promise<ResultErr<F[]>>
    getGroup: (id: string) => Promise<ResultErr<F[]>>

    get: () => Promise<ResultErr<F>>
    getById: (id: string) => Promise<ResultErr<F>>

    insertFront: (data: F) => Promise<ResultErr<F>>
    insertApi: (data: T) => Promise<ResultErr<F>>

    updateFront: (data: F) => Promise<ResultErr<F>>
    updateApi: (data: T) => Promise<ResultErr<F>>

    remove: (id: string) => Promise<ResultErr<F>>
}

export function useHttpActions<F, T>({ endpointCompound, fromApiMapper = undefined, toApiMapper = undefined }: Props<F, T>): HttpActions<F, T> {


    const getAllCall = useCallback(async () => {
        return getAll<F>(endpointCompound, fromApiMapper)
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const getSummaryCall = useCallback(async () => {
        return getSummary<F>(endpointCompound, fromApiMapper)
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const getAllSimpleCall = useCallback(async () => {
        return getAllSimple<F>(endpointCompound, fromApiMapper)
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const getGroupCall = useCallback(async (id: string) => {
        return getGroup<F>(endpointCompound, id, fromApiMapper)
    }, [endpointCompound, fromApiMapper, toApiMapper])


    function defaultFromApi(data: any): ResultErr<F> {
        return { success: true, result: data }
    }

    function defaultToApi(data: any): ResultErr<T> {
        return { success: true, result: data }
    }

    fromApiMapper = fromApiMapper ? fromApiMapper : defaultFromApi
    toApiMapper = toApiMapper ? toApiMapper : defaultToApi

    const getCall = useCallback(async () => {
        return get<F>(endpointCompound, fromApiMapper)
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const getByIdCall = useCallback(async (id: string) => {
        return getById<F>(endpointCompound, id, fromApiMapper)
    }, [endpointCompound, fromApiMapper, toApiMapper])



    const insertFrontModelCall = useCallback(async (data: F) => {
        const mapped = toApiMapper(data)

        if (mapped.success) {
            const result = await insert<T>(endpointCompound, mapped.result)
            if (!result.success || typeof result.result != 'object') return result as any as ResultErr<F>
            return fromApiMapper(result.result)
        }
        else return { success: false, error: 'El mapeo no fue satisfactorio' }
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const insertApiModelCall = useCallback(async (data: T) => {
        const result = await insert<T>(endpointCompound, data)
        if (!result.success || typeof result.result != 'object') return result as any as ResultErr<F>
        return fromApiMapper(result.result)
    }, [endpointCompound, fromApiMapper, toApiMapper])



    const updateFrontModelCall = useCallback(async (data: F) => {
        const mapped = toApiMapper(data)

        if (mapped.success) {
            const result = await update<T>(endpointCompound, mapped.result)
            if (!result.success || typeof result.result != 'object') return result as any as ResultErr<F>
            return fromApiMapper(result.result)
        }
        else return { success: false, error: 'El mapeo no fue satisfactorio' }
    }, [endpointCompound, fromApiMapper, toApiMapper])
    const updateApiModelCall = useCallback(async (data: T) => {
        const result = await update<T>(endpointCompound, data)
        if (!result.success || typeof result.result != 'object') return result as any as ResultErr<F>
        return fromApiMapper(result.result)
    }, [endpointCompound, fromApiMapper, toApiMapper])




    const removeCall = useCallback(async (id: string) => {
        return remove<F>(endpointCompound, id)
    }, [endpointCompound, fromApiMapper, toApiMapper])


    return {
        getAll: getAllCall,
        getSummary: getSummaryCall,
        getAllSimple: getAllSimpleCall,
        getGroup: getGroupCall,

        get: getCall,
        getById: getByIdCall,

        insertFront: insertFrontModelCall,
        insertApi: insertApiModelCall,

        updateFront: updateFrontModelCall,
        updateApi: updateApiModelCall,

        remove: removeCall
    }
}