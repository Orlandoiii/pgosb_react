import { z } from 'zod'

import { ResultErr } from '../../abstractions/types/resulterr'
import { mapEntity } from '../../../services/mapper'
import { CRUD } from '../../../utilities/crud'

export const AntaresSchema = z.object({
    id: z.string().default(''),
    type: z.string().default(''),
    description: z.string().default(''),
})

export const ApiAntaresSchema = z.object({
    id: z.string().default(''),
    type: z.string().default(''),
    description: z.string().default(''),
})

export type TAntares = z.infer<typeof AntaresSchema>
export type TApiAntares = z.infer<typeof ApiAntaresSchema>

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

export const FromApi = (data: TApiAntares): ResultErr<TAntares> =>
    mapEntity<TApiAntares, TAntares>(
        data,
        ApiAntaresSchema as any,
        AntaresSchema as any,
        fromApiInternal
    )

export const ToApi = (data: TAntares): ResultErr<TApiAntares> =>
    mapEntity<TAntares, TApiAntares>(
        data,
        AntaresSchema as any,
        ApiAntaresSchema as any,
        toApiInternal
    )

export const antaresCrud = new CRUD<TAntares>('mission', ToApi, FromApi)
