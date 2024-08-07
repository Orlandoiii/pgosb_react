import { useEffect, useState } from "react"
import { getAll } from "../../../services/http"
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