import { z } from 'zod'

import { mapEntity } from '../../../services/mapper'
import { CreateCRUD } from '../../../services/http'

export const AntaresSchema = z.object({
    id: z.string().default(""),
    type: z.string().default(''),
    description: z.string().default(''),
})

export const ApiAntaresSchema = z.object({
    id: z.string().default(""),
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

export const AntaresFromApi = (data: TApiAntares) =>
    mapEntity<TApiAntares, TAntares>(
        data,
        ApiAntaresSchema as any,
        AntaresSchema as any,
        fromApiInternal
    )

export const AntaresToApi = (data: TAntares) =>
    mapEntity<TAntares, TApiAntares>(
        data,
        AntaresSchema as any,
        ApiAntaresSchema as any,
        toApiInternal
    )

export const missionService = new CreateCRUD<TAntares>(
    'mission',
    toApiInternal,
    AntaresFromApi
)
