import { useEffect, useState } from "react"
import { getAll, getAllSimple, getGroup } from "../../../services/http"
import { ResultErr } from "../../../domain/abstractions/types/resulterr"

export function useCollection<T>(endpoint: string, mapper: (any) => ResultErr<T>): T[]{
    const [collection, setCollection] = useState<T[]>([])

    useEffect(() => {
        const getAntares = async () => {
            const response = await getAll<T>(
                endpoint,
                mapper
            )
            if (response.success && response.result)
                setCollection(response.result)
        }
        getAntares()
    }, [])

    return collection
}


export function useSimpleCollection<T>(endpoint: string, mapper?: (any) => ResultErr<T>): T[]{
    const [collection, setCollection] = useState<T[]>([])

    useEffect(() => {
        const getAntares = async () => {
            const response = await getAllSimple<T>(
                endpoint,
                mapper
            )
            
            if (response.success && response.result)
                setCollection(response.result)
        }
        getAntares()
    }, [])

    return collection
}

export function useGroup<T>(endpoint: string, id: string,mapper: (any) => ResultErr<T>): [T[], () => void]{
    const [collection, setCollection] = useState<T[]>([])

    const updateCollection = async () => {
        const response = await getGroup<T>(
            endpoint,
            id,
            mapper
        )
        if (response.success && response.result)
            setCollection(response.result)
    }

    useEffect(() => {
        updateCollection()
    }, [])

    return [collection , updateCollection]
}