import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'

export const AntaresFrontSchema = z.object({
    id: z.string().default(''),
    type: z.string().default(''),
    description: z.string().default(''),
})

export const AntaresApiSchema = z.object({
    id: z.string().default(''),
    type: z.string().default(''),
    description: z.string().default(''),
})

export type TAntares = z.infer<typeof AntaresFrontSchema>
export type TApiAntares = z.infer<typeof AntaresApiSchema>

function fromApiInternal(data: TApiAntares): TAntares {
    return {
        id: data.id,
        type: data.type,
        description: data.description,
    }
}

function toApiInternal(data: TAntares): TApiAntares {
    return {
        id: data.id,
        type: data.type,
        description: data.description,
    }
}

export const AntaresFromApi = (data: TApiAntares): ResultErr<TAntares> =>
    mapEntity<TApiAntares, TAntares>(
        data,
        AntaresApiSchema as any,
        AntaresFrontSchema as any,
        fromApiInternal
    )

export const AntaresToApi = (data: TAntares): ResultErr<TApiAntares> =>
    mapEntity<TAntares, TApiAntares>(
        data,
        AntaresFrontSchema as any,
        AntaresApiSchema as any,
        toApiInternal
    )

export const antaresCrud = new CRUD<TAntares>(
    'mission',
    AntaresToApi,
    AntaresFromApi
)
